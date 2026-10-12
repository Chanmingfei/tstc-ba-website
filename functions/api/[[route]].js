// 统一 API 路由（Pages Functions catch-all）。后续阶段在此扩展 /api/comments 与 /api/admin/*
import { json, handleOptions } from '../_lib/http.js';
import {
  hashPassword,
  verifyPassword,
  getSession,
  getActiveSession,
  createSession,
  destroySession,
  sessionCookie,
  clearCookie,
} from '../_lib/auth.js';
import { ALLOWED_ORIGINS } from '../_lib/config.js';
import { rateLimit, clientIp } from '../_lib/limit.js';
import { recalcLevel, getUserLevel } from '../_lib/level.js';

// 变更型请求（POST/PUT/DELETE）校验 Origin：仅允许同源或白名单来源，抵御跨站伪造。
// 同源请求浏览器不携带 Origin 或携带同域 Origin；跨站伪造请求将被拒绝。
function originOk(request) {
  const origin = request.headers.get('Origin');
  if (!origin) return true;
  return ALLOWED_ORIGINS.includes(origin);
}

export async function onRequest(context) {
  const { request, env, params } = context;
  const method = request.method;
  if (method === 'OPTIONS') return handleOptions();
  if (method !== 'GET' && method !== 'HEAD' && !originOk(request))
    return json({ error: 'Origin 不被允许' }, 403);

  // 注意：Pages Functions 双括号 catch-all（[[route]]）在运行时把参数作为「数组」传入，
  // 而非字符串（旧版/Node mock 行为不同），必须用 join 归一化，否则 .replace 抛 TypeError → 全站 API 1101。
  const routeRaw = params?.route;
  const route = (Array.isArray(routeRaw) ? routeRaw.join('/') : String(routeRaw ?? '')).replace(/^\/+|\/+$/g, '');
  const segments = route.split('/').filter(Boolean);
  const head = segments[0] || '';

  try {
    if (head === 'register' && method === 'POST') return await register(request, env);
    if (head === 'login' && method === 'POST') return await login(request, env);
    if (head === 'logout' && method === 'POST') return await logout(request, env);
    if (head === 'me' && method === 'GET') return await me(request, env);
    if (head === 'account') {
      if (method === 'GET') return await accountProfile(request, env);
      if (method === 'POST' && segments[1] === 'password') return await changePassword(request, env);
      return json({ error: 'Not Found' }, 404);
    }
    if (head === 'articles') {
      if (method === 'GET') {
        if (segments[1] === 'mine') return await listOwnArticles(request, env);
        return segments[1] ? await getArticle(env, segments[1]) : await listArticles(request, env);
      }
      if (method === 'POST') return await createUserArticle(request, env);
      if (method === 'PUT' && segments[1]) return await updateOwnArticle(request, env, segments[1]);
      if (method === 'DELETE' && segments[1]) return await deleteOwnArticle(request, env, segments[1]);
    }
    if (head === 'comments') {
      if (method === 'GET') return await listComments(request, env);
      if (method === 'POST') return await postComment(request, env);
      if (method === 'DELETE' && segments[1]) return await deleteComment(request, env, segments[1]);
    }
    if (head === 'admin') return await adminDispatch(request, env, segments);
    return json({ error: 'Not Found' }, 404);
  } catch (e) {
    return json({ error: e.message || 'Server Error' }, 500);
  }
}

// ---------- 认证 ----------
async function register(request, env) {
  const rl = await rateLimit(env, 'rl:reg:' + clientIp(request), 5, 60);
  if (!rl.ok) return json({ error: '注册过于频繁，请稍后再试' }, 429);
  const { username, password } = await request.json().catch(() => ({}));
  if (!username || !password) return json({ error: '缺少用户名或密码' }, 400);
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username))
    return json({ error: '用户名需为 3-20 位字母/数字/下划线' }, 400);
  if (String(password).length < 6) return json({ error: '密码至少 6 位' }, 400);

  const exist = await env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
  if (exist) return json({ error: '用户名已存在' }, 409);

  const pass = await hashPassword(password);
  const now = Date.now();
  await env.DB.prepare(
    'INSERT INTO users (username, pass, role, status, created_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(username, pass, 'user', 'active', now).run();

  return json({ ok: true });
}

async function login(request, env) {
  const rl = await rateLimit(env, 'rl:login:' + clientIp(request), 8, 60);
  if (!rl.ok) return json({ error: '尝试过于频繁，请稍后再试' }, 429);
  const { username, password } = await request.json().catch(() => ({}));
  if (!username || !password) return json({ error: '缺少用户名或密码' }, 400);

  const row = await env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();
  if (!row || row.status !== 'active') return json({ error: '用户名或密码错误' }, 401);
  if (!(await verifyPassword(password, row.pass))) return json({ error: '用户名或密码错误' }, 401);

  const token = await createSession(env, row);
  // 注意 json(data, status, headers)：Set-Cookie 是第三个参数，写成第二个会被当成 status → 响应构造非法。
  return json(
    { ok: true, username: row.username, role: row.role },
    200,
    { 'Set-Cookie': sessionCookie(token) }
  );
}

async function logout(request, env) {
  await destroySession(env, request);
  return json({ ok: true }, 200, { 'Set-Cookie': clearCookie() });
}

async function me(request, env) {
  const s = await getActiveSession(request, env);
  if (!s) return json({ error: '未登录' }, 401);
  return json({ username: s.username, role: s.role });
}

// ---------- 账号管理（个人资料 / 修改密码）----------
async function accountProfile(request, env) {
  const s = await getActiveSession(request, env);
  if (!s) return json({ error: '未登录' }, 401);
  const row = await env.DB.prepare('SELECT username, role, created_at FROM users WHERE id = ?').bind(s.userId).first();
  if (!row) return json({ error: '用户不存在' }, 404);
  const lv = await getUserLevel(env, s.userId);
  return json({ username: row.username, role: row.role, created_at: row.created_at, level: lv.level, xp: lv.xp });
}

async function changePassword(request, env) {
  const rl = await rateLimit(env, 'rl:pwd:' + clientIp(request), 5, 60);
  if (!rl.ok) return json({ error: '操作过于频繁，请稍后再试' }, 429);
  const s = await getActiveSession(request, env);
  if (!s) return json({ error: '请先登录' }, 401);
  const { oldPassword, newPassword } = await request.json().catch(() => ({}));
  if (!oldPassword || !newPassword) return json({ error: '请填写当前密码与新密码' }, 400);
  if (String(newPassword).length < 6) return json({ error: '新密码至少 6 位' }, 400);

  const row = await env.DB.prepare('SELECT id, pass FROM users WHERE id = ?').bind(s.userId).first();
  if (!row) return json({ error: '用户不存在' }, 404);
  if (!(await verifyPassword(String(oldPassword), row.pass))) return json({ error: '当前密码错误' }, 400);

  await env.DB.prepare('UPDATE users SET pass = ? WHERE id = ?')
    .bind(await hashPassword(String(newPassword)), s.userId).run();
  return json({ ok: true });
}

// ---------- 文章列表（M3 落地）----------
async function listArticles(request, env) {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'zh';
  const category = url.searchParams.get('category');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10) || 20, 50);
  const sql = `SELECT slug, lang, title, date, category, author, excerpt, cover FROM articles WHERE lang = ?${category ? ' AND category = ?' : ''} ORDER BY date DESC LIMIT ?`;
  const bind = category ? [lang, category, limit] : [lang, limit];
  const rows = await env.DB.prepare(sql).bind(...bind).all();
  return json({ articles: rows.results || [] });
}

// 单篇文章（含正文，供管理后台编辑）
async function getArticle(env, slug) {
  const row = await env.DB.prepare('SELECT * FROM articles WHERE slug = ?').bind(slug).first();
  if (!row) return json({ error: '文章不存在' }, 404);
  return json({ article: row });
}

// ---------- 用户发文（等级系统：Lv3+ 可发布/编辑/删除自己的文章）----------
// 等级阈值：达到 3 级（累计 10 条可见评论）方可发文。
const PUBLISH_LEVEL = 3;

// 我的文章（仅当前登录用户自己发布的）
async function listOwnArticles(request, env) {
  const s = await getActiveSession(request, env);
  if (!s) return json({ error: '请先登录' }, 401);
  const rows = await env.DB.prepare(
    'SELECT slug, lang, title, date, category, author, updated_at FROM articles WHERE user_id = ? ORDER BY date DESC'
  ).bind(s.userId).all();
  return json({ articles: rows.results || [] });
}

// 计算下一个可用文章编号（避免与已有 post-N 冲突）
async function nextArticleId(env) {
  const rows = await env.DB.prepare("SELECT slug FROM articles WHERE slug GLOB 'post-[0-9]*'").all();
  let max = 0;
  (rows.results || []).forEach((r) => {
    const m = /^post-(\d+)/.exec(r.slug || '');
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  return max + 1;
}

// 普通用户（Lv3+）发布文章：slug 自动生成、作者固定为本人、日期固定为系统日期（不可改）
async function createUserArticle(request, env) {
  const s = await getActiveSession(request, env);
  if (!s) return json({ error: '请先登录' }, 401);
  const lv = await getUserLevel(env, s.userId);
  if (s.role !== 'admin' && lv.level < PUBLISH_LEVEL)
    return json({ error: `需达到 ${PUBLISH_LEVEL} 级（累计发满 ${PUBLISH_LEVEL * 5} 条评论）才能发布文章` }, 403);
  const { lang, title, category, excerpt, content, cover } = await request.json().catch(() => ({}));
  if (!title || !content) return json({ error: '标题与正文必填' }, 400);
  const L = lang === 'en' ? 'en' : 'zh';
  const n = await nextArticleId(env);
  const slug = L === 'en' ? `post-${n}-en` : `post-${n}`;
  const now = Date.now();
  // 日期固定为发文时的系统日期（按服务器时区），客户端不可覆盖
  const d = new Date(now);
  const pad = (x) => String(x).padStart(2, '0');
  const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  await env.DB.prepare(
    'INSERT INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(slug, L, String(title).trim(), dateStr, String(category || '').trim(), s.username, String(excerpt || '').trim(), String(cover || '').trim(), content, s.userId, now, now).run();
  return json({ ok: true, slug });
}

// 普通用户编辑自己的文章：仅作者本人可编辑；作者固定为本人；日期不可修改
async function updateOwnArticle(request, env, slug) {
  const s = await getActiveSession(request, env);
  if (!s) return json({ error: '请先登录' }, 401);
  const row = await env.DB.prepare('SELECT user_id FROM articles WHERE slug = ?').bind(slug).first();
  if (!row) return json({ error: '文章不存在' }, 404);
  if (s.role !== 'admin' && row.user_id !== s.userId)
    return json({ error: '无权限编辑他人文章' }, 403);
  const f = await request.json().catch(() => ({}));
  const cols = ['title', 'lang', 'category', 'excerpt', 'content'];
  const sets = []; const binds = [];
  for (const col of cols) {
    if (f[col] !== undefined) {
      const v = col === 'lang' ? (f[col] === 'en' ? 'en' : 'zh') : String(f[col] || '').trim();
      sets.push(col + ' = ?'); binds.push(v);
    }
  }
  if (!sets.length) return json({ error: '无更新字段' }, 400);
  sets.push('author = ?'); binds.push(s.username); // 作者固定为当前用户
  sets.push('updated_at = ?'); binds.push(Date.now()); binds.push(slug);
  await env.DB.prepare('UPDATE articles SET ' + sets.join(', ') + ' WHERE slug = ?').bind(...binds).run();
  return json({ ok: true });
}

// 普通用户删除自己的文章：仅作者本人可删除（管理员走 /api/admin/articles）
async function deleteOwnArticle(request, env, slug) {
  const s = await getActiveSession(request, env);
  if (!s) return json({ error: '请先登录' }, 401);
  const row = await env.DB.prepare('SELECT user_id FROM articles WHERE slug = ?').bind(slug).first();
  if (!row) return json({ error: '文章不存在' }, 404);
  if (s.role !== 'admin' && row.user_id !== s.userId)
    return json({ error: '无权限删除他人文章' }, 403);
  await env.DB.prepare('DELETE FROM articles WHERE slug = ?').bind(slug).run();
  return json({ ok: true });
}

// ---------- 评论（M4 落地）----------
const THREAD_RE = /^post-\d+$/;

async function listComments(request, env) {
  const url = new URL(request.url);
  const thread = url.searchParams.get('thread') || '';
  if (!THREAD_RE.test(thread)) return json({ error: '非法 thread' }, 400);
  const rows = await env.DB.prepare(
    `SELECT c.id, c.thread, c.user_id, c.username, c.content, c.created_at, c.parent_id,
            COALESCE(u.level, 1) AS level
       FROM comments c
       LEFT JOIN users u ON c.user_id = u.id
      WHERE c.thread = ? AND c.status = 'visible'
      ORDER BY c.created_at ASC`
  ).bind(thread).all();
  const flat = rows.results || [];
  // 组装楼中楼树：parent_id 指向本 thread 内某条可见评论则为其子节点，否则为顶层。
  const byId = {};
  flat.forEach((c) => { byId[c.id] = { ...c, replies: [] }; });
  const tree = [];
  flat.forEach((c) => {
    const node = byId[c.id];
    if (c.parent_id && byId[c.parent_id]) byId[c.parent_id].replies.push(node);
    else tree.push(node);
  });
  return json({ comments: tree, total: flat.length });
}

async function postComment(request, env) {
  const rl = await rateLimit(env, 'rl:cmt:' + clientIp(request), 10, 60);
  if (!rl.ok) return json({ error: '评论过于频繁，请稍后再试' }, 429);
  const s = await getActiveSession(request, env);
  if (!s) return json({ error: '请先登录' }, 401);
  const { thread, content, parent_id } = await request.json().catch(() => ({}));
  if (!THREAD_RE.test(thread || '')) return json({ error: '非法 thread' }, 400);
  if (!content || !content.trim()) return json({ error: '评论内容不能为空' }, 400);
  if (content.length > 1000) return json({ error: '评论过长（上限 1000 字）' }, 400);
  // 楼中楼：parent_id 必须指向本 thread 内一条「可见」评论
  let parentId = null;
  if (parent_id != null && parent_id !== '') {
    if (!/^\d+$/.test(String(parent_id))) return json({ error: '非法 parent_id' }, 400);
    const p = await env.DB.prepare(
      "SELECT id FROM comments WHERE id = ? AND thread = ? AND status = 'visible'"
    ).bind(parent_id, thread).first();
    if (!p) return json({ error: '回复的评论不存在' }, 400);
    parentId = parseInt(parent_id, 10);
  }
  const now = Date.now();
  const info = await env.DB.prepare(
    "INSERT INTO comments (thread, user_id, username, content, created_at, status, parent_id) VALUES (?, ?, ?, ?, ?, 'visible', ?)"
  ).bind(thread, s.userId, s.username, content.trim(), now, parentId).run();
  // 发评/回复计入经验值 → 重算并落库等级
  await recalcLevel(env, s.userId);
  return json({ ok: true, id: info.meta?.last_row_id });
}

async function deleteComment(request, env, id) {
  const s = await getSession(request, env);
  if (!s) return json({ error: '请先登录' }, 401);
  if (!/^\d+$/.test(id)) return json({ error: '非法 id' }, 400);
  const row = await env.DB.prepare('SELECT user_id FROM comments WHERE id = ?').bind(id).first();
  if (!row) return json({ error: '评论不存在' }, 404);
  // 管理员可删任意评论；普通用户仅可删自己的评论（按 user_id 校验，防止越权删他人评论）
  if (s.role !== 'admin' && String(row.user_id) !== String(s.userId)) {
    return json({ error: '无权限删除他人评论' }, 403);
  }
  await env.DB.prepare("UPDATE comments SET status = 'deleted' WHERE id = ?").bind(id).run();
  // 删评扣回经验值 → 重算并落库等级
  await recalcLevel(env, row.user_id);
  return json({ ok: true });
}

// ---------- 管理后台（M5）----------
async function adminDispatch(request, env, segments) {
  const s = await getActiveSession(request, env);
  if (!s || s.role !== 'admin') return json({ error: '无权限' }, 403);
  if (request.method !== 'GET') {
    const rl = await rateLimit(env, 'rl:admin:' + clientIp(request), 40, 60);
    if (!rl.ok) return json({ error: '操作过于频繁' }, 429);
  }
  const method = request.method;
  const sub = segments[1] || '';
  const id = segments[2];

  // 概览统计
  if (sub === 'stats' && method === 'GET') {
    const users = await env.DB.prepare('SELECT COUNT(*) c FROM users').first();
    const articles = await env.DB.prepare('SELECT COUNT(*) c FROM articles').first();
    const comments = await env.DB.prepare('SELECT COUNT(*) c FROM comments').first();
    const visible = await env.DB.prepare("SELECT COUNT(*) c FROM comments WHERE status='visible'").first();
    return json({ stats: { users: users.c, articles: articles.c, comments: comments.c, commentsVisible: visible.c } });
  }

  // 用户管理
  if (sub === 'users') {
    if (method === 'GET') {
      const rows = await env.DB.prepare('SELECT id, username, role, status, created_at FROM users ORDER BY id').all();
      return json({ users: rows.results || [] });
    }
    if (method === 'POST' && !id) {
      const { username, password, role } = await request.json().catch(() => ({}));
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(username || '')) return json({ error: '用户名需 3-20 位字母/数字/下划线' }, 400);
      if (String(password || '').length < 6) return json({ error: '密码至少 6 位' }, 400);
      const exist = await env.DB.prepare('SELECT id FROM users WHERE username = ?').bind(username).first();
      if (exist) return json({ error: '用户名已存在' }, 409);
      await env.DB.prepare('INSERT INTO users (username, pass, role, status, created_at) VALUES (?, ?, ?, ?, ?)')
        .bind(username, await hashPassword(password), role === 'admin' ? 'admin' : 'user', 'active', Date.now()).run();
      return json({ ok: true });
    }
    if (id && /^\d+$/.test(id)) {
      if (method === 'DELETE') {
        await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run();
        return json({ ok: true });
      }
      const act = segments[3];
      if (method === 'POST' && act === 'ban') {
        await env.DB.prepare("UPDATE users SET status = 'banned' WHERE id = ?").bind(id).run();
        return json({ ok: true });
      }
      if (method === 'POST' && act === 'unban') {
        await env.DB.prepare("UPDATE users SET status = 'active' WHERE id = ?").bind(id).run();
        return json({ ok: true });
      }
      if (method === 'POST' && act === 'reset') {
        const { password } = await request.json().catch(() => ({}));
        if (String(password || '').length < 6) return json({ error: '密码至少 6 位' }, 400);
        await env.DB.prepare('UPDATE users SET pass = ? WHERE id = ?').bind(await hashPassword(password), id).run();
        return json({ ok: true });
      }
    }
    return json({ error: 'Not Found' }, 404);
  }

  // 文章管理
  if (sub === 'articles') {
    if (method === 'GET' && !id) {
      const rows = await env.DB.prepare('SELECT slug, lang, title, date, category, author, excerpt, cover FROM articles ORDER BY date DESC').all();
      return json({ articles: rows.results || [] });
    }
    if (method === 'POST' && !id) {
      const { slug, lang, title, date, category, author, excerpt, content } = await request.json().catch(() => ({}));
      if (!/^post-\d+(-en)?$/.test(slug || '')) return json({ error: 'slug 格式需为 post-N 或 post-N-en' }, 400);
      if (!title || !content) return json({ error: '标题与正文必填' }, 400);
      const now = Date.now();
      await env.DB.prepare(
        'INSERT OR REPLACE INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(slug, lang || 'zh', title, date || '', category || '', author || '', excerpt || '', '', content, now, now).run();
      return json({ ok: true });
    }
    if (id && method === 'GET') {
      const row = await env.DB.prepare('SELECT * FROM articles WHERE slug = ?').bind(id).first();
      if (!row) return json({ error: '文章不存在' }, 404);
      return json({ article: row });
    }
    if (id && method === 'PUT') {
      const f = await request.json().catch(() => ({}));
      const cols = ['title', 'date', 'category', 'author', 'excerpt', 'content', 'lang'];
      const sets = []; const binds = [];
      for (const col of cols) { if (f[col] !== undefined) { sets.push(col + ' = ?'); binds.push(f[col]); } }
      if (!sets.length) return json({ error: '无更新字段' }, 400);
      sets.push('updated_at = ?'); binds.push(Date.now()); binds.push(id);
      await env.DB.prepare('UPDATE articles SET ' + sets.join(', ') + ' WHERE slug = ?').bind(...binds).run();
      return json({ ok: true });
    }
    if (id && method === 'DELETE') {
      await env.DB.prepare('DELETE FROM articles WHERE slug = ?').bind(id).run();
      return json({ ok: true });
    }
    return json({ error: 'Not Found' }, 404);
  }

  // 评论管理（含已删，便于审核）
  if (sub === 'comments') {
    if (method === 'GET') {
      const rows = await env.DB.prepare('SELECT id, thread, user_id, username, content, created_at, status FROM comments ORDER BY created_at DESC').all();
      return json({ comments: rows.results || [] });
    }
    if (method === 'DELETE' && id && /^\d+$/.test(id)) {
      await env.DB.prepare("UPDATE comments SET status = 'deleted' WHERE id = ?").bind(id).run();
      return json({ ok: true });
    }
    return json({ error: 'Not Found' }, 404);
  }

  return json({ error: 'Not Found' }, 404);
}

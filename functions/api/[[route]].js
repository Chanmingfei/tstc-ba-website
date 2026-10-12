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
    if (head === 'articles' && method === 'GET')
      return segments[1] ? await getArticle(env, segments[1]) : await listArticles(request, env);
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
  return json({ username: row.username, role: row.role, created_at: row.created_at });
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

// ---------- 评论（M4 落地）----------
const THREAD_RE = /^post-\d+$/;

async function listComments(request, env) {
  const url = new URL(request.url);
  const thread = url.searchParams.get('thread') || '';
  if (!THREAD_RE.test(thread)) return json({ error: '非法 thread' }, 400);
  const rows = await env.DB.prepare(
    "SELECT id, username, content, created_at FROM comments WHERE thread = ? AND status = 'visible' ORDER BY created_at ASC"
  ).bind(thread).all();
  return json({ comments: rows.results || [] });
}

async function postComment(request, env) {
  const rl = await rateLimit(env, 'rl:cmt:' + clientIp(request), 10, 60);
  if (!rl.ok) return json({ error: '评论过于频繁，请稍后再试' }, 429);
  const s = await getActiveSession(request, env);
  if (!s) return json({ error: '请先登录' }, 401);
  const { thread, content } = await request.json().catch(() => ({}));
  if (!THREAD_RE.test(thread || '')) return json({ error: '非法 thread' }, 400);
  if (!content || !content.trim()) return json({ error: '评论内容不能为空' }, 400);
  if (content.length > 1000) return json({ error: '评论过长（上限 1000 字）' }, 400);
  const now = Date.now();
  const info = await env.DB.prepare(
    "INSERT INTO comments (thread, user_id, username, content, created_at, status) VALUES (?, ?, ?, ?, ?, 'visible')"
  ).bind(thread, s.userId, s.username, content.trim(), now).run();
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

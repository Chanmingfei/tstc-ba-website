// 统一 API 路由（Pages Functions catch-all）。后续阶段在此扩展 /api/comments 与 /api/admin/*
import { json, handleOptions } from '../_lib/http.js';
import {
  hashPassword,
  verifyPassword,
  getSession,
  getActiveSession,
  createSession,
  destroySession,
  revokeUserSessions,
  sessionCookie,
  clearCookie,
} from '../_lib/auth.js';
import { ALLOWED_ORIGINS } from '../_lib/config.js';
import { rateLimit, clientIp } from '../_lib/limit.js';
import { recalcLevel, getUserLevel } from '../_lib/level.js';
import { sendEmail } from '../_lib/mailer.js';

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
      if (method === 'POST' && segments[1] === 'email' && segments[2] === 'code') return await sendBindCode(request, env);
      if (method === 'PUT' && segments[1] === 'email') return await bindEmail(request, env);
      if (method === 'DELETE' && segments[1] === 'email') return await unbindEmail(request, env);
      return json({ error: 'Not Found' }, 404);
    }
    if (head === 'password-reset') {
      if (method === 'POST' && segments[1] === 'code') return await sendResetCode(request, env);
      if (method === 'POST' && segments[1] === 'confirm') return await confirmReset(request, env);
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
  return json({ id: s.userId, username: s.username, role: s.role });
}

// ---------- 账号管理（个人资料 / 修改密码）----------
async function accountProfile(request, env) {
  const s = await getActiveSession(request, env);
  if (!s) return json({ error: '未登录' }, 401);
  const row = await env.DB.prepare('SELECT username, role, created_at, email, email_verified FROM users WHERE id = ?').bind(s.userId).first();
  if (!row) return json({ error: '用户不存在' }, 404);
  const lv = await getUserLevel(env, s.userId);
  return json({
    username: row.username, role: row.role, created_at: row.created_at, level: lv.level, xp: lv.xp,
    email: row.email || '', email_verified: !!row.email_verified,
  });
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

// ---------- 邮箱绑定 / 验证码找回密码 ----------
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE_TTL = 5 * 60 * 1000; // 验证码 5 分钟有效
const CODE_KEEP_MS = 7 * 24 * 3600 * 1000; // 验证码记录保留 7 天（审计用），过期顺带清除，防止存档无限增长

function genCode() {
  const n = crypto.getRandomValues(new Uint32Array(1))[0];
  return String(n % 1000000).padStart(6, '0');
}

// 清理 7 天前的验证码存档（懒清理：email_codes 只在发码时增长，故在发码路径顺带执行；
// Pages Functions 无 Cron Triggers，此方式零基础设施且完全覆盖增长源）。返回删除条数。
// 安全边界：本函数是唯一会对 email_codes 执行 DELETE 的路径，目标表硬编码为 email_codes、
// 条件为 created_at < 7 天前（无任何用户输入拼入 SQL，不存在误删其他表的可能）；
// 失败仅记日志并放行，绝不影响发码主流程。
async function cleanupEmailCodes(env) {
  try {
    const r = await env.DB.prepare('DELETE FROM email_codes WHERE created_at < ?').bind(Date.now() - CODE_KEEP_MS).run();
    return r.meta?.changes ?? 0;
  } catch (e) {
    console.error('[cleanup] email_codes 清理失败（不影响发码）', e);
    return 0;
  }
}

// 发送验证码（bind/reset 共用）：落库 email_codes + 懒清理 + 发信。返回 { ok, via }。
async function sendCodeEmail(env, { email, purpose, userId }) {
  const code = genCode();
  const now = Date.now();
  await env.DB.prepare(
    'INSERT INTO email_codes (email, code, purpose, user_id, expires_at, used, created_at) VALUES (?, ?, ?, ?, ?, 0, ?)'
  ).bind(email, code, purpose, userId ?? null, now + CODE_TTL, now).run();
  await cleanupEmailCodes(env);
  const subject = purpose === 'reset' ? '唐山师范学院吧 · 重置密码验证码' : '唐山师范学院吧 · 邮箱绑定验证码';
  const text =
    `【唐山师范学院吧】您正在${purpose === 'reset' ? '重置账号密码' : '绑定邮箱'}，验证码为：${code}\n` +
    '验证码 5 分钟内有效，请勿转发给他人。如非本人操作，请忽略本邮件。';
  const m = await sendEmail(env, { to: email, subject, text });
  return { ok: true, via: m.via };
}

// 校验并消费验证码（一次性）：成功标记 used，失败返回 { error }。
async function consumeCode(env, { email, purpose, code }) {
  const row = await env.DB.prepare(
    'SELECT id, code, expires_at, used FROM email_codes WHERE email = ? AND purpose = ? ORDER BY id DESC LIMIT 1'
  ).bind(email, purpose).first();
  if (!row) return { error: '请先获取验证码' };
  if (row.used) return { error: '验证码已使用，请重新获取' };
  if (row.expires_at < Date.now()) return { error: '验证码已过期，请重新获取' };
  if (row.code !== String(code || '').trim()) return { error: '验证码不正确' };
  await env.DB.prepare('UPDATE email_codes SET used = 1 WHERE id = ?').bind(row.id).run();
  return { ok: true };
}

// 发送绑定/换绑邮箱验证码（需登录；限流：同一用户 60 秒 1 次、每日 10 次）
async function sendBindCode(request, env) {
  const s = await getActiveSession(request, env);
  if (!s) return json({ error: '请先登录' }, 401);
  const rl = await rateLimit(env, 'rl:emailcode:' + s.userId, 1, 60);
  if (!rl.ok) return json({ error: '发送过于频繁，请稍后再试' }, 429);
  const rlDay = await rateLimit(env, 'rl:emailcode:day:' + s.userId, 10, 86400);
  if (!rlDay.ok) return json({ error: '今日验证码发送次数已达上限' }, 429);
  const { email } = await request.json().catch(() => ({}));
  const e = String(email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(e) || e.length > 100) return json({ error: '邮箱格式不正确' }, 400);
  const taken = await env.DB.prepare('SELECT id FROM users WHERE email = ? AND id != ?').bind(e, s.userId).first();
  if (taken) return json({ error: '该邮箱已被其他账号绑定' }, 409);
  const r = await sendCodeEmail(env, { email: e, purpose: 'bind', userId: s.userId });
  return json({ ok: true, via: r.via });
}

// 确认绑定/换绑邮箱（需登录 + 验证码）
async function bindEmail(request, env) {
  const s = await getActiveSession(request, env);
  if (!s) return json({ error: '请先登录' }, 401);
  const { email, code } = await request.json().catch(() => ({}));
  const e = String(email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(e)) return json({ error: '邮箱格式不正确' }, 400);
  const chk = await consumeCode(env, { email: e, purpose: 'bind', code });
  if (chk.error) return json({ error: chk.error }, 400);
  const taken = await env.DB.prepare('SELECT id FROM users WHERE email = ? AND id != ?').bind(e, s.userId).first();
  if (taken) return json({ error: '该邮箱已被其他账号绑定' }, 409);
  await env.DB.prepare('UPDATE users SET email = ?, email_verified = 1 WHERE id = ?').bind(e, s.userId).run();
  return json({ ok: true });
}

// 解绑邮箱（需登录）：解绑后将无法通过邮箱找回密码
async function unbindEmail(request, env) {
  const s = await getActiveSession(request, env);
  if (!s) return json({ error: '请先登录' }, 401);
  await env.DB.prepare('UPDATE users SET email = NULL, email_verified = 0 WHERE id = ?').bind(s.userId).run();
  return json({ ok: true });
}

// 忘记密码 · 发送重置验证码（无需登录；防枚举：无论邮箱是否绑定均返回相同提示；
// 限流：同一 IP 每小时 5 次）
async function sendResetCode(request, env) {
  const rl = await rateLimit(env, 'rl:reset:' + clientIp(request), 5, 3600);
  if (!rl.ok) return json({ error: '操作过于频繁，请稍后再试' }, 429);
  const { email } = await request.json().catch(() => ({}));
  const e = String(email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(e)) return json({ error: '邮箱格式不正确' }, 400);
  const row = await env.DB.prepare('SELECT id, status FROM users WHERE email = ?').bind(e).first();
  if (row && row.status === 'active') {
    await sendCodeEmail(env, { email: e, purpose: 'reset', userId: row.id });
  }
  return json({ ok: true });
}

// 忘记密码 · 确认重置（无需登录）：校验码 + 改密 + 吊销该用户全部会话（全部设备下线）
async function confirmReset(request, env) {
  const rl = await rateLimit(env, 'rl:reset:' + clientIp(request), 10, 3600);
  if (!rl.ok) return json({ error: '操作过于频繁，请稍后再试' }, 429);
  const { email, code, password } = await request.json().catch(() => ({}));
  const e = String(email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(e)) return json({ error: '邮箱格式不正确' }, 400);
  if (!password || String(password).length < 6) return json({ error: '新密码至少 6 位' }, 400);
  const row = await env.DB.prepare('SELECT id, status FROM users WHERE email = ?').bind(e).first();
  if (!row || row.status !== 'active') return json({ error: '邮箱或验证码不正确' }, 400);
  const chk = await consumeCode(env, { email: e, purpose: 'reset', code });
  if (chk.error) return json({ error: chk.error }, 400);
  await env.DB.prepare('UPDATE users SET pass = ? WHERE id = ?')
    .bind(await hashPassword(String(password)), row.id).run();
  await revokeUserSessions(env, row.id);
  return json({ ok: true });
}

// ---------- 文章列表（M3 落地）----------
async function listArticles(request, env) {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'zh';
  const category = url.searchParams.get('category');
  // scope: news=仅管理员发文(user_id=0)，user=仅用户发文(Lv3+, user_id>0)，默认返回全部
  const scope = (url.searchParams.get('scope') || '').toLowerCase();
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '50', 10) || 50, 200);
  let where = 'lang = ?';
  const bind = [lang];
  if (scope === 'news') where += ' AND user_id = 0';
  else if (scope === 'user') where += ' AND user_id != 0';
  if (category) { where += ' AND category = ?'; bind.push(category); }
  where += ' ORDER BY date DESC LIMIT ?';
  bind.push(limit);
  const sql = `SELECT slug, lang, title, date, category, author, excerpt, cover FROM articles WHERE ${where}`;
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

// 封面图 URL 规范化：可为空；非空时须为 http(s) 绝对地址（用户发文仅接受外链封面），
// 返回字符串（含空串）或 null（非法）。
function validCover(c) {
  const v = String(c || '').trim();
  if (!v) return '';
  if (v.length > 500 || !/^https?:\/\//i.test(v)) return null;
  return v;
}

// 我的文章（仅当前登录用户自己发布的）
async function listOwnArticles(request, env) {
  const s = await getActiveSession(request, env);
  if (!s) return json({ error: '请先登录' }, 401);
  const rows = await env.DB.prepare(
    'SELECT slug, lang, title, date, category, author, cover, updated_at FROM articles WHERE user_id = ? ORDER BY date DESC'
  ).bind(s.userId).all();
  return json({ articles: rows.results || [] });
}

// 计算下一个可用新闻文章编号（管理员发文，post-N 系列）
async function nextArticleId(env) {
  const rows = await env.DB.prepare("SELECT slug FROM articles WHERE slug GLOB 'post-[0-9]*'").all();
  let max = 0;
  (rows.results || []).forEach((r) => {
    const m = /^post-(\d+)/.exec(r.slug || '');
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  return max + 1;
}

// 计算下一个吧友文章（用户 Lv3+ 发文）编号：独立计数，仅统计 ua-[0-9]*，
// 与新闻 post-N 系列完全隔离，链接统一为 /user-articles/N。
async function nextUserArticleId(env) {
  const rows = await env.DB.prepare("SELECT slug FROM articles WHERE slug GLOB 'ua-[0-9]*'").all();
  let max = 0;
  (rows.results || []).forEach((r) => {
    const m = /^ua-(\d+)/.exec(r.slug || '');
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
    return json({ error: `需达到 ${PUBLISH_LEVEL} 级（累计发满 ${(PUBLISH_LEVEL - 1) * 5} 条评论）才能发布文章` }, 403);
  const { lang, title, category, excerpt, content, cover } = await request.json().catch(() => ({}));
  if (!title || !content) return json({ error: '标题与正文必填' }, 400);
  const coverVal = validCover(cover);
  if (coverVal === null) return json({ error: '封面图须为 http(s) 开头的图片链接' }, 400);
  const L = lang === 'en' ? 'en' : 'zh';
  const n = await nextUserArticleId(env);
  // 吧友发文使用独立 slug 体系（ua-N / ua-N-en），链接对应 /user-articles/N，与新闻 post-N 隔离
  const slug = L === 'en' ? `ua-${n}-en` : `ua-${n}`;
  const now = Date.now();
  // 日期固定为发文时的系统日期（按服务器时区），客户端不可覆盖
  const d = new Date(now);
  const pad = (x) => String(x).padStart(2, '0');
  const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  await env.DB.prepare(
    'INSERT INTO articles (slug, lang, title, date, category, author, excerpt, cover, content, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(slug, L, String(title).trim(), dateStr, String(category || '').trim(), s.username, String(excerpt || '').trim(), coverVal, content, s.userId, now, now).run();
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
  const cols = ['title', 'lang', 'category', 'excerpt', 'content', 'cover'];
  const sets = []; const binds = [];
  for (const col of cols) {
    if (f[col] !== undefined) {
      if (col === 'cover') {
        const cv = validCover(f.cover);
        if (cv === null) return json({ error: '封面图须为 http(s) 开头的图片链接' }, 400);
        sets.push('cover = ?'); binds.push(cv);
        continue;
      }
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
// 评论 thread：新闻文章为 post-N，吧友文章为 ua-N（与 slug 体系一致）
const THREAD_RE = /^(post|ua)-\d+$/;

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
    const codes = await env.DB.prepare('SELECT COUNT(*) c FROM email_codes').first();
    return json({ stats: { users: users.c, articles: articles.c, comments: comments.c, commentsVisible: visible.c, emailCodes: codes.c } });
  }

  // 手动清理验证码存档（7 天前的 email_codes；平时发码时已懒清理，此处供立即执行/核查）
  if (sub === 'cleanup-codes' && method === 'POST') {
    const removed = await cleanupEmailCodes(env);
    const left = await env.DB.prepare('SELECT COUNT(*) c FROM email_codes').first();
    return json({ ok: true, removed, remaining: left.c });
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
        // 禁止删除自己的账号，否则会永久锁死后台
        if (String(id) === String(s.userId)) return json({ error: '不能删除自己的账号' }, 403);
        await env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id).run();
        return json({ ok: true });
      }
      const act = segments[3];
      if (method === 'POST' && act === 'ban') {
        // 禁止封禁自己的账号，否则会无法登录、无法自助解封
        if (String(id) === String(s.userId)) return json({ error: '不能封禁自己的账号' }, 403);
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

// 统一 API 路由（Pages Functions catch-all）。后续阶段在此扩展 /api/comments 与 /api/admin/*
import { json, handleOptions } from '../_lib/http.js';
import {
  hashPassword,
  verifyPassword,
  getSession,
  createSession,
  destroySession,
  sessionCookie,
  clearCookie,
} from '../_lib/auth.js';

export async function onRequest(context) {
  const { request, env, params } = context;
  const method = request.method;
  if (method === 'OPTIONS') return handleOptions();

  const route = (params.route || '').replace(/^\/+|\/+$/g, '');
  const segments = route.split('/').filter(Boolean);
  const head = segments[0] || '';

  try {
    if (head === 'register' && method === 'POST') return await register(request, env);
    if (head === 'login' && method === 'POST') return await login(request, env);
    if (head === 'logout' && method === 'POST') return await logout(request, env);
    if (head === 'me' && method === 'GET') return await me(request, env);
    if (head === 'articles' && method === 'GET') return await listArticles(request, env);
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
  const { username, password } = await request.json().catch(() => ({}));
  if (!username || !password) return json({ error: '缺少用户名或密码' }, 400);

  const row = await env.DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();
  if (!row || row.status !== 'active') return json({ error: '用户名或密码错误' }, 401);
  if (!(await verifyPassword(password, row.pass))) return json({ error: '用户名或密码错误' }, 401);

  const token = await createSession(env, row);
  return json(
    { ok: true, username: row.username, role: row.role },
    { 'Set-Cookie': sessionCookie(token) }
  );
}

async function logout(request, env) {
  await destroySession(env, request);
  return json({ ok: true }, { 'Set-Cookie': clearCookie() });
}

async function me(request, env) {
  const s = await getSession(request, env);
  if (!s) return json({ error: '未登录' }, 401);
  return json({ username: s.username, role: s.role });
}

// ---------- 文章列表（M3 落地，先提供基础实现）----------
async function listArticles(request, env) {
  const url = new URL(request.url);
  const lang = url.searchParams.get('lang') || 'zh';
  const category = url.searchParams.get('category');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20', 10) || 20, 50);
  const sql = `SELECT slug, title, date, category, author, excerpt, cover FROM articles WHERE lang = ?${category ? ' AND category = ?' : ''} ORDER BY date DESC LIMIT ?`;
  const bind = category ? [lang, category, limit] : [lang, limit];
  const rows = await env.DB.prepare(sql).bind(...bind).all();
  return json({ articles: rows.results || [] });
}

// ---------- 评论（M4 落地）----------
async function listComments(request, env) {
  const url = new URL(request.url);
  const thread = url.searchParams.get('thread');
  if (!thread) return json({ error: '缺少 thread' }, 400);
  const rows = await env.DB.prepare(
    "SELECT id, username, content, created_at FROM comments WHERE thread = ? AND status = 'visible' ORDER BY created_at ASC"
  ).bind(thread).all();
  return json({ comments: rows.results || [] });
}

async function postComment(request, env) {
  const s = await getSession(request, env);
  if (!s) return json({ error: '请先登录' }, 401);
  const { thread, content } = await request.json().catch(() => ({}));
  if (!thread || !content || !content.trim()) return json({ error: '评论内容不能为空' }, 400);
  if (content.length > 1000) return json({ error: '评论过长（上限 1000 字）' }, 400);
  const now = Date.now();
  const info = await env.DB.prepare(
    "INSERT INTO comments (thread, user_id, username, content, created_at, status) VALUES (?, ?, ?, ?, ?, 'visible')"
  ).bind(thread, s.userId, s.username, content.trim(), now).run();
  return json({ ok: true, id: info.meta?.last_row_id });
}

async function deleteComment(request, env, id) {
  const s = await getSession(request, env);
  if (!s || s.role !== 'admin') return json({ error: '无权限' }, 403);
  await env.DB.prepare("UPDATE comments SET status = 'deleted' WHERE id = ?").bind(id).run();
  return json({ ok: true });
}

// ---------- 管理后台（M5 落地，先占位）----------
async function adminDispatch(request, env, segments) {
  const s = await getSession(request, env);
  if (!s || s.role !== 'admin') return json({ error: '无权限' }, 403);
  return json({ ok: true, user: s.username });
}

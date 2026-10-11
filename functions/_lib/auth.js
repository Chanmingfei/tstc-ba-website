// 认证：PBKDF2 密码哈希、KV 会话、Cookie、守卫
import { COOKIE_NAME, COOKIE_DOMAIN, SESSION_TTL, PBKDF2_ITERATIONS } from './config.js';

const enc = new TextEncoder();

function toHex(buf) {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

// 注册/登录密码哈希：PBKDF2-SHA256（Workers WebCrypto 原生支持，scrypt/argon2 不在 WebCrypto）
export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations: PBKDF2_ITERATIONS, hash: 'SHA-256' },
    await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']),
    256
  );
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toHex(salt)}$${toHex(bits)}`;
}

export async function verifyPassword(password, stored) {
  try {
    const [scheme, iterStr, saltHex, hashHex] = stored.split('$');
    if (scheme !== 'pbkdf2') return false;
    const iterations = parseInt(iterStr, 10);
    const salt = Uint8Array.from(saltHex.match(/.{2}/g).map((h) => parseInt(h, 16)));
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
      await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits']),
      256
    );
    return toHex(bits) === hashHex;
  } catch {
    return false;
  }
}

export function parseCookies(req) {
  const header = req.headers.get('Cookie') || '';
  const out = {};
  for (const part of header.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    out[k] = decodeURIComponent(v);
  }
  return out;
}

export async function getSession(req, env) {
  const token = parseCookies(req)[COOKIE_NAME];
  if (!token) return null;
  const raw = await env.SESSIONS.get(token);
  if (!raw) return null;
  try {
    const s = JSON.parse(raw);
    if (s.exp && s.exp < Date.now()) {
      await env.SESSIONS.delete(token);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

export async function createSession(env, user) {
  const token = toHex(crypto.getRandomValues(new Uint8Array(32)));
  const payload = {
    userId: user.id,
    username: user.username,
    role: user.role,
    exp: Date.now() + SESSION_TTL * 1000,
  };
  await env.SESSIONS.put(token, JSON.stringify(payload), { expirationTtl: SESSION_TTL });
  return token;
}

export async function destroySession(env, req) {
  const token = parseCookies(req)[COOKIE_NAME];
  if (token) await env.SESSIONS.delete(token);
}

export function sessionCookie(token) {
  return `${COOKIE_NAME}=${token}; Domain=${COOKIE_DOMAIN}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_TTL}`;
}

export function clearCookie() {
  return `${COOKIE_NAME}=; Domain=${COOKIE_DOMAIN}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

// 守卫：返回 session 或 null（由调用方判定 401/403）
export async function requireUser(req, env) {
  return getSession(req, env);
}

export async function requireAdmin(req, env) {
  const s = await getSession(req, env);
  if (!s || s.role !== 'admin') return null;
  return s;
}

// 活跃会话：通过 getSession 取会话并校验用户未被封禁（banned）。
// 用于 /api/me、评论发表、管理后台等需要「有效且未被封禁」身份的场景。
export async function getActiveSession(req, env) {
  const s = await getSession(req, env);
  if (!s) return null;
  try {
    const u = await env.DB.prepare('SELECT status FROM users WHERE id = ?').bind(s.userId).first();
    if (!u || u.status !== 'active') return null;
  } catch {
    return null;
  }
  return s;
}

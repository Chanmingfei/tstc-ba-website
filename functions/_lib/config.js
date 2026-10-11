// 全局配置常量（Functions 共享）
export const COOKIE_NAME = 'sid';
export const COOKIE_DOMAIN = '.tstc.pp.ua'; // 父域 Cookie → tstc.pp.ua 与 sso.tstc.pp.ua 共享（SSO）
export const SESSION_TTL = 60 * 60 * 24 * 7; // 会话有效期（秒）：7 天
export const MAIN_HOST = 'tstc.pp.ua';
export const SSO_HOST = 'sso.tstc.pp.ua';
export const ALLOWED_ORIGINS = [
  'https://tstc.pp.ua',
  'https://www.tstc.pp.ua',
  'https://sso.tstc.pp.ua',
];
// PBKDF2 迭代次数。注意：Cloudflare Workers 的 WebCrypto 对 PBKDF2 有硬上限，
// 超过 100000 会直接抛错 "iteration counts above 100000 are not supported"，
// 导致注册 500、登录 verifyPassword 内部抛错被 catch 成 false（表现为密码永远错误）。
export const PBKDF2_ITERATIONS = 100000;

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
export const PBKDF2_ITERATIONS = 120000;

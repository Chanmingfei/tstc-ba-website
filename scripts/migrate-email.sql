-- 线上 D1 迁移：邮箱绑定 + 验证码找回密码（2026-10-12）
-- 执行：wrangler d1 execute tstc-ba-db --remote --file=./scripts/migrate-email.sql
-- 幂等：IF NOT EXISTS / ADD COLUMN（D1 对重复 ADD COLUMN 会报错，重跑前请先核对 PRAGMA table_info）。

ALTER TABLE users ADD COLUMN email TEXT;
ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0;

-- 部分唯一索引：仅对非 NULL 邮箱生效（未绑定用户互不冲突）
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL;

CREATE TABLE IF NOT EXISTS email_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  purpose TEXT NOT NULL,                   -- 'bind' | 'reset'
  user_id INTEGER,
  expires_at INTEGER NOT NULL,
  used INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_email_codes_lookup ON email_codes(email, purpose, used);

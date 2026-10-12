-- 唐山师范学院吧官网 · 动态站 D1 建表
-- 执行：wrangler d1 execute tstc-ba-db --file=./schema.sql
-- 绑定变量名（在 Cloudflare 控制台 Pages 项目 → Functions → D1 绑定）：DB

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  pass TEXT NOT NULL,                       -- 格式 pbkdf2$<iters>$<saltHex>$<hashHex>
  role TEXT NOT NULL DEFAULT 'user',       -- 'user' | 'admin'
  status TEXT NOT NULL DEFAULT 'active',   -- 'active' | 'banned'
  level INTEGER NOT NULL DEFAULT 1,        -- 等级：1 + floor(可见评论数 / 5)，删评扣回
  email TEXT,                              -- 绑定邮箱（NULL = 未绑定；唯一性见 idx_users_email）
  email_verified INTEGER NOT NULL DEFAULT 0, -- 邮箱是否经验证码确认（0/1）
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,               -- 'post-17' / 'post-17-en'
  lang TEXT NOT NULL DEFAULT 'zh',
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  author TEXT NOT NULL,
  excerpt TEXT,
  cover TEXT,
  content TEXT NOT NULL,                   -- 正文 HTML（原 .article-content 内容）
  user_id INTEGER NOT NULL DEFAULT 0,      -- 归属用户 id（0 = 后台/历史文章）
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  thread TEXT NOT NULL,                    -- 去 -en 后的键，如 'post-17'（中英文共用）
  user_id INTEGER NOT NULL,
  username TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'visible',  -- 'visible' | 'deleted'
  parent_id INTEGER                        -- 楼中楼：回复的上级评论 id；NULL = 顶层评论
);

-- 邮箱验证码（绑定邮箱 / 重置密码共用）：一次性、5 分钟有效
CREATE TABLE IF NOT EXISTS email_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL,
  code TEXT NOT NULL,                      -- 6 位数字验证码
  purpose TEXT NOT NULL,                   -- 'bind'（绑定/换绑邮箱）| 'reset'（重置密码）
  user_id INTEGER,                         -- bind：发起用户 id；reset：目标用户 id
  expires_at INTEGER NOT NULL,             -- 过期时间戳（毫秒）
  used INTEGER NOT NULL DEFAULT 0,         -- 是否已使用（一次性）
  created_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_user ON articles(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_thread ON comments(thread, created_at);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_email_codes_lookup ON email_codes(email, purpose, used);

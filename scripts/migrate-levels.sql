-- 等级系统 + 楼中楼 + 用户文章归属 的存量库迁移
-- 执行：wrangler d1 execute tstc-ba-db --remote --file=./scripts/migrate-levels.sql
--
-- 说明：
-- 1) 仅对「已存在」的远程 D1 库生效；全新库直接用 schema.sql 建表即可，无需本文件。
-- 2) ALTER 语句不可重复执行（列已存在会报错）。若需重跑，请先手动 DROP 对应列或仅保留 UPDATE 段。
-- 3) users.level：依据该用户「可见」评论数重算（1 + floor(可见评论数 / 5)）。
-- 4) articles.user_id：存量文章（含静态迁移的管理员文章）统一置 0，表示「后台/历史文章」，
--    后续由用户（level>=3）发布的文章会写入真实 user_id。

ALTER TABLE users ADD COLUMN level INTEGER NOT NULL DEFAULT 1;
ALTER TABLE comments ADD COLUMN parent_id INTEGER;
ALTER TABLE articles ADD COLUMN user_id INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_articles_user ON articles(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_id);

-- 按有效评论重算存量用户等级（SQLite 整数除法：COUNT(*)/5 即 floor）
UPDATE users
SET level = 1 + (SELECT COUNT(*) FROM comments WHERE comments.user_id = users.id AND comments.status = 'visible') / 5;

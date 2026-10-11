#!/usr/bin/env node
// 迁移脚本：解析 news/post-N.html 与 news/post-N-en.html，抽取元数据与正文，
// 生成 scripts/seed-articles.sql（INSERT OR REPLACE 到 D1 articles 表）。
// 用法：node scripts/migrate-articles.mjs            # 仅生成 SQL
//       node scripts/migrate-articles.mjs --execute  # 生成并尝试 wrangler 本地写入（需已登录）
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const NEWS = join(ROOT, 'news');

const metaRe = /<script id="articleMeta" type="application\/json">([\s\S]*?)<\/script>/;
const bodyRe = /<div class="article-content">([\s\S]*?)<\/div>\s*<!-- AUTO_PREV_NEXT_START -->/;

function sq(s) {
  return `'${String(s ?? '').replace(/'/g, "''")}'`;
}

const files = readdirSync(NEWS).filter((f) => /^post-\d+(-en)?\.html$/.test(f)).sort();
const rows = [];
let skipped = 0;

for (const f of files) {
  const html = readFileSync(join(NEWS, f), 'utf-8');
  const metaM = html.match(metaRe);
  const bodyM = html.match(bodyRe);
  if (!metaM || !bodyM) { console.error(`跳过（结构不符）: ${f}`); skipped++; continue; }
  let meta;
  try { meta = JSON.parse(metaM[1].trim()); } catch (e) { console.error(`跳过（meta 非 JSON）: ${f}`); skipped++; continue; }
  const slug = f.replace(/\.html$/, '');
  const lang = slug.endsWith('-en') ? 'en' : 'zh';
  const content = bodyM[1].replace(/^\n+|\n+$/g, '');
  const now = Date.now();
  rows.push({
    slug: sq(slug),
    lang: sq(lang),
    title: sq(meta.title || ''),
    date: sq(meta.date || ''),
    category: sq(meta.category || ''),
    author: sq(meta.author || ''),
    excerpt: sq(meta.excerpt || ''),
    cover: sq(''),
    content: sq(content),
    created_at: now,
    updated_at: now,
  });
}

const cols = ['slug', 'lang', 'title', 'date', 'category', 'author', 'excerpt', 'cover', 'content', 'created_at', 'updated_at'];
const sql =
  `-- 由 scripts/migrate-articles.mjs 生成，迁移 ${rows.length} 篇文章到 D1 articles 表\n` +
  `-- 执行：wrangler d1 execute tstc-ba-db --remote --file=scripts/seed-articles.sql\n` +
  `-- 注意：D1 不支持 SQL BEGIN/COMMIT 事务，逐条 INSERT OR REPLACE。\n` +
  rows.map((r) => `INSERT OR REPLACE INTO articles (${cols.join(', ')}) VALUES (${cols.map((c) => r[c]).join(', ')});`).join('\n') +
  `\n`;

const outPath = join(ROOT, 'scripts', 'seed-articles.sql');
writeFileSync(outPath, sql, 'utf-8');
console.log(`已生成 ${outPath}（${rows.length} 篇，跳过 ${skipped} 篇）`);

if (process.argv.includes('--execute')) {
  const { execSync } = await import('node:child_process');
  try {
    execSync('npx wrangler d1 execute tstc-ba-db --remote --file=scripts/seed-articles.sql', { cwd: ROOT, stdio: 'inherit' });
    console.log('远程 D1 写入完成（--remote）。');
  } catch (e) {
    console.error('写入失败（可能未登录 wrangler 或 DB 不存在）。请手动执行 wrangler 命令。');
  }
}

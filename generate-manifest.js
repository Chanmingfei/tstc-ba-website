#!/usr/bin/env node
/**
 * 扫描 news/ 下的所有文章 HTML，提取每篇的 #articleMeta 元信息，
 * 生成 news-manifest.json（按日期倒序）。
 *
 * 部署说明：
 *   - Cloudflare Pages 的「构建命令」设为：node generate-manifest.js
 *   - 本地预览前也先运行一次：node generate-manifest.js
 * 这样新增/修改文章只需动 news/<slug>.html，清单会自动更新，首页随之同步。
 */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const newsDir = path.join(root, 'news');

if (!fs.existsSync(newsDir)) {
    console.error('未找到 news/ 目录');
    process.exit(1);
}

const files = fs.readdirSync(newsDir).filter(f => f.endsWith('.html'));
const items = [];

for (const f of files) {
    const slug = f.replace(/\.html$/, '');
    const html = fs.readFileSync(path.join(newsDir, f), 'utf8');
    const m = html.match(/<script id="articleMeta" type="application\/json">([\s\S]*?)<\/script>/);
    if (!m) continue;
    let meta;
    try {
        meta = JSON.parse(m[1]);
    } catch (e) {
        console.warn('跳过 ' + f + '：元信息 JSON 解析失败');
        continue;
    }
    meta.slug = slug;
    items.push(meta);
}

items.sort((a, b) => (a.date < b.date ? 1 : -1));

const outPath = path.join(root, 'news-manifest.json');
fs.writeFileSync(outPath, JSON.stringify(items, null, 2), 'utf8');
console.log('已生成 news-manifest.json，共 ' + items.length + ' 篇文章');

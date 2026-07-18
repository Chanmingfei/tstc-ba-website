#!/usr/bin/env node
/**
 * 扫描 news/ 下的所有文章 HTML，提取每篇的 #articleMeta 元信息，
 * 生成 news-manifest.json（按日期倒序），并据此生成 assets/news-version.js
 * （内含带哈希的清单地址，用于缓存击穿：内容变了版本号就变，立即生效）。
 *
 * 部署说明：
 *   - Cloudflare Pages 的「构建命令」设为：node generate-manifest.js
 *   - 本地预览前也先运行一次：node generate-manifest.js
 * 这样新增/修改文章只需动 news/<slug>.html，清单会自动更新，首页随之同步。
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

const manifest = JSON.stringify(items, null, 2);
// 用内容哈希做版本号，内容一变哈希就变，清单 URL 随之变化，缓存立即失效
const hash = crypto.createHash('md5').update(manifest).digest('hex').slice(0, 8);

fs.writeFileSync(path.join(root, 'news-manifest.json'), manifest, 'utf8');
fs.writeFileSync(
    path.join(root, 'assets', 'news-version.js'),
    'window.NEWS_MANIFEST_URL = "news-manifest.json?v=' + hash + '";\n',
    'utf8'
);
// 把文章数据直接写成脚本（放在 /assets/ 下，Cloudflare 会稳定边缘缓存）。
// 前端直接读 window.__NEWS__ 渲染列表，省掉一次额外的清单网络请求，刷新即秒开；
// 即使边缘没命中，/assets/ 下的文件浏览器也会按版本号缓存，二次刷新即时生效。
fs.writeFileSync(
    path.join(root, 'assets', 'news-data.js'),
    'window.__NEWS__ = ' + JSON.stringify(items) + ';\n',
    'utf8'
);
console.log('已生成 news-manifest.json（' + items.length + ' 篇），版本 ' + hash);

// 用 main.js 内容哈希做脚本版本号：文件一改哈希就变，HTML 引用的 URL 随之变化，
// Cloudflare 边缘缓存按「完整 URL（含查询串）」做键，旧 ?v= 变体不会被复用，彻底避免陈旧缓存。
const mainJsPath = path.join(root, 'assets', 'main.js');
let mainJsHash = '0';
if (fs.existsSync(mainJsPath)) {
    mainJsHash = crypto.createHash('md5').update(fs.readFileSync(mainJsPath, 'utf8')).digest('hex').slice(0, 8);
}

function walkHtml(dir) {
    const out = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) out.push(...walkHtml(full));
        else if (entry.name.endsWith('.html')) out.push(full);
    }
    return out;
}

// news-data.js 同样按内容哈希做版本号，内容变化 URL 即变，缓存立即失效
const newsDataPath = path.join(root, 'assets', 'news-data.js');
let newsDataHash = '0';
if (fs.existsSync(newsDataPath)) {
    newsDataHash = crypto.createHash('md5').update(fs.readFileSync(newsDataPath, 'utf8')).digest('hex').slice(0, 8);
}

const htmlFiles = walkHtml(root);
let updated = 0;
for (const file of htmlFiles) {
    const before = fs.readFileSync(file, 'utf8');
    // 匹配 main.js / news-data.js 的 ?v=<任意版本> 并替换为内容哈希版本
    const after = before
        .replace(/(main\.js)\?v=[^"'>\s]*/g, '$1?v=' + mainJsHash)
        .replace(/(news-data\.js)\?v=[^"'>\s]*/g, '$1?v=' + newsDataHash);
    if (after !== before) {
        fs.writeFileSync(file, after, 'utf8');
        updated++;
    }
}
console.log('已更新 ' + updated + ' 个 HTML 中 main.js/news.js 版本（main=' + mainJsHash + ' data=' + newsDataHash + '）');

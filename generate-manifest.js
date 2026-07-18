#!/usr/bin/env node
/**
 * 扫描 news/ 下的所有文章 HTML，提取每篇的 #articleMeta 元信息，
 * 生成 news-manifest.json（按日期倒序），并据此生成 assets/news-version.js
 * （内含带哈希的清单地址，作为本地预览的兜底）。
 *
 * 关键优化：文章数据会直接「内联」进渲染列表的页面（index.html / news.html），
 * 以 <script>window.__NEWS__=[...]</script> 形式放在 main.js 之前。
 * 这样前端无需任何额外网络请求即可渲染列表，刷新即秒开，也彻底规避了
 * Cloudflare 对带 ?v= 查询串的静态资源偶发 404 的问题。
 *
 * 部署说明：
 *   - Cloudflare Pages 的「构建命令」建议设为：npm run build
 *     （= 预编译 Tailwind CSS + 生成清单/内联数据；本脚本也会自动先编译 CSS）
 *   - 也可直接设为：node generate-manifest.js（脚本内部已包含 CSS 预编译）
 *   - 本地预览前先运行一次：npm run build
 * 新增/修改文章只需动 news/<slug>.html，构建会自动同步，无需手动维护列表。
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

// 构建前先把 Tailwind 预编译为本地 CSS，保证部署产物自洽、彻底脱离外部 CDN。
// 若环境没有 tailwindcss（如仅预览已提交产物），则退回到已提交的 assets/style.css。
try {
  console.log('▶ 预编译 Tailwind CSS ...');
  execSync('npm run build:css', { stdio: 'inherit' });
} catch (e) {
  console.warn('⚠ 跳过 Tailwind 构建，使用已提交的 assets/style.css：', e.message);
}

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
// 用内容哈希做版本号，内容一变哈希就变，清单 URL 随之变化（仅作兜底用途）
const hash = crypto.createHash('md5').update(manifest).digest('hex').slice(0, 8);

fs.writeFileSync(path.join(root, 'news-manifest.json'), manifest, 'utf8');
fs.writeFileSync(
    path.join(root, 'assets', 'news-version.js'),
    'window.NEWS_MANIFEST_URL = "news-manifest.json?v=' + hash + '";\n',
    'utf8'
);
console.log('已生成 news-manifest.json（' + items.length + ' 篇），版本 ' + hash);

// main.js 版本号随内容哈希变化，HTML 引用的 URL 随之变化，避免陈旧缓存
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

const htmlFiles = walkHtml(root);
let updated = 0;
for (const file of htmlFiles) {
    let html = fs.readFileSync(file, 'utf8');
    const orig = html;
    // 1) 幂等清理：去掉上一次注入的内联数据脚本，以及任何残留的 news-data.js 外链
    html = html.replace(/<script>\s*window\.__NEWS__\s*=\s*[\s\S]*?<\/script>\s*/g, '');
    html = html.replace(/\s*<script src="assets\/news-data\.js[^"]*"><\/script>/g, '');
    // 2) main.js 版本号随内容哈希变化
    html = html.replace(/(main\.js)\?v=[^"'>\s]*/g, '$1?v=' + mainJsHash);
    // 3) 仅在真正渲染新闻列表的页面内联数据（放在 main.js 之前，确保渲染前已就绪）
    if (/id="newsGrid"|id="newsPreview"/.test(html)) {
        const dataScript = '<script>window.__NEWS__ = ' + JSON.stringify(items) + ';</script>';
        html = html.replace(/(<script[^>]*assets\/main\.js[^>]*><\/script>)/, '\n    ' + dataScript + '\n    $1');
    }
    if (html !== orig) {
        fs.writeFileSync(file, html, 'utf8');
        updated++;
    }
}
console.log('已更新 ' + updated + ' 个 HTML（main.js 版本=' + mainJsHash + '，含新闻列表的页面已内联数据）');

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
// 触发 Cloudflare 重新构建（确保全部 post-N 导航块均被注入）

// ---- 自动生成「上一篇 / 下一篇」导航 ----
// 仅对 post-N.html 且 N>=6 的文章生成（N<6 为测试性质文章，按需求不加导航）。
// 同一系列内按日期排序相邻的文章互相关联，测试文章不会出现在导航中。
const NAV_START = '<!-- AUTO_PREV_NEXT_START -->';
const NAV_END = '<!-- AUTO_PREV_NEXT_END -->';
const NAV_RE = new RegExp(
    NAV_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
    '[\\s\\S]*?' +
    NAV_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
);

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));
}

// 生成单个导航格子：有邻篇则渲染为可点击链接，无则渲染为占位说明
function navCell(isPrev, n) {
    const icon = isPrev
        ? '<i class="fa fa-arrow-left mr-1"></i> 上一篇'
        : '下一篇 <i class="fa fa-arrow-right ml-1"></i>';
    const align = isPrev ? '' : ' text-right';
    if (n) {
        return '                <a href="' + n.slug + '.html" class="border border-gray-200 rounded-xl p-4 flex flex-col' + align +
            ' text-secondary hover:text-primary hover:bg-gray-100 transition-colors font-medium">\n' +
            '                    <span class="text-sm text-gray-500 mb-1">' + icon + '</span>\n' +
            '                    <span class="leading-tight">' + escapeHtml(n.title) + '</span>\n' +
            '                </a>';
    }
    const text = isPrev ? '已是本系列第一篇' : '已是最新一篇';
    return '                <div class="border border-gray-200 rounded-xl p-4 flex flex-col' + align + '">\n' +
        '                    <span class="text-sm text-gray-500 mb-1">' + icon + '</span>\n' +
        '                    <span class="leading-tight text-gray-500">' + text + '</span>\n' +
        '                </div>';
}

// 生成导航块内部的 <div> 内容（不含占位标记，标记在插入时统一包裹）
function buildNav(prev, next) {
    return '            <div class="mt-10 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">\n' +
        navCell(true, prev) + '\n' +
        navCell(false, next) + '\n' +
        '            </div>';
}

// 系列文章（全部 post-N 新闻），继承 items 的日期倒序：index 越小越新
const seriesItems = items.filter(it => /^post-\d+$/.test(it.slug));

// main.js 版本号随内容哈希变化，HTML 引用的 URL 随之变化，避免陈旧缓存
const mainJsPath = path.join(root, 'assets', 'main.js');
let mainJsHash = '0';
if (fs.existsSync(mainJsPath)) {
    mainJsHash = crypto.createHash('md5').update(fs.readFileSync(mainJsPath, 'utf8')).digest('hex').slice(0, 8);
}

// style.css / fa.min.css 同样加内容哈希版本号，避免浏览器/边缘长期缓存旧文件
// （之前它们没有版本号，部署后用户仍看到旧的缺类样式）
function fileHash(p) {
    try { return crypto.createHash('md5').update(fs.readFileSync(p, 'utf8')).digest('hex').slice(0, 8); }
    catch (e) { return '0'; }
}
const styleHash = fileHash(path.join(root, 'assets', 'style.css'));
const faHash = fileHash(path.join(root, 'assets', 'fontawesome', 'fa.min.css'));

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
    // 2b) style.css / fa.min.css 加版本号，防止陈旧缓存（覆盖根目录与 news/ 子目录两种路径）
    html = html.replace(/(href="[^"]*style\.css)(\?v=[^"]*)?"/g, '$1?v=' + styleHash + '"');
    html = html.replace(/(href="[^"]*fa\.min\.css)(\?v=[^"]*)?"/g, '$1?v=' + faHash + '"');
    // 2c) 注入 favicon（吧徽图标，所有页面统一）
    const FAVICON_LINK = '<link rel="icon" type="image/jpeg" href="https://s1.imagehub.cc/images/2025/05/04/0458fef2ac8d47bc88ee2151cf193573.jpg">';
    html = html.replace(/<link[^>]*rel=["']icon["'][^>]*>/g, '');  // 幂等：先清旧
    html = html.replace(/(<\/head>)/, '    ' + FAVICON_LINK + '\n$1');  // 再注入
    // 3) 仅在真正渲染新闻列表的页面内联数据（放在 main.js 之前，确保渲染前已就绪）
        if (/id="newsGrid"|id="newsPreview"/.test(html)) {
        const dataScript = '<script>window.__NEWS__ = ' + JSON.stringify(items) + ';</script>';
        html = html.replace(/(<script[^>]*assets\/main\.js[^>]*><\/script>)/, '\n    ' + dataScript + '\n    $1');
    }
    // 4) 自动注入「上一篇 / 下一篇」导航（所有 post-N.html 新闻）
    //    不论文章里是旧版手写块、还是之前生成的带标记块，统一先清掉，
    //    再在「返回新闻列表」之前插入一份最新生成的导航，避免重复出现两组按钮。
    const pm = file.match(/[\\/]news[\\/]post-(\d+)\.html$/);
    if (pm) {
        const slug = path.basename(file, '.html');
        const idx = seriesItems.findIndex(it => it.slug === slug);
        if (idx !== -1) {
            const prev = seriesItems[idx + 1] || null; // 更旧一篇
            const next = seriesItems[idx - 1] || null; // 更新一篇
            // 清除旧导航：新占位标记整块 + 残留标记 + 老式「<!-- 上一篇 / 下一篇 -->」手写块
            html = html.replace(new RegExp(
                NAV_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + NAV_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
            html = html.replace(/<!--\s*AUTO_PREV_NEXT_START\s*-->/g, '');
            html = html.replace(/<!--\s*AUTO_PREV_NEXT_END\s*-->/g, '');
            html = html.replace(/<!--\s*上一篇[\s\S]*?下一篇\s*-->\s*<div class="mt-10 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">[\s\S]*?(?=<div class="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between">)/g, '');
            // 在「返回新闻列表」之前统一插入一份自动生成的导航
            html = html.replace(
                /([ \t]*)(<div class="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between">)/,
                '$1' + NAV_START + '\n' + buildNav(prev, next) + '\n$1' + NAV_END + '\n$1$2'
            );
        }
    }
    if (html !== orig) {
        fs.writeFileSync(file, html, 'utf8');
        updated++;
    }
}
console.log('已更新 ' + updated + ' 个 HTML（main.js 版本=' + mainJsHash + '，含新闻列表的页面已内联数据）');

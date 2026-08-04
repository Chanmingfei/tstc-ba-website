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
 *   - 也可直接设为：node build/generate-manifest.js（脚本内部已包含 CSS 预编译）
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

const root = path.resolve(__dirname, '..');
const newsDir = path.join(root, 'news');

if (!fs.existsSync(newsDir)) {
    console.error('未找到 news/ 目录');
    process.exit(1);
}

const files = fs.readdirSync(newsDir).filter(f => f.endsWith('.html'));
const items = [];

// 自动提取文章封面：
// 取 <main> 正文中第一张「非二维码 / 非品牌图」的图片作为卡片封面。
// 文章位于 news/ 子目录，图片通常以 ../assets/... 引用，这里统一转成站点根相对路径，
// 使封面在首页 / 新闻列表页（根目录）都能正确显示。若文章无合适图片，则留空，
// 前端（assets/main.js）会回退为文章分类对应的图标。
// 若 #articleMeta 中已手动指定 cover，则以手动为准（仍可强制指定封面）。
function extractCover(html, fallback) {
    if (fallback && String(fallback).trim()) return String(fallback).trim(); // 手动指定优先
    const mainMatch = html.match(/<main[\s\S]*?<\/main>/i);
    const body = mainMatch ? mainMatch[0] : html;
    const imgs = body.match(/<img\b[^>]*>/gi) || [];
    for (const tag of imgs) {
        const srcMatch = tag.match(/\ssrc=["']([^"']+)["']/i);
        if (!srcMatch) continue;
        const src = srcMatch[1];
        // 排除二维码（含群二维码 qq-group-qr、微信/小红书二维码）与品牌图（logo / 横幅）
        if (/qr|bar-logo|bg-banner/i.test(src)) continue;
        let p = src.replace(/^\.\//, '').replace(/^(\.\.\/)+/, ''); // ../assets → assets
        if (!p) continue;
        return p;
    }
    return '';
}

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
    meta.cover = extractCover(html, meta.cover);
    items.push(meta);
}

items.sort((a, b) => (a.date < b.date ? 1 : -1));

// 按语言拆分为中文 / 英文两套清单（英文文章 slug 以 -en 结尾）
const itemsZh = items.filter(it => !/-en$/.test(it.slug));
const itemsEn = items.filter(it => /-en$/.test(it.slug));

const manifest = JSON.stringify(itemsZh, null, 2);
// 用内容哈希做版本号，内容一变哈希就变，清单 URL 随之变化（仅作兜底用途）
const hash = crypto.createHash('md5').update(manifest).digest('hex').slice(0, 8);

fs.writeFileSync(path.join(root, 'news-manifest.json'), manifest, 'utf8');
fs.writeFileSync(path.join(root, 'news-manifest-en.json'), JSON.stringify(itemsEn, null, 2), 'utf8');
fs.writeFileSync(
    path.join(root, 'assets', 'news-version.js'),
    'window.NEWS_MANIFEST_URL = "news-manifest.json?v=' + hash + '";\n',
    'utf8'
);
console.log('已生成 news-manifest.json（' + itemsZh.length + ' 篇）/ news-manifest-en.json（' + itemsEn.length + ' 篇），版本 ' + hash);
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
// isEn 控制按钮文案（中文 / English）
function navCell(isPrev, n, isEn) {
    const icon = isPrev
        ? (isEn ? '<i class="fa fa-arrow-left mr-1"></i> Previous' : '<i class="fa fa-arrow-left mr-1"></i> 上一篇')
        : (isEn ? 'Next <i class="fa fa-arrow-right ml-1"></i>' : '下一篇 <i class="fa fa-arrow-right ml-1"></i>');
    const align = isPrev ? '' : ' text-right';
    if (n) {
        return '                <a href="' + n.slug + '.html" class="border border-gray-200 rounded-xl p-4 flex flex-col' + align +
            ' text-secondary hover:text-primary hover:bg-gray-100 transition-colors font-medium">\n' +
            '                    <span class="text-sm text-gray-500 mb-1">' + icon + '</span>\n' +
            '                    <span class="leading-tight">' + escapeHtml(n.title) + '</span>\n' +
            '                </a>';
    }
    const text = isPrev
        ? (isEn ? 'First in this series' : '已是本系列第一篇')
        : (isEn ? 'Latest post' : '已是最新一篇');
    return '                <div class="border border-gray-200 rounded-xl p-4 flex flex-col' + align + '">\n' +
        '                    <span class="text-sm text-gray-500 mb-1">' + icon + '</span>\n' +
        '                    <span class="leading-tight text-gray-500">' + text + '</span>\n' +
        '                </div>';
}

// 生成导航块内部的 <div> 内容（不含占位标记，标记在插入时统一包裹）
function buildNav(prev, next, isEn) {
    return '            <div class="mt-10 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">\n' +
        navCell(true, prev, isEn) + '\n' +
        navCell(false, next, isEn) + '\n' +
        '            </div>';
}

// 系列文章（全部 post-N 新闻，含 -en 英文版），继承 items 的日期倒序：index 越小越新
const seriesItems = items.filter(it => /^post-\d+(-en)?$/.test(it.slug));

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

// ---- 社交分享卡片（Open Graph / Twitter Card）与站点地图所需基础配置 ----
// SITE_BASE：站点绝对地址前缀；默认使用本站正式公网域名，确保 OG / sitemap / 分享链接
// 都是可被第三方（贴吧等）抓取的绝对地址。部署到其它域名时可环境变量覆盖，例如
//   SITE_BASE=https://your-domain.com npm run build
const SITE_BASE = (process.env.SITE_BASE || 'https://tstc.pp.ua').replace(/\/+$/, '');
const DEFAULT_OG_IMAGE = '/assets/images/bar-logo.jpg';
function escAttr(s) {
    return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
// 解码常见 HTML 实体：从已渲染的 HTML 文本（如 <title>、<meta description>）提取内容时，
// 源里可能已含 &amp; 等转义，先还原再交给 escAttr，避免二次转义（&amp;amp;）。
function decodeEntities(s) {
    return String(s)
        .replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/&apos;/gi, "'");
}
// slug -> 封面图（来自文章元信息，供 og:image 使用）
const coverMap = {};
for (const it of items) { if (it.cover) coverMap[it.slug] = it.cover; }

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

// ---- 生成全站搜索索引（标题 + 正文，按语言拆分为中/英两套） ----
// 供 assets/main.js 的站内搜索使用：构建期一次性抓取所有页面的纯文本，
// 避免浏览器端实时抓取/解析带来的额外请求与 404 风险。
function extractSearchText(html) {
    // 只取 <main> 内容，排除顶栏导航、页脚、弹窗等全站公共骨架。
    // 若页面异常没有 <main>，则回退到整个 <body>。
    let h = html;
    const mainMatch = h.match(/<main[\s\S]*?<\/main>/i);
    if (mainMatch) {
        h = mainMatch[0];
    } else {
        const bodyMatch = h.match(/<body[\s\S]*?<\/body>/i);
        h = bodyMatch ? bodyMatch[0] : h;
    }
    // 先剔除 <style>（含巨型 Tailwind 重置样式）与 <script>（含内联数据/脚本）内容，
    // 否则这些非正文会污染搜索结果（例如 CSS 类名会被全文命中）。
    h = h.replace(/<style[\s\S]*?<\/style>/gi, ' ');
    h = h.replace(/<script[\s\S]*?<\/script>/gi, ' ');
    // 去掉自动生成的「上一篇 / 下一篇」导航块
    h = h.replace(/<!--\s*AUTO_PREV_NEXT_START\s*-->[\s\S]*?<!--\s*AUTO_PREV_NEXT_END\s*-->/gi, ' ');
    // 去掉文章底部的「返回新闻列表 / 返回首页」按钮行（中英文页面共用同一套 class）
    h = h.replace(/<div class="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between">[\s\S]*?<\/div>/gi, ' ');
    h = h.replace(/<[^>]+>/g, ' ');
    h = h.replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/&apos;/gi, "'");
    return h.replace(/\s+/g, ' ').trim();
}
function extractSearchTitle(html) {
    const m = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    let t = m ? m[1].replace(/\s+/g, ' ').trim() : '';
    // 解码常见 HTML 实体（标题里可能出现 &amp; 等）
    t = t.replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/&apos;/gi, "'");
    // 去掉站点名/品牌后缀，让搜索结果标题更干净（中英文各几种写法）
    t = t.replace(/\s*-\s*TSNU Bar\s*$/i, '')
         .replace(/\s*-\s*Tangshan Normal University Bar\s*$/i, '')
         .replace(/\s*-\s*Mod Team Official Site \(not affiliated with the school\)\s*$/i, '')
         .replace(/\s*-\s*唐山师范学院吧\s*$/, '');
    return t.trim() || '(untitled)';
}

const searchZh = [];
const searchEn = [];
for (const file of htmlFiles) {
    // 仅收录真实站点页面：根目录下的 .html 与 news/ 下的文章，
    // 排除 .templates / docs / .codebuddy 等目录里的模板与文档页，避免它们出现在搜索结果中。
    const rel = path.relative(root, file).split(path.sep);
    const inRoot = rel.length === 1;
    const inNews = rel.length === 2 && rel[0] === 'news';
    if (!inRoot && !inNews) continue;
    const fb = path.basename(file).replace(/\.html$/, '');
    // 错误页（404.html / dzl.html 均为「页面不存在」）不进入搜索索引
    if (fb === '404' || fb === '404-en' || fb === 'dzl' || fb === 'dzl-en') continue;
    const isEnPage = /-en$/.test(fb);
    const html = fs.readFileSync(file, 'utf8');
    const entry = {
        title: extractSearchTitle(html),
        url: rel.join('/'),
        text: extractSearchText(html)
    };
    (isEnPage ? searchEn : searchZh).push(entry);
}
const searchDataStr = JSON.stringify({ zh: searchZh, en: searchEn });
const searchHash = crypto.createHash('md5').update(searchDataStr).digest('hex').slice(0, 8);
fs.writeFileSync(path.join(root, 'assets', 'search-index.json'), searchDataStr, 'utf8');
console.log('已生成 search-index.json（中文 ' + searchZh.length + ' 页 / 英文 ' + searchEn.length + ' 页），版本 ' + searchHash);

// ---- 贴吧分享短链（dwz.cn）----
// 背景：tstc.pp.ua 这个免费域名被百度贴吧分享接口屏蔽（提示"分享URL不合法"）。
// 用百度自家的 dwz.cn 短链包装后，贴吧对话框通常能接受（dwz.cn 为百度信任域名）。
// 仅当构建环境提供 DWZ_TOKEN 时才生成；否则跳过，分享按钮自动回退到长链接。
// 短链映射缓存到 build/.shortlinks.json，避免每次构建重复申请、浪费"长期有效"配额、产生重复短链。
const SHORT_LINK_CACHE = path.join(__dirname, '.shortlinks.json');
function loadShortCache() {
    try { return JSON.parse(fs.readFileSync(SHORT_LINK_CACHE, 'utf8')); } catch (e) { return {}; }
}
function saveShortCache(map) {
    try { fs.writeFileSync(SHORT_LINK_CACHE, JSON.stringify(map, null, 2), 'utf8'); } catch (e) {}
}
async function buildShortLinks(pages) {
    const map = {};
    const token = process.env.DWZ_TOKEN;
    if (!token) {
        console.log('ℹ 未设置 DWZ_TOKEN，跳过贴吧短链生成（分享将使用长链接）');
        return map;
    }
    if (typeof fetch === 'undefined') {
        console.warn('⚠ 当前 Node 环境无 fetch，跳过贴吧短链生成');
        return map;
    }
    const cache = loadShortCache();
    const pending = [];
    for (const p of pages) {
        if (cache[p.url]) map[p.url] = cache[p.url];
        else pending.push(p);
    }
    if (pending.length === 0) {
        console.log('✓ 贴吧短链全部命中缓存（' + Object.keys(map).length + ' 条）');
        return map;
    }
    console.log('▶ 生成贴吧短链（dwz.cn），需申请 ' + pending.length + ' 条 ...');
    let ok = 0, fail = 0;
    for (const p of pending) {
        try {
            const res = await fetch('https://dwz.cn/api/v3/short-urls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=UTF-8', 'Dwz-Token': token },
                body: JSON.stringify([{ LongUrl: p.url, TermOfValidity: 'long-term' }])
            });
            const data = await res.json();
            const item = (data && Array.isArray(data.ShortUrls) && data.ShortUrls[0]) ? data.ShortUrls[0] : null;
            if (item && item.ShortUrl && (item.Code === 0 || item.Code === undefined)) {
                map[p.url] = item.ShortUrl;
                cache[p.url] = item.ShortUrl;
                ok++;
            } else {
                const err = (item && item.ErrMsg) || (data && data.ErrMsg) || ('Code=' + (data && data.Code));
                console.warn('⚠ 短链生成失败 [' + p.url + ']：' + err);
                fail++;
            }
        } catch (e) {
            console.warn('⚠ 短链请求异常 [' + p.url + ']：' + e.message);
            fail++;
        }
        await new Promise(r => setTimeout(r, 150)); // 免费用户 10 QPS，留余量
    }
    saveShortCache(cache);
    console.log('✓ 贴吧短链生成完成：成功 ' + ok + '，失败 ' + fail);
    return map;
}

// 收集需要短链的页面（与 OG 注入同条件：排除 404 / dzl 错误页）
const sharePages = [];
for (const file of htmlFiles) {
    const fb = path.basename(file).replace(/\.html$/, '');
    if (fb === '404' || fb === '404-en' || fb === 'dzl' || fb === 'dzl-en') continue;
    const rel = path.relative(root, file).split(path.sep);
    let relUrl = '/' + rel.join('/');
    if (relUrl === '/index.html') relUrl = '/';
    sharePages.push({ file, url: SITE_BASE + relUrl });
}

(async () => {
const shortUrlMap = await buildShortLinks(sharePages);
let updated = 0;
for (const file of htmlFiles) {
    let html = fs.readFileSync(file, 'utf8');
    const orig = html;
    // 本页公开绝对地址，供短链映射查找
    const relTop = path.relative(root, file).split(path.sep);
    let relUrlTop = '/' + relTop.join('/');
    if (relUrlTop === '/index.html') relUrlTop = '/';
    const pageUrlFull = SITE_BASE + relUrlTop;
    // 1) 幂等清理：去掉上一次注入的内联数据脚本（中/英两套都要清），以及任何残留的 news-data.js 外链
    html = html.replace(/<script>\s*window\.__NEWS(_EN)?__\s*=\s*[\s\S]*?<\/script>\s*/g, '');
    html = html.replace(/\s*<script src="assets\/news-data\.js[^"]*"><\/script>/g, '');
    // 幂等清理：去掉上一次注入的搜索索引地址脚本，避免重复堆积
    html = html.replace(/<script>\s*window\.__SEARCH_INDEX_URL__\s*=\s*[\s\S]*?<\/script>\s*/g, '');
    // 2) main.js 版本号随内容哈希变化
    html = html.replace(/(main\.js)\?v=[^"'>\s]*/g, '$1?v=' + mainJsHash);
    // 2b) style.css / fa.min.css 加版本号，防止陈旧缓存（覆盖根目录与 news/ 子目录两种路径）
    html = html.replace(/(href="[^"]*style\.css)(\?v=[^"]*)?"/g, '$1?v=' + styleHash + '"');
    html = html.replace(/(href="[^"]*fa\.min\.css)(\?v=[^"]*)?"/g, '$1?v=' + faHash + '"');
    // 2c) 注入 favicon（吧徽图标，所有页面统一）
    const FAVICON_LINK = '<link rel="icon" type="image/jpeg" href="/assets/images/bar-logo.jpg">';
    html = html.replace(/<link[^>]*rel=["']icon["'][^>]*>/g, '');  // 幂等：先清旧
    html = html.replace(/(<\/head>)/, '    ' + FAVICON_LINK + '\n$1');  // 再注入

    // 2d) 注入社交分享卡片（Open Graph / Twitter Card），错误页不注入
    {
        const fb2 = path.basename(file).replace(/\.html$/, '');
        if (fb2 !== '404' && fb2 !== '404-en' && fb2 !== 'dzl' && fb2 !== 'dzl-en') {
            const rel2 = path.relative(root, file).split(path.sep);
            const titleM = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
            const title = titleM ? decodeEntities(titleM[1]).replace(/\s+/g, ' ').trim() : '';
            const descM = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
            const desc = descM ? decodeEntities(descM[1]) : '';
            let relUrl = '/' + rel2.join('/');
            if (relUrl === '/index.html') relUrl = '/';
            const url = SITE_BASE + relUrl;
            let img = DEFAULT_OG_IMAGE;
            if (coverMap[fb2]) img = '/' + String(coverMap[fb2]).replace(/^\/+/, '');
            img = SITE_BASE + img;
            const ogType = /^post-\d+(-en)?$/.test(fb2) ? 'article' : 'website';
            const og =
                '<!-- AUTO_OG_START -->\n' +
                '<meta property="og:site_name" content="TSNU Bar">\n' +
                '<meta property="og:type" content="' + ogType + '">\n' +
                '<meta property="og:title" content="' + escAttr(title) + '">\n' +
                '<meta property="og:description" content="' + escAttr(desc) + '">\n' +
                '<meta property="og:url" content="' + escAttr(url) + '">\n' +
                '<meta property="og:image" content="' + escAttr(img) + '">\n' +
                '<meta name="twitter:card" content="summary_large_image">\n' +
                '<meta name="twitter:title" content="' + escAttr(title) + '">\n' +
                '<meta name="twitter:description" content="' + escAttr(desc) + '">\n' +
                '<meta name="twitter:image" content="' + escAttr(img) + '">\n' +
                '<!-- AUTO_OG_END -->';
            html = html.replace(/<!--\s*AUTO_OG_START\s*-->[\s\S]*?<!--\s*AUTO_OG_END\s*-->/g, '');
            html = html.replace(/(<\/head>)/, '    ' + og + '\n$1');
        }
    }
    // 3) 仅在真正渲染新闻列表的页面内联数据（放在 main.js 之前，确保渲染前已就绪）
    //    按页面语言注入对应清单：英文页用 window.__NEWS_EN__，中文页用 window.__NEWS__
        if (/id="newsGrid"|id="newsPreview"/.test(html)) {
        const pageIsEn = /\-en\.html$/.test(file);
        const dataArr = pageIsEn ? itemsEn : itemsZh;
        const varName = pageIsEn ? 'window.__NEWS_EN__' : 'window.__NEWS__';
        const dataScript = '<script>' + varName + ' = ' + JSON.stringify(dataArr) + ';</script>';
        html = html.replace(/(<script[^>]*assets\/main\.js[^>]*><\/script>)/, '\n    ' + dataScript + '\n    $1');
    }
    // 4b) 所有页面注入全站搜索索引地址（顶栏导航现也带搜索入口，故不再限定含搜索框的页面）
    //     使用站点根绝对路径，确保从 news/ 子页面也能正确加载；版本哈希随内容变化避免陈旧缓存
    {
        const searchUrlScript = '<script>window.__SEARCH_INDEX_URL__ = "/assets/search-index.json?v=' + searchHash + '";</script>';
        html = html.replace(/(<script[^>]*assets\/main\.js[^>]*><\/script>)/, '\n    ' + searchUrlScript + '\n    $1');
    }
    // 4c) 注入站点公开地址（SITE_BASE）。分享/OG 等需要可被第三方抓取「绝对公开地址」的场景使用；
    //     留空时分享回退到 location.href（线上为公网地址，本地预览为 localhost，贴吧等无法抓取会报错）。
    //     幂等：先清除旧的注入，避免多次构建叠加重复脚本。
    {
        html = html.replace(/<script>\s*window\.__SITE_URL__\s*=\s*[^;]*;\s*<\/script>\s*/g, '');
        const siteUrlScript = '<script>window.__SITE_URL__ = ' + JSON.stringify(SITE_BASE) + ';</script>';
        html = html.replace(/(<script[^>]*assets\/main\.js[^>]*><\/script>)/, '\n    ' + siteUrlScript + '\n    $1');
    }
    // 4d) 注入贴吧分享短链（dwz.cn）。仅当该页已生成短链时注入；否则清除旧注入，按钮回退长链接。幂等。
    {
        html = html.replace(/<script>\s*window\.__SHARE_SHORT_URL__\s*=\s*[^;]*;\s*<\/script>\s*/g, '');
        const short = shortUrlMap[pageUrlFull];
        if (short) {
            const s = '<script>window.__SHARE_SHORT_URL__ = ' + JSON.stringify(short) + ';</script>';
            html = html.replace(/(<script[^>]*assets\/main\.js[^>]*><\/script>)/, '\n    ' + s + '\n    $1');
        }
    }
    // 4) 自动注入「上一篇 / 下一篇」导航（所有 post-N.html 新闻，含 -en 英文版）
    //    不论文章里是旧版手写块、还是之前生成的带标记块，统一先清掉，
    //    再在「返回新闻列表」之前插入一份最新生成的导航，避免重复出现两组按钮。
    const pm = file.match(/[\\/]news[\\/]post-(\d+)(-en)?\.html$/);
    if (pm) {
        const pageIsEn = !!pm[2];
        const slug = path.basename(file, '.html');
        const langSeries = seriesItems.filter(it => /-en$/.test(it.slug) === pageIsEn);
        const idx = langSeries.findIndex(it => it.slug === slug);
        if (idx !== -1) {
            const prev = langSeries[idx + 1] || null; // 更旧一篇
            const next = langSeries[idx - 1] || null; // 更新一篇
            // 清除旧导航：新占位标记整块 + 残留标记 + 老式「<!-- 上一篇 / 下一篇 -->」手写块
            html = html.replace(new RegExp(
                NAV_START.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[\\s\\S]*?' + NAV_END.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
            html = html.replace(/<!--\s*AUTO_PREV_NEXT_START\s*-->/g, '');
            html = html.replace(/<!--\s*AUTO_PREV_NEXT_END\s*-->/g, '');
            html = html.replace(/<!--\s*上一篇[\s\S]*?下一篇\s*-->\s*<div class="mt-10 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">[\s\S]*?(?=<div class="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between">)/g, '');
            // 在「返回新闻列表」之前统一插入一份自动生成的导航
            html = html.replace(
                /([ \t]*)(<div class="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between">)/,
                '$1' + NAV_START + '\n' + buildNav(prev, next, pageIsEn) + '\n$1' + NAV_END + '\n$1$2'
            );
        }
    }
    if (html !== orig) {
        fs.writeFileSync(file, html, 'utf8');
        updated++;
    }
}
console.log('已更新 ' + updated + ' 个 HTML（main.js 版本=' + mainJsHash + '，含新闻列表的页面已内联数据）');

// ---- 生成 sitemap.xml 与 robots.txt（供搜索引擎收录） ----
{
    const today = new Date().toISOString().slice(0, 10);
    const urls = [];
    for (const file of htmlFiles) {
        const r = path.relative(root, file).split(path.sep);
        const inRoot = r.length === 1;
        const inNews = r.length === 2 && r[0] === 'news';
        if (!inRoot && !inNews) continue;
        const fb3 = path.basename(file).replace(/\.html$/, '');
        if (fb3 === '404' || fb3 === '404-en' || fb3 === 'dzl' || fb3 === 'dzl-en') continue;
        let u = '/' + r.join('/');
        if (u === '/index.html') u = '/';
        urls.push(SITE_BASE + u);
    }
    const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n' +
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
        urls.map(function (u) { return '  <url><loc>' + escAttr(u) + '</loc><lastmod>' + today + '</lastmod></url>'; }).join('\n') +
        '\n</urlset>\n';
    fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap, 'utf8');
    const robots = 'User-agent: *\nAllow: /\nSitemap: ' + (SITE_BASE ? SITE_BASE + '/sitemap.xml' : '/sitemap.xml') + '\n';
    fs.writeFileSync(path.join(root, 'robots.txt'), robots, 'utf8');
    console.log('已生成 sitemap.xml（' + urls.length + ' 条）/ robots.txt');
}
})();

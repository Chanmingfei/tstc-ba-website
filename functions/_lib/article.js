// 文章数据访问 + SSR 渲染：读取静态外壳并替换动态区域（正文进 D1，SSR 渲染）
// 静态 news/post-N.html 作为设计模板与回退；函数仅在 D1 有正文时替换动态区域。

export async function getArticleBySlug(env, slug) {
  if (!env.DB) return null;
  return await env.DB.prepare('SELECT * FROM articles WHERE slug = ?').bind(slug).first();
}

export async function listArticles(env, { lang = 'zh', category = null, limit = 20 } = {}) {
  const lim = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 50);
  let sql = 'SELECT slug, lang, title, date, category, author, excerpt, cover FROM articles WHERE lang = ?';
  const bind = [lang];
  if (category) { sql += ' AND category = ?'; bind.push(category); }
  sql += ' ORDER BY date DESC LIMIT ?';
  bind.push(lim);
  const rows = await env.DB.prepare(sql).bind(...bind).all();
  return rows.results || [];
}

export function escHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// 用于注入 <script> 数据块的 JSON：转义 < > 防止 </script> 提前闭合
export function jsonScript(obj) {
  return JSON.stringify(obj).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
}

// 用 D1 文章行替换静态外壳中的动态区域；正文为可信管理内容，按原样注入（不转义）。
export function renderArticlePage(shell, a) {
  let out = shell;

  // 1) <title>
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escHtml(a.title)} - 唐山师范学院吧</title>`);

  // 2) #articleMeta JSON（main.js 等依赖）
  out = out.replace(
    /(<script id="articleMeta" type="application\/json">)[\s\S]*?(<\/script>)/,
    (m, g1, g2) =>
      `${g1}\n${jsonScript({ title: a.title, date: a.date, category: a.category, author: a.author, excerpt: a.excerpt || '' })}\n${g2}`
  );

  // 3) 面包屑末项 = 分类
  out = out.replace(
    /(<a href="\.\.\/news\.html" class="hover:underline">新闻动态<\/a>\s*<span class="mx-2">\/<\/span>\s*)<span>[^<]*<\/span>/,
    `$1<span>${escHtml(a.category)}</span>`
  );

  // 4) meta 徽章（分类/日期/作者）+ h1 标题
  out = out.replace(
    /(<div class="flex items-center text-sm text-white\/85 mb-3">)[\s\S]*?(<\/h1>)/,
    `<div class="flex items-center text-sm text-white/85 mb-3">\n` +
      `  <span class="bg-white/20 px-3 py-1 rounded-full">${escHtml(a.category)}</span>\n` +
      `  <span class="ml-3"><i class="fa fa-calendar mr-1"></i>${escHtml(a.date)}</span>\n` +
      `  <span class="ml-3"><i class="fa fa-user mr-1"></i>${escHtml(a.author)}</span>\n` +
      `</div>\n` +
      `<h1 class="text-[clamp(1.6rem,4vw,2.2rem)] font-bold text-shadow leading-tight">${escHtml(a.title)}</h1>`
  );

  // 5) 正文（.article-content 内部 → 其闭合 </div> 紧邻 AUTO_PREV_NEXT_START 注释）
  out = out.replace(
    /(<div class="article-content">)[\s\S]*?(<\/div>\s*<!-- AUTO_PREV_NEXT_START -->)/,
    `$1\n${a.content || ''}\n$2`
  );

  return out;
}

// 由文章 slug 生成规范访问路径：吧友文章 ua-N → /user-articles/N；新闻 post-N → /news/post-N
export function articleUrl(slug) {
  const ua = /^ua-(\d+)(-en)?$/.exec(slug || '');
  if (ua) return '/user-articles/' + ua[1] + (ua[2] || '');
  return '/news/' + (slug || '');
}

// 计算同系列（新闻 user_id=0 或吧友文章 user_id>0）中按日期排序的上一篇/下一篇。
// 中英版本（-en）视为同一篇，仅返回与当前文章同语言的邻居；
// 日期倒序（新→旧），同日期按编号倒序。上一篇=更旧、下一篇=更新。
export async function getSiblings(env, article) {
  if (!env.DB || !article) return { prev: null, next: null };
  const isUser = !!(article.user_id && article.user_id !== 0);
  const scopeCond = isUser ? 'user_id != 0' : 'user_id = 0';
  let list = [];
  try {
    const rows = await env.DB.prepare(
      `SELECT slug, lang, title, date FROM articles WHERE ${scopeCond}`
    ).all();
    list = (rows.results || []).filter((r) => r.lang === article.lang);
  } catch (_) {
    return { prev: null, next: null };
  }
  const num = (s) => { const m = /(\d+)/.exec(s || ''); return m ? parseInt(m[1], 10) : 0; };
  const norm = (s) => (s || '').replace(/-en$/, '');
  list.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : num(b.slug) - num(a.slug)));
  const cur = norm(article.slug);
  const idx = list.findIndex((r) => norm(r.slug) === cur);
  if (idx < 0) return { prev: null, next: null };
  return { prev: idx < list.length - 1 ? list[idx + 1] : null, next: idx > 0 ? list[idx - 1] : null };
}

// 动态渲染「上一篇 / 下一篇」导航区块（替代静态外壳里对后台新建/吧友文章会错配或失效的上下篇）。
// 有邻篇渲染为可点击链接（绝对路径，二级详情页也可达），无则渲染占位说明。
export function renderPrevNext(prev, next, isEn) {
  function cell(isPrev, n) {
    const icon = isPrev
      ? (isEn ? '<i class="fa fa-arrow-left mr-1"></i> Previous' : '<i class="fa fa-arrow-left mr-1"></i> 上一篇')
      : (isEn ? 'Next <i class="fa fa-arrow-right ml-1"></i>' : '下一篇 <i class="fa fa-arrow-right ml-1"></i>');
    const align = isPrev ? '' : ' text-right';
    if (n) {
      return '<a href="' + articleUrl(n.slug) + '" class="border border-gray-200 rounded-xl p-4 flex flex-col' + align +
        ' text-secondary hover:text-primary hover:bg-gray-100 transition-colors font-medium">' +
        '<span class="text-sm text-gray-500 mb-1">' + icon + '</span>' +
        '<span class="leading-tight">' + escHtml(n.title) + '</span></a>';
    }
    const text = isPrev
      ? (isEn ? 'First in this series' : '已是本系列第一篇')
      : (isEn ? 'Latest post' : '已是最新一篇');
    return '<div class="border border-gray-200 rounded-xl p-4 flex flex-col' + align + '">' +
      '<span class="text-sm text-gray-500 mb-1">' + icon + '</span>' +
      '<span class="leading-tight text-gray-500">' + text + '</span></div>';
  }
  return '<div class="mt-10 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">' +
    cell(true, prev) + cell(false, next) + '</div>';
}

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

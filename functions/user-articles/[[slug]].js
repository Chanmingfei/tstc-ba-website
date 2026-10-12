// 吧友文章（用户 Lv3+ 发文）SSR 拦截器：仅匹配 /user-articles/N 与 /user-articles/N-en
// 复用新闻文章外壳替换动态区域，并把面包屑「新闻动态」改写为「吧友文章」，
// slug 体系为 ua-N / ua-N-en，与新闻 post-N 完全隔离。
import { getArticleBySlug, renderArticlePage, getSiblings, renderPrevNext } from '../_lib/article.js';

// 后台新建的文章（如 post-17）在仓库里没有静态页面文件，借用其当设计模板。
const SHELL_FALLBACK_SLUG = 'post-17';

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'GET') return env.ASSETS.fetch(request);

  // 双括号 catch-all 在运行时把参数作为「数组」传入，需 join 归一化（否则 SSR 失效回退静态）。
  const slugRaw = context.params.slug;
  const slug = (Array.isArray(slugRaw) ? slugRaw.join('/') : String(slugRaw ?? '')).replace(/\.html$/, '');
  // 仅接受纯数字（可选 -en）形式的吧友文章编号
  const m = /^(\d+)(-en)?$/.exec(slug);
  if (!m) return env.ASSETS.fetch(request);
  const articleSlug = 'ua-' + m[1] + (m[2] || ''); // ua-N 或 ua-N-en

  let article = null;
  try { article = await getArticleBySlug(env, articleSlug); } catch (_) { article = null; }

  // 仅渲染吧友发文（user_id > 0）；若误匹配新闻或不存在，则原样回退静态资源。
  if (article && article.content && article.user_id) {
    try {
      // 直接以 .html 结尾的 URL 请求 ASSETS 会触发 Pages 的 308（跳转到无扩展名路径），
      // 跳转响应 body 为空 → 渲染出空页。因此取外壳时去掉 .html。
      const shellUrl = new URL(request.url);
      shellUrl.pathname = shellUrl.pathname.replace(/\.html$/, '');
      const shellRes = await env.ASSETS.fetch(new URL(shellUrl.toString()));
      let shellText = shellRes.ok ? await shellRes.text() : '';
      if (!shellText) {
        // 无静态外壳（吧友文章无对应静态页）→ 用既有新闻文章页当模板
        const fbUrl = new URL(`/news/${SHELL_FALLBACK_SLUG}`, request.url);
        const fbRes = await env.ASSETS.fetch(new URL(fbUrl.toString()));
        shellText = fbRes.ok ? await fbRes.text() : '';
      }
      if (!shellText) return env.ASSETS.fetch(request); // 兜底：仍取不到则原样回退静态资源

      // 渲染正文（renderArticlePage 会替换标题/元信息/正文/徽章），再把面包屑改回「吧友文章」。
      let out = renderArticlePage(shellText, article);
      out = out.replace(
        '<a href="../news.html" class="hover:underline">新闻动态</a>',
        '<a href="/user-articles" class="hover:underline">吧友文章</a>'
      );
      // 动态渲染「上一篇/下一篇」：按同系列（吧友文章 user_id>0）日期从 D1 现算，
      // 替代新闻外壳里指向 post-N.html 的错配上下篇（那会在二级路径 404 且与吧友文章无关）。
      try {
        const sib = await getSiblings(env, article);
        out = out.replace(
          /<!--\s*AUTO_PREV_NEXT_START\s*-->[\s\S]*?<!--\s*AUTO_PREV_NEXT_END\s*-->/i,
          renderPrevNext(sib.prev, sib.next, article.lang === 'en')
        );
      } catch (_) {
        out = out.replace(/<!--\s*AUTO_PREV_NEXT_START\s*-->[\s\S]*?<!--\s*AUTO_PREV_NEXT_END\s*-->/i, '');
      }
      // 文章尾部「返回新闻列表」→「返回吧友文章列表」
      out = out.replace(
        /<a href="\.\.\/news\.html" class="text-secondary hover:text-primary font-medium transition-colors">[\s\S]*?返回新闻列表[\s\S]*?<\/a>/,
        '<a href="/user-articles" class="text-secondary hover:text-primary font-medium transition-colors"><i class="fa fa-arrow-left mr-1"></i>返回「吧友文章」列表</a>'
      );
      return new Response(out, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=60' },
      });
    } catch (_) { /* 回退静态 */ }
  }

  return env.ASSETS.fetch(request);
}

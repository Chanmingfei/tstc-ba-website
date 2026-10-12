// 文章 SSR 拦截器：仅匹配 /news/post-N.html 与 /news/post-N-en.html
// D1 有正文时读取静态外壳并替换动态区域；否则原样回退静态资源。
import { getArticleBySlug, renderArticlePage, getSiblings, renderPrevNext } from '../_lib/article.js';

// 后台新建的文章（如 post-18）在仓库里没有静态页面文件，直接取外壳会 404。
// 此时借用一篇既有文章页作为设计模板（renderArticlePage 会替换掉标题/元信息/正文），
// 这样模板始终与主站最新设计同步，无需额外维护模板文件。
const SHELL_FALLBACK_SLUG = 'post-17';

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'GET') return env.ASSETS.fetch(request);

  // 双括号 catch-all 在运行时把参数作为「数组」传入，需 join 归一化（否则 SSR 失效回退静态）。
  const slugRaw = context.params.slug;
  const slug = (Array.isArray(slugRaw) ? slugRaw.join('/') : String(slugRaw ?? '')).replace(/\.html$/, '');
  if (!/^post-\d+(-en)?$/.test(slug)) return env.ASSETS.fetch(request);

  let article = null;
  try { article = await getArticleBySlug(env, slug); } catch (_) { article = null; }

  // 吧友发文已迁移到 /user-articles/N，原 /news/post-N 链接 308 永久重定向到新地址（规范且可达）。
  if (article && article.user_id) {
    const mm = /^post-(\d+)(-en)?$/.exec(slug);
    if (mm) {
      const target = new URL('/user-articles/' + mm[1] + (mm[2] || ''), request.url);
      return Response.redirect(target.toString(), 308);
    }
  }

  // 迁移后：原 /news/post-N 在 D1 中已不存在（slug 改为 ua-N），若对应 ua-N 吧友文存在也重定向。
  if (!article) {
    const mm = /^post-(\d+)(-en)?$/.exec(slug);
    if (mm) {
      const uaSlug = 'ua-' + mm[1] + (mm[2] || '');
      let ua = null;
      try { ua = await getArticleBySlug(env, uaSlug); } catch (_) { ua = null; }
      if (ua && ua.user_id) {
        const target = new URL('/user-articles/' + mm[1] + (mm[2] || ''), request.url);
        return Response.redirect(target.toString(), 308);
      }
    }
  }

  if (article && article.content) {
    try {
      // 直接以 .html 结尾的 URL 请求 ASSETS 会触发 Pages 的 308（跳转到无扩展名路径），
      // 跳转响应 body 为空 → 渲染出空页。因此取外壳时去掉 .html。
      const shellUrl = new URL(request.url);
      shellUrl.pathname = shellUrl.pathname.replace(/\.html$/, '');
      const shellRes = await env.ASSETS.fetch(new Request(shellUrl.toString(), { method: 'GET' }));
      let shellText = shellRes.ok ? await shellRes.text() : '';
      if (!shellText) {
        // 无静态外壳（后台新建文章）→ 用既有文章页当模板
        const fbUrl = new URL(`/news/${SHELL_FALLBACK_SLUG}`, request.url);
        const fbRes = await env.ASSETS.fetch(new Request(fbUrl.toString(), { method: 'GET' }));
        shellText = fbRes.ok ? await fbRes.text() : '';
      }
      if (!shellText) return env.ASSETS.fetch(request); // 兜底：仍取不到则原样回退静态资源
      let out = renderArticlePage(shellText, article);
      // 动态替换「上一篇/下一篇」：静态外壳里的上下篇是构建时生成的，对后台新建文章会错配
      // （沿用模板文章的上下篇），按同系列（新闻）日期从 D1 现算，保证正确可达。
      try {
        const sib = await getSiblings(env, article);
        out = out.replace(
          /<!--\s*AUTO_PREV_NEXT_START\s*-->[\s\S]*?<!--\s*AUTO_PREV_NEXT_END\s*-->/i,
          renderPrevNext(sib.prev, sib.next, article.lang === 'en')
        );
      } catch (_) { /* 保留静态上下篇 */ }
      return new Response(out, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=60' },
      });
    } catch (_) { /* 回退静态 */ }
  }

  return env.ASSETS.fetch(request);
}

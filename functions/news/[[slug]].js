// 文章 SSR 拦截器：仅匹配 /news/post-N.html 与 /news/post-N-en.html
// D1 有正文时读取静态外壳并替换动态区域；否则原样回退静态资源。
import { getArticleBySlug, renderArticlePage } from '../_lib/article.js';

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'GET') return env.ASSETS.fetch(request);

  // 双括号 catch-all 在运行时把参数作为「数组」传入，需 join 归一化（否则 SSR 失效回退静态）。
  const slugRaw = context.params.slug;
  const slug = (Array.isArray(slugRaw) ? slugRaw.join('/') : String(slugRaw ?? '')).replace(/\.html$/, '');
  if (!/^post-\d+(-en)?$/.test(slug)) return env.ASSETS.fetch(request);

  let article = null;
  try { article = await getArticleBySlug(env, slug); } catch (_) { article = null; }

  if (article && article.content) {
    try {
      // 直接以 .html 结尾的 URL 请求 ASSETS 会触发 Pages 的 308（跳转到无扩展名路径），
      // 跳转响应 body 为空 → 渲染出空页。因此取外壳时去掉 .html。
      const shellUrl = new URL(request.url);
      shellUrl.pathname = shellUrl.pathname.replace(/\.html$/, '');
      const shellRes = await env.ASSETS.fetch(new Request(shellUrl.toString(), { method: 'GET' }));
      const shellText = shellRes.ok ? await shellRes.text() : '';
      if (!shellText) return env.ASSETS.fetch(request); // 兜底：外壳为空则原样回退静态资源
      const out = renderArticlePage(shellText, article);
      return new Response(out, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=60' },
      });
    } catch (_) { /* 回退静态 */ }
  }

  return env.ASSETS.fetch(request);
}

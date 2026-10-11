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
      const shellRes = await env.ASSETS.fetch(request);
      const shell = await shellRes.text();
      const out = renderArticlePage(shell, article);
      return new Response(out, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=60' },
      });
    } catch (_) { /* 回退静态 */ }
  }

  return env.ASSETS.fetch(request);
}

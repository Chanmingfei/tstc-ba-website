// Cloudflare Pages Function（catch-all）：
// 任何未能匹配到静态文件的请求，都返回自定义的 404.html（状态 404）。
// 这样无论打开哪个不存在的链接，都会显示统一的"关于我们"风格 404 页面。
// 已存在的静态资源（首页、新闻页、about、assets 等）仍由原样返回，不受影响。

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // 先尝试按原路径提供静态资源
  const response = await env.ASSETS.fetch(request);

  // 资源存在（非 404）则直接返回
  if (response.status !== 404) {
    return response;
  }

  // 资源不存在：返回自定义 404 页面，并保持 404 状态码
  const notFound = await env.ASSETS.fetch(new URL('/404.html', url.origin));
  const body = await notFound.text();

  return new Response(body, {
    status: 404,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
    },
  });
}

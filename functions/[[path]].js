// Cloudflare Pages Functions 通配路由
// 作用：任何未匹配到静态资源的请求，统一返回自定义的 404.html 页面（HTTP 404）。
// 已存在的页面 / 资源（如 /index.html、/assets/main.js）不受影响，照常返回。

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // 1) 先按原路径尝试返回静态资源；存在的文件直接放行
  const response = await env.ASSETS.fetch(request);
  if (response.status !== 404) {
    return response;
  }

  // 2) 命中 404：返回与全站风格一致的自定义 404 页面
  const notFoundUrl = new URL('/404.html', url.origin);
  const notFound = await env.ASSETS.fetch(notFoundUrl);
  if (notFound.ok) {
    const body = await notFound.text();
    return new Response(body, {
      status: 404,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=60',
      },
    });
  }

  // 3) 兜底（理论上不会走到这里）
  return new Response('404 Not Found', { status: 404 });
}

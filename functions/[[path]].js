// Cloudflare Pages Functions 通配路由（仅处理 404）
// - 已存在的页面 / 静态资源：原样返回，不受影响
// - 不存在的路径：返回自定义 404.html 页面（HTTP 404）
export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  const response = await env.ASSETS.fetch(request);
  if (response.status !== 404) {
    return response;
  }

  const notFound = await env.ASSETS.fetch(new URL('/404.html', url.origin));
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

  // 兜底（理论上不会走到）
  return new Response(
    '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8">' +
    '<title>404</title></head><body style="font-family:sans-serif;text-align:center;padding:80px">' +
    '<h1>404</h1><p>您访问的界面不存在，请检查链接或<a href="/">回到首页</a>。</p>' +
    '</body></html>',
    { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

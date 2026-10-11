// 根级 catch-all：host 路由收口，防止 sso.tstc.pp.ua 成为主站镜像。
//
// Cloudflare Pages 给同一项目的所有自定义域提供相同静态文件，因此若不拦截，
// 访问 sso.tstc.pp.ua/ 或任意主站页面都会回退到主站静态页 —— 表现为「sso 是主站映射」。
//
// 规则（仅对 sso 子域生效）：
//   - /login /register /admin  由各自精确路由（login.js/register.js/admin.js）渲染，本 catch-all 不会命中；
//   - /api/*                   由 api/[[route]].js 处理（登录/后台接口必须在 sso 域可用）；
//   - 其余一切路径（含 /、/assets/*、/news/*、/bazhu.html 等）一律 302 跳回主站，保留原 pathname。
// 主站（tstc.pp.ua / www.*）与 sso 上的专属页面：直接 next() 放行到静态资源 / 更精确路由。
//
// 注：login/register/admin 页面均为内联样式与脚本、不依赖 /assets/*，故重定向不会破坏它们。
import { redirect } from './_lib/http.js';
import { SSO_HOST, MAIN_HOST } from './_lib/config.js';

const SSO_ALLOW = new Set(['/login', '/register', '/admin', '/account']);

export async function onRequest(context) {
  const { request, next } = context;
  const host = (request.headers.get('host') || '').split(':')[0].toLowerCase();

  if (host === SSO_HOST) {
    const url = new URL(request.url);
    const path = url.pathname;
    // 直接打开 sso 根域 → 进入账号管理页
    if (path === '/') return redirect(`https://${SSO_HOST}/account`);
    if (!SSO_ALLOW.has(path) && !path.startsWith('/api')) {
      return redirect(`https://${MAIN_HOST}${path}${url.search}`);
    }
  }

  return next();
}

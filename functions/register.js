// 注册页：仅 sso.tstc.pp.ua 渲染，主站访问 302 回 sso
import { html, redirect } from './_lib/http.js';
import { SSO_HOST } from './_lib/config.js';
import { authShell } from './_lib/ui.js';

export async function onRequest(context) {
  const { request } = context;
  if (request.headers.get('host') !== SSO_HOST) return redirect(`https://${SSO_HOST}/register`);

  const formHtml = `
    <label for="username">用户名（3-20 位字母/数字/下划线）</label>
    <input id="username" name="username" autocomplete="username" required maxlength="20">
    <label for="password">密码（至少 6 位）</label>
    <input id="password" name="password" type="password" autocomplete="new-password" required>`;
  const footerHtml = '已有账号？<a href="/login">去登录</a>';
  const redirectTo = new URL(request.url).searchParams.get('redirect') || '/login';

  return html(authShell({ title: '注册', subtitle: '创建唐山师范学院吧统一认证系统账号', apiPath: 'register', formHtml, footerHtml, redirectTo }));
}

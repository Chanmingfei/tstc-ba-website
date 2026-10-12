// 登录页：仅 sso.tstc.pp.ua 渲染，主站访问 302 回 sso
import { html, redirect } from './_lib/http.js';
import { SSO_HOST } from './_lib/config.js';
import { authShell } from './_lib/ui.js';

export async function onRequest(context) {
  const { request } = context;
  if (request.headers.get('host') !== SSO_HOST) return redirect(`https://${SSO_HOST}/login`);

  const formHtml = `
    <label for="username">用户名</label>
    <input id="username" name="username" autocomplete="username" required>
    <label for="password">密码</label>
    <input id="password" name="password" type="password" autocomplete="current-password" required>`;
  const footerHtml = '还没有账号？<a href="/register">立即注册</a>' +
    '<div style="margin-top:8px"><a href="/reset-password">忘记密码？通过绑定邮箱重置</a></div>';

  return html(authShell({ title: '登录', subtitle: '唐山师范学院吧账号', apiPath: 'login', formHtml, footerHtml }));
}

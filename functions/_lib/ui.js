// 玻璃风认证页外壳（登录/注册）：统一使用 auth-layout 的「左侧品牌大图 + 右侧表单」分栏布局
import { MAIN_HOST } from './config.js';
import { authPage } from './auth-layout.js';

export function authShell({ title, subtitle, apiPath, formHtml, footerHtml, redirectTo }) {
  // 登录后统一回主站（管理员自行输入网址打开后台），不做按角色跳转
  const go = redirectTo || `https://${MAIN_HOST}`;

  const cardHtml = `
    <form id="f">
      ${formHtml}
      <button class="primary" type="submit">${title}</button>
      <div class="msg" id="msg"></div>
    </form>
    <div class="foot">${footerHtml}</div>`;

  const scriptHtml = `
    var form = document.getElementById('f');
    var msg = document.getElementById('msg');
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      msg.className = 'msg';
      msg.textContent = '';
      var fd = new FormData(form);
      var body = Object.fromEntries(fd.entries());
      try {
        var r = await fetch('/api/${apiPath}', {
          method: 'POST', credentials: 'include',
          headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
        });
        var data = await r.json().catch(function () { return {}; });
        if (r.ok && data.ok) { location.href = '${go}'; }
        else { msg.textContent = data.error || '操作失败'; }
      } catch (err) { msg.textContent = '网络错误，请重试'; }
    });`;

  return authPage({
    pageTitle: `${title} · 唐山师范学院吧统一认证系统`,
    title,
    subtitle,
    cardHtml,
    scriptHtml,
  });
}

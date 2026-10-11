// 账号管理页：仅 sso.tstc.pp.ua/account 渲染，主站访问 302 回 sso。
// 展示账号资料并提供修改密码（/api/account/password）；与登录/注册共用统一分栏布局。
import { html, redirect } from './_lib/http.js';
import { SSO_HOST, MAIN_HOST } from './_lib/config.js';
import { authPage } from './_lib/auth-layout.js';

export async function onRequest(context) {
  const { request } = context;
  if (request.headers.get('host') !== SSO_HOST) return redirect(`https://${SSO_HOST}/account`);

  const cardHtml = `
    <div id="gate"></div>
    <div id="app" style="display:none">
      <div class="info" id="profile"></div>
      <form id="pwForm">
        <label for="oldPassword">当前密码</label>
        <input id="oldPassword" type="password" autocomplete="current-password" required>
        <label for="newPassword">新密码（至少 6 位）</label>
        <input id="newPassword" type="password" autocomplete="new-password" required minlength="6">
        <label for="newPassword2">确认新密码</label>
        <input id="newPassword2" type="password" autocomplete="new-password" required minlength="6">
        <button class="primary" type="submit">修改密码</button>
        <div class="msg" id="msg"></div>
      </form>
      <div class="links">
        <button id="logout" type="button" style="color:#ef4444">退出登录</button>
      </div>
    </div>`;

  const scriptHtml = `
    var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]); }); };
    function fmt(ts) {
      if (!ts) return '—';
      var d = new Date(typeof ts === 'number' ? ts : Date.parse(ts));
      if (isNaN(d.getTime())) return '—';
      var p = function (n) { return (n < 10 ? '0' : '') + n; };
      return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
    }

    document.getElementById('logout').onclick = function () {
      fetch('/api/logout', { method: 'POST', credentials: 'include' }).then(function () { location.href = 'https://${MAIN_HOST}'; });
    };

    fetch('/api/account', { credentials: 'include' }).then(function (r) {
      if (!r.ok) {
        document.getElementById('gate').innerHTML =
          '<div class="info" style="text-align:center">尚未登录，请先登录后再管理账号。' +
          '<div style="margin-top:10px"><a href="/login" style="color:var(--tint)">前往登录</a></div></div>';
        return null;
      }
      return r.json();
    }).then(function (d) {
      if (!d) return;
      document.getElementById('profile').innerHTML =
        '<div><span>用户名</span><span>' + esc(d.username) + '</span></div>' +
        '<div><span>角色</span><span>' + (d.role === 'admin' ? '管理员' : '普通用户') + '</span></div>' +
        '<div><span>注册时间</span><span>' + fmt(d.created_at) + '</span></div>';
      document.getElementById('app').style.display = 'block';
    }).catch(function () {
      document.getElementById('gate').innerHTML = '<div class="info" style="text-align:center">加载失败，请刷新重试。</div>';
    });

    document.getElementById('pwForm').addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = document.getElementById('msg');
      msg.className = 'msg'; msg.textContent = '';
      var oldPassword = document.getElementById('oldPassword').value;
      var newPassword = document.getElementById('newPassword').value;
      var newPassword2 = document.getElementById('newPassword2').value;
      if (newPassword.length < 6) { msg.textContent = '新密码至少 6 位'; return; }
      if (newPassword !== newPassword2) { msg.textContent = '两次输入的新密码不一致'; return; }
      fetch('/api/account/password', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword: oldPassword, newPassword: newPassword })
      }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
        .then(function (res) {
          if (res.ok && res.d.ok) {
            msg.className = 'msg ok'; msg.textContent = '密码修改成功';
            document.getElementById('pwForm').reset();
          } else { msg.textContent = (res.d && res.d.error) || '修改失败'; }
        }).catch(function () { msg.textContent = '网络错误，请重试'; });
    });`;

  const page = authPage({
    pageTitle: '账号管理 · 唐山师范学院吧统一认证系统',
    title: '账号管理',
    subtitle: '查看账号信息并修改密码',
    cardHtml,
    scriptHtml,
  });

  // 账号资料小卡样式（本页专用）追加到布局样式表
  const extraStyle = `
  .info { background:rgba(255,255,255,.55); border:1px solid rgba(255,255,255,.75); border-radius:14px; padding:14px 16px; margin-bottom:16px; }
  .info div { display:flex; justify-content:space-between; font-size:13px; padding:6px 0; border-bottom:1px solid rgba(60,60,67,.08); }
  .info div:last-child { border-bottom:0; }
  .info span:first-child { color:var(--text-muted); }
  .info span:last-child { color:var(--text-strong); font-weight:600; }
  @media (prefers-color-scheme: dark) {
    .info { background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.16); }
    .info span:first-child { color:#aab4c2; } .info span:last-child { color:#fff; }
    .info div { border-bottom-color:rgba(255,255,255,.10); }
  }`;

  return html(page.replace('</style>', extraStyle + '\n</style>'));
}

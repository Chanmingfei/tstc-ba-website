// 账号管理页：仅 sso.tstc.pp.ua/account 渲染，主站访问 302 回 sso。
// 展示账号资料并提供修改密码（/api/account/password）。与主站玻璃风一致，校徽在左、吧徽在右。
import { html, redirect } from './_lib/http.js';
import { SSO_HOST, MAIN_HOST } from './_lib/config.js';

const SCHOOL_BADGE = '/assets/img/school-badge-v2.png';
const BAR_LOGO = '/assets/images/bar-logo.png';

export async function onRequest(context) {
  const { request } = context;
  if (request.headers.get('host') !== SSO_HOST) return redirect(`https://${SSO_HOST}/account`);

  return html(`<!DOCTYPE html><html lang="zh-CN"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>账号管理 · 唐山师范学院吧统一认证系统</title>
<style>
  :root {
    --primary:#0465bc; --secondary:#2575fc; --tint:#0a6cd6;
    --text:#1f2937; --text-strong:#111827; --text-muted:#6b7280;
    --hairline:rgba(60,60,67,.13); --r-sm:12px; --r-lg:20px;
  }
  * { box-sizing: border-box; }
  body {
    margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:16px;
    font-family: Inter, system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif; color:var(--text);
    background:
      radial-gradient(1300px 700px at 50% 28%, rgba(10,108,214,.10), transparent 58%),
      radial-gradient(1200px 600px at 82% -6%, rgba(10,108,214,.10), transparent 55%),
      radial-gradient(1000px 520px at -4% 8%, rgba(124,58,237,.07), transparent 52%),
      linear-gradient(180deg, #fff, #edf2fa 42%, #e3edf8);
  }
  .card {
    width:min(92vw,440px); padding:30px 28px 26px; border-radius:var(--r-lg);
    background:rgba(255,255,255,.55);
    -webkit-backdrop-filter:blur(22px) saturate(190%); backdrop-filter:blur(22px) saturate(190%);
    border:1px solid rgba(255,255,255,.7);
    box-shadow: inset 2px -2px 1px -1px hsla(0,0%,100%,.9), inset -2px 2px 1px -1px hsla(0,0%,100%,.9), 0 28px 64px -24px rgba(0,0,0,.30);
  }
  .brand { text-align:center; margin-bottom:18px; }
  .logo-row { display:flex; align-items:center; justify-content:center; gap:14px; margin-bottom:12px; }
  .school-badge { height:40px; width:auto; filter:drop-shadow(0 2px 6px rgba(0,0,0,.16)); }
  .bar-logo { width:58px; height:58px; border-radius:50%; object-fit:cover; filter:drop-shadow(0 4px 10px rgba(0,0,0,.18)); }
  .sys-name { font-size:13px; font-weight:600; color:var(--tint); letter-spacing:.6px; margin-bottom:10px; padding-bottom:8px; }
  .sys-name::after { content:''; display:block; width:44px; height:2px; margin:8px auto 0; border-radius:2px; background:linear-gradient(90deg,var(--primary),var(--secondary)); opacity:.55; }
  h1 { font-size:20px; margin:2px 0 2px; color:var(--text-strong); }
  .sub { font-size:13px; color:var(--text-muted); margin:0 0 14px; }
  .info { background:rgba(255,255,255,.5); border:1px solid rgba(255,255,255,.7); border-radius:14px; padding:14px 16px; margin-bottom:16px; }
  .info div { display:flex; justify-content:space-between; font-size:13px; padding:5px 0; border-bottom:1px solid rgba(60,60,67,.08); }
  .info div:last-child { border-bottom:0; }
  .info span:first-child { color:var(--text-muted); }
  .info span:last-child { color:var(--text-strong); font-weight:600; }
  label { display:block; font-size:13px; margin:12px 0 6px; }
  input {
    width:100%; padding:12px 14px; font-size:14px; color:var(--text-strong);
    background:rgba(255,255,255,.62); border:1px solid var(--hairline); border-radius:var(--r-sm);
    outline:none; transition:border-color .18s ease, box-shadow .18s ease; font-family:inherit;
  }
  input:focus { border-color:var(--tint); box-shadow:0 0 0 3px rgba(10,108,214,.16); }
  button.primary {
    width:100%; margin-top:18px; padding:13px; border:0; border-radius:var(--r-sm);
    background:linear-gradient(135deg,var(--primary),var(--secondary)); color:#fff; font-size:15px; font-weight:600; cursor:pointer;
    box-shadow:0 10px 24px -10px rgba(4,101,188,.6);
  }
  button.primary:hover { filter:brightness(1.05); }
  .msg { min-height:18px; font-size:13px; margin-top:12px; text-align:center; color:#dc2626; }
  .msg.ok { color:#16a34a; }
  .links { margin-top:16px; display:flex; justify-content:center; gap:14px; font-size:13px; }
  .links a, .links button { background:none; border:0; color:var(--tint); cursor:pointer; font-size:13px; text-decoration:none; font-family:inherit; }
  .links a:hover, .links button:hover { text-decoration:underline; }
  .links button { color:#ef4444; }
  @media (prefers-color-scheme: dark) {
    body { color:#e7ecf3; background: radial-gradient(1300px 700px at 50% 26%, rgba(37,117,252,.16), transparent 58%), radial-gradient(1000px 520px at -4% 8%, rgba(124,58,237,.14), transparent 52%), linear-gradient(180deg,#0c253d,#143352); }
    .card { background:rgba(255,255,255,.08); border-color:rgba(255,255,255,.16); color:#e7ecf3; box-shadow: inset 2px -2px 1px -1px hsla(0,0%,100%,.18), inset -2px 2px 1px -1px hsla(0,0%,100%,.18), 0 28px 64px -24px rgba(0,0,0,.6); }
    h1 { color:#fff; } .sub { color:#aab4c2; }
    input { background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.18); color:#fff; }
    .info { background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.16); }
    .info span:first-child { color:#aab4c2; } .info span:last-child { color:#fff; }
    .info div { border-bottom-color:rgba(255,255,255,.10); }
    .sys-name { color:#7fb0ff; }
    .links a, .links button { color:#7fb0ff; }
  }
</style>
</head><body>
  <div class="card">
    <div class="brand">
      <div class="logo-row">
        <img class="school-badge" src="${SCHOOL_BADGE}" alt="唐山师范学院">
        <img class="bar-logo" src="${BAR_LOGO}" alt="唐山师范学院吧">
      </div>
      <div class="sys-name">唐山师范学院吧统一认证系统</div>
      <h1>账号管理</h1>
      <p class="sub">查看账号信息并修改密码</p>
    </div>
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
        <a href="https://${MAIN_HOST}">← 返回主站</a>
        <button id="logout" type="button">退出登录</button>
      </div>
    </div>
  </div>
<script>
var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]); }); };
function fmt(ts) { if (!ts) return '—'; var d = new Date(typeof ts === 'number' ? ts : Date.parse(ts)); if (isNaN(d.getTime())) return '—';
  var p = function(n){return (n<10?'0':'')+n;}; return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes()); }

document.getElementById('logout').onclick = function () {
  fetch('/api/logout', { method:'POST', credentials:'include' }).then(function(){ location.href = 'https://${MAIN_HOST}'; });
};

fetch('/api/account', { credentials:'include' }).then(function (r) {
  if (!r.ok) {
    document.getElementById('gate').innerHTML =
      '<div class="info" style="text-align:center">尚未登录，请先登录后再管理账号。<div style="margin-top:10px"><a href="/login" style="color:var(--tint)">前往登录</a></div></div>';
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
    method:'POST', credentials:'include',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ oldPassword: oldPassword, newPassword: newPassword })
  }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); })
    .then(function (res) {
      if (res.ok && res.d.ok) {
        msg.className = 'msg ok'; msg.textContent = '密码修改成功';
        document.getElementById('pwForm').reset();
      } else { msg.textContent = (res.d && res.d.error) || '修改失败'; }
    }).catch(function () { msg.textContent = '网络错误，请重试'; });
});
</script>
</body></html>`);
}

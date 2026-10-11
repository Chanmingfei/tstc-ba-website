// 玻璃风认证页外壳（登录/注册）：复用主站设计令牌，磨砂白卡 + 校徽（左）/吧徽（右）
import { MAIN_HOST } from './config.js';

const BAR_LOGO = '/assets/images/bar-logo.png';
// v2：按参考色块 #880002 重着色并保留全部笔画细节；换新文件名以避开 CDN/浏览器缓存
const SCHOOL_BADGE = '/assets/img/school-badge-v2.png';

export function authShell({ title, subtitle, apiPath, formHtml, footerHtml, redirectTo }) {
  // 登录后统一回主站（管理员自行输入网址打开后台），不做按角色跳转
  const go = redirectTo || `https://${MAIN_HOST}`;
  return `<!DOCTYPE html><html lang="zh-CN"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} · 唐山师范学院吧统一认证系统</title>
<style>
  :root {
    --primary: #0465bc; --secondary: #2575fc; --tint: #0a6cd6;
    --text: #1f2937; --text-strong: #111827; --text-muted: #6b7280;
    --hairline: rgba(60,60,67,.13); --r-sm: 12px; --r-lg: 20px;
  }
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 16px; font-family: Inter, system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
    color: var(--text);
    background:
      radial-gradient(1300px 700px at 50% 28%, rgba(10,108,214,.10), transparent 58%),
      radial-gradient(1200px 600px at 82% -6%, rgba(10,108,214,.10), transparent 55%),
      radial-gradient(1000px 520px at -4% 8%, rgba(124,58,237,.07), transparent 52%),
      linear-gradient(180deg, #fff, #edf2fa 42%, #e3edf8);
    -webkit-font-smoothing: antialiased;
  }
  .card {
    width: min(92vw, 420px); padding: 30px 28px 26px; border-radius: var(--r-lg);
    background: rgba(255,255,255,.55);
    -webkit-backdrop-filter: blur(22px) saturate(190%); backdrop-filter: blur(22px) saturate(190%);
    border: 1px solid rgba(255,255,255,.7);
    box-shadow:
      inset 2px -2px 1px -1px hsla(0,0%,100%,.9),
      inset -2px 2px 1px -1px hsla(0,0%,100%,.9),
      0 28px 64px -24px rgba(0,0,0,.30), 0 8px 24px -16px rgba(0,0,0,.14);
  }
  .brand { display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 18px; }
  .logo-row { display: flex; align-items: center; justify-content: center; gap: 14px; margin-bottom: 12px; }
  /* 校徽与吧徽均为「边界泛洪去底」的透明 PNG，统一不加白底，保持观感一致 */
  .bar-logo {
    width: 62px; height: 62px; border-radius: 50%; object-fit: cover;
    filter: drop-shadow(0 4px 10px rgba(0,0,0,.18));
  }
  .school-badge { height: 44px; width: auto; filter: drop-shadow(0 2px 6px rgba(0,0,0,.16)); }
  .sys-name {
    font-size: 13px; font-weight: 600; color: var(--tint); letter-spacing: .6px;
    margin-bottom: 10px; padding-bottom: 8px;
  }
  .sys-name::after {
    content: ''; display: block; width: 44px; height: 2px; margin: 8px auto 0;
    border-radius: 2px; background: linear-gradient(90deg, var(--primary), var(--secondary)); opacity: .55;
  }
  h1 { font-size: 20px; margin: 2px 0 2px; color: var(--text-strong); letter-spacing: .5px; }
  .sub { font-size: 13px; color: var(--text-muted); margin: 0; }
  label { display: block; font-size: 13px; color: var(--text); margin: 14px 0 6px; }
  input {
    width: 100%; padding: 12px 14px; font-size: 14px; color: var(--text-strong);
    background: rgba(255,255,255,.62); border: 1px solid var(--hairline); border-radius: var(--r-sm);
    outline: none; transition: border-color .18s ease, box-shadow .18s ease; font-family: inherit;
  }
  input::placeholder { color: #9aa3af; }
  input:focus { border-color: var(--tint); box-shadow: 0 0 0 3px rgba(10,108,214,.16); }
  button.primary {
    width: 100%; margin-top: 20px; padding: 13px; border: 0; border-radius: var(--r-sm);
    background: linear-gradient(135deg, var(--primary), var(--secondary)); color: #fff;
    font-size: 15px; font-weight: 600; cursor: pointer;
    box-shadow: 0 10px 24px -10px rgba(4,101,188,.6); transition: filter .15s ease, transform .12s ease;
  }
  button.primary:hover { filter: brightness(1.05); }
  button.primary:active { transform: translateY(1px); }
  .msg { min-height: 18px; font-size: 13px; margin-top: 12px; color: #dc2626; text-align: center; }
  .foot { margin-top: 16px; font-size: 13px; text-align: center; color: var(--text-muted); }
  .foot a { color: var(--tint); text-decoration: none; }
  a.home { display: block; text-align: center; margin-top: 10px; font-size: 12px; color: #9ca3af; text-decoration: none; }
  @media (prefers-color-scheme: dark) {
    body {
      color: #e7ecf3;
      background:
        radial-gradient(1300px 700px at 50% 26%, rgba(37,117,252,.16), transparent 58%),
        radial-gradient(1000px 520px at -4% 8%, rgba(124,58,237,.14), transparent 52%),
        linear-gradient(180deg, #0c253d, #143352);
    }
    .card {
      background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.16); color: #e7ecf3;
      box-shadow: inset 2px -2px 1px -1px hsla(0,0%,100%,.18), inset -2px 2px 1px -1px hsla(0,0%,100%,.18), 0 28px 64px -24px rgba(0,0,0,.6);
    }
    h1 { color: #fff; } .sub, .foot, a.home { color: #aab4c2; }
    input { background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.18); color: #fff; }
    input::placeholder { color: #7e8a9a; }
    .sys-name { color: #7fb0ff; }
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
      <h1>${title}</h1>
      <p class="sub">${subtitle}</p>
    </div>
    <form id="f">
      ${formHtml}
      <button class="primary" type="submit">${title}</button>
      <div class="msg" id="msg"></div>
    </form>
    <div class="foot">${footerHtml}</div>
    <a class="home" href="https://${MAIN_HOST}">← 返回唐山师范学院吧</a>
  </div>
  <script>
    const form = document.getElementById('f');
    const msg = document.getElementById('msg');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      msg.textContent = '';
      const fd = new FormData(form);
      const body = Object.fromEntries(fd.entries());
      try {
        const r = await fetch('/api/${apiPath}', { method:'POST', credentials:'include', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
        const data = await r.json().catch(() => ({}));
        if (r.ok && data.ok) { location.href = '${go}'; }
        else { msg.textContent = data.error || '操作失败'; }
      } catch (err) { msg.textContent = '网络错误，请重试'; }
    });
  </script>
</body></html>`;
}

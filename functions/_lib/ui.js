// 玻璃风认证页外壳（登录/注册），自包含样式，复用品牌渐变背景
import { MAIN_HOST } from './config.js';

export function authShell({ title, subtitle, apiPath, formHtml, footerHtml, redirectTo }) {
  const go = redirectTo || `https://${MAIN_HOST}`;
  return `<!DOCTYPE html><html lang="zh-CN"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} · 唐山师范学院吧</title>
<style>
  * { box-sizing: border-box; }
  body { margin:0; min-height:100vh; display:flex; align-items:center; justify-content:center; font-family: system-ui,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif; background: linear-gradient(135deg,#1e3a8a,#7c3aed 55%,#db2777); color:#1f2937; padding:16px; }
  .card { width:min(92vw,380px); padding:28px 26px; border-radius:20px; background:rgba(255,255,255,.82); backdrop-filter:blur(22px) saturate(190%); -webkit-backdrop-filter:blur(22px) saturate(190%); border:1px solid rgba(255,255,255,.7); box-shadow:0 20px 50px rgba(0,0,0,.25); }
  h1 { font-size:20px; margin:0 0 4px; color:#111827; }
  .sub { font-size:13px; color:#6b7280; margin:0 0 18px; }
  label { display:block; font-size:13px; color:#374151; margin:12px 0 6px; }
  input { width:100%; padding:11px 13px; border:1px solid #d1d5db; border-radius:12px; font-size:14px; outline:none; }
  input:focus { border-color:#6366f1; box-shadow:0 0 0 3px rgba(99,102,241,.15); }
  button.primary { width:100%; margin-top:18px; padding:12px; border:0; border-radius:12px; background:linear-gradient(135deg,#4f46e5,#7c3aed); color:#fff; font-size:15px; font-weight:600; cursor:pointer; }
  button.primary:hover { filter:brightness(1.05); }
  .msg { min-height:18px; font-size:13px; margin-top:12px; color:#dc2626; }
  .foot { margin-top:16px; font-size:13px; text-align:center; color:#6b7280; }
  .foot a { color:#4f46e5; text-decoration:none; }
  a.home { display:block; text-align:center; margin-top:10px; font-size:12px; color:#9ca3af; text-decoration:none; }
</style>
</head><body>
  <div class="card">
    <h1>${title}</h1>
    <p class="sub">${subtitle}</p>
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

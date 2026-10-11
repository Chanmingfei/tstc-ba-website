// 统一认证系统页面布局。
// 桌面端：左侧品牌图（主站同款 bg-banner.jpg + 蓝色渐变遮罩，含校徽/吧徽/系统名）+ 右侧表单卡。
// 移动端（<=900px）：回归原来的居中玻璃卡样式（左栏隐藏，徽标与系统名回到卡片内）。
// 仅使用主站已有素材，不引入外部资源。
import { MAIN_HOST } from './config.js';

const VISUAL_BG = '/assets/images/bg-banner.jpg'; // 与主站页头同一张背景图
const SCHOOL_BADGE = '/assets/img/school-badge-v2.png';
const BAR_LOGO = '/assets/images/bar-logo.png';

export function authPage({ pageTitle, title, subtitle, cardHtml, scriptHtml }) {
  return `<!DOCTYPE html><html lang="zh-CN"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${pageTitle}</title>
<style>
  :root {
    --primary:#0465bc; --secondary:#2575fc; --tint:#0a6cd6;
    --text:#1f2937; --text-strong:#111827; --text-muted:#6b7280;
    --hairline:rgba(60,60,67,.13); --r-sm:12px; --r-lg:20px;
  }
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0; font-family: Inter, system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif;
    color: var(--text); -webkit-font-smoothing: antialiased;
    background:
      radial-gradient(1300px 700px at 50% 28%, rgba(10,108,214,.10), transparent 58%),
      radial-gradient(1200px 600px at 82% -6%, rgba(10,108,214,.10), transparent 55%),
      radial-gradient(1000px 520px at -4% 8%, rgba(124,58,237,.07), transparent 52%),
      linear-gradient(180deg, #fff, #edf2fa 42%, #e3edf8);
  }
  .auth-wrap { display: flex; min-height: 100vh; }

  /* ---------- 左侧品牌图（仅桌面端）---------- */
  .auth-visual {
    position: relative; flex: 0 0 42%; overflow: hidden;
    background: linear-gradient(135deg, #0465bc 0%, #2575fc 100%); /* 与主站 header 同款 */
    display: flex; align-items: center; justify-content: center;
  }
  .auth-visual::before {
    content: ''; position: absolute; inset: 0;
    background-image: url('${VISUAL_BG}');
    background-size: cover; background-position: center;
    opacity: .28; /* 对应主站页头的 opacity-20 观感 */
  }
  .auth-visual-inner { position: relative; z-index: 1; padding: 40px 36px; text-align: center; color: #fff; }
  .v-badges { display: flex; align-items: center; justify-content: center; gap: 16px; }
  .v-badges .school-badge { height: 44px; width: auto; filter: drop-shadow(0 2px 6px rgba(0,0,0,.28)); }
  .v-badges .bar-logo { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; background: rgba(255,255,255,.92); padding: 4px; filter: drop-shadow(0 4px 10px rgba(0,0,0,.28)); }
  .v-name { margin-top: 18px; font-size: 20px; font-weight: 700; letter-spacing: .5px; line-height: 1.45; }
  .v-sub { margin-top: 8px; font-size: 13px; color: rgba(255,255,255,.82); letter-spacing: 1px; }

  /* ---------- 右侧表单区 ---------- */
  .auth-main { flex: 1 1 auto; display: flex; align-items: center; justify-content: center; padding: 40px 32px; }
  .card {
    width: min(100%, 400px); padding: 30px 28px 24px; border-radius: var(--r-lg);
    background: rgba(255,255,255,.62);
    -webkit-backdrop-filter: blur(22px) saturate(190%); backdrop-filter: blur(22px) saturate(190%);
    border: 1px solid rgba(255,255,255,.75);
    box-shadow: inset 2px -2px 1px -1px hsla(0,0%,100%,.9), inset -2px 2px 1px -1px hsla(0,0%,100%,.9), 0 28px 64px -24px rgba(0,0,0,.28);
  }
  /* 卡片内的徽标/系统名：桌面端由左栏承担，避免重复 */
  .c-brand { text-align: center; margin-bottom: 16px; }
  .c-brand .logo-row { display: flex; align-items: center; justify-content: center; gap: 14px; }
  .c-brand .school-badge { height: 40px; width: auto; filter: drop-shadow(0 2px 6px rgba(0,0,0,.16)); }
  .c-brand .bar-logo { width: 58px; height: 58px; border-radius: 50%; object-fit: cover; filter: drop-shadow(0 4px 10px rgba(0,0,0,.18)); }
  .c-brand .sys-name {
    margin-top: 10px; font-size: 13px; font-weight: 600; color: var(--tint);
    letter-spacing: .6px; padding-bottom: 8px;
  }
  .c-brand .sys-name::after {
    content: ''; display: block; width: 44px; height: 2px; margin: 8px auto 0;
    border-radius: 2px; background: linear-gradient(90deg, var(--primary), var(--secondary)); opacity: .55;
  }
  @media (min-width: 901px) { .c-brand { display: none; } }

  h1 { font-size: 20px; margin: 0 0 4px; color: var(--text-strong); letter-spacing: .5px; }
  .sub { font-size: 13px; color: var(--text-muted); margin: 0 0 14px; }
  label { display: block; font-size: 13px; margin: 13px 0 6px; }
  input, select {
    width: 100%; padding: 12px 14px; font-size: 14px; color: var(--text-strong);
    background: rgba(255,255,255,.7); border: 1px solid var(--hairline); border-radius: var(--r-sm);
    outline: none; transition: border-color .18s ease, box-shadow .18s ease; font-family: inherit;
  }
  input:focus, select:focus { border-color: var(--tint); box-shadow: 0 0 0 3px rgba(10,108,214,.16); }
  button.primary {
    width: 100%; margin-top: 20px; padding: 13px; border: 0; border-radius: var(--r-sm);
    background: linear-gradient(135deg, var(--primary), var(--secondary)); color: #fff;
    font-size: 15px; font-weight: 600; cursor: pointer;
    box-shadow: 0 10px 24px -10px rgba(4,101,188,.6); transition: filter .15s ease, transform .12s ease;
  }
  button.primary:hover { filter: brightness(1.05); }
  button.primary:active { transform: translateY(1px); }
  .msg { min-height: 18px; font-size: 13px; margin-top: 12px; color: #dc2626; text-align: center; }
  .msg.ok { color: #16a34a; }
  .foot { margin-top: 16px; font-size: 13px; text-align: center; color: var(--text-muted); }
  .foot a { color: var(--tint); text-decoration: none; }
  .links { margin-top: 16px; display: flex; justify-content: center; gap: 14px; font-size: 13px; }
  .links a, .links button { background: none; border: 0; color: var(--tint); cursor: pointer; font-size: 13px; text-decoration: none; font-family: inherit; }
  .links a:hover, .links button:hover { text-decoration: underline; }
  a.home { display: block; text-align: center; margin-top: 12px; font-size: 12px; color: #9ca3af; text-decoration: none; }

  /* ---------- 移动端：回到原来的居中玻璃卡 ---------- */
  @media (max-width: 900px) {
    .auth-visual { display: none; }
    .auth-main { padding: 20px 14px 36px; } /* 保持原来的垂直居中 */
    .card { width: min(100%, 420px); margin: 0 auto; padding: 28px 24px 22px; }
  }

  @media (prefers-color-scheme: dark) {
    body {
      color: #e7ecf3;
      background:
        radial-gradient(1300px 700px at 50% 26%, rgba(37,117,252,.16), transparent 58%),
        radial-gradient(1000px 520px at -4% 8%, rgba(124,58,237,.14), transparent 52%),
        linear-gradient(180deg, #0c253d, #143352);
    }
    .auth-visual { background: linear-gradient(135deg, #0c253d 0%, #143352 100%); }
    .card { background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.16); color: #e7ecf3; box-shadow: inset 2px -2px 1px -1px hsla(0,0%,100%,.16), inset -2px 2px 1px -1px hsla(0,0%,100%,.16), 0 28px 64px -24px rgba(0,0,0,.6); }
    h1 { color: #fff; } .sub, .foot, a.home { color: #aab4c2; }
    input, select { background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.18); color: #fff; }
    .links a, .links button { color: #7fb0ff; } .foot a { color: #7fb0ff; }
    .c-brand .sys-name { color: #7fb0ff; }
  }
</style>
</head><body>
  <div class="auth-wrap">
    <aside class="auth-visual">
      <div class="auth-visual-inner">
        <div class="v-badges">
          <img class="school-badge" src="${SCHOOL_BADGE}" alt="唐山师范学院">
          <img class="bar-logo" src="${BAR_LOGO}" alt="唐山师范学院吧">
        </div>
        <div class="v-name">唐山师范学院吧统一认证系统</div>
        <div class="v-sub">统一身份认证 · 安全便捷</div>
      </div>
    </aside>
    <main class="auth-main">
      <div class="card">
        <div class="c-brand">
          <div class="logo-row">
            <img class="school-badge" src="${SCHOOL_BADGE}" alt="唐山师范学院">
            <img class="bar-logo" src="${BAR_LOGO}" alt="唐山师范学院吧">
          </div>
          <div class="sys-name">唐山师范学院吧统一认证系统</div>
        </div>
        <h1>${title}</h1>
        <p class="sub">${subtitle}</p>
        ${cardHtml}
        <a class="home" href="https://${MAIN_HOST}">← 返回唐山师范学院吧</a>
      </div>
    </main>
  </div>
  <script>
    ${scriptHtml}
  </script>
</body></html>`;
}

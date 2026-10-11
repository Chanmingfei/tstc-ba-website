// 统一认证系统页面布局：桌面端「左侧品牌大图 + 右侧表单卡片」，移动端改为顶部图条 + 卡片。
// 仅使用主站已有素材（campus-students.jpg 校园照、校徽/吧徽 PNG），不引入外部资源。
import { MAIN_HOST } from './config.js';

const VISUAL_BG = '/assets/images/campus-students.jpg';
const SCHOOL_BADGE = '/assets/img/school-badge-v2.png';
const BAR_LOGO = '/assets/images/bar-logo.png';

export const BADGES = { SCHOOL_BADGE, BAR_LOGO };

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
    background: linear-gradient(180deg, #fff, #edf2fa 42%, #e3edf8);
  }
  .auth-wrap { display: flex; min-height: 100vh; }

  /* ---------- 左侧品牌视觉 ---------- */
  .auth-visual {
    position: relative; flex: 0 0 44%; overflow: hidden;
    background-image: url('${VISUAL_BG}'); background-size: cover; background-position: center;
    display: flex; align-items: center;
  }
  .auth-visual::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(155deg, rgba(4,101,188,.88), rgba(10,108,214,.78) 45%, rgba(12,37,61,.92));
  }
  .auth-visual-inner { position: relative; z-index: 1; padding: 56px 44px; color: #fff; width: 100%; }
  .v-badges { display: flex; align-items: center; gap: 14px; margin-bottom: 22px; }
  .v-badges .school-badge { height: 42px; width: auto; filter: drop-shadow(0 2px 6px rgba(0,0,0,.25)); }
  .v-badges .bar-logo { width: 60px; height: 60px; border-radius: 50%; object-fit: cover; background: rgba(255,255,255,.9); padding: 3px; filter: drop-shadow(0 4px 10px rgba(0,0,0,.25)); }
  .v-name { font-size: 19px; font-weight: 700; letter-spacing: .5px; line-height: 1.4; }
  .v-name small { display: block; font-size: 13px; font-weight: 400; color: rgba(255,255,255,.8); margin-top: 4px; letter-spacing: 1px; }
  .v-tag { margin: 22px 0 0; font-size: 15px; line-height: 1.7; color: rgba(255,255,255,.92); font-weight: 500; }
  .v-list { list-style: none; margin: 26px 0 0; padding: 0; }
  .v-list li {
    display: flex; align-items: flex-start; gap: 10px; font-size: 14px;
    color: rgba(255,255,255,.88); margin-bottom: 14px; line-height: 1.5;
  }
  .v-list li::before {
    content: ''; flex: 0 0 auto; width: 8px; height: 8px; margin-top: 7px; border-radius: 50%;
    background: rgba(255,255,255,.85); box-shadow: 0 0 0 4px rgba(255,255,255,.18);
  }
  .v-foot {
    position: absolute; left: 44px; right: 44px; bottom: 28px; z-index: 1;
    font-size: 12px; color: rgba(255,255,255,.7);
  }

  /* ---------- 右侧表单区 ---------- */
  .auth-main {
    flex: 1 1 auto; display: flex; align-items: center; justify-content: center;
    padding: 40px 32px;
    background:
      radial-gradient(900px 520px at 78% 18%, rgba(10,108,214,.10), transparent 60%),
      radial-gradient(800px 460px at 8% 88%, rgba(124,58,237,.07), transparent 60%);
  }
  .card {
    width: min(100%, 400px); padding: 32px 30px 26px; border-radius: var(--r-lg);
    background: rgba(255,255,255,.62);
    -webkit-backdrop-filter: blur(22px) saturate(190%); backdrop-filter: blur(22px) saturate(190%);
    border: 1px solid rgba(255,255,255,.75);
    box-shadow: inset 2px -2px 1px -1px hsla(0,0%,100%,.9), inset -2px 2px 1px -1px hsla(0,0%,100%,.9), 0 28px 64px -24px rgba(0,0,0,.28);
  }
  .c-head { margin-bottom: 18px; }
  h1 { font-size: 21px; margin: 0 0 4px; color: var(--text-strong); letter-spacing: .5px; }
  .sub { font-size: 13px; color: var(--text-muted); margin: 0; }
  label { display: block; font-size: 13px; margin: 14px 0 6px; }
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

  /* ---------- 移动端：顶部图条 + 卡片 ---------- */
  @media (max-width: 900px) {
    .auth-wrap { flex-direction: column; }
    .auth-visual { flex: none; min-height: 190px; }
    .auth-visual-inner { padding: 26px 22px 30px; text-align: center; }
    .v-badges { justify-content: center; margin-bottom: 12px; }
    .v-tag { font-size: 14px; margin-top: 14px; }
    .v-list { display: none; }
    .v-foot { position: static; margin-top: 14px; text-align: center; left: auto; right: auto; bottom: auto; }
    .auth-main { padding: 24px 16px 40px; }
    .card { width: min(100%, 420px); padding: 26px 22px 22px; }
  }
  @media (max-width: 420px) {
    .auth-visual { min-height: 165px; }
    .v-name { font-size: 17px; }
  }

  @media (prefers-color-scheme: dark) {
    body { color: #e7ecf3; background: linear-gradient(180deg, #0c253d, #143352); }
    .auth-main { background: radial-gradient(900px 520px at 78% 18%, rgba(37,117,252,.14), transparent 60%), radial-gradient(800px 460px at 8% 88%, rgba(124,58,237,.10), transparent 60%); }
    .card { background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.16); color: #e7ecf3; box-shadow: inset 2px -2px 1px -1px hsla(0,0%,100%,.16), inset -2px 2px 1px -1px hsla(0,0%,100%,.16), 0 28px 64px -24px rgba(0,0,0,.6); }
    h1 { color: #fff; } .sub, .foot, a.home { color: #aab4c2; }
    input, select { background: rgba(255,255,255,.06); border-color: rgba(255,255,255,.18); color: #fff; }
    .links a, .links button { color: #7fb0ff; } .foot a { color: #7fb0ff; }
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
        <div class="v-name">唐山师范学院吧统一认证系统<small>TANGSHAN NORMAL UNIVERSITY BAR · SSO</small></div>
        <p class="v-tag">一个账号，畅行全站：登录、评论、投稿与管理，尽在统一认证。</p>
        <ul class="v-list">
          <li>统一身份：主站与后台共用同一会话，跨子域免重复登录</li>
          <li>安全加密：口令经 PBKDF2 加盐派生存储，不明文保存</li>
          <li>自主管理：随时修改密码，管理员可统一维护账号与文章</li>
        </ul>
      </div>
      <div class="v-foot">吧务组官网（非学校官方） · bazhu@tstc.pp.ua</div>
    </aside>
    <main class="auth-main">
      <div class="card">
        <div class="c-head">
          <h1>${title}</h1>
          <p class="sub">${subtitle}</p>
        </div>
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

// 忘记密码页：仅 sso.tstc.pp.ua/reset-password 渲染，主站访问 302 回 sso。
// 两步流程：① 输入绑定邮箱发送验证码 → ② 验证码 + 新密码完成重置（重置后该账号全部设备下线）。
import { html, redirect } from './_lib/http.js';
import { SSO_HOST } from './_lib/config.js';
import { authPage } from './_lib/auth-layout.js';

export async function onRequest(context) {
  const { request } = context;
  if (request.headers.get('host') !== SSO_HOST) return redirect(`https://${SSO_HOST}/reset-password`);

  const cardHtml = `
    <form id="f1">
      <label for="email">绑定邮箱</label>
      <input id="email" name="email" type="email" autocomplete="email" required placeholder="you@example.com">
      <button class="primary" type="submit">发送验证码</button>
    </form>
    <form id="f2" style="display:none">
      <p class="sub" style="margin:0 0 4px">验证码已发送至 <b id="emailEcho"></b>（5 分钟内有效）</p>
      <label for="code">验证码</label>
      <input id="code" name="code" inputmode="numeric" maxlength="6" autocomplete="one-time-code" required placeholder="6 位数字">
      <label for="np">新密码（至少 6 位）</label>
      <input id="np" name="np" type="password" autocomplete="new-password" required minlength="6">
      <label for="np2">确认新密码</label>
      <input id="np2" name="np2" type="password" autocomplete="new-password" required minlength="6">
      <button class="primary" type="submit">重置密码</button>
      <div class="links"><button type="button" id="resend">重新发送验证码</button></div>
    </form>
    <div class="msg" id="msg"></div>
    <div class="foot"><a href="/login">返回登录</a></div>`;

  const scriptHtml = `
    var msg = document.getElementById('msg');
    var f1 = document.getElementById('f1');
    var f2 = document.getElementById('f2');
    var emailValue = '';

    function say(text, ok) {
      msg.className = 'msg' + (ok ? ' ok' : '');
      msg.textContent = text;
    }

    function sendCode() {
      var email = document.getElementById('email').value.trim();
      if (!email) { say('请填写绑定邮箱'); return; }
      return fetch('/api/password-reset/code', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email })
      }).then(function (r) {
        return r.json().then(function (d) { return { ok: r.ok, d: d }; });
      }).then(function (res) {
        if (res.ok) {
          emailValue = email;
          document.getElementById('emailEcho').textContent = email;
          f1.style.display = 'none';
          f2.style.display = '';
          say('若该邮箱已绑定账号，验证码已发送，请查收邮件。', true);
          document.getElementById('code').focus();
        } else {
          say(res.d.error || '发送失败，请稍后再试');
        }
      }).catch(function () { say('网络错误，请重试'); });
    }

    f1.addEventListener('submit', function (e) { e.preventDefault(); say(''); sendCode(); });

    document.getElementById('resend').addEventListener('click', function () {
      say('');
      document.getElementById('email').value = emailValue;
      sendCode();
    });

    f2.addEventListener('submit', function (e) {
      e.preventDefault();
      say('');
      var code = document.getElementById('code').value.trim();
      var np = document.getElementById('np').value;
      var np2 = document.getElementById('np2').value;
      if (np.length < 6) { say('新密码至少 6 位'); return; }
      if (np !== np2) { say('两次输入的新密码不一致'); return; }
      fetch('/api/password-reset/confirm', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailValue, code: code, password: np })
      }).then(function (r) {
        return r.json().then(function (d) { return { ok: r.ok, d: d }; });
      }).then(function (res) {
        if (res.ok) {
          say('重置成功！正在跳转登录页…', true);
          setTimeout(function () { location.href = '/login'; }, 1500);
        } else {
          say(res.d.error || '重置失败');
        }
      }).catch(function () { say('网络错误，请重试'); });
    });`;

  return html(authPage({
    pageTitle: '重置密码 · 唐山师范学院吧统一认证系统',
    title: '重置密码',
    subtitle: '通过绑定邮箱收到的验证码重置密码',
    cardHtml,
    scriptHtml,
  }));
}

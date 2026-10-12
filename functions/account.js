// 账号管理页：仅 sso.tstc.pp.ua/account 渲染，主站访问 302 回 sso。
// 展示账号资料、等级与进度、修改密码；并对达到 3 级的用户开放「我的文章」（发布/编辑/删除自己的文章）。
import { html, redirect } from './_lib/http.js';
import { SSO_HOST, MAIN_HOST } from './_lib/config.js';
import { authPage } from './_lib/auth-layout.js';

export async function onRequest(context) {
  const { request } = context;
  if (request.headers.get('host') !== SSO_HOST) return redirect(`https://${SSO_HOST}/account`);

  const cardHtml = `
    <div id="gate"></div>
    <div id="app" style="display:none">
      <div class="tabs" id="tabs">
        <button class="tab active" data-tab="account">账号信息</button>
        <button class="tab" data-tab="articles" id="tabArticles" style="display:none">我的文章</button>
      </div>
      <div id="view"></div>
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
    function api(path, opts) {
      opts = opts || {};
      return fetch(path, Object.assign({ credentials: 'include', headers: { 'Content-Type': 'application/json' } }, opts))
        .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); });
    }

    var currentUser = null;   // /api/account 返回的全量资料
    var view = document.getElementById('view');

    document.getElementById('logout').onclick = function () {
      fetch('/api/logout', { method: 'POST', credentials: 'include' }).then(function () { location.href = 'https://${MAIN_HOST}'; });
    };

    document.querySelectorAll('.tab').forEach(function (t) {
      t.onclick = function () {
        var tab = t.dataset.tab;
        if (tab === 'articles' && !canPublish()) { alert('需达到 3 级（累计发满 10 条评论）才能发布文章'); return; }
        document.querySelectorAll('.tab').forEach(function (x) { x.classList.toggle('active', x.dataset.tab === tab); });
        if (tab === 'account') showAccount(); else loadArticles();
      };
    });

    // 达到 3 级（或管理员）方可发布/管理文章
    function canPublish() {
      if (!currentUser) return false;
      if (currentUser.role === 'admin') return true;
      return (currentUser.level || 1) >= 3;
    }

    // ---------- 账号信息 ----------
    function showAccount() {
      view.innerHTML =
        '<div class="kv" id="profileCard"></div>' +
        '<div class="card" style="margin-top:16px">' +
          '<b>修改密码</b>' +
          '<form id="pwForm" style="margin-top:12px">' +
            '<label for="oldPassword">当前密码</label>' +
            '<input id="oldPassword" type="password" autocomplete="current-password" required>' +
            '<label for="newPassword">新密码（至少 6 位）</label>' +
            '<input id="newPassword" type="password" autocomplete="new-password" required minlength="6">' +
            '<label for="newPassword2">确认新密码</label>' +
            '<input id="newPassword2" type="password" autocomplete="new-password" required minlength="6">' +
            '<button class="primary" type="submit" style="margin-top:14px">修改密码</button>' +
            '<div class="msg" id="msg"></div>' +
          '</form>' +
        '</div>';
      document.getElementById('profileCard').innerHTML = profileHtml();
      document.getElementById('pwForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var msg = document.getElementById('msg');
        msg.className = 'msg'; msg.textContent = '';
        var oldPassword = document.getElementById('oldPassword').value;
        var newPassword = document.getElementById('newPassword').value;
        var newPassword2 = document.getElementById('newPassword2').value;
        if (newPassword.length < 6) { msg.textContent = '新密码至少 6 位'; return; }
        if (newPassword !== newPassword2) { msg.textContent = '两次输入的新密码不一致'; return; }
        api('/api/account/password', { method: 'POST', body: JSON.stringify({ oldPassword: oldPassword, newPassword: newPassword }) })
          .then(function (res) {
            if (res.ok && res.d.ok) { msg.className = 'msg ok'; msg.textContent = '密码修改成功'; document.getElementById('pwForm').reset(); }
            else { msg.textContent = (res.d && res.d.error) || '修改失败'; }
          }).catch(function () { msg.textContent = '网络错误，请重试'; });
      });
    }

    function profileHtml() {
      var u = currentUser;
      var xp = u.xp || 0;
      var inLevel = xp % 5;
      var remaining = inLevel === 0 ? 5 : 5 - inLevel;
      var pct = Math.round((inLevel / 5) * 100);
      var roleText = u.role === 'admin' ? '管理员' : '普通用户';
      var tip = canPublish()
        ? '已解锁发文权限：可在「我的文章」发布/编辑/删除自己的文章（日期固定为发文当天）。'
        : '距发文权限还差 ' + remaining + ' 条评论（满 10 条即达 3 级）。';
      return '<div class="kv-row"><span>用户名</span><span>' + esc(u.username) + '</span></div>' +
        '<div class="kv-row"><span>角色</span><span>' + roleText + '</span></div>' +
        '<div class="kv-row"><span>等级</span><span>Lv.' + (u.level || 1) + '</span></div>' +
        '<div class="kv-row"><span>经验值</span><span>' + xp + ' 条评论</span></div>' +
        '<div class="lvbar"><i style="width:' + pct + '%"></i></div>' +
        '<div class="kv-hint">' + tip + '</div>' +
        '<div class="kv-row"><span>注册时间</span><span>' + fmt(u.created_at) + '</span></div>';
    }

    // ---------- 我的文章（Lv3+）----------
    function articleForm(a) {
      a = a || {};
      return '<div class="panel"><div style="display:flex;justify-content:space-between;align-items:center"><b>' + (a.slug ? '编辑文章' : '新建文章') + '</b>' +
        '<button class="btn ghost" id="cancelArt">取消</button></div>' +
        (a.slug ? '<p class="muted" style="margin:6px 0 0">slug：' + esc(a.slug) + '（不可修改）</p>' : '<p class="muted" style="margin:6px 0 0">slug 由系统自动生成</p>') +
        '<div class="row2"><div><label>语言</label><select id="f_lang">' +
          '<option value="zh"' + ((a.lang || 'zh') === 'zh' ? ' selected' : '') + '>中文 zh</option>' +
          '<option value="en"' + (a.lang === 'en' ? ' selected' : '') + '>English en</option></select></div>' +
        '<div><label>分类</label><input id="f_cat" value="' + esc(a.category || '') + '"></div></div>' +
        '<label>标题</label><input id="f_title" value="' + esc(a.title || '') + '">' +
        '<label>摘要</label><input id="f_excerpt" value="' + esc(a.excerpt || '') + '">' +
        '<label>正文（HTML）</label><textarea id="f_content">' + esc(a.content || '') + '</textarea>' +
        '<div class="row2"><div><label>作者（固定为本人）</label><input id="f_author" value="' + esc(a.author || (currentUser && currentUser.username) || '') + '" readonly></div>' +
        '<div><label>日期（固定为发文日期）</label><input id="f_date" value="' + esc(a.date || '系统自动') + '" readonly></div></div>' +
        '<div style="margin-top:12px"><button class="btn" id="saveArt">保存</button> <span class="err" id="artErr"></span></div></div>';
    }

    function loadArticles() {
      if (!canPublish()) { showAccount(); return; }
      api('/api/articles/mine').then(function (r) {
        if (!r.ok) return (view.innerHTML = '<div class="card">加载失败</div>');
        var rows = r.d.articles || [];
        var html = '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><b>我的文章（' + rows.length + '）</b>' +
          '<button class="btn" id="newArt">+ 新建文章</button></div>';
        if (rows.length) {
          html += '<table><thead><tr><th>slug</th><th>语言</th><th>标题</th><th>日期</th><th>分类</th><th>操作</th></tr></thead><tbody>';
          rows.forEach(function (a) {
            html += '<tr><td>' + esc(a.slug) + '</td><td>' + esc(a.lang) + '</td><td>' + esc(a.title) + '</td><td>' + esc(a.date) + '</td><td>' + esc(a.category) + '</td>' +
              '<td style="white-space:nowrap"><a class="btn ghost" href="https://${MAIN_HOST}/news/' + esc(a.slug) + '.html" target="_blank">查看</a> ' +
              '<button class="btn ghost" data-edit="' + esc(a.slug) + '">编辑</button> ' +
              '<button class="btn danger" data-del="' + esc(a.slug) + '">删除</button></td></tr>';
          });
          html += '</tbody></table>';
        } else {
          html += '<p class="muted">还没有发布文章。在此发布后将在主站新闻列表展示。</p>';
        }
        html += '</div>';
        view.innerHTML = html;
        document.getElementById('newArt').onclick = function () { view.innerHTML = articleForm(); bindArtForm(null); };
        view.querySelectorAll('button[data-edit]').forEach(function (b) {
          b.onclick = function () {
            api('/api/articles/' + b.dataset.edit).then(function (res) {
              if (!res.ok) return alert(res.d.error || '加载失败');
              view.innerHTML = articleForm(res.d.article); bindArtForm(b.dataset.edit);
            });
          };
        });
        view.querySelectorAll('button[data-del]').forEach(function (b) {
          b.onclick = function () { if (!confirm('删除文章 ' + b.dataset.del + '？')) return;
            api('/api/articles/' + b.dataset.del, { method: 'DELETE' }).then(function (res) { if (res.ok) loadArticles(); else alert(res.d.error || '失败'); }); };
        });
      });
    }

    function bindArtForm(slug) {
      var cancel = document.getElementById('cancelArt'); if (cancel) cancel.onclick = loadArticles;
      document.getElementById('saveArt').onclick = function () {
        var err = document.getElementById('artErr');
        var payload = {
          lang: document.getElementById('f_lang').value.trim(),
          title: document.getElementById('f_title').value.trim(),
          category: document.getElementById('f_cat').value.trim(),
          excerpt: document.getElementById('f_excerpt').value.trim(),
          content: document.getElementById('f_content').value
        };
        if (!payload.title || !payload.content) { err.textContent = '标题与正文必填'; return; }
        var p = slug ? api('/api/articles/' + slug, { method: 'PUT', body: JSON.stringify(payload) })
                     : api('/api/articles', { method: 'POST', body: JSON.stringify(payload) });
        p.then(function (res) {
          if (res.ok) { loadArticles(); if (!slug) alert('发布成功！文章将在主站新闻列表展示。'); }
          else err.textContent = res.d.error || '保存失败';
        });
      };
    }

    // ---------- 鉴权入口 ----------
    api('/api/account').then(function (r) {
      if (!r.ok) {
        document.getElementById('gate').innerHTML =
          '<div class="info" style="text-align:center">尚未登录，请先登录后再管理账号。' +
          '<div style="margin-top:10px"><a href="/login" style="color:var(--tint)">前往登录</a></div></div>';
        return null;
      }
      return r.d;
    }).then(function (d) {
      if (!d) return;
      currentUser = d;
      document.getElementById('app').style.display = 'block';
      if (canPublish()) document.getElementById('tabArticles').style.display = '';
      showAccount();
    }).catch(function () {
      document.getElementById('gate').innerHTML = '<div class="info" style="text-align:center">加载失败，请刷新重试。</div>';
    });`;

  const page = authPage({
    pageTitle: '账号管理 · 唐山师范学院吧统一认证系统',
    title: '账号管理',
    subtitle: '查看账号信息、等级与发布文章',
    cardHtml,
    scriptHtml,
  });

  // 账号页专用样式（等级进度条、键值表、文章面板等）追加到布局样式表
  const extraStyle = `
  .tabs { display:flex; gap:8px; margin:4px 0 16px; flex-wrap:wrap; }
  .tab { padding:9px 16px; border-radius:999px; border:1px solid var(--hairline); cursor:pointer; font-size:14px; background:rgba(255,255,255,.5); color:var(--text-muted); }
  .tab.active { background:linear-gradient(135deg,var(--primary),var(--secondary)); color:#fff; border-color:transparent; font-weight:600; }
  .card { background:rgba(255,255,255,.55); border:1px solid rgba(255,255,255,.7); border-radius:18px; padding:18px; box-shadow: inset 2px -2px 1px -1px hsla(0,0%,100%,.9), inset -2px 2px 1px -1px hsla(0,0%,100%,.9), 0 16px 40px -22px rgba(0,0,0,.26); }
  .info { background:rgba(255,255,255,.55); border:1px solid rgba(255,255,255,.75); border-radius:14px; padding:14px 16px; margin-bottom:16px; text-align:center; }
  .kv { background:rgba(255,255,255,.55); border:1px solid rgba(255,255,255,.75); border-radius:14px; padding:14px 16px; }
  .kv-row { display:flex; justify-content:space-between; font-size:13px; padding:6px 0; border-bottom:1px solid rgba(60,60,67,.08); }
  .kv-row:last-child { border-bottom:0; }
  .kv-row span:first-child { color:var(--text-muted); }
  .kv-row span:last-child { color:var(--text-strong); font-weight:600; }
  .kv-hint { font-size:12px; color:#9ca3af; margin:8px 0 2px; }
  .lvbar { height:8px; border-radius:999px; background:rgba(10,108,214,.12); overflow:hidden; margin-top:8px; }
  .lvbar > i { display:block; height:100%; background:linear-gradient(135deg,var(--primary),var(--secondary)); }
  .btn { border:0; border-radius:9px; padding:6px 11px; font-size:13px; cursor:pointer; background:linear-gradient(135deg,var(--primary),var(--secondary)); color:#fff; }
  .btn.ghost { background:rgba(10,108,214,.10); color:var(--tint); }
  .btn.danger { background:#fee2e2; color:#dc2626; }
  .panel { background:rgba(255,255,255,.55); border:1px solid rgba(255,255,255,.7); border-radius:14px; padding:16px; margin-bottom:16px; }
  .panel label { display:block; font-size:12px; color:#374151; margin:10px 0 4px; }
  .panel input, .panel textarea, .panel select { width:100%; padding:9px 11px; border:1px solid var(--hairline); border-radius:10px; font-size:14px; font-family:inherit; outline:none; background:rgba(255,255,255,.7); color:var(--text-strong); }
  .panel input:focus, .panel textarea:focus, .panel select:focus { border-color:var(--tint); box-shadow:0 0 0 3px rgba(10,108,214,.16); }
  .panel input[readonly] { background:rgba(255,255,255,.4); color:#6b7280; }
  .panel textarea { min-height:160px; resize:vertical; }
  .row2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .muted { color:#9ca3af; }
  .err { color:#dc2626; font-size:13px; min-height:18px; }
  @media (prefers-color-scheme: dark) {
    .card, .panel, .kv { background:rgba(255,255,255,.08); border-color:rgba(255,255,255,.16); color:#e7ecf3; box-shadow: inset 2px -2px 1px -1px hsla(0,0%,100%,.16), inset -2px 2px 1px -1px hsla(0,0%,100%,.16), 0 16px 40px -22px rgba(0,0,0,.6); }
    .tab { color:#aab4c2; }
    .info { background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.16); }
    .kv-row span:first-child { color:#aab4c2; } .kv-row span:last-child { color:#fff; }
    .kv-row { border-bottom-color:rgba(255,255,255,.10); }
    .kv-hint { color:#8a93a3; }
    .lvbar { background:rgba(255,255,255,.12); }
    .panel input, .panel textarea, .panel select { background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.18); color:#fff; }
    .panel input[readonly] { background:rgba(255,255,255,.03); color:#aab4c2; }
    .muted { color:#8a93a3; }
    .btn.ghost { background:rgba(255,255,255,.12); color:#cfe0ff; }
    .btn.danger { background:#5b2020; color:#ffb4b4; }
  }`;

  return html(page.replace('</style>', extraStyle + '\n</style>'));
}

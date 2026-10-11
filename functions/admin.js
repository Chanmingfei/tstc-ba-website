// 管理后台：仅 sso.tstc.pp.ua/admin 渲染，主站访问 302 回 sso；非管理员显示无权限。
import { html, redirect } from './_lib/http.js';
import { SSO_HOST, MAIN_HOST } from './_lib/config.js';

export async function onRequest(context) {
  const { request } = context;
  if (request.headers.get('host') !== SSO_HOST) return redirect(`https://${SSO_HOST}/admin`);

  return html(`<!DOCTYPE html><html lang="zh-CN"><head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>管理后台 · 唐山师范学院吧统一认证系统</title>
<style>
  :root {
    --primary:#0465bc; --secondary:#2575fc; --tint:#0a6cd6; --accent:#4c94ff;
    --text:#1f2937; --text-strong:#111827; --text-muted:#6b7280;
    --hairline:rgba(60,60,67,.13); --r-sm:12px; --r-lg:18px; --r-full:999px;
  }
  * { box-sizing: border-box; }
  body {
    margin:0; min-height:100vh; font-family: Inter, system-ui,-apple-system,"PingFang SC","Microsoft YaHei",sans-serif;
    color:var(--text);
    background:
      radial-gradient(1300px 700px at 50% 28%, rgba(10,108,214,.10), transparent 58%),
      radial-gradient(1200px 600px at 82% -6%, rgba(10,108,214,.10), transparent 55%),
      radial-gradient(1000px 520px at -4% 8%, rgba(124,58,237,.07), transparent 52%),
      linear-gradient(180deg, #fff, #edf2fa 42%, #e3edf8);
  }
  .wrap { max-width: 1040px; margin: 0 auto; padding: 24px 18px 60px; }
  .topbar {
    display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:18px;
    padding:12px 16px; border-radius:var(--r-lg);
    background:rgba(255,255,255,.55); -webkit-backdrop-filter:blur(22px) saturate(190%); backdrop-filter:blur(22px) saturate(190%);
    border:1px solid rgba(255,255,255,.7);
    box-shadow: inset 2px -2px 1px -1px hsla(0,0%,100%,.9), inset -2px 2px 1px -1px hsla(0,0%,100%,.9), 0 16px 40px -20px rgba(0,0,0,.28);
  }
  .brand { display:flex; align-items:center; gap:12px; font-weight:700; font-size:17px; color:var(--text-strong); }
  /* 校徽/吧徽均为透明 PNG，统一不加白底 */
  .brand .bar-logo { width:44px; height:44px; border-radius:50%; object-fit:cover; filter:drop-shadow(0 3px 8px rgba(0,0,0,.18)); }
  .brand .school-badge { height:30px; width:auto; filter:drop-shadow(0 2px 5px rgba(0,0,0,.14)); }
  .brand .b-title { display:flex; flex-direction:column; line-height:1.15; }
  .brand .b-title small { font-weight:500; font-size:12px; color:var(--text-muted); }
  .topbar .actions { display:flex; gap:8px; }
  .topbar a, .topbar button {
    color:var(--tint); text-decoration:none; font-size:13px; background:rgba(10,108,214,.10); border:1px solid rgba(10,108,214,.18);
    padding:8px 14px; border-radius:var(--r-full); cursor:pointer; transition:background .15s ease, filter .15s ease;
  }
  .topbar a:hover, .topbar button:hover { background:rgba(10,108,214,.18); }
  .card {
    background:rgba(255,255,255,.55); -webkit-backdrop-filter:blur(22px) saturate(190%); backdrop-filter:blur(22px) saturate(190%);
    border:1px solid rgba(255,255,255,.7); border-radius:var(--r-lg); padding:18px;
    box-shadow: inset 2px -2px 1px -1px hsla(0,0%,100%,.9), inset -2px 2px 1px -1px hsla(0,0%,100%,.9), 0 16px 40px -22px rgba(0,0,0,.26);
  }
  .tabs { display:flex; gap:8px; margin-bottom:16px; flex-wrap:wrap; }
  .tab { padding:9px 16px; border-radius:var(--r-full); border:0; cursor:pointer; font-size:14px; background:rgba(255,255,255,.5); color:var(--text-muted); border:1px solid var(--hairline); }
  .tab.active { background:linear-gradient(135deg,var(--primary),var(--secondary)); color:#fff; border-color:transparent; font-weight:600; }
  .btn { border:0; border-radius:9px; padding:6px 11px; font-size:13px; cursor:pointer; background:linear-gradient(135deg,var(--primary),var(--secondary)); color:#fff; }
  .btn.ghost { background:rgba(10,108,214,.10); color:var(--tint); }
  .btn.danger { background:#fee2e2; color:#dc2626; }
  .btn.warn { background:#fef3c7; color:#b45309; }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  th, td { text-align:left; padding:9px 8px; border-bottom:1px solid rgba(60,60,67,.08); vertical-align:top; }
  th { color:var(--text-muted); font-weight:600; }
  .panel { background:rgba(255,255,255,.55); border:1px solid rgba(255,255,255,.7); border-radius:14px; padding:16px; margin-bottom:16px; }
  .panel label { display:block; font-size:12px; color:#374151; margin:10px 0 4px; }
  .panel input, .panel textarea { width:100%; padding:9px 11px; border:1px solid var(--hairline); border-radius:10px; font-size:14px; font-family:inherit; outline:none; background:rgba(255,255,255,.7); color:var(--text-strong); }
  .panel input:focus, .panel textarea:focus { border-color:var(--tint); box-shadow:0 0 0 3px rgba(10,108,214,.16); }
  .panel textarea { min-height:160px; resize:vertical; }
  .row2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .muted { color:#9ca3af; }
  .pill { display:inline-block; padding:1px 8px; border-radius:999px; font-size:12px; }
  .pill.active { background:#dcfce7; color:#16a34a; }
  .pill.banned { background:#fee2e2; color:#dc2626; }
  .pill.visible { background:#dcfce7; color:#16a34a; }
  .pill.deleted { background:#f3f4f6; color:#9ca3af; }
  .stats { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
  .stat { background:rgba(255,255,255,.55); -webkit-backdrop-filter:blur(22px) saturate(190%); backdrop-filter:blur(22px) saturate(190%); border:1px solid rgba(255,255,255,.7); border-radius:16px; padding:18px; text-align:center; box-shadow: inset 2px -2px 1px -1px hsla(0,0%,100%,.9), inset -2px 2px 1px -1px hsla(0,0%,100%,.9), 0 10px 30px -20px rgba(0,0,0,.24); }
  .stat b { display:block; font-size:26px; color:var(--tint); }
  .err { color:#dc2626; font-size:13px; min-height:18px; }
  @media (prefers-color-scheme: dark) {
    body { color:#e7ecf3; background: radial-gradient(1300px 700px at 50% 26%, rgba(37,117,252,.16), transparent 58%), radial-gradient(1000px 520px at -4% 8%, rgba(124,58,237,.14), transparent 52%), linear-gradient(180deg, #0c253d, #143352); }
    .topbar, .card, .panel, .tab, .stat { background:rgba(255,255,255,.08); border-color:rgba(255,255,255,.16); color:#e7ecf3; box-shadow: inset 2px -2px 1px -1px hsla(0,0%,100%,.16), inset -2px 2px 1px -1px hsla(0,0%,100%,.16), 0 16px 40px -22px rgba(0,0,0,.6); }
    .brand { color:#fff; } .brand .b-title small { color:#aab4c2; }
    .tab { color:#aab4c2; }
    th, td { border-bottom-color:rgba(255,255,255,.10); }
    .panel input, .panel textarea { background:rgba(255,255,255,.06); border-color:rgba(255,255,255,.18); color:#fff; }
    .topbar a, .topbar button { background:rgba(255,255,255,.10); border-color:rgba(255,255,255,.18); color:#cfe0ff; }
    .muted { color:#8a93a3; }
  }
</style>
</head><body>
<div class="wrap">
  <div class="topbar">
    <span class="brand">
      <img class="school-badge" src="/assets/img/school-badge.png" alt="唐山师范学院">
      <img class="bar-logo" src="/assets/images/bar-logo.png" alt="唐山师范学院吧">
      <span class="b-title">唐山师范学院吧统一认证系统<small>管理后台</small></span>
    </span>
    <span class="actions">
      <a href="https://${MAIN_HOST}">返回主站</a>
      <button id="logout">退出登录</button>
    </span>
  </div>
  <div id="gate"></div>
  <div id="app" style="display:none">
    <div class="tabs">
      <button class="tab active" data-tab="stats">概览</button>
      <button class="tab" data-tab="users">用户</button>
      <button class="tab" data-tab="articles">文章</button>
      <button class="tab" data-tab="comments">评论</button>
    </div>
    <div id="view"></div>
  </div>
</div>
<script>
var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]); }); };
function api(path, opts) {
  opts = opts || {};
  return fetch(path, Object.assign({ credentials: 'include', headers: { 'Content-Type': 'application/json' } }, opts))
    .then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); });
}
function fmt(ts) { if (!ts) return ''; var d = new Date(typeof ts === 'number' ? ts : Date.parse(ts)); if (isNaN(d.getTime())) return ''; var p = function (n){return (n<10?'0':'')+n;}; return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+' '+p(d.getHours())+':'+p(d.getMinutes()); }

document.getElementById('logout').onclick = function () {
  fetch('/api/logout', { method: 'POST', credentials: 'include' }).then(function () { location.href = '/login'; });
};

var view = document.getElementById('view');
function show(tab) {
  document.querySelectorAll('.tab').forEach(function (t) { t.classList.toggle('active', t.dataset.tab === tab); });
  if (tab === 'stats') loadStats();
  else if (tab === 'users') loadUsers();
  else if (tab === 'articles') loadArticles();
  else if (tab === 'comments') loadComments();
}
document.querySelectorAll('.tab').forEach(function (t) { t.onclick = function () { show(t.dataset.tab); }; });

function loadStats() {
  api('/api/admin/stats').then(function (r) {
    if (!r.ok) return (view.innerHTML = '<div class="card">加载失败</div>');
    var s = r.d.stats;
    view.innerHTML = '<div class="stats">' +
      '<div class="stat"><b>' + s.users + '</b>用户</div>' +
      '<div class="stat"><b>' + s.articles + '</b>文章</div>' +
      '<div class="stat"><b>' + s.comments + '</b>评论</div>' +
      '<div class="stat"><b>' + s.commentsVisible + '</b>可见评论</div></div>' +
      '<div class="card" style="margin-top:16px"><p class="muted">提示：文章正文由 SSR 渲染（news/post-N.html 作为模板）。在此新建/编辑文章会写入 D1；删除文章不会删除静态文件，如需彻底下线请同步处理静态页。</p></div>';
  });
}

function loadUsers() {
  api('/api/admin/users').then(function (r) {
    if (!r.ok) return (view.innerHTML = '<div class="card">加载失败</div>');
    var rows = r.d.users || [];
    var html = '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><b>用户（' + rows.length + '）</b>' +
      '<button class="btn" id="newUser">+ 新建用户</button></div>' +
      '<table><thead><tr><th>ID</th><th>用户名</th><th>角色</th><th>状态</th><th>注册时间</th><th>操作</th></tr></thead><tbody>';
    rows.forEach(function (u) {
      var st = u.status === 'banned' ? '<span class="pill banned">已封禁</span>' : '<span class="pill active">正常</span>';
      var banBtn = u.status === 'banned'
        ? '<button class="btn ghost" data-act="unban" data-id="' + u.id + '">解封</button>'
        : '<button class="btn warn" data-act="ban" data-id="' + u.id + '">封禁</button>';
      html += '<tr><td>' + u.id + '</td><td>' + esc(u.username) + '</td><td>' + esc(u.role) + '</td><td>' + st + '</td><td>' + fmt(u.created_at) + '</td>' +
        '<td style="white-space:nowrap">' +
        '<button class="btn ghost" data-act="reset" data-id="' + u.id + '">重置密码</button> ' +
        banBtn + ' ' +
        '<button class="btn danger" data-act="del" data-id="' + u.id + '">删除</button></td></tr>';
    });
    html += '</tbody></table></div>';
    view.innerHTML = html;

    document.getElementById('newUser').onclick = function () {
      var name = prompt('新用户名（3-20 位字母/数字/下划线）'); if (!name) return;
      var pw = prompt('初始密码（至少 6 位）'); if (!pw) return;
      var role = confirm('设为管理员？（确定=管理员，取消=普通用户）') ? 'admin' : 'user';
      api('/api/admin/users', { method: 'POST', body: JSON.stringify({ username: name, password: pw, role: role }) })
        .then(function (res) { if (res.ok) loadUsers(); else alert(res.d.error || '创建失败'); });
    };
    view.querySelectorAll('button[data-act]').forEach(function (b) {
      b.onclick = function () {
        var id = b.dataset.id, act = b.dataset.act;
        if (act === 'reset') {
          var pw = prompt('输入新密码（至少 6 位）'); if (!pw) return;
          api('/api/admin/users/' + id + '/reset', { method: 'POST', body: JSON.stringify({ password: pw }) })
            .then(function (res) { if (res.ok) alert('密码已重置'); else alert(res.d.error || '失败'); });
        } else if (act === 'ban') {
          if (!confirm('封禁该用户？')) return;
          api('/api/admin/users/' + id + '/ban', { method: 'POST' }).then(function (res) { if (res.ok) loadUsers(); else alert(res.d.error || '失败'); });
        } else if (act === 'unban') {
          api('/api/admin/users/' + id + '/unban', { method: 'POST' }).then(function (res) { if (res.ok) loadUsers(); else alert(res.d.error || '失败'); });
        } else if (act === 'del') {
          if (!confirm('永久删除该用户？（评论将保留为匿名）')) return;
          api('/api/admin/users/' + id, { method: 'DELETE' }).then(function (res) { if (res.ok) loadUsers(); else alert(res.d.error || '失败'); });
        }
      };
    });
  });
}

function articleForm(article) {
  article = article || {};
  return '<div class="panel"><div style="display:flex;justify-content:space-between;align-items:center"><b>' + (article.slug ? '编辑文章' : '新建文章') + '</b>' +
    '<button class="btn ghost" id="cancelArt">取消</button></div>' +
    '<div class="row2"><div><label>slug（post-N 或 post-N-en）</label><input id="f_slug" value="' + esc(article.slug || '') + '" ' + (article.slug ? 'readonly' : '') + '></div>' +
    '<div><label>语言</label><input id="f_lang" value="' + esc(article.lang || 'zh') + '" readonly></div></div>' +
    '<label>标题</label><input id="f_title" value="' + esc(article.title || '') + '">' +
    '<div class="row2"><div><label>日期</label><input id="f_date" value="' + esc(article.date || '') + '" placeholder="2025-07-02"></div>' +
    '<div><label>分类</label><input id="f_cat" value="' + esc(article.category || '') + '"></div></div>' +
    '<div class="row2"><div><label>作者</label><input id="f_author" value="' + esc(article.author || '') + '"></div>' +
    '<div><label>封面图 URL（可选）</label><input id="f_cover" value="' + esc(article.cover || '') + '"></div></div>' +
    '<label>摘要</label><input id="f_excerpt" value="' + esc(article.excerpt || '') + '">' +
    '<label>正文（HTML）</label><textarea id="f_content">' + esc(article.content || '') + '</textarea>' +
    '<div style="margin-top:12px"><button class="btn" id="saveArt">保存</button> <span class="err" id="artErr"></span></div></div>';
}
function loadArticles() {
  api('/api/admin/articles').then(function (r) {
    if (!r.ok) return (view.innerHTML = '<div class="card">加载失败</div>');
    var rows = r.d.articles || [];
    var html = '<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><b>文章（' + rows.length + '）</b>' +
      '<button class="btn" id="newArt">+ 新建文章</button></div>' +
      '<table><thead><tr><th>slug</th><th>语言</th><th>标题</th><th>日期</th><th>分类</th><th>操作</th></tr></thead><tbody>';
    rows.forEach(function (a) {
      html += '<tr><td>' + esc(a.slug) + '</td><td>' + esc(a.lang) + '</td><td>' + esc(a.title) + '</td><td>' + esc(a.date) + '</td><td>' + esc(a.category) + '</td>' +
        '<td style="white-space:nowrap"><button class="btn ghost" data-edit="' + esc(a.slug) + '">编辑</button> ' +
        '<button class="btn danger" data-del="' + esc(a.slug) + '">删除</button></td></tr>';
    });
    html += '</tbody></table></div>';
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
        api('/api/admin/articles/' + b.dataset.del, { method: 'DELETE' }).then(function (res) { if (res.ok) loadArticles(); else alert(res.d.error || '失败'); }); };
    });
  });
}
function bindArtForm(slug) {
  var cancel = document.getElementById('cancelArt'); if (cancel) cancel.onclick = loadArticles;
  document.getElementById('saveArt').onclick = function () {
    var err = document.getElementById('artErr');
    var payload = {
      slug: document.getElementById('f_slug').value.trim(),
      lang: document.getElementById('f_lang').value.trim(),
      title: document.getElementById('f_title').value.trim(),
      date: document.getElementById('f_date').value.trim(),
      category: document.getElementById('f_cat').value.trim(),
      author: document.getElementById('f_author').value.trim(),
      cover: document.getElementById('f_cover').value.trim(),
      excerpt: document.getElementById('f_excerpt').value.trim(),
      content: document.getElementById('f_content').value
    };
    if (!payload.slug || !payload.title || !payload.content) { err.textContent = 'slug/标题/正文必填'; return; }
    var p = slug ? api('/api/admin/articles/' + slug, { method: 'PUT', body: JSON.stringify(payload) })
                 : api('/api/admin/articles', { method: 'POST', body: JSON.stringify(payload) });
    p.then(function (res) { if (res.ok) loadArticles(); else err.textContent = res.d.error || '保存失败'; });
  };
}

function loadComments() {
  api('/api/admin/comments').then(function (r) {
    if (!r.ok) return (view.innerHTML = '<div class="card">加载失败</div>');
    var rows = r.d.comments || [];
    var html = '<div class="card"><b>评论（' + rows.length + '）</b><table style="margin-top:8px"><thead><tr><th>ID</th><th>thread</th><th>用户</th><th>内容</th><th>时间</th><th>状态</th><th>操作</th></tr></thead><tbody>';
    rows.forEach(function (c) {
      var st = c.status === 'visible' ? '<span class="pill visible">可见</span>' : '<span class="pill deleted">已删</span>';
      html += '<tr><td>' + c.id + '</td><td>' + esc(c.thread) + '</td><td>' + esc(c.username) + '</td><td style="max-width:320px">' + esc(c.content) + '</td><td>' + fmt(c.created_at) + '</td><td>' + st + '</td>' +
        '<td>' + (c.status === 'visible' ? '<button class="btn danger" data-del="' + c.id + '">删除</button>' : '<span class="muted">—</span>') + '</td></tr>';
    });
    html += '</tbody></table></div>';
    view.innerHTML = html;
    view.querySelectorAll('button[data-del]').forEach(function (b) {
      b.onclick = function () { if (!confirm('删除评论 ' + b.dataset.del + '？')) return;
        api('/api/admin/comments/' + b.dataset.del, { method: 'DELETE' }).then(function (res) { if (res.ok) loadComments(); else alert(res.d.error || '失败'); }); };
    });
  });
}

// 鉴权入口
api('/api/me').then(function (r) {
  if (!r.ok || r.d.role !== 'admin') {
    document.getElementById('gate').innerHTML = '<div class="card" style="color:#fff;text-align:center">无权限：仅管理员可访问。<a href="/login?redirect=%2Fadmin" style="color:#fff">前往登录</a></div>';
    return;
  }
  document.getElementById('app').style.display = 'block';
  show('stats');
}).catch(function () {
  document.getElementById('gate').innerHTML = '<div class="card" style="color:#fff;text-align:center">加载失败，请刷新。</div>';
});
</script>
</body></html>`);
}

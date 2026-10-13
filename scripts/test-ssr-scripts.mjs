// 防回归：SSR 页面（sso.tstc.pp.ua 下的 admin/account/login/register/reset-password）
// 输出的 inline script 必须语法合法。
//
// 背景：2026-10-13 线上事故——「全部清除」confirm 文案里的 \n 写在 admin.js 的
// 模板字符串中，输出时被求值为真实换行符，截断 inline script 的 JS 字符串字面量，
// 浏览器整块 script 解析失败（Invalid or unexpected token），管理后台只剩 SSR
// 框架、内容区全白。node --check 只能查 admin.js 自身语法，查不出「求值后」
// 的产物，故用本测试直接渲染页面并编译检查 inline script。
//
// 运行：node scripts/test-ssr-scripts.mjs
import { onRequest as adminPage } from '../functions/admin.js';
import { onRequest as accountPage } from '../functions/account.js';
import { onRequest as loginPage } from '../functions/login.js';
import { onRequest as registerPage } from '../functions/register.js';
import { onRequest as resetPage } from '../functions/reset-password.js';

let pass = 0, fail = 0;
function check(name, cond, extra) {
  if (cond) { pass++; console.log('PASS | ' + name); }
  else { fail++; console.log('FAIL | ' + name + (extra ? ' | ' + extra : '')); }
}

const PAGES = [
  ['admin', adminPage],
  ['account', accountPage],
  ['login', loginPage],
  ['register', registerPage],
  ['reset-password', resetPage],
];

// 用 new Function 仅编译不执行：抓语法错误（含字符串被真实换行截断这类），
// 不触碰 document/fetch 等浏览器 API。
function compileScript(code) {
  try { new Function(code); return null; } catch (e) { return e.message; }
}

for (const [name, handler] of PAGES) {
  // host 必须是 SSO_HOST 才会渲染页面（否则 302 回 sso）
  const ctx = {
    request: new Request('https://sso.tstc.pp.ua/' + name, { headers: { host: 'sso.tstc.pp.ua' } }),
    env: {},
  };
  let res, html;
  try { res = await handler(ctx); html = await res.text(); }
  catch (e) { check(name + '：页面渲染不抛错', false, e.message); continue; }
  check(name + '：页面渲染不抛错', true);

  const isHtml = (res.headers.get('content-type') || '').includes('text/html');
  check(name + '：返回 HTML（非重定向）', res.status === 200 && isHtml, 'status=' + res.status);

  const scripts = [...html.matchAll(/<script(?![^>]+src)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  check(name + '：含 inline script', scripts.length > 0, 'blocks=' + scripts.length);

  scripts.forEach((code, i) => {
    const err = compileScript(code);
    check(`${name}：inline script #${i + 1} 语法合法`, err === null, err || '');
  });

  // 直接复现本次事故形态：script 源码中不得出现「引号字符串内嵌真实换行」的
  // 常见信号——单引号字符串跨行。用括号配平+逐行扫描近似检测：
  // 统计每行是否处于「未闭合的单引号」状态（排除注释与正则的误报可接受，
  // 本项目的 inline script 均为简单字符串拼接，无误报）。
  const joined = scripts.join('\n');
  let inSingle = false, badLine = -1;
  const lines = joined.split('\n');
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    for (let ci = 0; ci < line.length; ci++) {
      const ch = line[ci];
      if (ch === '\\') { ci++; continue; }
      if (ch === "'") inSingle = !inSingle;
    }
    if (inSingle) { badLine = li + 1; break; }
  }
  check(name + '：无未闭合的单引号字符串（真实换行截断检测）', badLine === -1,
    badLine > 0 ? '第 ' + badLine + ' 行起字符串未闭合' : '');
}

console.log(`\n结果：${pass} 通过，${fail} 失败`);
process.exit(fail ? 1 : 0);

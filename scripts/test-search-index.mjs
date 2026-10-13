// 动态搜索索引单测：
// 1) _lib/article.js 的 htmlToText / searchEntryUrl 助手；
// 2) assets/main.js 中 loadSearchIndex 的真实代码（从源文件提取后以 mock fetch/window 执行），
//    验证「静态 + 动态按 url 合并、动态覆盖同名、吧友文章新增、动态失败降级、结果缓存」。
// 运行：node scripts/test-search-index.mjs
import fs from 'node:fs';
import path from 'node:path';
import { htmlToText, searchEntryUrl } from '../functions/_lib/article.js';

let pass = 0, fail = 0;
function check(name, cond, detail = '') {
  if (cond) { pass++; console.log(`PASS | ${name}`); }
  else { fail++; console.log(`FAIL | ${name} ${detail}`); }
}

// ── 助手函数 ────────────────────────────────────────────────
console.log('== htmlToText ==');
check('剔除标签与脚本/样式',
  htmlToText('<p>你好<strong>世界</strong></p><script>alert(1)</script><style>.a{color:red}</style>') === '你好 世界',
  JSON.stringify(htmlToText('<p>你好<strong>世界</strong></p><script>alert(1)</script><style>.a{color:red}</style>')));
check('解码常见实体',
  htmlToText('a &amp; b &lt;c&gt; &quot;d&quot; &#39;e&#39; &nbsp;f') === 'a & b <c> "d" \'e\' f',
  JSON.stringify(htmlToText('a &amp; b &lt;c&gt; &quot;d&quot; &#39;e&#39; &nbsp;f')));
check('压缩连续空白与换行',
  htmlToText('  多行\n\n  文本\t\t 混合   ') === '多行 文本 混合',
  JSON.stringify(htmlToText('  多行\n\n  文本\t\t 混合   ')));
check('空内容返回空串', htmlToText('') === '' && htmlToText(null) === '' && htmlToText(undefined) === '');
check('文章正文（含图片/链接）提取纯文本',
  htmlToText('<div class="article-content"><img src="/a.png"><p>第一段</p><a href="/x">链接</a></div>') === '第一段 链接',
  JSON.stringify(htmlToText('<div class="article-content"><img src="/a.png"><p>第一段</p><a href="/x">链接</a></div>')));

console.log('== searchEntryUrl ==');
check('新闻 post-N → news/post-N.html（与静态索引同名，供覆盖）', searchEntryUrl('post-17') === 'news/post-17.html', searchEntryUrl('post-17'));
check('英文新闻 post-N-en → news/post-N-en.html', searchEntryUrl('post-17-en') === 'news/post-17-en.html', searchEntryUrl('post-17-en'));
check('吧友文章 ua-N → user-articles/N（无静态页，作为新条目）', searchEntryUrl('ua-19') === 'user-articles/19', searchEntryUrl('ua-19'));
check('英文吧友文章 ua-N-en → user-articles/N-en', searchEntryUrl('ua-19-en') === 'user-articles/19-en', searchEntryUrl('ua-19-en'));

// ── loadSearchIndex 真实代码（从 main.js 提取执行）────────────
console.log('== loadSearchIndex（main.js 真实代码）==');
const mainSrc = fs.readFileSync(path.resolve(import.meta.dirname, '..', 'assets', 'main.js'), 'utf8');
const extracted = mainSrc.match(/let searchIndexCache = null;[\s\S]*?function loadSearchIndex\(\) \{[\s\S]*?\n    \}/);
check('从 main.js 提取到 loadSearchIndex 源码', !!extracted);
if (!extracted) {
  console.log(`\n结果：${pass} 通过，${fail} 失败`);
  process.exit(1);
}

// 静态索引 fixture：含非文章页面 + 一篇新闻外壳旧文（url 与动态条目同名）
const staticData = {
  zh: [
    { title: '关于我们', url: 'about.html', text: '站点介绍 唐山师范学院吧' },
    { title: '旧文标题（外壳）', url: 'news/post-1.html', text: '外壳里的旧正文 已过期' },
    { title: '新生指南', url: 'guide.html', text: '入学须知' },
  ],
  en: [{ title: 'About', url: 'about-en.html', text: 'site intro' }],
};
// 动态索引 fixture：同 url 新闻（最新正文）+ 吧友文章（无静态页）+ 英文新闻
const dynData = {
  zh: [
    { title: '新文标题（D1 最新）', url: 'news/post-1.html', text: 'D1 里的最新正文 社团招新' },
    { title: '我的大学第一天', url: 'user-articles/19', text: '用户发布的吧友文章 军训', tag: 'user' },
  ],
  en: [{ title: 'News One (D1)', url: 'news/post-2-en.html', text: 'latest english content' }],
};

function makeFetch(staticPayload, dynBehavior) {
  const calls = [];
  const f = (url) => {
    calls.push(url);
    if (url === '/assets/search-index.json') return Promise.resolve({ ok: true, json: () => Promise.resolve(staticPayload) });
    if (url === '/api/search-index') {
      if (dynBehavior === 'reject') return Promise.reject(new Error('network down'));
      if (dynBehavior === 'http500') return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
      return Promise.resolve({ ok: true, json: () => Promise.resolve(dynData) });
    }
    return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
  };
  f.calls = calls;
  return f;
}

function buildLoadSearchIndex(fetchMock, searchIndexUrl) {
  const factory = new Function('fetch', 'window', extracted[0] + '\nreturn loadSearchIndex;');
  return factory(fetchMock, searchIndexUrl === undefined ? {} : { __SEARCH_INDEX_URL__: searchIndexUrl });
}

(async () => {
  // 用例 1：正常合并
  let f = makeFetch(staticData, 'ok');
  let load = buildLoadSearchIndex(f);
  let merged = await load();
  const byUrl = new Map(merged.zh.map(it => [it.url, it]));
  check('静态非文章页面保留（about.html）', byUrl.has('about.html') && byUrl.get('about.html').title === '关于我们');
  check('动态新闻条目覆盖静态同名旧文（news/post-1.html 取 D1 最新正文）',
    byUrl.get('news/post-1.html').title === '新文标题（D1 最新）' && byUrl.get('news/post-1.html').text.includes('D1 里的最新正文'),
    JSON.stringify(byUrl.get('news/post-1.html')));
  check('吧友文章作为新条目加入（user-articles/19）',
    byUrl.has('user-articles/19') && byUrl.get('user-articles/19').tag === 'user');
  check('英文套合同样合并（静态 about-en + 动态 news/post-2-en）',
    merged.en.length === 2 && merged.en.some(it => it.url === 'news/post-2-en.html'));
  check('合并后 zh 共 4 条（3 静态 + 1 新增，1 条被覆盖不增量）', merged.zh.length === 4, String(merged.zh.length));
  check('使用了带版本的静态索引 URL（window.__SEARCH_INDEX_URL__）',
    f.calls.includes('/assets/search-index.json') && f.calls.includes('/api/search-index'), f.calls.join(','));

  // 用例 2：动态索引拉取失败 → 降级为仅静态索引
  f = makeFetch(staticData, 'reject');
  load = buildLoadSearchIndex(f);
  merged = await load();
  check('动态 fetch 失败时降级：仍返回静态索引且保留外壳旧文',
    merged.zh.length === 3 && byUrlOf(merged, 'news/post-1.html').text.includes('外壳里的旧正文'));

  // 用例 3：动态索引 HTTP 500 → 降级
  f = makeFetch(staticData, 'http500');
  load = buildLoadSearchIndex(f);
  merged = await load();
  check('动态返回非 ok 时降级为仅静态索引', merged.zh.length === 3 && merged.zh.every(it => !it.url.startsWith('user-articles/')));

  // 用例 4：缓存——第二次调用不再发请求
  f = makeFetch(staticData, 'ok');
  load = buildLoadSearchIndex(f);
  await load();
  const callsAfterFirst = f.calls.length;
  await load();
  check('索引只抓取一次（缓存生效）', f.calls.length === callsAfterFirst, `first=${callsAfterFirst} second=${f.calls.length}`);

  // 用例 5：静态索引拉取失败 → 整体 reject（由 runSearch 的 catch 提示用户刷新）
  f = (url) => url === '/assets/search-index.json'
    ? Promise.reject(new Error('static index 404'))
    : Promise.resolve({ ok: true, json: () => Promise.resolve(dynData) });
  load = buildLoadSearchIndex(f);
  let rejected = false;
  try { await load(); } catch { rejected = true; }
  check('静态索引失败时整体 reject（前端提示刷新重试）', rejected);

  function byUrlOf(data, url) { return data.zh.find(it => it.url === url); }
})();

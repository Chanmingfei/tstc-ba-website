# 接手提示词（对话崩溃后贴给新 AI 用的续接说明）

> 用法：新对话开头，把下面整段 + "仓库已克隆到 /workspace/tstc-ba-website，请接手" 一起发给我即可。我已通读全仓并实操过发布/删除文章，下面是所有必须知道的约定与坑。

---

## 0. 一句话背景

这是一个**唐山师范学院吧官网**的静态双语（中文 / 英文）多页站点，预编译 Tailwind、自托管 Font Awesome，部署在 Cloudflare Pages。你负责**发布/更新/删除新闻文章**，并维护"单一数据源 → 自动派生"的构建流程。

---

## 1. 仓库与部署通道（务必照此操作）

- **Gitee（主仓库，可直接 push，镜像兜底）**：`mingfei123/tstc-ba-website`，分支 `main`。
  - 永久 Token（推送用）：`d03655b0f6188c13ca4591504d5e6494`
  - 远程 URL 形如：`https://oauth2:d03655b0f6188c13ca4591504d5e6494@gitee.com/mingfei123/tstc-ba-website.git`
- **GitHub（Chanmingfei/tstc-ba-website）**：已配置为本地 `git remote add github`（token 写入远程 URL，存于本地 `.git/config`，**切勿提交到仓库**）。
  - ⚠️ **当前沙箱无法直连 GitHub**：`git push github` 稳定失败（`gnutls_handshake() failed: The TLS connection was non-properly terminated`，代理拦截 TLS）。**用户已明确指示"不用管 GitHub push"**。因此实际推送只走 Gitee：`git push origin main`。Gitee 镜像 → 自动同步 GitHub → Cloudflare 部署，所以 GitHub 最终也会更新，只是延迟同步；需要即时上 GitHub 时由用户在本地网络恢复后手动 `git push github main`。
  - 别用 `gh` CLI（同样连不上）。
- 工作目录：`/workspace/tstc-ba-website`。

### Git 操作坑（踩过）
- **cwd 不跨工具调用保持**：每条 git 命令都要前缀 `cd /workspace/tstc-ba-website &&`。
- 首次提交若报 "unable to auto-detect email"：执行
  `git config user.name "mingfei123"` 和 `git config user.email "bazhu@tstc.pp.ua"`（仓库级配置）。
- 推送：**只 `git push origin main`（Gitee）**。沙箱连不上 GitHub，别试 `git push github`（必失败，浪费时间）；用户已明确"不用管 GitHub push"。Gitee 镜像会自动同步到 GitHub 并触发 Cloudflare 部署。部署稍等片刻再在线上验证。

---

## 2. 构建流程（最关键的执行细节）

正常一条命令：`npm run build` = `build:css` + `build:critical` + `node build/generate-manifest.js`。**当前环境 `node_modules` 已就绪，`npm run build` 可直接跑通**（含 Tailwind 编译）。

> 历史注记（可能已过时）：早期沙箱缺 `node_modules` 时 `npm run build:css` 会失败，当时的兜底写法是分开跑 `npm run build:critical && node build/generate-manifest.js`。**现在不必**，若某次 `npm run build` 报 Tailwind 缺失再回到这条兜底即可。

- `build:critical`：Python 脚本，内联关键 CSS。
- `generate-manifest.js`：主脚本，抽取文章、生成清单/搜索索引、注入 OG/导航/防闪烁脚本、重写上下篇导航、生成 sitemap/robots。
- main.js 内容一变，哈希就变，脚本会自动把所有 HTML 里的 `main.js?v=xxxx` 刷新。
- 改完文章或改了 `assets/main.js`（含 `CHANGELOG_DATA`）/ `build/tailwind-input.css` 后，**必须重跑 `npm run build`** 再提交，否则清单/搜索/OG/导航/首页预览/样式都不会更新。

### generate-manifest.js 做了什么（心里有数即可）
扫描 `news/*.html` → 抽 `#articleMeta` → 生成 `news-manifest.json` / `news-manifest-en.json`、`assets/search-index.json`（中/英）、注入 OG/Twitter Card 与 sitemap、内联 `__NEWS__`/`__NEWS_EN__`/`__SEARCH_INDEX_URL__`/`__SITE_URL__`、重写 `AUTO_PREV_NEXT_*` 上下篇导航、生成 `sitemap.xml` / `robots.txt`。

---

## 3. 单一数据源原则（铁律）

每篇文章只有一个 HTML 文件（`news/post-N.html` + `news/post-N-en.html`）。**唯一可改的两处**：
1. `<script id="articleMeta" type="application/json">` 里的 JSON 元数据；
2. `<div class="article-content"> … </div>` 里的正文 HTML。

**骨架（顶部导航、AUTO_PREV_NEXT 块、页脚、脚本、`<head>` 里除 title/description 外的东西）一律不要手改**——构建脚本会自动重写导航、OG、版本号等。你只改上面两处，其余交给构建。

### #articleMeta 字段
```json
{"title":"标题","date":"2026-08-01","category":"指南","author":"唐山师范学院吧务组","excerpt":"列表卡片与分享卡片用的摘要","cover":"assets/images/xxx.jpg"}
```
- `category` 用既有分类：指南 / 公告 / 通知 / 总结 等。
- `cover` 是首页/列表卡片封面图，用 `assets/images/` 下已有图片。

---

## 4. 如何新增一篇文章（模板法）

1. 复制 `news/post-1.html` → `news/post-N.html`，同时复制 `news/post-1-en.html` → `news/post-N-en.html`（`N` 取当前最大编号 +1，如最新是 post-14 则新文章是 post-15）。
2. 只改两处：
   - `#articleMeta`（中英文各自的标题/日期/分类/作者/摘要/封面）；
   - `<div class="article-content">` 正文（按第 5 节格式写）。
3. **必须同步改 `<head>` 里的 `<title>` 和 `<meta name="description">`**（见第 5 节开头）——这是高频错误：忘了改会导致浏览器标签、OG 分享卡片、搜索结果标题都显示成被复制那篇的旧标题。
4. 跑构建（第 2 节两条命令）→ 提交 → 推送。

> 删文章反向操作：直接 `rm news/post-N.html news/post-N-en.html`，重跑构建（清单/搜索/sitemap/导航/首页预览会自动剔除，上一篇的"下一篇"自动回退为"已是最新一篇"），并清掉 `CHANGELOG.md` 与 `assets/main.js` 里 `CHANGELOG_DATA` 对该文章的条目，再提交推送。

---

## 5. 指南类文章的成文格式（用户最看重，照抄）

这是"排版基因"，来自对 `post-6/7/9/11/13/14`（新生指南系列）的逐篇研读。用户给的 AI 生成文案**排版往往不同**，你的工作就是**把它重排成下面这套格式并强调重点**，而不是直接粘贴。

### 5.1 开头
- 1–2 段：先点明新生痛点，再一句"本篇把 … 一次性整理清楚，配合《校园卡》《公共浴室》等指南一起看，帮你 …"。口语化、在校实测感，直接对"新生"说话。

### 5.2 标题层级
- 大节用 `## 一、二、三、`（h2）；小节用 `### 1. 2.` 或 `### （一）（二）`（h3）细分。不要一坨平铺。

### 5.3 内容载体（按场景选用）
- **描述列表**：`<ul>`/`<ol>` 里用 `<li><strong>标签：</strong>描述</li>`（参考 post-7/9/11）。
- **步骤流程**：`<ol>` 编号步骤，可夹图（参考 post-13 的充值步骤）。
- **表格**：需要罗列参数时用
  ```html
  <div class="overflow-x-auto my-4">
    <table class="w-full text-sm border-collapse border border-gray-300">
      <thead><tr class="bg-gray-100">
        <th class="border border-gray-300 px-3 py-2 text-left">列1</th> … </tr></thead>
      <tbody><tr><td class="border border-gray-300 px-3 py-2">…</td> … </tr></tbody>
    </table>
  </div>
  <p class="text-xs text-gray-500">注：…以馆内公告为准。</p>
  ```
  （参考 post-13 收费标准表、post-15 开放时间表）
- **双图并排**：`<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">` 包两个 `<figure>`（参考 post-11）。

### 5.4 图片（强制写法）
一律用 `<figure>`，**图片说明前不要加 ▲ 之类的三角标记**（既有文章都没有）：
```html
<figure class="text-center my-6 md:max-w-xl mx-auto">
  <img src="../assets/images/xxx.jpg" alt="描述" class="w-full h-auto rounded-lg shadow-sm" style="margin:0" loading="lazy">
  <figcaption class="text-xs text-gray-500 mt-2">图片说明文字</figcaption>
</figure>
```

### 5.5 蓝色提示框（重点强调用）
涉及**提示 / 提醒 / 注意事项**的语句，用蓝色左边框提示框框出（浅灰底 + 蓝左边框，`border-primary` 即品牌蓝）：
```html
<p class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4">
  <strong>温馨提示：/ 小提示：/ 提醒：/ 重要提醒：</strong>具体提醒语句
</p>
```
- 可含**嵌套列表**（参考 post-13「重要提醒」、post-15「占座规则提醒」）：
  ```html
  <div class="bg-gray-50 border-l-4 border-primary px-4 py-3 rounded-r-lg my-4">
    <p class="mb-2"><strong>占座规则提醒：</strong></p>
    <ul class="list-disc ml-5 mb-0"><li>…</li><li>…</li></ul>
  </div>
  ```
- 框的是"语句"不是整段；普通说明文字仍用普通 `<p>`。

### 5.6 引用块
单个核心提醒/金句用 `<blockquote>`（参考 post-9「重点避雷」、post-15 收尾金句）。

### 5.7 文末固定结构（顺序不能错）
1. **署名行**（放在二维码"之前"）：
   - 中文：`<p>唐山师范学院吧务组<br>2026年8月1日</p>`
   - 英文：`<p>TSNU Bar Mod Team<br>2026-08-01</p>`
2. **新生群二维码**（指南类文章必须有）：
   ```html
   <figure class="text-center my-6">
     <img src="../assets/images/qq-group-qr.jpg" alt="唐山师范学院吧QQ迎新群二维码"
          class="rounded-lg shadow-sm" style="max-width:320px;width:100%;display:block;margin:0 auto" loading="lazy">
     <figcaption class="text-xs text-gray-500 mt-2">扫码加入唐山师范学院吧 QQ 迎新群</figcaption>
   </figure>
   ```

### 5.8 中英双语对应
- 必须有 `post-N.html` + `post-N-en.html`，**结构一一对应**：相同章节、相同表格、相同提示框、相同署名行、相同二维码。
- 英文标题若含 `&`，HTML 里写 `&amp;`（如 `Freshman Guide (10) – Library &amp; Study Rooms`）；构建脚本注入 OG 时会先解码再转义，不会二次转义。

---

## 6. 搜索索引须知（用户曾因这个报错）

- 全站搜索数据在 `assets/search-index.json`（含 `zh` / `en` 两套），由 `generate-manifest.js` 从每页 `<main>` 抽取纯文本生成。
- **搜索结果展示的标题来自 `#articleMeta` / `<title>`**。如果忘了改 `<title>`（见 4.3），线上搜出来的标题会是被复制那篇的旧标题——用户会误以为"文章没进搜索库"。**所以新增文章后务必确认 `<title>` 已改对，并重跑构建。**
- 构建会给 `search-index.json` 打版本号并写进 HTML 的 `?v=` 查询串做缓存刷新；若线上搜索偶发"搜不到新文章"，多为 CDN 缓存了旧索引，新版本号会自动失效旧缓存。

---

## 7. 已修过的构建脚本 Bug（心里有数，一般不用再动）

- **OG 标题双重转义**：标题含 `&` 时，旧逻辑会把 `&amp;` 再转义成 `&amp;amp;`（post-7-en 也中过招）。已在 `generate-manifest.js` 的 OG 注入前加 `decodeEntities()` 解码再转义，已修复。若再看到 `&amp;amp;`，就是这处没生效。

---

## 8. 用户的工作流偏好（务必遵守）

- 用户后续更新文章时，可能会发来**他用 AI 辅助生成的文案，且排版与站内不一致**。
- 你的任务：**把这份文案重新排版、按第 5 节格式整理、对重点做强调（用蓝色提示框 / 加粗 / 列表），然后走第 4 节流程上线**。不要原样粘贴。
- 用户重视"格式统一"：同一类内容（指南）的版式、提示框样式、图片说明、署名行、二维码必须前后一致。
- 测试性质的文章（事实未经核实）在用户确认流程后会被删除——删除按第 4 节"反向操作"走，保持仓库干净。
- **效率（重要）**：流程已熟悉，**新增/删除文章时直接执行，不要重复逐篇研读格式、不要做冗余的多轮验证**。标准动作：编辑两个文件 → 跑 `npm run build:critical && node build/generate-manifest.js` → `git add -A` → commit → `git push origin main`。构建脚本已验证可靠，跑完即视为正确；只在构建报错或线上异常时才排查。能合并的命令一次性合并，减少来回。

---

## 9. 快速检查清单（每次发文章前过一遍）

- [ ] 复制模板，只改 `#articleMeta` 与 `.article-content`
- [ ] `<head>` 的 `<title>` 和 `<meta name="description">` 已改成新文章（非模板旧标题）
- [ ] 章节用 `## 一、` + `### 1.` 层级
- [ ] 图片均为 `<figure><figcaption>`，无 ▲ 三角标记
- [ ] 提示/提醒语句用了蓝色提示框；重点用 `<strong>` / 列表强调
- [ ] 文末顺序：署名行 → 新生群二维码
- [ ] 中英两版结构对应
- [ ] 跑过 `npm run build:critical && node build/generate-manifest.js`
- [ ] `git add -A` → commit → `git push origin main`
- [ ] （删除场景）已清 `CHANGELOG.md` 与 `main.js` 的 `CHANGELOG_DATA` 相关条目

---

## 10. 关键文件速查

| 文件 | 作用 |
|---|---|
| `news/post-N.html` / `post-N-en.html` | 文章本体（只改 `#articleMeta` + `.article-content`） |
| `build/generate-manifest.js` | 主构建脚本：清单/搜索/OG/导航/sitemap |
| `build/build-critical-css.py` | 关键 CSS 内联 |
| `build/tailwind.config.js` | Tailwind 配置（沙箱无 CLI，跳过） |
| `assets/main.js` | 前端逻辑（搜索/分享/灯箱/导航/CHANGELOG_DATA）；改它哈希会变 |
| `assets/search-index.json` | 全站搜索数据（构建生成） |
| `news-manifest.json` / `news-manifest-en.json` | 新闻清单（构建生成） |
| `CHANGELOG.md` + `assets/main.js` 的 `CHANGELOG_DATA` | 更新日志，需保持同步 |
| `assets/images/qq-group-qr.jpg` | 新生群二维码（指南文末固定用） |
| `build/tailwind-input.css` | **所有 CSS 的唯一编辑入口**（含暗色模式、`[data-theme="dark"]` 覆盖、开关伪元素、白色阴影等）；改完必须 `npm run build` |
| `build/inject-theme.js` | 防首屏闪烁脚本；把读 `localStorage`/`prefers-color-scheme` 设 `data-theme` 的 `<script>` 注入每个 HTML 的 `<head>` 首位（幂等，可重复跑） |
| `assets/images/`（README 配图） | 手动维护的 8 张展示图（见下）；README 引用，勿删；重新截图后才提交替换 |

---

## 11. 近期功能迭代小结（截至 2026-08-03，接手即知状态）

这些不是"发文章"主线，但已落地并会影响后续改动，新对话先读这节：

1. **全站暗色模式 + 昼夜滑动开关**（导航栏内置，纯 CSS 太阳/月亮伪元素，参考 SegmentFault「单标签日夜间切换」，严格按原文 220×90 ×0.309 = 68×28 实现，**尺寸/坐标要等比重算**）。状态由 `html[data-theme="dark"]` 驱动（无 JS 切换 class）。
2. **暗色适配三处打磨**：① 卡片/阴影在暗色背景不可见 → 改为白色光晕（`rgba(255,255,255,…)`），尺寸/动画不变；② 搜索弹窗输入框聚焦变白 → 加暗色覆盖；③ 夜间开关凹陷感加强（`inset` 阴影对比度调高）。
3. **QZone 分享图标去白底**：内联 SVG 删掉 `<rect fill="#FFFFFF"/>`，亮色按钮白底仍能透出原观感，暗色不再有白块。
4. **README 重写成「技术 + 配图」双线**：新增「设计与视觉展示」章节，`images/` 下 8 张图（preview-light/dark、toggle-light/dark、cards-light、search-light/dark、mobile-dark），用表格左右对照亮/暗。搜索配图是**按 Enter 触发出结果**后截的。
5. **全站液态玻璃（Liquid Glass）设计层**（2026-08-03 重大更新，参考 iOS 26）：`build/tailwind-input.css` 的 `:root` 新增 `--glass-bg/-border/-highlight/-shadow/-blur` 令牌，`§5.5` 区块统一实现「半透明表面 + `backdrop-filter:blur() saturate()` 折射模糊 + 白色高光边框 + 内发光」。覆盖：顶栏工具（搜索/汉堡）、主按钮/胶囊 CTA、返回顶部、分享浮标、幽灵按钮。两点易踩的坑：① **品牌色按钮要保色**——二维码按钮（微信绿/小红书红/QQ蓝）必须用 ID 显式保留原色再叠玻璃，否则会被幽灵按钮规则覆盖成透明玻璃、白字看不见；② **分享主按钮 / 返回顶部刻意用白色毛玻璃 + 品牌色图标**（不能用品牌蓝渐变当背景，否则玻璃看不出变化）。平台色按钮与弹窗玻璃写法见 `§5.5` 与 `§7`。
6. **移动端顶栏单行修复**（2026-08-03）：`§3` 的 `@media (max-width:767px)` 块里，`flex-wrap:nowrap` + 缩按钮尺寸（搜索/汉堡 38px、主题切换 `scale(0.85)`、Logo 32px、标题 18px 且去省略号），保证 390px 屏搜索/主题切换/汉堡正常尺寸同一行。桌面/移动端顶栏搜索按钮均 `border-radius:50%` + 38px 正圆。
7. **卡片液态玻璃化**（2026-08-03）：统一的卡片类 `.card-hover`（`build/tailwind-input.css` §4）已改为磨砂玻璃——半透明白渐变 + `backdrop-filter: blur(16px) saturate(160%)` + 白色高光描边 + 内发光，自动覆盖全站卡片（快捷链接、吧务组公示、新闻预览/列表、文章页相关阅读）；暗色同步为深半透明玻璃。坑：新闻页列表卡片由 `main.js` 模板（约 line 1454）生成、原本不带 `card-hover`（用的是 `bg-white` 普通类），已在 `className` 显式补 `card-hover` 才会变玻璃——以后新增新闻卡样式务必带上 `card-hover`。页面另加一层极淡渐变底色（`body` 的两个 radial + 纵向 linear），让玻璃卡片产生可见折射层次。
8. **液态玻璃质感再强化 + 风格统一**（2026-08-04）：玻璃令牌整体提升（背景透明度、高光边框、内发光、阴影、模糊 / 饱和度），并为 `.liquid-glass`、顶栏工具、主按钮 / CTA、幽灵按钮、平台色按钮、卡片、弹窗统一叠加左上镜面高光；首页头部搜索框 `.search-container` 也改为玻璃药丸，导航栏 `.glass-effect` 顶部增加玻璃高光边线，暗色用更柔和的白光（`rgba(255,255,255,.22)`），保持玻璃轮廓但不刺眼。

8. **液态玻璃继续统一（2026-08-04 续）**：文章内 tip / callout 提示框（`.article-content .bg-gray-50.border-l-4`）与「关于我们」主内容卡（`.bg-white.rounded-xl.shadow-md.border-l-4`）从实心底色改为液态玻璃，保留左侧品牌色强调边；均用 CSS 规则实现，不必逐个改文章 HTML。仍未玻璃化的大面：文章阅读卡（`.article-content` 外层 `bg-white`）有意保留实白以保证长文阅读对比，暂未玻璃化。
9. **顶栏通透度 + 搜索框统一 + 夜间按钮柔化（2026-08-04 续二）**：① 导航栏 `--nav-bg` 背景透明度下调（亮色 `.72→.58`、暗色 `.72→.42`），顶部高光边线（`.glass-effect` / `.nav-shadow` 的 `inset 0 1px 0`）同步减弱，顶栏更通透、更贴合液态玻璃半透明质感，**夜间尤其明显**；② 夜间模式按钮边缘与光影柔化——导航工具按钮（搜索/汉堡/主题）、`.bg-primary`/`.bg-secondary` CTA、幽灵按钮、平台色按钮（微信/小红书/QQ）、分享浮标（`#backToTop` / `#shareFab .share-toggle` / `.share-btn`）统一把背景降到 `rgba(30,34,44,.45)`、收窄边框（`rgba(255,255,255,.12~.22)`）、改用更柔和的内外阴影；③ 顶栏圆型按钮（搜索/汉堡）夜间默认质感调整为「被选中」的平铺雾化白 `rgba(255,255,255,.1)`（无渐变），与展开菜单时汉堡的干净 frosted 质感一致，悬停 `.16`。改动在 `build/tailwind-input.css`。
10. **首页搜索框 + 灯箱液态玻璃统一（2026-08-04 续三）**：① 首页 Hero 搜索框内 `.search-container .search-button` 改为液态玻璃按钮（品牌色渐变 + 左上镜面高光 + 折射模糊 + 白色高光边框 + 内发光），与玻璃容器同为玻璃语言；日夜结构统一，暗色占位符颜色同步适配。② 灯箱内左右切换箭头、关闭、下载按钮全部改为 frosted 液态玻璃质感（样式在 `assets/main.js` 的 `lightboxNavStyle` 注入字符串中自包含，不依赖构建链路）。③ 灯箱右下角新增 `.lb-caption` 液态玻璃卡片，读取当前图片 `alt` 作为描述，无描述时隐藏。改 `main.js` 后必须 `npm run build`，并同步 CHANGELOG.md / README.md / main.js 的 `CHANGELOG_DATA`。

> 本次会话还清理了 `/tmp` 下所有验证用截图/脚本（不进仓库，随手删即可）；仓库 `images/` 仅保留 README 引用的 8 张，无冗余。

---

## 12. 易出 bug 的地方（暗色模式 & 组件，重点看护）

> 这条是**高优先级**：新增/修改任何组件，都要先在暗色模式下自查一遍下面这些点。

1. **暗色下黑色阴影看不见**：Tailwind 默认 `shadow-*` 是黑色投影，落在深色背景上完全消失，卡片像"没边框"。凡新增带阴影的组件，必须补 `[data-theme="dark"] .xxx{box-shadow:0 … rgba(255,255,255,…)}`（白色光晕，尺寸与原阴影一致），已有模式：`.card-hover:hover`、`.nav-shadow`、`#backToTop`、`#shareFab .share-btn`、`--card-shadow`。
2. **可聚焦控件 `focus:bg-white` 在暗色变白块**：搜索弹窗 `openSearchModal` 里的 `#searchModalInput` 曾因 `focus:bg-white` 在暗色下聚焦变白。凡用 `focus:bg-white`/`bg-white` 的可输入/可聚焦控件，暗色下都要显式覆盖（如 `[data-theme="dark"] #searchModalInput:focus{background:var(--surface-2)}`）。
3. **内联 SVG 硬编码白底**：QZone 图标就是教训——`<rect fill="#FFFFFF"/>` 在暗色分享按钮上变成突兀白方块。凡是手绘/内联 SVG 图标（分享面板、旗帜、logo 等），暗色下要检查有无硬编码白底，能透明就透明。
4. **昼夜开关的状态绑定方式**：开关外观全靠 `::before`（太阳/月亮）/`::after`（云朵/光晕）伪元素 + `html[data-theme="dark"]` 下覆盖 `box-shadow`/`background`。**不要**引入 JS 给开关加 class 切换。改暗色适配时注意：原 SegmentFault 代码里的 `#ffe`/`#ddd` 高光边在暗色会变成一圈白环；原 `#333`/`#665613` 太阳阴影会让月亮变黑洞——这些都要在暗色分支重算。改尺寸务必等比重算所有坐标（基准缩放系数 0.309）。
5. **README 配图漏触发交互**：用 Playwright 截搜索弹窗时，只 `fill('关键词')` 不 `press('Enter')`，结果区是空的（用户曾指出）。搜索截图必须 Enter 出结果再截。
6. **Playwright 视口选择器可见性**：桌面端 `#navSearchBtn` 与移动端专属 `#mobileTopSearchBtn` 在不同视口下一方 `display:none`，脚本点隐藏元素会 "element is not visible" 超时。桌面视口用 `#navSearchBtn`，移动布局用移动上下文捕获。验证暗色主题用 `addInitScript` 设 `localStorage.theme='dark'` 再 reload，别靠点开关。
7. **构建产物一致性**：改 `assets/main.js`（含 `CHANGELOG_DATA`）或 `build/tailwind-input.css` 后**必须 `npm run build`**，否则 HTML 里 `main.js?v=` 哈希、内联 OG、关键 CSS、防闪烁脚本都不过新，线上看着像"没生效"。
8. **液态玻璃（Liquid Glass）保色与可见性**：① 品牌色按钮（微信/小红书/QQ 二维码按钮、`.bg-primary`/`.bg-secondary` CTA）必须保留原色再叠玻璃——按 ID 或带品牌类的选择器显式设 `background`，别让通用 `.rounded-full:not(.bg-primary):not(.bg-secondary)` 幽灵规则把它们变透明白底（否则白字看不清）；用 `color-mix(in srgb, <品牌色> 88%, transparent)` 做玻璃化渐变，配 `backdrop-filter` + 白色高光边框。② 分享主按钮/返回顶部若用品牌蓝渐变作背景，玻璃几乎看不出变化——改用白色毛玻璃（`rgba(255,255,255,.5)` + 左上 85% 白色高光渐变 + `blur(22px) saturate(180%)`）+ 品牌色图标，质感才明显。③ 分享 FAB 的样式由 `assets/main.js` 在运行时**注入一段 `<style id="shareWidgetStyle">`**，改分享按钮外观要同时改 `build/tailwind-input.css` 的 `#shareFab .share-toggle/.share-btn` 与 `main.js` 里的注入字符串，且注入样式与 CSS 同特异性、 后者顺序可能覆盖——两边都要改到位。④ 暗色下这些玻璃按钮用 `rgba(30,34,44,.55)` + 白色高光内发光，避免白底突兀。⑤ 卡片玻璃走 `.card-hover` 单一来源：改卡片外观只动 `.card-hover`（含 `[data-theme="dark"] .card-hover`），别在 HTML 里给卡片另加 `bg-white`/`shadow-*` 期望覆盖——`.card-hover` 在编译产物中排在 Tailwind 工具类之后，会覆盖它们；新闻页列表卡由 `main.js` 模板生成，必须显式带 `card-hover` 类名，否则仍是普通白卡。⑥ 新增玻璃表面时记得统一叠左上镜面高光（`linear-gradient(150deg, rgba(255,255,255,.5) …)`），保持一套设计语言。⑦ 搜索框 `.search-container` 现在是玻璃药丸：亮色走 `var(--glass-bg)` + `var(--glass-blur)`，暗色要覆盖 `background-color` 为深半透明并保留 `backdrop-filter`；内部 `.search-input` 在暗色下应透明，否则会出现实心方块盖住玻璃。⑧ 导航栏 `.glass-effect` 已加顶部内发光高光；滚动状态 `.nav-shadow` 也要保留该高光，避免滚动后玻璃顶边突然变平。

---

## 13. 用户的协作习惯与反馈风格（务必顺毛）

- **用截图提问题**：用户经常上传现象截图（白底突兀、阴影看不见、开关有 bug…）。先看清图再动手，必要时自己也用 Playwright 截同样场景核对。
- **要"忠实照搬"，不要自由发挥**：当用户说"你不能直接照搬里面的代码吗？"——给完整参考实现（如 SegmentFault 开关）时，要**严格按原样**实现（统一缩放、不改 easing/配色），不要重排成"我觉得更好"的版本。
- **视觉细节较真**：对阴影、焦点态、图标白底、开关凹陷感、动画丝滑度都很敏感，要求"和预览一样"。改完最好自己截图确认再交付。
- **README 要少技术堆砌、多配图**：之前的 README 几乎全是技术方案，用户希望用截图展示组件/设计；新增功能时顺手在 README 配图说明。
- **迭代式反馈**：通常先说现象 → 看改完的图 → 再挑下一处。一次改到位比来回多轮好，但别跳过"自己核对效果"这步。
- **GitHub 直推别管**：沙箱连不上 GitHub，用户已明确"不用管 GitHub push"，只推 Gitee（`origin`）。**别在每次提交后重试 `git push github`**，那只会刷一堆 TLS 报错。
- **预览画廊不必每次重做**：验证改完效果用 Playwright 自己截图自检即可（含暗色用 `addInitScript` 设 `theme=dark` 再 reload），不必每次重生成/提交 `v2-preview.html` 画廊文件；确认无误直接提交推送。`v2-preview.html` 已存在、允许过期，不要随每次改动刷新它。
- **语言**：全程中文沟通。

---

## 14. 当前快速上手（新对话第一句可贴）

> 仓库已克隆到 `/workspace/tstc-ba-website`，请接手。背景：唐山师范学院吧官网静态双语站，Cloudflare Pages 部署。近期已做全站暗色模式 + 昼夜滑动开关、QZone 图标去白底、全站液态玻璃（Liquid Glass）设计（含 2026-08-04 多轮强化：统一左上镜面高光、搜索框玻璃 + 搜索按钮液态玻璃化、导航栏玻璃顶边、顶栏通透度提升、灯箱控制按钮与描述卡片液态玻璃化、夜间按钮边缘与光影柔化、顶栏圆型按钮夜间默认改为被选中态的平铺雾化白）、移动端顶栏单行修复、README 配图重写；发文章流程见上文第 4/5 节。注意：① 暗色模式与液态玻璃改组件时看§12 的易错点；② 推送只走 `git push origin main`（Gitee），别试 GitHub；③ 改 `main.js`/`tailwind-input.css` 后必须 `npm run build`。


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
- 首次提交若报 "unable to auto-detect email"：执行 `git config user.name "mingfei123"` 和 `git config user.email "bazhu@tstc.pp.ua"`（仓库级配置）。
- 推送：**只 `git push origin main`（Gitee）**。沙箱连不上 GitHub，别试 `git push github`（必失败，浪费时间）；用户已明确"不用管 GitHub push"。Gitee 镜像会自动同步到 GitHub 并触发 Cloudflare 部署。部署稍等片刻再在线上验证。

---

## 2. 构建流程（最关键的执行细节）

正常一条命令：

```bash
npm run build
```

它等于 `build:css` + `build:critical` + `generate-manifest` + 刷新 HTML 版本号 + sitemap/robots。**当前环境 `node_modules` 已就绪，可直接跑通**（含 Tailwind 编译）。

- `build:css`：Tailwind 从 `build/tailwind-input.css` 编译到 `assets/style.css`。
- `build:critical`：Python 脚本提取关键 CSS 并内联到每个 HTML。
- `generate-manifest.js`：主脚本，抽取文章、生成清单/搜索索引、注入 OG/导航/防闪烁脚本、重写上下篇导航、生成 sitemap/robots。
- 改完 `assets/main.js` 或 `build/tailwind-input.css` 后，**必须重跑 `npm run build`** 再提交，否则清单/搜索/OG/导航/首页预览/样式都不会更新。
- 历史兜底（现在一般不用）：若某次 Tailwind 缺失，可分开跑 `npm run build:critical && node build/generate-manifest.js`。

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

1. 复制 `news/post-1.html` → `news/post-N.html`，同时复制 `news/post-1-en.html` → `news/post-N-en.html`（`N` 取当前最大编号 +1，如最新是 post-16 则新文章是 post-17）。
2. 只改两处：
   - `#articleMeta`（中英文各自的标题/日期/分类/作者/摘要/封面）；
   - `<div class="article-content">` 正文（按第 5 节格式写）。
3. **必须同步改 `<head>` 里的 `<title>` 和 `<meta name="description">`**（见第 5 节开头）——这是高频错误：忘了改会导致浏览器标签、OG 分享卡片、搜索结果标题都显示成被复制那篇的旧标题。
4. 跑 `npm run build` → 提交 → 推送。

> 删文章反向操作：直接 `rm news/post-N.html news/post-N-en.html`，重跑构建（清单/搜索/sitemap/导航/首页预览会自动剔除，上一篇的"下一篇"自动回退为"已是最新一篇"），并清掉 `CHANGELOG.md` 与 `assets/main.js` 里 `CHANGELOG_DATA` 对该文章的条目，再提交推送。

---

## 5. 指南类文章的成文格式（用户最看重，照抄）

这是"排版基因"，来自对 `post-6/7/9/11/13/14/15/16`（新生指南系列）的逐篇研读。用户给的 AI 生成文案**排版往往不同**，你的工作就是**把它重排成下面这套格式并强调重点**，而不是直接粘贴。

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
- **效率（重要）**：流程已熟悉，**新增/删除文章时直接执行，不要重复逐篇研读格式、不要做冗余的多轮验证**。标准动作：编辑两个文件 → `npm run build` → `git add -A` → commit → `git push origin main`。构建脚本已验证可靠，跑完即视为正确；只在构建报错或线上异常时才排查。能合并的命令一次性合并，减少来回。

---

## 9. 快速检查清单（每次发文章前过一遍）

- [ ] 复制模板，只改 `#articleMeta` 与 `.article-content`
- [ ] `<head>` 的 `<title>` 和 `<meta name="description">` 已改成新文章（非模板旧标题）
- [ ] 章节用 `## 一、` + `### 1.` 层级
- [ ] 图片均为 `<figure><figcaption>`，无 ▲ 三角标记
- [ ] 提示/提醒语句用了蓝色提示框；重点用 `<strong>` / 列表强调
- [ ] 文末顺序：署名行 → 新生群二维码
- [ ] 中英两版结构对应
- [ ] 跑过 `npm run build`
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
| `build/tailwind-input.css` | **所有 CSS 的唯一编辑入口**；改完必须 `npm run build` |
| `assets/main.js` | 前端逻辑（搜索/分享/灯箱/导航/CHANGELOG_DATA）；改它哈希会变 |
| `assets/search-index.json` | 全站搜索数据（构建生成） |
| `news-manifest.json` / `news-manifest-en.json` | 新闻清单（构建生成） |
| `CHANGELOG.md` + `assets/main.js` 的 `CHANGELOG_DATA` | 更新日志，需保持同步 |
| `assets/images/qq-group-qr.jpg` | 新生群二维码（指南文末固定用） |
| `build/inject-theme.js` | 防首屏闪烁脚本；幂等，可重复跑 |
| `v2-preview.html` | 玻璃风格预览画廊（重大视觉迭代后按需刷新） |
| `images/` | README 引用的展示图；重新截图后才替换 |

---

## 11. 当前视觉体系与近期迭代（截至 2026-08-27）

> 新对话先读这节。下面按"当前状态"组织，不是按日期流水账。

### 11.1 全站暗色模式

- 状态由 `html[data-theme="dark"]` 驱动（无 JS 切换 class）。
- 昼夜滑动开关位于顶栏右侧，纯 CSS 太阳/月亮/云朵伪元素实现，严格按 SegmentFault「单标签日夜间切换」缩放（基准 220×90 ×0.309 = 68×28）。
- 改尺寸务必等比重算所有伪元素坐标，暗色分支要重算太阳阴影/月亮高光，避免白环或黑洞。

### 11.2 玻璃体系已收敛为一套 `.box` 语言（2026-08-27 重大统一）

之前并存两套玻璃系统：`.ios-btn` / `.box`（用户提供的多内阴影 + `blur(2px)`）与 `.liquid-glass` / `--glass-*`（单一高光 + `blur(22px) saturate(190%)`）。

现在已把用户提供的 `.box` 多层内阴影提取为可复用 token：`--glass-inset`。所有玻璃表面统一指向它：

```css
/* 亮色 */
--glass-bg: rgba(255, 255, 255, .16);
--glass-border: rgba(255, 255, 255, .5);
--glass-blur: blur(22px) saturate(190%);
--glass-shadow: var(--glass-inset), 0 10px 30px rgba(0, 0, 0, .16);

/* 暗色 */
--glass-bg: rgba(30, 34, 44, .38);
--glass-border: rgba(255, 255, 255, .18);
--glass-shadow: var(--glass-inset), 0 10px 30px rgba(0, 0, 0, .5);
```

`--glass-inset` 亮色签名：

```css
inset 2px -2px 1px -1px rgba(255,255,255,.9),
inset -2px 2px 1px -1px rgba(255,255,255,.9),
inset 6px -6px 1px -6px rgba(255,255,255,.55),
inset -6px 6px 1px -6px rgba(255,255,255,.55),
inset 0 0 2px rgba(0,0,0,.8)
```

暗色签名把白边 alpha 降到 `.5/.28/.12`，避免"光感太重"。

**已覆盖的表面**：顶栏导航（`#mainNav.glass-effect` / `.nav-shadow`）、顶栏圆型工具按钮（搜索/汉堡/主题切换，日/夜均统一）、首页 Hero 搜索框及按钮、主 CTA 胶囊按钮、幽灵按钮、平台色二维码按钮（微信绿/小红书红/QQ蓝，在保留品牌色的前提下叠同一套玻璃）、分享浮标主按钮、分享浮标子按钮、返回顶部按钮、全站卡片（`.bg-white.rounded-xl.shadow-md` 与 `.border-l-4` 强调卡）、弹窗面板（搜索/二维码/反馈/更新日志）、弹窗关闭按钮（`#searchModalClose` 等 4 个）。

**新增/修改玻璃表面时的铁律**：

1. 唯一编辑入口是 `build/tailwind-input.css`。
2. 优先复用 `--glass-inset` / `--glass-bg` / `--glass-border` / `--glass-blur` / `--glass-shadow`，不要另写一套内阴影。
3. 品牌色按钮（微信/小红书/QQ/CTA）必须保留原色再叠玻璃，用 `color-mix(in srgb, <品牌色> 78~88%, transparent)` + `var(--glass-blur)` + 白色高光边框，不能让通用 `.rounded-full` 幽灵规则把它们变白底。
4. 分享主按钮与返回顶部用**中性白色玻璃** + 品牌色图标，不要再用品牌蓝渐变当背景，否则玻璃层次看不出来。
5. 分享 FAB 的样式由 `assets/main.js` 运行时注入 `<style id="shareWidgetStyle">`；改分享按钮外观时，CSS 与 JS 注入样式要同步改，否则运行时可能覆盖。
6. 卡片玻璃通过 `.bg-white.rounded-xl.shadow-md` 统一规则实现，不必改 HTML；新闻页列表卡片由 `main.js` 模板生成，要显式带 `.bg-white.rounded-xl.shadow-md`（模板已有）。
7. 弹窗面板与关闭按钮现在走同一套 `--glass-inset` + `--glass-bg` + `--glass-border`；日间面板背景更通透，夜间面板背景从实心 `rgba(30,34,44,.64)` 改为 `var(--glass-bg)`。

### 11.3 移动端顶栏

- 390px 屏保证搜索按钮 / 主题切换 / 汉堡同一行；按钮 38px 正圆、主题开关 `scale(0.85)`、Logo 32px、标题 18px 且去省略号。

### 11.4 灯箱

- 灯箱控制按钮（左右箭头、关闭、下载）为 frosted 玻璃质感；右下角 `.lb-caption` 读取图片 `alt` 作为描述，无描述隐藏，深色半透玻璃 + `text-shadow` 保证亮色图片背景可读。

### 11.5 搜索弹窗

- 桌面触发 `#searchButton` / 移动触发 `#mobileTopSearchBtn`。
- 搜索框需 `press('Enter')` 才出结果；只 `fill` 不出结果，截图会空。

### 11.6 更新日志弹窗

- 由页脚"更新日志"链接（`#changelogOpen`）触发；弹窗内容来自 `CHANGELOG_DATA`（`assets/main.js` 内）。新增文章时若要在首页"更新日志"里出现，需同步更新 `CHANGELOG_DATA` 与 `CHANGELOG.md`。

### 11.7 近期关键提交

- `c102ba0`：完成 `.box` 玻璃最终统一（分享主按钮中性化、卡片/弹窗背景更通透、弹窗关闭按钮统一玻璃）。
- `11d307d`：把顶栏/搜索/分享/返回顶部/卡片/弹窗边框先统一为 `--glass-inset`。
- `3d98c81`：分享按钮、卡片、新闻分页、返回顶部初步玻璃化。

> 历史（2026-08-03 ~ 08-05）的暗色模式、液态玻璃多轮强化、新增新生指南等详情见 `CHANGELOG.md` 与 `README.md`，本提示词不再重复堆砌。

---

## 12. 易出 bug 的地方（暗色模式 & 组件，重点看护）

> 新增/修改任何组件，都要先在暗色模式下自查一遍下面这些点。

1. **暗色下黑色阴影看不见**：Tailwind 默认 `shadow-*` 是黑色投影，落在深色背景上完全消失，卡片像"没边框"。凡新增带阴影的组件，必须补 `[data-theme="dark"] .xxx{box-shadow:0 … rgba(255,255,255,…)}`（白色光晕，尺寸与原阴影一致）。
2. **可聚焦控件 `focus:bg-white` 在暗色变白块**：搜索弹窗 `openSearchModal` 里的 `#searchModalInput` 曾因 `focus:bg-white` 在暗色下聚焦变白。凡用 `focus:bg-white`/`bg-white` 的可输入/可聚焦控件，暗色下都要显式覆盖（如 `[data-theme="dark"] #searchModalInput:focus{background:var(--surface-2)}`）。
3. **内联 SVG 硬编码白底**：QZone 图标就是教训——`<rect fill="#FFFFFF"/>` 在暗色分享按钮上变成突兀白方块。凡是手绘/内联 SVG 图标（分享面板、旗帜、logo 等），暗色下要检查有无硬编码白底，能透明就透明。
4. **昼夜开关的状态绑定方式**：开关外观全靠 `::before`（太阳/月亮）/`::after`（云朵/光晕）伪元素 + `html[data-theme="dark"]` 下覆盖 `box-shadow`/`background`。**不要**引入 JS 给开关加 class 切换。改尺寸务必等比重算所有坐标（基准缩放系数 0.309）。
5. **README/预览配图漏触发交互**：用 Playwright 截搜索弹窗时，只 `fill('关键词')` 不 `press('Enter')`，结果区是空的。搜索截图必须 Enter 出结果再截。
6. **Playwright 视口选择器可见性**：桌面端 `#navSearchBtn` 与移动端专属 `#mobileTopSearchBtn` 在不同视口下一方 `display:none`，脚本点隐藏元素会 "element is not visible" 超时。桌面视口用 `#navSearchBtn`，移动布局用移动上下文捕获。验证暗色主题用 `addInitScript` 设 `localStorage.theme='dark'` 再 reload，别靠点开关。
7. **构建产物一致性**：改 `assets/main.js` 或 `build/tailwind-input.css` 后**必须 `npm run build`**，否则 HTML 里 `main.js?v=` 哈希、内联 OG、关键 CSS、防闪烁脚本都不过新，线上看着像"没生效"。
8. **玻璃编辑后验证**：改完玻璃样式用 Playwright 无头渲染验证（日+夜），重点查：① 分享主按钮 `#shareToggle` 与返回顶部 `#backToTop` 的玻璃签名是否一致；② 卡片/弹窗背景是否仍通透（`backgroundImage` 含透明渐变，`backgroundColor` 不是实色）；③ 弹窗关闭按钮 `#searchModalClose` 是否使用了 `--glass-inset`；④ 控制台有无 JS 错误。浏览器序列化 `box-shadow` 时 `inset` 关键词在偏移量之后，正则提取时要匹配这种顺序。

---

## 13. 用户的协作习惯与反馈风格（务必顺毛）

- **用截图提问题**：用户经常上传现象截图（白底突兀、阴影看不见、开关有 bug…）。先看清图再动手，必要时自己也用 Playwright 截同样场景核对。
- **要"忠实照搬"，不要自由发挥**：当用户说"你不能直接照搬里面的代码吗？"——给完整参考实现（如 SegmentFault 开关、用户提供的 `.box` 玻璃代码）时，要**严格按原样**实现（统一缩放、不改 easing/配色），不要重排成"我觉得更好"的版本。
- **视觉细节较真**：对阴影、焦点态、图标白底、开关凹陷感、动画丝滑度都很敏感，要求"和预览一样"。改完最好自己截图确认再交付。
- **README 要少技术堆砌、多配图**：之前的 README 几乎全是技术方案，用户希望用截图展示组件/设计；新增功能时顺手在 README 配图说明。
- **迭代式反馈**：通常先说现象 → 看改完的图 → 再挑下一处。一次改到位比来回多轮好，但别跳过"自己核对效果"这步。
- **GitHub 直推别管**：沙箱连不上 GitHub，用户已明确"不用管 GitHub push"，只推 Gitee（`origin`）。**别在每次提交后重试 `git push github`**，那只会刷一堆 TLS 报错。
- **预览画廊按需刷新**：`v2-preview.html` 是玻璃风格展示画廊，重大视觉迭代后（如本次 `.box` 统一）应更新；日常小改动不必每次都刷新。可用 Playwright 自己截图自检，确认无误后随构建产物一起提交。
- **语言**：全程中文沟通。

---

## 14. 当前快速上手（新对话第一句可贴）

> 仓库已克隆到 `/workspace/tstc-ba-website`，请接手。背景：唐山师范学院吧官网静态双语站，Cloudflare Pages 部署。当前视觉体系已统一为一套 `.box` 玻璃语言（2026-08-27，`c102ba0`）：`--glass-inset` 多内阴影签名被提取为 token，顶栏 / 搜索按钮 / 分享浮标 / 返回顶部 / 卡片 / 弹窗面板 / 关闭按钮全部共享同一套玻璃签名，日间通透、夜间柔和不发白。此前已落地全站暗色模式 + 昼夜滑动开关、灯箱玻璃化、移动端顶栏单行修复、README 配图重写等。发文章流程见上文第 4/5 节。注意：① 改 `main.js`/`tailwind-input.css` 后必须 `npm run build`；② 新增玻璃组件先看 §12 的暗色自查点；③ 推送只走 `git push origin main`（Gitee），别试 GitHub。

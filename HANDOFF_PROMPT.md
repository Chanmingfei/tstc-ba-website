# 接手提示词（对话崩溃后贴给新 AI 用的续接说明）

> 用法：新对话开头，把下面整段 + "仓库已克隆到 /workspace/tstc-ba-website，请接手" 一起发给我即可。我已通读全仓并实操过发布/删除文章，下面是所有必须知道的约定与坑。

---

## 0. 一句话背景

这是一个**唐山师范学院吧官网**的静态双语（中文 / 英文）多页站点，预编译 Tailwind、自托管 Font Awesome，部署在 Cloudflare Pages。你负责**发布/更新/删除新闻文章**，并维护"单一数据源 → 自动派生"的构建流程。

---

## 1. 仓库与部署通道（务必照此操作）

- **Gitee（主仓库，可直接 push）**：`mingfei123/tstc-ba-website`，分支 `main`。
  - 永久 Token（推送用）：`d03655b0f6188c13ca4591504d5e6494`
  - 远程 URL 形如：`https://oauth2:d03655b0f6188c13ca4591504d5e6494@gitee.com/mingfei123/tstc-ba-website.git`
- **GitHub（镜像，只读来源）**：`Chanmingfei/tstc-ba-website`。**所有改动推到 Gitee 后会自动镜像到 GitHub，再由 Cloudflare Pages 自动部署**——你只需 push 到 Gitee。
- ⚠️ **沙箱网络：GitHub 的 TLS 被代理拦截，直接访问/clone GitHub 会失败。一律走 Gitee。** 也别用 `gh` CLI（未登录）。
- 工作目录：`/workspace/tstc-ba-website`。

### Git 操作坑（踩过）
- **cwd 不跨工具调用保持**：每条 git 命令都要前缀 `cd /workspace/tstc-ba-website &&`。
- 首次提交若报 "unable to auto-detect email"：执行
  `git config user.name "mingfei123"` 和 `git config user.email "bazhu@tstc.pp.ua"`（仓库级配置）。
- 推送：`git push origin main` → 自动镜像 + 部署。部署稍等片刻再在线上验证。

---

## 2. 构建流程（最关键的执行细节）

正常一条命令：`npm run build` = `build:css` + `build:critical` + `node build/generate-manifest.js`。

⚠️ **沙箱里没有 node_modules，`tailwindcss` CLI 不存在，`npm run build:css` 必失败**，导致 `&&` 链中断。**正确做法（分开跑）：**

```bash
cd /workspace/tstc-ba-website && npm run build:critical && node build/generate-manifest.js
```

- `build:critical`：Python 脚本，内联关键 CSS，沙箱内可跑。
- `generate-manifest.js`：主脚本，自带 try/catch，Tailwind 失败时沿用已提交的 `assets/style.css`，**所有注入照常完成**。
- main.js 内容一变，哈希就变，脚本会自动把所有 HTML 里的 `main.js?v=xxxx` 刷新。
- 改完文章后**必须重跑上面两条命令**再提交，否则清单/搜索/OG/导航/首页预览都不会更新。

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

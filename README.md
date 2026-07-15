# 唐山师范学院吧 · 官网（含新闻动态）

一个纯静态多页网站，无需本地编译，可直接部署到 Cloudflare Pages。

## 目录结构

```
index.html              首页（含新闻动态预览 + 关于我们入口）
news.html               新闻列表页
about.html              关于我们页面
news/post-1.html        文章详情页（示例）
news/post-2.html
news/post-3.html
news/post-4.html
news/post-5.html        文章详情页（示例）
generate-manifest.js   构建脚本：扫描 news/ 目录，生成新闻清单
news-manifest.json     新闻清单（由脚本自动生成，列表的单一数据源）
assets/style.css        全站共用样式
assets/main.js          全站共用脚本（导航、弹窗、新闻渲染等）
assets/news-version.js  清单版本号（由脚本自动生成，用于缓存击穿）
```

> 说明：`news-manifest.json` 与 `assets/news-version.js` 由 `generate-manifest.js` 在构建 / 预览时自动生成，无需手写，也不要手动修改。

## 本地预览

直接双击 `index.html` 即可在浏览器打开；若部分浏览器对本地文件有限制，可启动一个静态服务器：

```bash
# 任选其一
python3 -m http.server 8080
# 然后访问 http://localhost:8080
```

> 本地预览新闻列表前，请先运行一次 `node generate-manifest.js` 生成清单。

## 部署到 Cloudflare Pages

方式一：控制台拖拽上传
1. 本地先运行 `node generate-manifest.js`，生成 `news-manifest.json` 与 `assets/news-version.js`。
2. 登录 Cloudflare 控制台 → Pages → 「创建项目」→「直接上传」。
3. 把本目录（含 `index.html`、`news.html`、`about.html`、`news/`、`assets/`、`news-manifest.json`）整体拖入上传区。
4. 项目名称随意，「构建设置」保持默认（无需构建命令、无需输出目录）。
5. 点击「部署」，完成后会得到一个 `*.pages.dev` 域名。

方式二：连接 Git 仓库（推荐，自动同步）
1. 把这些文件推送到 GitHub / GitLab 仓库。
2. Cloudflare Pages 连接该仓库：
   - **构建命令**：填 `node generate-manifest.js`
   - **输出目录**：填 `.`（根目录）
3. 保存并部署。之后每次 `git push` 都会自动重新扫描 `news/` 并生成清单，首页与列表页随之同步。

> 说明：本站使用 Tailwind CSS Play CDN 与 Font Awesome CDN，部署后浏览器会自动加载，无需本地编译。
> 若希望生产环境去掉控制台告警、进一步提速，可将 Tailwind 改为本地构建版本（属可选项，不影响上线）。

## 新闻动态（自动同步，无需维护列表）

每篇文章是一个独立 HTML 文件（`news/post-x.html`），文件顶部有一段 `#articleMeta` 元信息（标题 / 日期 / 分类 / 作者 / 摘要）。
`generate-manifest.js` 在构建时扫描 `news/` 目录、提取元信息、生成 `news-manifest.json`；首页与新闻列表页读取该清单自动渲染卡片。
因此新增 / 修改文章**只需动 `news/` 下的 HTML 文件，不需要改任何列表文件**。

### 如何新增一篇新闻
1. 复制 `news/post-1.html` 为一个新文件，例如 `news/post-6.html`。
2. 改写正文，并修改文件顶部那段 `#articleMeta` 元信息（标题 / 日期 / 分类 / 作者 / 摘要）。
   - 首页与列表页会直接读取这段元信息，**不需要再改任何列表文件**。
3. 推送仓库：Cloudflare 会自动运行 `node generate-manifest.js` 扫描 `news/`、生成清单并重新部署，首页立即同步。

## 缓存说明

`_headers` 已配置合理的缓存策略：页面 / 脚本 / 清单只缓存 1~5 分钟，样式表缓存 1 天（兼顾加载速度与更新及时性）。
`main.js` 读取新闻清单时会自动加时间戳并禁用缓存，因此新增文章通常能在几分钟内显示，无需手动清缓存。
若偶尔仍看到旧内容，可硬刷新（Ctrl/Cmd + Shift + R），或到 Cloudflare 控制台 **Caching → Purge Everything** 清一次缓存即可。

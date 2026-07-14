# 唐山师范学院吧 · 官网（含新闻动态）

一个纯静态多页网站，无需任何构建步骤，可直接部署到 Cloudflare Pages。

## 目录结构

```
index.html              首页（含新闻动态预览）
news.html               新闻列表页
news/post-1.html        文章详情页（示例）
news/post-2.html
news/post-3.html
news/post-4.html
assets/style.css        全站共用样式
assets/main.js          全站共用脚本（导航、弹窗、新闻渲染等）
assets/news-data.js     新闻数据（单一数据源）
```

## 本地预览

直接双击 `index.html` 即可在浏览器打开；若部分浏览器对本地文件有限制，可启动一个静态服务器：

```bash
# 任选其一
python3 -m http.server 8080
# 然后访问 http://localhost:8080
```

## 部署到 Cloudflare Pages

方式一：控制台拖拽上传
1. 登录 Cloudflare 控制台 → Pages → 「创建项目」→「直接上传」。
2. 把本目录（含 `index.html`、`news.html`、`news/`、`assets/`）整体拖入上传区。
3. 项目名称随意，「构建设置」保持默认（无需构建命令、无需输出目录）。
4. 点击「部署」，完成后会得到一个 `*.pages.dev` 域名。

方式二：连接 Git 仓库
1. 把这些文件推送到 GitHub / GitLab 仓库。
2. Cloudflare Pages 连接该仓库，「构建命令」留空，「输出目录」填 `.`（根目录）。
3. 保存并部署。

> 说明：本站使用 Tailwind CSS Play CDN 与 Font Awesome CDN，部署后浏览器会自动加载，无需本地编译。
> 若希望生产环境去掉控制台告警、进一步提速，可将 Tailwind 改为本地构建版本（属可选项，不影响上线）。

## 如何新增一篇新闻

1. 复制 `news/post-1.html` 为一个新文件，例如 `news/post-5.html`，改写标题、日期、作者与正文。
2. 打开 `assets/news-data.js`，照着已有格式加一条对象（`slug` 填 `post-5`）。
3. 保存即可，新闻列表页与首页预览会自动出现这篇新文章。

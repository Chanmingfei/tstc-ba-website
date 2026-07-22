#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成并内联首屏关键 CSS（critical CSS）。

做法：
1. 从 index.html 的 body 中，截取到 id="newsPreview" 之前的所有 HTML，
   提取其中出现过的所有 class 名（首屏用到的类）。
2. 解析 assets/style.css，保留以下规则：
   - 基础/重置样式（*, html, body, :root, ::before, ::after 等）
   - 选择器中包含任一“首屏 class”的整条规则（含其 :hover / :focus 等变体）
3. 将关键 CSS 压缩后写入 assets/critical.css，并内联到每个 HTML 的 <head> 中，
   同时把完整 style.css 改为异步加载（preload + onload）。

这样首屏可立即绘制，导航栏与三条横线（汉堡按钮）无需等待完整 CSS 下载，
用户体验不变，但首屏时间大幅缩短。
"""
import os
import re
import html as html_module

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STYLE_CSS = os.path.join(ROOT, "assets", "style.css")
CRITICAL_CSS = os.path.join(ROOT, "assets", "critical.css")
INDEX_HTML = os.path.join(ROOT, "index.html")

GLOBAL_SELECTORS = {"*", "html", "body", ":root", "::before", "::after"}


def extract_first_screen_classes():
    """从 index.html 中截取首屏（到 newsPreview 之前）的 class。"""
    with open(INDEX_HTML, "r", encoding="utf-8") as f:
        content = f.read()
    # body 起始位置
    body_start = content.find("<body")
    if body_start == -1:
        body_start = 0
    # 首屏结束标记
    marker = content.find('id="newsPreview"')
    if marker == -1:
        marker = content.find('id="newsGrid"')
    if marker == -1 or marker < body_start:
        marker = len(content)
    first_screen = content[body_start:marker]
    classes = set()
    for m in re.finditer(r'class="([^"]*)"', first_screen):
        for token in m.group(1).split():
            classes.add(token.strip())
    return classes


def split_rules(css):
    """把 CSS 拆成 (selector, body) 列表，正确跳过 {} 内的内容。"""
    rules = []
    i = 0
    n = len(css)
    depth = 0
    buf = ""
    for ch in css:
        buf += ch
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                # 完整规则结束
                sel, _, body = buf.partition("{")
                body = body.rstrip("}")
                rules.append((sel.strip(), body.strip()))
                buf = ""
    return rules


def minify_rule(selector, body):
    sel = re.sub(r"\s+", " ", selector).strip()
    body = body.strip()
    body = re.sub(r"\s*([{}:;,])\s*", r"\1", body)
    body = re.sub(r";}", "}", body)
    return sel + "{" + body + "}"


def rule_should_keep(selector, first_screen):
    """判断该规则是否应保留为关键 CSS。"""
    # 全局/基础规则
    sels = [s.strip() for s in re.split(r",", selector)]
    kept_for_global = False
    for s in sels:
        bare = s.split(":")[0].split("[")[0].strip()
        if bare in GLOBAL_SELECTORS:
            kept_for_global = True
    if kept_for_global:
        return True
    # 选择器中包含首屏 class
    for s in sels:
        for m in re.finditer(r"\.([A-Za-z0-9_\\-]+)", s):
            cls = m.group(1)
            if cls in first_screen:
                return True
    return False


def build_critical():
    with open(STYLE_CSS, "r", encoding="utf-8") as f:
        full = f.read()
    first_screen = extract_first_screen_classes()
    rules = split_rules(full)
    kept = []
    for sel, body in rules:
        if rule_should_keep(sel, first_screen):
            kept.append(minify_rule(sel, body))
    critical = "".join(kept)
    with open(CRITICAL_CSS, "w", encoding="utf-8") as f:
        f.write(critical)
    return critical, len(kept)


def apply_to_html(critical):
    html_files = []
    for root, _, files in os.walk(ROOT):
        if "/node_modules" in root or "/.git" in root:
            continue
        for fn in files:
            if fn.endswith(".html"):
                html_files.append(os.path.join(root, fn))
    applied = 0
    inline_block = "<style>" + critical + "</style>"
    for path in html_files:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        # 移除已存在的首屏 critical <style> 块
        content = re.sub(r"<style>[\s\S]*?</style>", "", content, count=1)
        # 在异步 style.css 的 preload 链接之前插入内联 critical
        preload_pattern = re.compile(
            r'(<link rel="preload" href="[^"]*style\.css[^"]*" as="style"[^>]*>)',
            re.IGNORECASE,
        )
        if preload_pattern.search(content):
            content = preload_pattern.sub(
                lambda m: inline_block + "\n    " + m.group(1), content, count=1
            )
            with open(path, "w", encoding="utf-8") as f:
                f.write(content)
            applied += 1
    return applied, html_files


def main():
    if not os.path.exists(STYLE_CSS):
        print("⚠ 未找到 assets/style.css，请先运行 npm run build:css")
        return
    critical, n_rules = build_critical()
    size = len(critical.encode("utf-8"))
    print(f"▶ 生成 critical.css：{n_rules} 条规则，{size} 字节")
    applied, files = apply_to_html(critical)
    print(f"▶ 已内联到 {applied} 个 HTML 文件")


if __name__ == "__main__":
    main()

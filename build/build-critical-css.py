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
   - @media / @supports 块中命中首屏类的内部规则
   - 被保留规则 body 中实际引用到的 @keyframes
   - 固定的 ID/全局基础规则（防 FOUC）
3. 将关键 CSS 压缩后写入 assets/critical.css，并内联到每个 HTML 的 <head> 中，
   同时把完整 style.css 改为异步加载（preload + onload）。

这样首屏可立即绘制，导航栏与汉堡按钮无需等待完整 CSS 下载，
同时修复了 @media、@keyframes 及部分 ID 基础规则被丢弃导致的 FOUC。
"""
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
STYLE_CSS = os.path.join(ROOT, "assets", "style.css")
CRITICAL_CSS = os.path.join(ROOT, "assets", "critical.css")
INDEX_HTML = os.path.join(ROOT, "index.html")

GLOBAL_SELECTORS = {"*", "html", "body", ":root", "::before", "::after"}

# 这些选择器对应首屏可见的固定元素，其基础规则必须保留，避免异步 CSS 到达前 FOUC
ALWAYS_KEEP_PREFIX = (
    "#mainNav", "#mobileMenu", "#menuBackdrop", "#menuBtn",
    "#backToTop", "#shareFab", ".theme-toggle",
    ":root", "html", "body", "[data-theme",
)

# 体积告警线（字节）
SIZE_WARNING = 24 * 1024


def extract_first_screen_classes():
    """从 index.html 中截取首屏（到 newsPreview 之前）的 class。"""
    with open(INDEX_HTML, "r", encoding="utf-8") as f:
        content = f.read()
    body_start = content.find("<body")
    if body_start == -1:
        body_start = 0
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
    """把 CSS 拆成顶层规则列表，保留 @media / @supports / @keyframes / @font-face 整块。"""
    rules = []
    i = 0
    n = len(css)
    depth = 0
    buf = ""
    while i < n:
        ch = css[i]
        buf += ch
        if ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                sel, _, body = buf.partition("{")
                # 只剥掉本规则自己的那一个闭合括号。
                # 这里绝不能用 rstrip("}")：@keyframes / @media 的 body 以嵌套块
                # 结尾（"...to{opacity:1}}"），rstrip 会把嵌套块的括号一起吃掉，
                # 输出的 @keyframes 缺少闭合符，进而把后面所有规则吞进这个块里。
                if body.endswith("}"):
                    body = body[:-1]
                rules.append((sel.strip(), body.strip()))
                buf = ""
        i += 1
    return rules


def minify_css(text):
    """简单压缩：归并空白、去除注释。"""
    text = re.sub(r"/\*[^*]*\*+(?:[^/*][^*]*\*+)*/", "", text)
    text = re.sub(r"\s+", " ", text)
    text = re.sub(r"\s*([{}:;,])\s*", r"\1", text)
    text = re.sub(r";}", "}", text)
    return text.strip()


def selector_starts_with_any(selector, prefixes):
    """判断选择器（或其逗号分隔的某一部分）是否以任一 prefix 开头。"""
    for part in re.split(r",", selector):
        part = part.strip()
        for prefix in prefixes:
            if part.startswith(prefix):
                return True
    return False


def is_container_breakpoint_only(selector, body):
    """是否只是 Tailwind 的 .container 断点 max-width 规则（首屏不必需）。"""
    parts = [p.strip() for p in selector.split(",")]
    if not all(p == ".container" for p in parts):
        return False
    decls = [d.strip() for d in body.split(";") if d.strip()]
    return all(d.startswith("max-width:") for d in decls)


def rule_should_keep(selector, first_screen, is_inner=False, body=""):
    """判断该规则是否应保留为关键 CSS。"""
    # 文章正文样式必须同步首屏生效
    if ".article-content" in selector:
        return True
    # 暗色模式令牌与工具类映射
    if "data-theme" in selector:
        return True
    # 固定 ID / 全局基础规则
    if selector_starts_with_any(selector, ALWAYS_KEEP_PREFIX):
        return True
    # 跳过纯 .container 断点规则，通常可省 3-4KB 关键 CSS
    if is_container_breakpoint_only(selector, body):
        return False
    # 全局选择器
    sels = [s.strip() for s in re.split(r",", selector)]
    for s in sels:
        if s in GLOBAL_SELECTORS:
            return True
        bare = s.split(":")[0].split("[")[0].strip()
        if bare in GLOBAL_SELECTORS:
            return True
    # 包含首屏 class
    for s in sels:
        for m in re.finditer(r"\.([A-Za-z0-9_\\\-]+)", s):
            cls = m.group(1)
            if cls in first_screen:
                return True
    return False


def split_inner_rules(body):
    """解析 @media / @supports 块内部的规则。"""
    return split_rules(body)


def collect_animation_names(text):
    """从 CSS body 中收集 animation / animation-name 引用的关键帧名。"""
    names = set()
    # animation: name 0.8s ease-out ...
    for m in re.finditer(r"animation(?:-name)?\s*:\s*([^;{}]+)", text):
        value = m.group(1)
        # 取第一个 token（关键帧名）
        tokens = value.split()
        if tokens:
            names.add(tokens[0].strip())
    return names


def build_critical():
    with open(STYLE_CSS, "r", encoding="utf-8") as f:
        full = f.read()
    first_screen = extract_first_screen_classes()
    rules = split_rules(full)

    kept_rules = []          # (selector, body) for regular rules
    kept_at_rules = []       # (selector, body) for @media/@supports
    keyframe_blocks = {}     # name -> (selector, body)
    referenced_keyframes = set()

    for sel, body in rules:
        if sel.startswith("@keyframes"):
            name = sel.replace("@keyframes", "").strip()
            keyframe_blocks[name] = (sel, body)
        elif sel.startswith("@media") or sel.startswith("@supports"):
            inner_rules = split_inner_rules(body)
            kept_inner = []
            for inner_sel, inner_body in inner_rules:
                if rule_should_keep(inner_sel, first_screen, is_inner=True, body=inner_body):
                    kept_inner.append((inner_sel, inner_body))
                    referenced_keyframes.update(collect_animation_names(inner_body))
            if kept_inner:
                inner_min = " ".join(minify_css(s + "{" + b + "}") for s, b in kept_inner)
                kept_at_rules.append((sel, inner_min))
        elif sel.startswith("@font-face"):
            kept_rules.append((sel, body))
            referenced_keyframes.update(collect_animation_names(body))
        else:
            if rule_should_keep(sel, first_screen, body=body):
                kept_rules.append((sel, body))
                referenced_keyframes.update(collect_animation_names(body))

    # 二遍：保留被引用的 keyframes
    kept_keyframes = []
    for name in referenced_keyframes:
        if name in keyframe_blocks:
            kept_keyframes.append(keyframe_blocks[name])

    # 组装：keyframes 放在规则之前（CSS 不要求顺序，但习惯如此）
    parts = []
    for sel, body in kept_keyframes + kept_rules:
        parts.append(minify_css(sel + "{" + body + "}"))
    for sel, body in kept_at_rules:
        parts.append(minify_css(sel + "{" + body + "}"))

    critical = "".join(parts)
    return critical, len(parts)


def apply_to_html(critical):
    html_files = []
    for root, _, files in os.walk(ROOT):
        if "/node_modules" in root or "/.git" in root:
            continue
        for fn in files:
            if fn.endswith(".html"):
                html_files.append(os.path.join(root, fn))
    applied = 0
    inline_block = '<style id="critical">' + critical + "</style>"
    for path in html_files:
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        # 幂等：移除已存在的 critical <style> 块（带或不带 id）
        content = re.sub(r'<style[^>]*>[\s\S]*?</style>', "", content, count=1)
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
    with open(CRITICAL_CSS, "w", encoding="utf-8") as f:
        f.write(critical)
    print(f"▶ 生成 critical.css：{n_rules} 条规则，{size} 字节")
    if size > SIZE_WARNING:
        print(f"⚠ 警告：critical.css 体积超过 {SIZE_WARNING} 字节，建议检查 @media 保留范围或 safelist")
    applied, files = apply_to_html(critical)
    print(f"▶ 已内联到 {applied} 个 HTML 文件")


if __name__ == "__main__":
    main()

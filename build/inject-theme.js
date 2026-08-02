#!/usr/bin/env node
/**
 * 注入「防首屏闪烁」暗色模式初始化脚本。
 *
 * 该脚本必须位于 <head> 最前面、所有 CSS 之前同步执行：
 * 在浏览器首次绘制前读取 localStorage 中的用户偏好，
 * 若无显式选择则跟随系统 prefers-color-scheme，
 * 据此为 <html> 设置 / 清除 data-theme="dark"，
 * 从而避免暗色模式用户在刷新时出现「白屏闪烁」。
 *
 * 幂等：已注入过则先移除再重新插入，可安全重复运行。
 *
 * 必须在 generate-manifest.js 之后执行（它是构建的最后一步），
 * 以保证无论前面的步骤如何改写 <head>，脚本都稳定处于 <head> 首位。
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const MARK = 'data-theme-no-flash';

// 防闪烁核心逻辑：同步、无依赖、带 try/catch 防御隐私模式禁用 localStorage
const SCRIPT =
    '<script id="' + MARK + '">(function(){try{var t=localStorage.getItem("theme");' +
    'if(t!=="light"&&t!=="dark"){t=(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches)?"dark":"light";}' +
    'if(t==="dark"){document.documentElement.setAttribute("data-theme","dark");}}catch(_){}})();</script>';

function walkHtml(dir) {
    const out = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (full === path.join(root, 'node_modules') || full === path.join(root, '.git')) continue;
            out.push(...walkHtml(full));
        } else if (entry.name.endsWith('.html')) {
            out.push(full);
        }
    }
    return out;
}

function injectToHead(html) {
    // 幂等：移除上一次注入的同名脚本（含其后可能的空白）
    html = html.replace(new RegExp('<script id="' + MARK + '"[\\s\\S]*?</script>\\s*', 'g'), '');
    // 插入为 <head> 的第一个子节点（紧随 <head ...> 之后，早于任何 CSS）
    if (/<head[^>]*>/i.test(html)) {
        html = html.replace(/(<head[^>]*>)/i, '$1\n    ' + SCRIPT + '\n');
    }
    return html;
}

const files = walkHtml(root);
let applied = 0;
for (const file of files) {
    const orig = fs.readFileSync(file, 'utf8');
    const next = injectToHead(orig);
    if (next !== orig) {
        fs.writeFileSync(file, next, 'utf8');
        applied++;
    }
}
console.log('▶ 已注入防闪烁暗色脚本到 ' + applied + ' 个 HTML 文件');

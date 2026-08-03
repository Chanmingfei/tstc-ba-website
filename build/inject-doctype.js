#!/usr/bin/env node
/**
 * 注入标准 DOCTYPE 并升级 viewport 以支持安全区。
 *
 * 全站曾经运行在 quirks mode（首字节即 <html>），会导致：
 * - 行内图片基线间隙、百分比高度、body overflow 滚动锁定等行为不可预期；
 * - env(safe-area-inset-*) 恒为 0，刘海屏无法留边距。
 *
 * 该脚本为每个 HTML 文件：
 * 1. 在文件最开头补齐 <!DOCTYPE html>（幂等，不会重复）。
 * 2. 把 viewport 升级为 width=device-width, initial-scale=1.0, viewport-fit=cover
 *    （若已含 viewport-fit=cover 则跳过）。
 *
 * 必须在构建最后一步执行，保证无论前面步骤如何改写 HTML，最终产物都符合标准模式。
 */
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');

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

function inject(file) {
    let html = fs.readFileSync(file, 'utf8');
    let changed = false;

    // 1. 补齐 DOCTYPE（忽略大小写与前后空白）
    const trimmed = html.trimStart();
    if (!/^<!DOCTYPE\s+html/i.test(trimmed)) {
        html = '<!DOCTYPE html>\n' + html;
        changed = true;
    } else if (!html.startsWith('<!DOCTYPE html>')) {
        // 已有 DOCTYPE 但大小写不一致，统一为标准小写
        html = html.replace(/^<!DOCTYPE\s+html/i, '<!DOCTYPE html>');
        changed = true;
    }

    // 2. 升级 viewport：保留原有 content，追加 viewport-fit=cover
    html = html.replace(
        /<meta\s+name="viewport"\s+content="([^"]*)"\s*>/i,
        (match, content) => {
            if (/viewport-fit=cover/i.test(content)) return match;
            const newContent = content.replace(/\s*$/, '') + ', viewport-fit=cover';
            changed = true;
            return `<meta name="viewport" content="${newContent}">`;
        }
    );

    if (changed) {
        fs.writeFileSync(file, html, 'utf8');
        return true;
    }
    return false;
}

const files = walkHtml(root);
let applied = 0;
for (const file of files) {
    if (inject(file)) applied++;
}
console.log('▶ 已注入 DOCTYPE / viewport-fit 到 ' + applied + ' 个 HTML 文件');

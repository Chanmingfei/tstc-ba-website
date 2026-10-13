// IMAP 诊断：登录邮箱检查诊断邮件是否真实到达（INBOX / 垃圾箱）。
// 凭证从环境变量读取（MAIL_SMTP_USER/PASS 为登录账号，IMAP 主机可用 MAIL_IMAP_HOST 覆盖）。
// 用法：MAIL_SMTP_USER=xxx MAIL_SMTP_PASS=yyy node scripts/diag-imap.mjs
import tls from 'node:tls';
import { once } from 'node:events';

const HOST = process.env.MAIL_IMAP_HOST || 'imap.qiye.163.com';
const PORT = 993;
const USER = process.env.MAIL_SMTP_USER;
const PASS = process.env.MAIL_SMTP_PASS;
if (!USER || !PASS) { console.log('请设置环境变量 MAIL_SMTP_USER 与 MAIL_SMTP_PASS'); process.exit(2); }

const sock = tls.connect({ host: HOST, port: PORT, servername: HOST });
sock.on('error', (e) => { console.log('!! socket error:', e.message); process.exit(1); });
await once(sock, 'secureConnect');
console.log('== IMAP TLS 已连接 ==');

const dec = new TextDecoder();
let buf = '';
let tag = 0;
let current = null; // 当前命令收集器

sock.on('data', (chunk) => {
  buf += dec.decode(chunk, { stream: true });
  let idx;
  while ((idx = buf.indexOf('\r\n')) >= 0) {
    const line = buf.slice(0, idx);
    buf = buf.slice(idx + 2);
    if (!line) continue;
    const t = line.split(' ')[0];
    if (current && t === current.tag) {
      current.lines.push(line);
      const rest = line.slice(t.length + 1);
      if (/^(OK|NO|BAD)\b/.test(rest)) {
        const c = current;
        current = null;
        c.resolve(c.lines);
      }
    } else if (current) {
      current.lines.push(line); // 未标记应答行归入当前命令
    }
  }
});

function cmd(command) {
  const t = 'a' + ++tag;
  return new Promise((resolve, reject) => {
    current = { tag: t, lines: [], resolve };
    sock.write(t + ' ' + command + '\r\n');
    setTimeout(() => {
      if (current && current.tag === t) {
        current = null;
        reject(new Error('IMAP 命令超时: ' + command));
      }
    }, 20000);
  });
}

try {
  await new Promise((r) => setTimeout(r, 800)); // 等问候语
  buf = '';
  console.log('<<< LOGIN: ' + (await cmd('LOGIN ' + USER + ' ' + PASS)).slice(-1)[0]);

  const list = await cmd('LIST "" "*"');
  console.log('<<< 邮箱列表:');
  for (const l of list.filter((x) => x.startsWith('*'))) console.log('    ' + l);

  for (const folder of ['INBOX', 'Junk', 'Spam', 'Trash']) {
    let sel;
    try { sel = await cmd('EXAMINE "' + folder + '"'); } catch { continue; }
    const exists = sel.find((l) => /\* \d+ EXISTS/.test(l));
    if (!exists) continue;
    const n = parseInt(exists.match(/\* (\d+) EXISTS/)[1], 10);
    console.log('\n===== ' + folder + '：共 ' + n + ' 封 =====');
    if (n === 0) continue;
    const search = await cmd('SEARCH ALL');
    const ids = (search.find((l) => l.startsWith('* SEARCH')) || '').split(' ').slice(2).filter(Boolean);
    const recent = ids.slice(-4);
    if (recent.length) {
      const fetch = await cmd('FETCH ' + recent.join(',') + ' (FLAGS ENVELOPE)');
      for (const l of fetch.filter((x) => x.startsWith('*'))) console.log('    ' + l.slice(0, 260));
    }
  }
  await cmd('LOGOUT');
  console.log('\n== IMAP 诊断结束 ==');
  sock.destroy();
} catch (e) {
  console.log('IMAP 诊断失败:', e.message);
  sock.destroy();
  process.exit(1);
}

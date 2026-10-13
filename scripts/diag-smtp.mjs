// SMTP 全对话诊断：完整记录服务端每一行应答，定位邮件服务器的拦截点。
// 凭证从环境变量读取（MAIL_SMTP_HOST/PORT/USER/PASS），切勿写进文件。
// 用法：MAIL_SMTP_USER=xxx MAIL_SMTP_PASS=yyy node scripts/diag-smtp.mjs [host] [port] [收件人...]
import tls from 'node:tls';
import { Duplex } from 'node:stream';
import { once } from 'node:events';

const HOST = process.argv[2] || process.env.MAIL_SMTP_HOST || 'smtp.qiye.163.com';
const PORT = Number(process.argv[3] || process.env.MAIL_SMTP_PORT || 465);
const USER = process.env.MAIL_SMTP_USER;
const PASS = process.env.MAIL_SMTP_PASS;
if (!USER || !PASS) { console.log('请设置环境变量 MAIL_SMTP_USER 与 MAIL_SMTP_PASS'); process.exit(2); }
const recipients = process.argv.slice(4);
if (recipients.length === 0) recipients.push('cmf@tstc.pp.ua');

const enc = new TextEncoder();
function b64(s) { return Buffer.from(s, 'utf8').toString('base64'); }

async function readMulti(reader) {
  // 读取完整应答（含多行 250- 续行）
  let buf = '';
  const dec = new TextDecoder();
  for (;;) {
    const { value, done } = await reader.read();
    if (done) return buf + '<EOF>';
    buf += dec.decode(value, { stream: true });
    let idx;
    while ((idx = buf.indexOf('\r\n')) >= 0) {
      const line = buf.slice(0, idx);
      buf = buf.slice(idx + 2);
      if (/^\d{3} /.test(line)) return 'LINE: ' + line;
    }
  }
}

const sock = tls.connect({ host: HOST, port: PORT, servername: HOST });
sock.on('error', (e) => console.log('!! socket error:', e.message));
await once(sock, 'secureConnect');
console.log('== TLS 已连接', HOST + ':' + PORT, '==');
const web = Duplex.toWeb(sock);
const writer = web.writable.getWriter();
const reader = web.readable.getReader();

const send = async (cmd) => {
  console.log('>>> ' + cmd.replace(b64(USER), '<USER_B64>').replace(b64(PASS), '<PASS_B64>'));
  await writer.write(enc.encode(cmd + '\r\n'));
  const resp = await readMulti(reader);
  console.log('<<< ' + resp);
  return resp;
};

console.log('<<< 问候语: ' + (await readMulti(reader)).replace(/\r\n/g, ' | '));
await send('EHLO tstc.pp.ua');
await send('AUTH LOGIN');
await send(b64(USER));
await send(b64(PASS));

for (const to of recipients) {
  console.log('\n===== 发送至 ' + to + ' =====');
  await send('MAIL FROM:<' + USER + '>');
  await send('RCPT TO:<' + to + '>');
  await send('DATA');
  const msg = [
    'From: ' + USER,
    'To: ' + to,
    'Subject: =?UTF-8?B?' + b64('发信诊断测试（可忽略）') + '?=',
    'Date: ' + new Date().toUTCString(),
    'Message-ID: <diag-' + Date.now() + '@tstc.pp.ua>',
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
    '',
    b64('这是唐山师范学院吧官网的发信诊断邮件。如果你收到它，说明投递链路正常。'),
    '',
  ].join('\r\n');
  await writer.write(enc.encode(msg + '\r\n.\r\n'));
  console.log('<<< DATA 应答: ' + (await readMulti(reader)).replace(/\r\n/g, ' | '));
}
await send('QUIT');
sock.destroy();
console.log('\n== 诊断结束 ==');

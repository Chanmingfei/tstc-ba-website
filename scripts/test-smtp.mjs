// SMTP 通道单测：本地起模拟 SMTP 服务端，验证 sendViaSmtp 的完整协议行为。
// 运行：node scripts/test-smtp.mjs
import net from 'node:net';
import { Duplex } from 'node:stream';
import { once } from 'node:events';
import { sendViaSmtp } from '../functions/_lib/smtp.js';

// ── 模拟 SMTP 服务端 ─────────────────────────────────────────────
const received = [];   // 捕获服务端收到的全部原始行
let dataPayload = '';  // DATA 阶段内容
let rejectAuth = false;
let lastConnectArgs = null; // 记录最近一次 connectFn 收到的参数（验证调用形态）

function startServer() {
  return new Promise((resolve) => {
    const server = net.createServer((sock) => {
      let inData = false;
      let buf = '';
      const reply = (s) => sock.write(s + '\r\n');
      reply('220 mock.smtp.local ESMTP ready');
      sock.on('data', (chunk) => {
        buf += chunk.toString('utf8');
        if (inData) {
          if (buf.includes('\r\n.\r\n')) {
            dataPayload = buf;
            received.push('<DATA>');
            buf = '';
            inData = false;
            reply('250 2.0.0 Ok: queued as MOCK123');
          }
          return;
        }
        let idx;
        while ((idx = buf.indexOf('\r\n')) >= 0) {
          const line = buf.slice(0, idx);
          buf = buf.slice(idx + 2);
          received.push(line);
          const cmd = line.split(' ')[0].toUpperCase();
          if (cmd === 'EHLO') reply('250-mock.smtp.local\r\n250-AUTH LOGIN\r\n250 SMTP ready'); // 多行应答
          else if (cmd === 'AUTH') reply('334 ' + Buffer.from('Username:').toString('base64'));
          else if (line === Buffer.from('smtpuser@qq.com').toString('base64')) reply('334 ' + Buffer.from('Password:').toString('base64'));
          else if (rejectAuth) reply('535 5.7.8 Error: authentication failed');
          else if (line === Buffer.from('wrongpass').toString('base64') && received.some(l => l === 'AUTH LOGIN')) reply('235 2.7.0 Accepted');
          else if (cmd === 'MAIL') reply('250 2.1.0 Ok');
          else if (cmd === 'RCPT') reply('250 2.1.5 Ok');
          else if (cmd === 'DATA') { reply('354 End data with <CR><LF>.<CR><LF>'); inData = true; }
          else if (cmd === 'QUIT') { reply('221 2.0.0 Bye'); sock.end(); }
          else reply('250 Ok');
        }
      });
      sock.on('error', () => {});
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

// node:net → web streams 适配（模拟 workerd socket 接口）
// 注意入参形态：workerd connect(address, options)，address 为 { hostname, port }
function nodeConnectFactory() {
  return (addr, opts) => {
    lastConnectArgs = { addr, opts };
    const sock = net.connect(addr.port, addr.hostname);
    const web = Duplex.toWeb(sock);
    return { readable: web.readable, writable: web.writable, close: () => sock.destroy() };
  };
}

// 模拟「connect 后需等待 opened」的 socket（更接近 workerd 行为）
function nodeConnectFactoryWithOpened() {
  return (addr, opts) => {
    const sock = net.connect(addr.port, addr.hostname);
    const web = Duplex.toWeb(sock);
    return {
      readable: web.readable,
      writable: web.writable,
      opened: new Promise((resolve, reject) => { sock.once('connect', resolve); sock.once('error', reject); }),
      close: () => sock.destroy(),
    };
  };
}

// ── 断言工具 ────────────────────────────────────────────────────
let pass = 0, fail = 0;
function check(name, cond, detail = '') {
  if (cond) { pass++; console.log(`PASS | ${name}`); }
  else { fail++; console.log(`FAIL | ${name} ${detail}`); }
}

async function waitConnected(server) {
  const port = server.address().port;
  return port;
}

// ── 主流程 ──────────────────────────────────────────────────────
const server = await startServer();
const port = await waitConnected(server);

const env = {
  MAIL_SMTP_HOST: '127.0.0.1',
  MAIL_SMTP_PORT: String(port),
  MAIL_SMTP_USER: 'smtpuser@qq.com',
  MAIL_SMTP_PASS: 'smtp-auth-code',
  MAIL_FROM: 'smtpuser@qq.com',
};

const msg = {
  to: 'someone@example.com',
  subject: '唐山师范学院吧 · 邮箱绑定验证码',
  text: '你的验证码是 123456，5 分钟内有效。\n如非本人操作请忽略。',
};

console.log('== 用例 1：正常发送 ==');
received.length = 0; dataPayload = ''; lastConnectArgs = null;
let r = await sendViaSmtp(env, msg, { connectFn: nodeConnectFactory() });
check('返回 {ok:true, via:smtp}', r.ok === true && r.via === 'smtp', JSON.stringify(r));
check('connect() 首参为 {hostname, port} 地址对象（workerd 无 (host, port, opts) 三参重载）',
  lastConnectArgs && typeof lastConnectArgs.addr === 'object' &&
  lastConnectArgs.addr.hostname === '127.0.0.1' && typeof lastConnectArgs.addr.port === 'number' &&
  lastConnectArgs.opts && typeof lastConnectArgs.opts.secureTransport === 'string',
  JSON.stringify(lastConnectArgs && { addr: lastConnectArgs.addr, opts: lastConnectArgs.opts }));
check('命令序列：EHLO 使用站点域名', received[0] === 'EHLO tstc.pp.ua', received[0]);
check('命令序列：AUTH LOGIN', received.includes('AUTH LOGIN'));
check('命令序列：base64 用户名', received.includes(Buffer.from('smtpuser@qq.com').toString('base64')));
check('命令序列：base64 授权码', received.includes(Buffer.from('smtp-auth-code').toString('base64')));
check('命令序列：MAIL FROM 与发件人一致', received.some(l => l === `MAIL FROM:<smtpuser@qq.com>`));
check('命令序列：RCPT TO 收件人', received.some(l => l === `RCPT TO:<someone@example.com>`));
check('命令序列：DATA 与 QUIT', received.includes('DATA') && received.includes('QUIT'));
check('DATA 含 From 头', /^From: smtpuser@qq\.com$/m.test(dataPayload));
check('DATA 含 To 头', /^To: someone@example\.com$/m.test(dataPayload));
check('DATA 含 Date / Message-ID / MIME 头', /^Date: .+\r$/m.test(dataPayload) && /^Message-ID: <.+@tstc\.pp\.ua>$/m.test(dataPayload) && /^Content-Transfer-Encoding: base64$/m.test(dataPayload));
check('DATA Subject 为 UTF-8 encoded-word 且可解码回中文',
  /^Subject: =\?UTF-8\?B\?(.+)\?=$/m.test(dataPayload) &&
  Buffer.from(RegExp.$1, 'base64').toString('utf8') === msg.subject,
  dataPayload.split('\r\n').find(l => l.startsWith('Subject')));
const bodyPart = dataPayload.split('\r\n\r\n')[1].replace(/\r\n\.$/, '');
check('DATA 正文 base64 可解码回原文（含中文与换行）', Buffer.from(bodyPart.replace(/\r\n/g, ''), 'base64').toString('utf8') === msg.text);

console.log('== 用例 2：认证失败（错误授权码）==');
received.length = 0; dataPayload = '';
rejectAuth = true;
let threw = false;
try {
  await sendViaSmtp({ ...env, MAIL_SMTP_PASS: 'wrongpass' }, msg, { connectFn: nodeConnectFactory() });
} catch (e) { threw = true; }
check('认证失败抛出异常（由 mailer 捕获转 {ok:false}）', threw);
rejectAuth = false;

console.log('== 用例 3：配置不完整时不尝试连接 ==');
r = await sendViaSmtp({ MAIL_SMTP_HOST: 'x' }, msg, { connectFn: () => { throw new Error('不应被调用'); } });
check('缺少 USER/PASS 返回 ok:false 且不连接', r.ok === false && r.via === 'smtp', JSON.stringify(r));

console.log('== 用例 4：starttls 模式（发送 STARTTLS 命令，升级后重新 EHLO）==');
// 模拟 startTls() 语义：返回一个全新 socket（旧 socket 的 reader/writer 作废）
function starttlsConnectFactory() {
  let currentAddr = null;
  const make = (addr) => {
    const sock = net.connect(addr.port, addr.hostname);
    const web = Duplex.toWeb(sock);
    return {
      readable: web.readable,
      writable: web.writable,
      opened: new Promise((resolve, reject) => { sock.once('connect', resolve); sock.once('error', reject); }),
      close: () => sock.destroy(),
    };
  };
  let current = null;
  return async (addr) => {
    if (!currentAddr) currentAddr = addr;
    if (!current) current = make(currentAddr);
    current.startTls = () => { current = make(currentAddr); return current; };
    return current;
  };
}
received.length = 0; dataPayload = '';
r = await sendViaSmtp({ ...env, MAIL_SMTP_SECURE: 'starttls' }, msg, { connectFn: starttlsConnectFactory() });
check('starttls：发送 STARTTLS 命令', received.includes('STARTTLS'), received.join(' | '));
check('starttls：升级后重新 EHLO 且完成发送',
  r.ok === true && received.filter(l => l.startsWith('EHLO')).length === 2 && received.includes('AUTH LOGIN'),
  JSON.stringify(r) + ' :: ' + received.join(' | '));

console.log('== 用例 5：async connectFn（生产默认实现的形状，回归测试）==');
// 生产 defaultConnect 因动态 import 而是 async 函数，返回 Promise。
// 曾经 sendViaSmtp 未 await 该结果，直接访问 socket.writable 导致
// TypeError: Cannot read properties of undefined (reading 'getWriter')，
// 且错误被 mailer/路由掩盖，线上表现为"发送成功"但邮件从未发出。
received.length = 0; dataPayload = '';
const syncFactory = nodeConnectFactoryWithOpened();
r = await sendViaSmtp(env, msg, { connectFn: async (addr, opts) => syncFactory(addr, opts) });
check('async connectFn 正常完成发送', r.ok === true && r.via === 'smtp' && received.includes('AUTH LOGIN'), JSON.stringify(r));

console.log('== 用例 6：连接失败时 opened reject，错误向上传播 ==');
received.length = 0;
let connErr = null;
try {
  await sendViaSmtp(env, msg, {
    connectFn: async () => ({
      readable: new ReadableStream(),
      writable: new WritableStream(),
      opened: Promise.reject(new Error('connection refused')),
      close: () => {},
    }),
  });
} catch (e) { connErr = e; }
check('opened 拒绝时抛出可读错误（由 mailer 捕获转 {ok:false}）', connErr !== null && /refused/.test(String(connErr)), String(connErr));

server.close();
console.log(`\n结果：${pass} 通过，${fail} 失败`);
process.exit(fail ? 1 : 0);

// SMTP 通道真实服务器实测：经 sendViaSmtp 生产代码路径发送（async connectFn 形状与
// 生产 defaultConnect 一致，用于验证 await 修复在真实 TLS + 真实 SMTP 对话下成立）。
// 凭证从环境变量读取，切勿写进文件。
// 用法：MAIL_SMTP_USER=xxx MAIL_SMTP_PASS=yyy node scripts/test-smtp-live.mjs [收件人]
import tls from 'node:tls';
import { Duplex } from 'node:stream';
import { sendViaSmtp } from '../functions/_lib/smtp.js';

const HOST = process.env.MAIL_SMTP_HOST || 'smtp.qiye.163.com';
const PORT = Number(process.env.MAIL_SMTP_PORT || 465);
const USER = process.env.MAIL_SMTP_USER;
const PASS = process.env.MAIL_SMTP_PASS;
const TO = process.argv[2] || 'cmf@tstc.pp.ua';
if (!USER || !PASS) { console.log('请设置环境变量 MAIL_SMTP_USER 与 MAIL_SMTP_PASS'); process.exit(2); }

// 形状与 workerd connect() 一致：同步返回含 opened 的 socket 对象；
// 外层包 async —— 与生产 defaultConnect（动态 import 包装）同形。
async function connectFn(host, port) {
  const sock = tls.connect({ host, port, servername: host });
  const web = Duplex.toWeb(sock);
  return {
    readable: web.readable,
    writable: web.writable,
    opened: new Promise((resolve, reject) => {
      sock.once('secureConnect', () => resolve({ remoteAddress: sock.remoteAddress }));
      sock.once('error', reject);
    }),
    close: () => sock.destroy(),
  };
}

const started = Date.now();
const r = await sendViaSmtp(
  {
    MAIL_SMTP_HOST: HOST,
    MAIL_SMTP_PORT: String(PORT),
    MAIL_SMTP_USER: USER,
    MAIL_SMTP_PASS: PASS,
    MAIL_FROM: USER,
  },
  {
    to: TO,
    subject: '唐山师范学院吧 · SMTP 通道实测（await 修复版）',
    text: '这是一封通过 sendViaSmtp（修复 await 后）经真实 SMTP 服务器发送的实测邮件。\n收到即证明通道可用。',
  },
  { connectFn }
);
console.log(`耗时 ${Date.now() - started}ms`);
console.log('结果:', JSON.stringify(r));
process.exit(r.ok ? 0 : 1);

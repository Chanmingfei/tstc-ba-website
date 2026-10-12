// 凭证验证：连接 smtp.qiye.163.com:465，完成 EHLO + AUTH LOGIN 即止（不发送任何邮件）。
// 用法：node scripts/verify-smtp-auth.mjs
import tls from 'node:tls';
import { Duplex } from 'node:stream';
import { once } from 'node:events';
import { sendViaSmtp } from '../functions/_lib/smtp.js';

const host = 'smtp.qiye.163.com';
const port = 465;

// 预热一条 TLS 连接（workerd 的 connect 是同步返回 socket 对象，故这里先连好再同步交出）
const sock = tls.connect({ host, port, servername: host });
sock.on('error', () => {});
await once(sock, 'secureConnect');
const web = Duplex.toWeb(sock);

// 包装 writer：一旦出现 MAIL FROM 立即抛错中断 —— 保证在认证成功后绝不进入发信阶段
const wrappedWritable = {
  getWriter() {
    const w = web.writable.getWriter();
    return {
      write: async (chunk) => {
        const s = new TextDecoder().decode(chunk);
        if (s.startsWith('MAIL FROM')) throw new Error('__AUTH_OK_STOP__');
        return w.write(chunk);
      },
      close: () => w.close(),
      abort: (r) => w.abort?.(r),
      ready: w.ready,
      desiredSize: w.desiredSize,
      closed: w.closed,
    };
  },
};

const guard = () => ({
  readable: web.readable,
  writable: wrappedWritable,
  close: () => sock.destroy(),
});

try {
  await sendViaSmtp(
    {
      MAIL_SMTP_HOST: host,
      MAIL_SMTP_PORT: String(port),
      MAIL_SMTP_USER: 'noreply@tstc.pp.ua',
      MAIL_SMTP_PASS: 't@78beZSvNSRtL72',
      MAIL_FROM: 'noreply@tstc.pp.ua',
    },
    { to: 'verify@example.invalid', subject: 'auth check', text: 'auth check' },
    { connectFn: guard }
  );
  console.log('UNEXPECTED: 未在 MAIL FROM 前中断');
  process.exit(2);
} catch (e) {
  if (String(e.message || e).includes('__AUTH_OK_STOP__')) {
    console.log('AUTH_OK: EHLO + AUTH LOGIN 成功，凭证有效（未发送任何邮件）');
    process.exit(0);
  }
  console.log('AUTH_FAIL:', e.message || e);
  process.exit(1);
}

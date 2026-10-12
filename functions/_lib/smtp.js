// SMTP 直连发信通道：零注册、零费用，使用自己的邮箱（QQ / 163 / Gmail 等）+ 授权码。
// 依赖 workerd 的 cloudflare:sockets（Pages Functions 原生支持）。
//
// 配置（Pages 环境变量，全部配齐才启用本通道）：
//   MAIL_SMTP_HOST   必填，如 smtp.qq.com / smtp.163.com / smtp.gmail.com
//   MAIL_SMTP_PORT   选填，默认 465
//   MAIL_SMTP_SECURE 选填：on=隐式 TLS（默认，配 465）；starttls=STARTTLS（配 587）
//   MAIL_SMTP_USER   必填，登录邮箱（须与 MAIL_FROM 一致，各邮箱商强制要求）
//   MAIL_SMTP_PASS   必填，SMTP 授权码（非邮箱登录密码）
//   MAIL_FROM        选填，默认取 MAIL_SMTP_USER
//
// 说明：为什么不推荐 Resend —— Resend 拒绝验证 pp.ua 这类免费公共域名（含其子域），
// 本机 tstc.pp.ua 正在其黑名单内；自有邮箱 SMTP 无域名验证要求，任意收件人均可送达。

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function b64(str) {
  const bytes = encoder.encode(str);
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin);
}

// 按 RFC 2045 将 base64 折行（每行 ≤76 字符）
function wrapBase64(b64Str) {
  return (b64Str.match(/.{1,76}/g) || ['']).join('\r\n');
}

async function defaultConnect(host, port, opts) {
  const { connect } = await import('cloudflare:sockets');
  return connect(host, port, opts);
}

// 读取一条完整 SMTP 应答（支持 250- 多行续行，直到 "NNN " 空格行为止）
async function readReply(reader, timeoutMs) {
  let buffer = '';
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new Error('SMTP 应答超时');
    const readP = reader.read();
    readP.catch(() => {}); // 防止超时后挂起的 read 产生未处理拒绝
    const r = await Promise.race([
      readP,
      new Promise((_, rej) => setTimeout(() => rej(new Error('SMTP 应答超时')), remaining)),
    ]);
    if (r.done) throw new Error('SMTP 连接被对端关闭');
    buffer += decoder.decode(r.value, { stream: true });
    let idx;
    while ((idx = buffer.indexOf('\r\n')) >= 0) {
      const line = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      if (/^\d{3} /.test(line)) return parseInt(line.slice(0, 3), 10);
    }
  }
}

async function cmd(writer, reader, line, timeoutMs = 20000) {
  await writer.write(encoder.encode(line + '\r\n'));
  const code = await readReply(reader, timeoutMs);
  if (code >= 400) throw new Error(`SMTP 命令失败 [${line.split(' ')[0]}]: ${code}`);
  return code;
}

/**
 * 通过 SMTP 发送一封纯文本邮件。
 * @param env Pages 环境变量
 * @param msg { from, to, subject, text }
 * @param opts.connectFn 可选，注入 socket 工厂（测试用；生产默认 cloudflare:sockets）
 */
export async function sendViaSmtp(env, msg, opts = {}) {
  const host = env.MAIL_SMTP_HOST;
  const user = env.MAIL_SMTP_USER;
  const pass = env.MAIL_SMTP_PASS;
  const from = env.MAIL_FROM || user;
  const port = Number(env.MAIL_SMTP_PORT || 465);
  const secure = (env.MAIL_SMTP_SECURE || 'on').toLowerCase();
  if (!host || !user || !pass) return { ok: false, via: 'smtp', error: 'SMTP 配置不完整' };

  const connectFn = opts.connectFn || defaultConnect;
  const socket = connectFn(host, port, { secureTransport: secure === 'starttls' ? 'starttls' : 'on' });
  let writer;
  let reader;
  try {
    // 等待底层连接就绪（含 TLS 握手）
    if (socket.opened) await socket.opened;
    writer = socket.writable.getWriter();
    reader = socket.readable.getReader();

    const greeting = await readReply(reader, 20000); // 服务端 220 欢迎语
    if (greeting !== 220) throw new Error(`SMTP 问候语异常: ${greeting}`);

    await cmd(writer, reader, `EHLO tstc.pp.ua`);
    await cmd(writer, reader, 'AUTH LOGIN');
    await cmd(writer, reader, b64(user));
    await cmd(writer, reader, b64(pass));
    await cmd(writer, reader, `MAIL FROM:<${from}>`);
    await cmd(writer, reader, `RCPT TO:<${msg.to}>`);

    const date = new Date().toUTCString().replace('GMT', '+0000');
    const messageId = `<${crypto.randomUUID()}@tstc.pp.ua>`;
    const headers = [
      `From: ${from}`,
      `To: ${msg.to}`,
      `Subject: =?UTF-8?B?${b64(msg.subject)}?=`,
      `Date: ${date}`,
      `Message-ID: ${messageId}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: base64',
    ].join('\r\n');
    const body = wrapBase64(b64(msg.text));

    await cmd(writer, reader, 'DATA');
    await writer.write(encoder.encode(headers + '\r\n\r\n' + body + '\r\n.\r\n'));
    // DATA 结束后的应答（250 表示服务端已接收）
    const dataCode = await readReply(reader, 20000);
    if (dataCode >= 400) throw new Error(`SMTP DATA 被拒: ${dataCode}`);

    try { await cmd(writer, reader, 'QUIT', 5000); } catch { /* QUIT 失败不影响送达 */ }
    return { ok: true, via: 'smtp' };
  } finally {
    // 清理：writer.close() 返回 Promise，底层流异常时会被 reject，必须接住防止未处理拒绝
    try { const p = writer?.close?.(); if (p && typeof p.catch === 'function') p.catch(() => {}); } catch { /* 忽略 */ }
    try { socket.close(); } catch { /* 忽略 */ }
  }
}

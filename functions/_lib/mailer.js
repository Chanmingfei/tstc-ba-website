// 邮件发送抽象：三级通道，按 Pages 环境变量配置自动切换，调用方代码零改动。
// 1) MAIL_WEBHOOK_URL（+ 可选 MAIL_WEBHOOK_TOKEN）：POST {from,to,subject,text} 到自有转发服务（最通用，任何邮件服务都能包一层）。
// 2) RESEND_API_KEY（+ 可选 MAIL_FROM）：Resend API（免费额度约 3000 封/月；未验证域名时需用其测试发件地址）。
// 3) 均未配置：开发模式——内容仅写入日志，验证码由调用方落库 D1（可经 wrangler d1 execute 查询）。
//    安全底线：任何模式下验证码都不随 HTTP 响应返回，避免忘配密钥时验证码泄露导致账号被重置。
export async function sendEmail(env, { to, subject, text }) {
  const from = env.MAIL_FROM || 'noreply@tstc.pp.ua';

  // 1) 通用 Webhook 转发
  if (env.MAIL_WEBHOOK_URL) {
    try {
      const r = await fetch(env.MAIL_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(env.MAIL_WEBHOOK_TOKEN ? { Authorization: 'Bearer ' + env.MAIL_WEBHOOK_TOKEN } : {}),
        },
        body: JSON.stringify({ from, to, subject, text }),
      });
      if (r.ok) return { ok: true, via: 'webhook' };
      console.error('[mailer] webhook 发送失败', r.status);
      return { ok: false, via: 'webhook', error: 'webhook ' + r.status };
    } catch (e) {
      console.error('[mailer] webhook 异常', e);
      return { ok: false, via: 'webhook', error: String(e) };
    }
  }

  // 2) Resend
  if (env.RESEND_API_KEY) {
    try {
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + env.RESEND_API_KEY,
        },
        body: JSON.stringify({ from, to: [to], subject, text }),
      });
      if (r.ok) return { ok: true, via: 'resend' };
      const body = await r.text().catch(() => '');
      console.error('[mailer] resend 发送失败', r.status, body);
      return { ok: false, via: 'resend', error: 'resend ' + r.status };
    } catch (e) {
      console.error('[mailer] resend 异常', e);
      return { ok: false, via: 'resend', error: String(e) };
    }
  }

  // 3) 开发模式：仅日志，不真实发送
  console.log(`[mailer][dev] 未配置邮件服务（MAIL_WEBHOOK_URL / RESEND_API_KEY），邮件未真实发送。to=${to} subject=${subject}`);
  return { ok: true, via: 'dev' };
}

// 简单限流：基于 KV（RATELIMIT 绑定）。无绑定或异常时放行（优雅降级）。
export async function rateLimit(env, key, max, windowSec) {
  if (!env || !env.RATELIMIT) return { ok: true };
  try {
    const now = Date.now();
    const raw = await env.RATELIMIT.get(key);
    let hits = raw ? JSON.parse(raw) : { count: 0, ts: now };
    if (now - hits.ts > windowSec * 1000) hits = { count: 0, ts: now };
    hits.count += 1;
    if (hits.count > max) {
      const retry = Math.max(1, Math.ceil((hits.ts + windowSec * 1000 - now) / 1000));
      return { ok: false, retryAfter: retry };
    }
    await env.RATELIMIT.put(key, JSON.stringify(hits), { expirationTtl: windowSec + 5 });
    return { ok: true };
  } catch {
    return { ok: true };
  }
}

export function clientIp(request) {
  return request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For') || 'local';
}

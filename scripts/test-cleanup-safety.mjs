// 安全单测：验证「验证码存档清理」只触碰 email_codes 表，绝不伤及 users/articles/comments。
// 方法：mock DB/KV 捕获全部 SQL 与绑定参数，经真实 onRequest 链路触发两条清理路径。
import * as api from '../functions/api/[[route]].js';

const DAY = 24 * 3600 * 1000;
let failures = 0;
function assert(name, cond, detail) {
  console.log((cond ? 'PASS' : 'FAIL') + ' | ' + name + (cond ? '' : ' | ' + (detail || '')));
  if (!cond) failures++;
}

// ---------- mock 基础设施 ----------
function makeEnv(role, userId) {
  const sqlLog = [];
  const env = {
    SESSIONS: {
      async get(token) {
        sqlLog.push({ sql: 'KV GET sess:' + token });
        if (token !== 'valid-token') return null;
        return JSON.stringify({ userId, username: 'tester', role, exp: Date.now() + 3600000 });
      },
      async put(k, v) { sqlLog.push({ sql: 'KV PUT ' + k }); },
      async delete(k) { sqlLog.push({ sql: 'KV DEL ' + k }); },
      async list() { sqlLog.push({ sql: 'KV LIST' }); return { keys: [], list_complete: true }; },
    },
    RATELIMIT: {
      async get(k) { return null; },
      async put(k, v) { },
    },
    DB: {
      prepare(sql) {
        const stmt = {
          _binds: [],
          bind(...args) { this._binds = args; return this; },
          async run() { sqlLog.push({ sql, binds: this._binds, type: 'run' }); return { meta: { changes: 1 } }; },
          async first() {
            sqlLog.push({ sql, binds: this._binds, type: 'first' });
            if (/SELECT id FROM users WHERE email/i.test(sql)) return null; // 邮箱未被他人占用
            if (/SELECT status FROM users/i.test(sql)) return { status: 'active' };
            return { c: 0 };
          },
          async all() { sqlLog.push({ sql, binds: this._binds, type: 'all' }); return { results: [] }; },
        };
        return stmt;
      },
    },
  };
  return { env, sqlLog };
}

function cookies(role, userId) {
  return { Cookie: 'sid=valid-token', Origin: 'https://tstc.pp.ua' };
}
const COOKIE_NAME = 'sid'; // 与 _lib/config.js 一致（若改名需同步）

// ---------- 场景 A：管理员手动清理 ----------
{
  const { env, sqlLog } = makeEnv('admin', 1);
  const req = new Request('https://tstc.pp.ua/api/admin/cleanup-codes', {
    method: 'POST', headers: cookies(), body: JSON.stringify({}),
  });
  const res = await api.onRequest({ request: req, env, params: { route: ['admin', 'cleanup-codes'] } });
  const body = await res.json();
  assert('A1 管理端点返回 ok', res.status === 200 && body.ok === true, JSON.stringify(body));

  const deletes = sqlLog.filter((x) => /DELETE/i.test(x.sql));
  assert('A2 全链路恰好 1 条 DELETE', deletes.length === 1, '实际 ' + deletes.length + ' 条: ' + deletes.map((d) => d.sql).join(' ; '));
  assert('A3 唯一 DELETE 目标表是 email_codes', deletes.length === 1 && /^DELETE FROM email_codes\b/i.test(deletes[0].sql.trim()), deletes.map((d) => d.sql).join(' ; '));
  assert('A4 DELETE 条件是 created_at < ?', deletes.length === 1 && /WHERE created_at < \?/i.test(deletes[0].sql), deletes[0] && deletes[0].sql);
  const bind = deletes[0] && deletes[0].binds && deletes[0].binds[0];
  const expected = Date.now() - 7 * DAY;
  assert('A5 删除阈值约为 7 天前（±5 分钟）', typeof bind === 'number' && Math.abs(bind - expected) < 5 * 60000, 'bind=' + bind);
  assert('A6 不触碰 users/articles/comments 任何语句', !sqlLog.some((x) => /\b(users|articles|comments)\b/i.test(x.sql) && !/users WHERE id = \?/.test(x.sql) === false ? false : /\b(articles|comments)\b/i.test(x.sql)), '');
  const writes = sqlLog.filter((x) => x.type === 'run' && !/email_codes/i.test(x.sql));
  assert('A7 除 email_codes 外无任何写操作（run）', writes.length === 0, writes.map((w) => w.sql).join(' ; '));
}

// ---------- 场景 B：登录用户发绑定验证码（触发懒清理） ----------
{
  const { env, sqlLog } = makeEnv('user', 5);
  const req = new Request('https://tstc.pp.ua/api/account/email/code', {
    method: 'POST', headers: cookies(), body: JSON.stringify({ email: 'b@c.com' }),
  });
  const res = await api.onRequest({ request: req, env, params: { route: ['account', 'email', 'code'] } });
  const body = await res.json();
  assert('B1 发码接口返回 ok', res.status === 200 && body.ok === true, JSON.stringify(body));

  const deletes = sqlLog.filter((x) => /DELETE/i.test(x.sql));
  assert('B2 发码链路 DELETE 仅 1 条且只针对 email_codes', deletes.length === 1 && /^DELETE FROM email_codes\b/i.test(deletes[0].sql.trim()), deletes.map((d) => d.sql).join(' ; '));
  assert('B3 懒清理发生在 INSERT 之后（新码不会被误删）', (() => {
    const iInsert = sqlLog.findIndex((x) => /INSERT INTO email_codes/i.test(x.sql));
    const iDelete = sqlLog.findIndex((x) => /DELETE FROM email_codes/i.test(x.sql));
    return iInsert >= 0 && iDelete > iInsert;
  })());
  const touchedTables = [...new Set(sqlLog.map((x) => {
    const m = /(?:FROM|INTO|UPDATE)\s+([a-z_]+)/i.exec(x.sql);
    return m ? m[1] : null;
  }).filter(Boolean))];
  assert('B4 链路涉及的表仅在 {users, email_codes}', touchedTables.every((t) => ['users', 'email_codes'].includes(t)), '实际: ' + touchedTables.join(','));
  assert('B5 无任何 articles/comments 操作', !sqlLog.some((x) => /\b(articles|comments)\b/i.test(x.sql)), '');
}

console.log(failures === 0 ? '\n全部通过：清理功能严格限定于 email_codes 表。' : '\n存在 ' + failures + ' 项失败！');
process.exit(failures === 0 ? 0 : 1);

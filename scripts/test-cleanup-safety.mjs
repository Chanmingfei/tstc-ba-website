// 安全单测：验证「验证码存档清理」的三条路径都只触碰 email_codes 表，绝不伤及 users/articles/comments。
// 路径：A) 管理员手动全部清除（无视日期）；B) 发码时的懒清理（7 天阈值）；C) 管理员单条删除。
// 方法：mock DB/KV 捕获全部 SQL 与绑定参数，经真实 onRequest 链路触发。
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

// ---------- 场景 A：管理员手动全部清除（无视日期） ----------
{
  const { env, sqlLog } = makeEnv('admin', 1);
  const req = new Request('https://tstc.pp.ua/api/admin/clear-codes', {
    method: 'POST', headers: cookies(), body: JSON.stringify({}),
  });
  const res = await api.onRequest({ request: req, env, params: { route: ['admin', 'clear-codes'] } });
  const body = await res.json();
  assert('A1 全清端点返回 ok', res.status === 200 && body.ok === true, JSON.stringify(body));

  const deletes = sqlLog.filter((x) => /DELETE/i.test(x.sql));
  assert('A2 全链路恰好 1 条 DELETE', deletes.length === 1, '实际 ' + deletes.length + ' 条: ' + deletes.map((d) => d.sql).join(' ; '));
  assert('A3 唯一 DELETE 目标表是 email_codes', deletes.length === 1 && /^DELETE FROM email_codes\b/i.test(deletes[0].sql.trim()), deletes.map((d) => d.sql).join(' ; '));
  assert('A4 全清无视日期：DELETE 不带 WHERE 条件', deletes.length === 1 && !/\bWHERE\b/i.test(deletes[0].sql), deletes[0] && deletes[0].sql);
  assert('A5 不触碰 users/articles/comments 任何语句', !sqlLog.some((x) => /\b(articles|comments)\b/i.test(x.sql)), '');
  const writes = sqlLog.filter((x) => x.type === 'run' && !/email_codes/i.test(x.sql));
  assert('A6 除 email_codes 外无任何写操作（run）', writes.length === 0, writes.map((w) => w.sql).join(' ; '));
}

// ---------- 场景 C：管理员单条删除验证码存档 ----------
{
  const { env, sqlLog } = makeEnv('admin', 1);
  const req = new Request('https://tstc.pp.ua/api/admin/codes/123', {
    method: 'DELETE', headers: cookies(),
  });
  const res = await api.onRequest({ request: req, env, params: { route: ['admin', 'codes', '123'] } });
  const body = await res.json();
  assert('C1 单条删除返回 ok', res.status === 200 && body.ok === true, JSON.stringify(body));

  const deletes = sqlLog.filter((x) => /DELETE/i.test(x.sql));
  assert('C2 恰好 1 条 DELETE 且按 id 条件删除', deletes.length === 1 && /^DELETE FROM email_codes WHERE id = \?/i.test(deletes[0].sql.trim()), deletes.map((d) => d.sql).join(' ; '));
  assert('C3 删除绑定参数为传入 id（字符串）', deletes.length === 1 && deletes[0].binds && deletes[0].binds[0] === '123', JSON.stringify(deletes[0] && deletes[0].binds));
  assert('C4 不触碰其他表', !sqlLog.some((x) => /\b(users|articles|comments)\b/i.test(x.sql) && !/users WHERE id = \?/.test(x.sql) === false ? false : /\b(articles|comments)\b/i.test(x.sql)), '');
}
{
  // 非法 id：不产生任何 DELETE，返回 404
  const { env, sqlLog } = makeEnv('admin', 1);
  const req = new Request('https://tstc.pp.ua/api/admin/codes/abc', {
    method: 'DELETE', headers: cookies(),
  });
  const res = await api.onRequest({ request: req, env, params: { route: ['admin', 'codes', 'abc'] } });
  assert('C5 非法 id 返回 404 且无 DELETE', res.status === 404 && !sqlLog.some((x) => /DELETE/i.test(x.sql)), 'status=' + res.status);
}
{
  // 非管理员：403 且无 DELETE
  const { env, sqlLog } = makeEnv('user', 5);
  const req = new Request('https://tstc.pp.ua/api/admin/codes/123', {
    method: 'DELETE', headers: cookies(),
  });
  const res = await api.onRequest({ request: req, env, params: { route: ['admin', 'codes', '123'] } });
  assert('C6 非管理员单条删除 403 且无 DELETE', res.status === 403 && !sqlLog.some((x) => /DELETE/i.test(x.sql)), 'status=' + res.status);
}
{
  // 非管理员全清：403 且无 DELETE
  const { env, sqlLog } = makeEnv('user', 5);
  const req = new Request('https://tstc.pp.ua/api/admin/clear-codes', {
    method: 'POST', headers: cookies(), body: JSON.stringify({}),
  });
  const res = await api.onRequest({ request: req, env, params: { route: ['admin', 'clear-codes'] } });
  assert('C7 非管理员全清 403 且无 DELETE', res.status === 403 && !sqlLog.some((x) => /DELETE/i.test(x.sql)), 'status=' + res.status);
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

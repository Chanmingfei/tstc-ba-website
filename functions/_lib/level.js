// 等级系统辅助（Functions 共享）
//
// 经验值 = 该用户「可见」评论数（含楼中楼回复）。
// 等级   = 1 + floor(经验值 / 5)：每发 5 条评论升 1 级。
// 扣回   ：评论被删除（软删 status='deleted'）后，可见数减少，等级相应下降 —— 自然实现「扣回经验值」。
//
// 设计取舍：等级由各事件（发评/删评）实时重算并落库到 users.level，避免每次读取都做聚合，
// 也便于评论列表等场景直接读取；recalcLevel 在发评/回复/删评后调用即可保持同步。

// 发评 / 删评后，按该用户当前可见评论数重算并写回 users.level。
export async function recalcLevel(env, userId) {
  const r = await env.DB.prepare(
    "SELECT COUNT(*) c FROM comments WHERE user_id = ? AND status = 'visible'"
  ).bind(userId).first();
  const xp = r ? r.c : 0;
  const level = 1 + Math.floor(xp / 5);
  await env.DB.prepare('UPDATE users SET level = ? WHERE id = ?').bind(level, userId).run();
  return { level, xp };
}

// 读取用户等级与经验值（经验值 = 当前可见评论数）。
export async function getUserLevel(env, userId) {
  const r = await env.DB.prepare(
    "SELECT level, (SELECT COUNT(*) FROM comments WHERE user_id = ? AND status = 'visible') c FROM users WHERE id = ?"
  ).bind(userId, userId).first();
  const xp = r ? r.c : 0;
  const level = r ? r.level : 1;
  return { level, xp };
}

// Tiny Redis client over Upstash REST (free tier). Falls back to in-memory storage when env vars are missing (local dev only).
const U = process.env.UPSTASH_REDIS_REST_URL, T = process.env.UPSTASH_REDIS_REST_TOKEN;
const mem = global.__mem || (global.__mem = {});
async function cmd(...a) {
  if (!U) {
    const [op, key, f, v] = a; const h = (mem[key] = mem[key] || {});
    if (op === "HSETNX") { if (h[f]) return 0; h[f] = v; return 1; }
    if (op === "HGET") return h[f] || null;
    if (op === "HVALS") return Object.values(h);
  }
  const r = await fetch(U, { method: "POST", headers: { Authorization: "Bearer " + T }, body: JSON.stringify(a) });
  return (await r.json()).result;
}
module.exports = {
  TIMES: ["10:00", "12:00", "15:00", "17:00"],
  hsetnx: (k, f, v) => cmd("HSETNX", k, f, v), hget: (k, f) => cmd("HGET", k, f), hvals: k => cmd("HVALS", k)
};

export async function closeRedis() { /* Redis-ready lifecycle hook; no client is created until configured. */ }
export function redisStatus() { return process.env.REDIS_URL ? 'unavailable' : 'not_configured'; }

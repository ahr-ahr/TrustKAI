const { redis } = require("./redisClient");

async function increment(key, windowSeconds) {
  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }

  return current;
}

module.exports = { increment };

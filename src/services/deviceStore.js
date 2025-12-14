const { redis } = require("./redisClient");

const DEVICE_TTL_SECONDS = 60 * 60 * 24 * 30; // 30 hari

async function isKnownDevice(deviceId) {
  const key = `device:${deviceId}`;
  const exists = await redis.exists(key);
  return exists === 1;
}

async function rememberDevice(deviceId) {
  const key = `device:${deviceId}`;
  await redis.set(key, "1", "EX", DEVICE_TTL_SECONDS);
}

module.exports = { isKnownDevice, rememberDevice };

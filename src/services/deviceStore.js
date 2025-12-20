const { redis } = require("./redisClient");

const TTL_NEW_DEVICE = 60 * 60 * 24 * 3; // 3 hari
const TTL_KNOWN_DEVICE = 60 * 60 * 24 * 30; // 30 hari

async function isKnownDevice(deviceId) {
  const key = `device:${deviceId}`;
  return (await redis.exists(key)) === 1;
}

async function rememberDevice(deviceId, confidence = "LOW") {
  const key = `device:${deviceId}`;
  const ttl = confidence === "HIGH" ? TTL_KNOWN_DEVICE : TTL_NEW_DEVICE;

  await redis.set(key, "1", "EX", ttl);
}

module.exports = { isKnownDevice, rememberDevice };

const { redis } = require("./redisClient");
const { hashApiKey } = require("../utils/hash");

function redisKey(hash) {
  return `apikey:${hash}`;
}

async function getApiKeyRecord(apiKey) {
  const hash = hashApiKey(apiKey);
  const data = await redis.get(redisKey(hash));
  return data ? JSON.parse(data) : null;
}

function isApiKeyActive(record) {
  return record?.status === "active";
}

function isApiKeyExpired(record) {
  if (!record.expires_at) return false;
  return Date.now() / 1000 > record.expires_at;
}

async function revokeApiKey(apiKey) {
  const hash = hashApiKey(apiKey);
  await redis.del(redisKey(hash));
}

module.exports = {
  getApiKeyRecord,
  isApiKeyActive,
  isApiKeyExpired,
  revokeApiKey,
};

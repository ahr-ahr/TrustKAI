const { redis } = require("./redisClient");
const { hashApiKey } = require("../utils/hash");

const redisKey = (hash) => `apikey:${hash}`;

async function getApiKeyRecord(rawKey) {
  const hash = hashApiKey(rawKey);
  const data = await redis.get(redisKey(hash));
  return data ? JSON.parse(data) : null;
}

function isApiKeyActive(record) {
  return record?.status === "active";
}

function isApiKeyExpired(record) {
  return record.expires_at && Date.now() / 1000 > record.expires_at;
}

function hasScope(record, scope) {
  return Array.isArray(record.scopes) && record.scopes.includes(scope);
}

async function revokeApiKey(rawKey) {
  const hash = hashApiKey(rawKey);
  await redis.del(redisKey(hash));
}

module.exports = {
  getApiKeyRecord,
  isApiKeyActive,
  isApiKeyExpired,
  hasScope,
  revokeApiKey,
};

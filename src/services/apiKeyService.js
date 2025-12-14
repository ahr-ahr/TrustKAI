/**
 * V2: API Key Management Service
 * - In-memory (aman untuk V2)
 * - Siap di-upgrade ke Redis / DB
 */

const API_KEYS = [
  {
    key: "dev-trustkai-key-123",
    name: "internal-dashboard",
    tier: "basic",
    status: "active",
  },
  {
    key: "dev-trustkai-key-456",
    name: "partner-service",
    tier: "premium",
    status: "active",
  },
];

function getApiKeyRecord(apiKey) {
  return API_KEYS.find((item) => item.key === apiKey) || null;
}

function isApiKeyActive(record) {
  return record && record.status === "active";
}

module.exports = {
  getApiKeyRecord,
  isApiKeyActive,
};

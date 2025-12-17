const {
  getApiKeyRecord,
  isApiKeyActive,
  isApiKeyExpired,
} = require("../services/apiKeyService");

async function apiKeyAuth(request, reply) {
  const headerName = process.env.API_KEY_HEADER || "x-trustkai";
  const apiKey = request.headers[headerName];

  if (!apiKey) {
    return reply.code(401).send({
      error: "API_KEY_MISSING",
      code: "TK-401-001",
    });
  }

  const record = await getApiKeyRecord(apiKey);

  if (!record) {
    return reply.code(403).send({
      error: "API_KEY_INVALID",
      code: "TK-403-001",
    });
  }

  if (!isApiKeyActive(record)) {
    return reply.code(403).send({
      error: "API_KEY_INACTIVE",
      code: "TK-403-002",
    });
  }

  if (isApiKeyExpired(record)) {
    return reply.code(403).send({
      error: "API_KEY_EXPIRED",
      code: "TK-403-003",
    });
  }

  request.apiClient = {
    name: record.name,
    tier: record.tier,
  };
}

module.exports = { apiKeyAuth };

const {
  getApiKeyRecord,
  isApiKeyActive,
} = require("../services/apiKeyService");

function apiKeyAuth(request, reply, done) {
  const headerName = process.env.API_KEY_HEADER || "x-trustkai";
  const apiKey = request.headers[headerName];

  if (!apiKey) {
    return reply.code(401).send({
      error: "API_KEY_MISSING",
      message: "API key is required",
    });
  }

  const record = getApiKeyRecord(apiKey);

  if (!record) {
    return reply.code(403).send({
      error: "API_KEY_INVALID",
      message: "Invalid API key",
    });
  }

  if (!isApiKeyActive(record)) {
    return reply.code(403).send({
      error: "API_KEY_INACTIVE",
      message: "API key is inactive",
    });
  }

  // attach metadata
  request.apiClient = {
    name: record.name,
    tier: record.tier,
  };

  done();
}

module.exports = { apiKeyAuth };

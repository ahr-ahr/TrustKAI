const { isValidApiKey } = require("../services/apiKeyService");

function apiKeyAuth(request, reply, done) {
  const headerName = process.env.API_KEY_HEADER || "x-api-key";
  const apiKey = request.headers[headerName];

  if (!apiKey) {
    return reply.code(401).send({
      error: "API_KEY_MISSING",
      message: "API key is required",
    });
  }

  if (!isValidApiKey(apiKey)) {
    return reply.code(403).send({
      error: "API_KEY_INVALID",
      message: "Invalid API key",
    });
  }

  // API key valid → lanjut
  done();
}

module.exports = { apiKeyAuth };

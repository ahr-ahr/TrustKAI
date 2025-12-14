const { increment } = require("../services/rateLimitStore");

function rateLimit(request, reply, done) {
  const apiKey = request.headers[process.env.API_KEY_HEADER || "x-api-key"];

  const tier = request.apiClient?.tier || "basic";

  const tierLimits = {
    basic: parseInt(process.env.RATE_LIMIT_MAX || "100"),
    premium: parseInt(process.env.RATE_LIMIT_PREMIUM || "300"),
  };

  const max = tierLimits[tier] || tierLimits.basic;
  const windowSec = parseInt(process.env.RATE_LIMIT_WINDOW || "60");

  const key = `rate:${apiKey}`;

  increment(key, windowSec)
    .then((count) => {
      if (count > max) {
        return reply.code(429).send({
          error: "RATE_LIMIT_EXCEEDED",
          message: "Too many requests",
        });
      }

      done();
    })
    .catch((err) => {
      console.error("Rate limit error", err);
      done(); // fail-open (important)
    });
}

module.exports = { rateLimit };

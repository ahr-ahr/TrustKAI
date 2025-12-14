const { increment } = require("../services/rateLimitStore");

function rateLimit(request, reply, done) {
  const apiKey = request.headers[process.env.API_KEY_HEADER || "x-api-key"];

  const max = parseInt(process.env.RATE_LIMIT_MAX || "100");
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

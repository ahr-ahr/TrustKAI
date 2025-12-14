const fastify = require("fastify");

function buildApp() {
  const app = fastify({ logger: true });

  app.register(require("./routes/verifyAccess"));

  return app;
}

module.exports = buildApp;

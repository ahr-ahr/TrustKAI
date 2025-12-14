const fastify = require("fastify");
const verifyAccessRoute = require("./routes/verifyAccess");

function buildApp() {
  const app = fastify({ logger: true });

  app.register(verifyAccessRoute);

  return app;
}

module.exports = buildApp;

const fastify = require("fastify");
const verifyAccessRoute = require("./routes/verifyAccess");

function buildApp() {
  const app = fastify({ logger: true });

  app.register(verifyAccessRoute);

  app.register(require("./routes/admin/apiKeys"), {
    prefix: "/v1/admin",
  });

  return app;
}

module.exports = buildApp;

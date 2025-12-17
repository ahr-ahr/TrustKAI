require("dotenv").config();
const buildApp = require("./app");

async function start() {
  const app = buildApp();
  const PORT = Number(process.env.PORT || 3000);

  try {
    await app.listen({
      port: PORT,
      host: "0.0.0.0",
    });
    console.log(
      JSON.stringify({
        level: "info",
        event: "SERVICE_STARTED",
        app: process.env.APP_NAME || "TrustKAI",
        version: process.env.APP_VERSION || "v2",
        env: process.env.NODE_ENV,
        port: PORT,
        timestamp: new Date().toISOString(),
      })
    );
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

start();

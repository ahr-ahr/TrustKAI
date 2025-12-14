require("dotenv").config();
const buildApp = require("./app");

const app = buildApp();
const PORT = process.env.PORT || 3000;

app.listen({ port: PORT }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 TrustKAI V1 running on port ${PORT}`);
});

require("dotenv").config();
const crypto = require("crypto");
const { redis } = require("../src/services/redisClient");
const { hashApiKey } = require("../src/utils/hash");

function generateApiKey() {
  return "tk_live_" + crypto.randomBytes(24).toString("hex");
}

(async () => {
  const apiKey = generateApiKey();
  const hash = hashApiKey(apiKey);

  const record = {
    name: "partner-service",
    tier: "premium",
    status: "active",
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
  };

  // SET
  await redis.set(`apikey:${hash}`, JSON.stringify(record));

  // 🔥 WAJIB: VERIFIKASI LANGSUNG DARI REDIS
  const verify = await redis.get(`apikey:${hash}`);
  console.log("REDIS VERIFY:", verify);
  console.log("REDIS KEY:", `apikey:${hash}`);

  console.log("🔐 API KEY CREATED");
  console.log("RAW KEY (SAVE IT NOW):", apiKey);

  // 🔥 JANGAN LANGSUNG EXIT
  setTimeout(async () => {
    await redis.quit();
    process.exit(0);
  }, 500);
})();

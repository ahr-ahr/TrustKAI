const Redis = require("ioredis");

let redis;

if (process.env.NODE_ENV === "test") {
  redis = {
    get: async () => null,
    set: async () => null,
    incr: async () => 1,
    expire: async () => null,
    exists: async () => 0,
    quit: async () => null,
  };
  console.log("🧪 Redis mocked (test mode)");
} else {
  redis = new Redis(process.env.REDIS_URL || "redis://127.0.0.1:6379", {
    maxRetriesPerRequest: 1,
  });

  redis.on("connect", () => {
    console.log("🔗 Redis connected");
  });

  redis.on("error", (err) => {
    console.error("❌ Redis error", err);
  });
}

module.exports = { redis };

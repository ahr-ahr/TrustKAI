const crypto = require("crypto");
const { adminAuth } = require("../../middlewares/adminAuth");
const { generateApiKey } = require("../../services/apiKeyGenerator");
const {
  storeApiKey,
  revokeApiKey,
  getApiKeyRecord,
} = require("../../services/apiKeyService");
const {
  createApiKeySchema,
} = require("../../schemas/admin/createApiKeySchema");
const {
  rotateApiKeySchema,
} = require("../../schemas/admin/rotateApiKeySchema");
const {
  revokeApiKeySchema,
} = require("../../schemas/admin/revokeApiKeySchema");
const { auditLog } = require("../../utils/logger");

module.exports = async function (app) {
  // CREATE
  app.post(
    "/api-keys",
    { preHandler: adminAuth, schema: createApiKeySchema },
    async (request, reply) => {
      const {
        name,
        tier = "basic",
        scopes = ["verify:access"],
      } = request.body || {};

      if (!name) {
        return reply.code(400).send({
          code: "TK-400-001",
          error: "NAME_REQUIRED",
        });
      }

      const rawKey = generateApiKey();
      const now = Math.floor(Date.now() / 1000);

      const record = {
        id: "key_" + crypto.randomBytes(4).toString("hex"),
        name,
        tier,
        scopes,
        status: "active",
        created_at: now,
        expires_at: now + 365 * 86400,
        rotated_from: null,
      };

      await storeApiKey(rawKey, record, 365 * 86400);

      auditLog({
        event: "API_KEY_CREATED",
        key_id: record.id,
        name: record.name,
        tier: record.tier,
        scopes: record.scopes,
        actor: "admin",
        ip: request.ip,
      });

      reply.send({
        api_key: rawKey, // ⚠️ hanya muncul sekali
        key_id: record.id,
        expires_at: record.expires_at,
        scopes: record.scopes,
      });
    }
  );

  app.post(
    "/api-keys/rotate",
    { preHandler: adminAuth, schema: rotateApiKeySchema },
    async (request, reply) => {
      const { old_api_key } = request.body || {};

      if (!old_api_key) {
        return reply.code(400).send({
          code: "TK-400-003",
          error: "OLD_API_KEY_REQUIRED",
        });
      }

      const oldRecord = await getApiKeyRecord(old_api_key);

      if (!oldRecord) {
        return reply.code(404).send({
          code: "TK-404-001",
          error: "OLD_API_KEY_NOT_FOUND",
        });
      }

      const newKey = generateApiKey();
      const now = Math.floor(Date.now() / 1000);

      const newRecord = {
        id: "key_" + crypto.randomBytes(4).toString("hex"),
        name: "rotated-key",
        tier: "premium",
        scopes: ["verify:access"],
        status: "active",
        created_at: now,
        expires_at: now + 365 * 86400,
        rotated_from: oldRecord.id,
      };

      await storeApiKey(newKey, newRecord, 365 * 86400);

      auditLog({
        event: "API_KEY_ROTATED",
        old_key_id: oldRecord.id,
        new_key_id: newRecord.id,
        actor: "admin",
        ip: request.ip,
      });

      reply.send({
        new_api_key: newKey,
        expires_at: newRecord.expires_at,
      });
    }
  );

  // REVOKE
  app.delete(
    "/api-keys",
    { preHandler: adminAuth, schema: revokeApiKeySchema },
    async (request, reply) => {
      const { api_key } = request.body || {};

      if (!api_key) {
        return reply.code(400).send({
          code: "TK-400-002",
          error: "API_KEY_REQUIRED",
        });
      }

      await revokeApiKey(api_key);

      auditLog({
        event: "API_KEY_REVOKED",
        key_hash: crypto
          .createHash("sha256")
          .update(api_key)
          .digest("hex")
          .slice(0, 12),
        actor: "admin",
        ip: request.ip,
      });

      reply.send({ status: "revoked" });
    }
  );
};

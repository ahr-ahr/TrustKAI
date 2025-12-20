const { calculateRisk } = require("../engine/riskEngine");
const { makeDecision } = require("../engine/decisionEngine");
const { verifySchema } = require("../schemas/verifySchema");
const { isOutsideOfficeHour } = require("../services/timeService");
const { auditLog } = require("../utils/logger");
const { apiKeyAuth } = require("../middlewares/apiKeyAuth");
const { rateLimit } = require("../middlewares/rateLimit");
const { getConfidenceLevel } = require("../utils/confidence");

const { getDeviceContext } = require("../services/deviceFingerprint");
const { isKnownDevice, rememberDevice } = require("../services/deviceStore");

module.exports = async function (app) {
  app.post(
    "/v1/verify-access",
    { preHandler: [apiKeyAuth, rateLimit], schema: verifySchema },
    async (request, reply) => {
      // 🔐 DEVICE FINGERPRINT (V2)
      const { device_id, confidence } = getDeviceContext(request);

      const known = await isKnownDevice(device_id);
      const deviceIsNew = !known;

      const context = {
        role: request.body.role,
        is_new_device: deviceIsNew,
        outside_office_hour: isOutsideOfficeHour(),
      };

      const { risk, reasons } = calculateRisk(context);
      const decision = makeDecision(risk);
      const riskConfidence = getConfidenceLevel(risk);

      // 🧠 SIMPAN DEVICE DENGAN TTL ADAPTIF
      if (!known) {
        await rememberDevice(device_id, confidence);
      }

      // 🔐 AUDIT LOG
      auditLog({
        event: "ACCESS_DECISION",
        decision,
        risk_score: risk,
        confidence: riskConfidence,
        device_confidence: confidence,
        reasons,
        role: context.role,
        device_id: device_id.slice(0, 12),
        ip: request.ip,
        client: request.apiClient?.name,
        tier: request.apiClient?.tier,
      });

      reply.send({
        decision,
        risk_score: risk,
        confidence: riskConfidence,
        device_confidence: confidence,
        reasons,
        device_id: device_id.slice(0, 12),
      });
    }
  );
};

const { calculateRisk } = require("../engine/riskEngine");
const { makeDecision } = require("../engine/decisionEngine");
const { verifySchema } = require("../schemas/verifySchema");
const { isOutsideOfficeHour } = require("../services/timeService");
const { getDeviceId } = require("../services/deviceService");
const { auditLog } = require("../utils/logger");
const { apiKeyAuth } = require("../middlewares/apiKeyAuth");
const { isKnownDevice, rememberDevice } = require("../services/deviceStore");
const { rateLimit } = require("../middlewares/rateLimit");
const { getConfidenceLevel } = require("../utils/confidence");

module.exports = async function (app) {
  app.post(
    "/v1/verify-access",
    { preHandler: [apiKeyAuth, rateLimit], schema: verifySchema },
    async (request, reply) => {
      const deviceId = getDeviceId(request);

      // 🔑 V2: cek Redis
      const known = await isKnownDevice(deviceId);
      const deviceIsNew = !known;

      const context = {
        role: request.body.role,
        is_new_device: deviceIsNew,
        outside_office_hour: isOutsideOfficeHour(),
      };

      const { risk, reasons } = calculateRisk(context);
      const decision = makeDecision(risk);
      const confidence = getConfidenceLevel(risk);

      // 🧠 simpan device SETELAH decision
      if (!known) {
        await rememberDevice(deviceId);
      }

      // 🔐 AUDIT LOG
      auditLog({
        decision,
        risk_score: risk,
        confidence,
        reasons,
        role: context.role,
        device_id: deviceId.substring(0, 12),
        ip: request.ip,
        client: request.apiClient?.name,
        tier: request.apiClient?.tier,
      });

      return {
        decision,
        risk_score: risk,
        confidence,
        reasons,
        device_id: deviceId.substring(0, 12),
      };
    }
  );
};

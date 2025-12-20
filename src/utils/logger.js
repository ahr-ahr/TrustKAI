const crypto = require("crypto");

function auditLog(event) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    request_id: event.request_id || crypto.randomUUID(),
    app: process.env.APP_NAME || "TrustKAI",
    version: process.env.APP_VERSION || "v1",
    ...event,
  };

  try {
    console.log(JSON.stringify(logEntry));
  } catch (err) {
    // fail-open: audit log TIDAK BOLEH crash app
  }
}

module.exports = { auditLog };

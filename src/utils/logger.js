function auditLog(event) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    app: process.env.APP_NAME || "TrustKAI",
    version: process.env.APP_VERSION || "v1",
    event: "ACCESS_DECISION",
    ...event,
  };

  // V1: log ke stdout (JSON terstruktur)
  console.log(JSON.stringify(logEntry));
}

module.exports = { auditLog };

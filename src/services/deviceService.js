const crypto = require("crypto");

function getDeviceId(request) {
  const ua = request.headers["user-agent"] || "unknown";
  const ip = request.headers["x-forwarded-for"] || request.ip || "0.0.0.0";

  // fingerprint sederhana (V1)
  const raw = `${ua}|${ip}`;
  return crypto.createHash("sha256").update(raw).digest("hex");
}

/**
 * V1: anggap device baru jika tidak ada device_id sebelumnya
 * (nanti di V2 bisa dibandingkan dengan storage/Redis)
 */
function isNewDevice(deviceId, knownDevices = []) {
  return !knownDevices.includes(deviceId);
}

module.exports = { getDeviceId, isNewDevice };

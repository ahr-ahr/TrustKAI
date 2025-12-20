const crypto = require("crypto");

function normalize(str = "") {
  return String(str).toLowerCase().trim();
}

function partialIp(ip = "") {
  // IPv4: ambil /24 → 192.168.1.x
  const v4 = ip.match(/^(\d+)\.(\d+)\.(\d+)\./);
  if (v4) return `${v4[1]}.${v4[2]}.${v4[3]}.0`;

  // IPv6: ambil prefix pendek
  return ip.split(":").slice(0, 3).join(":");
}

function buildFingerprint(request) {
  const ua = normalize(request.headers["user-agent"]);
  const lang = normalize(request.headers["accept-language"]);
  const chUa = normalize(request.headers["sec-ch-ua"]);
  const ipRaw = request.headers["x-forwarded-for"] || request.ip || "";

  const ip = normalize(partialIp(ipRaw));

  const raw = [ua, lang, chUa, ip].join("|");
  const hash = crypto.createHash("sha256").update(raw).digest("hex");

  return `dfp_${hash}`;
}

function confidenceFromSignals({ hasChUa, hasLang }) {
  if (hasChUa && hasLang) return "HIGH";
  if (hasLang) return "MEDIUM";
  return "LOW";
}

function getDeviceContext(request) {
  const device_id = buildFingerprint(request);
  const hasLang = !!request.headers["accept-language"];
  const hasChUa = !!request.headers["sec-ch-ua"];

  return {
    device_id,
    confidence: confidenceFromSignals({ hasChUa, hasLang }),
  };
}

module.exports = { getDeviceContext };

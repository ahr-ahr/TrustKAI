const crypto = require("crypto");

function hashApiKey(apiKey) {
  return crypto
    .createHash("sha256")
    .update(apiKey + process.env.API_KEY_SALT)
    .digest("hex");
}

module.exports = { hashApiKey };

/**
 * V2: API Key Service
 * NOTE:
 * - Untuk V2 awal, API key masih hardcoded
 * - Nanti di-upgrade ke DB / Redis
 */

const VALID_API_KEYS = ["dev-trustkai-key-123", "dev-trustkai-key-456"];

function isValidApiKey(apiKey) {
  return VALID_API_KEYS.includes(apiKey);
}

module.exports = { isValidApiKey };

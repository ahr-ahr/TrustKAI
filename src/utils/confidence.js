function getConfidenceLevel(riskScore) {
  if (riskScore <= 20) return "LOW";
  if (riskScore <= 50) return "MEDIUM";
  return "HIGH";
}

module.exports = { getConfidenceLevel };

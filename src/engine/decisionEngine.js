function makeDecision(risk) {
  const challengeThreshold = Number(process.env.RISK_CHALLENGE_THRESHOLD || 40);
  const blockThreshold = Number(process.env.RISK_BLOCK_THRESHOLD || 70);

  if (risk >= blockThreshold) {
    return "BLOCK";
  }

  if (risk >= challengeThreshold) {
    return "CHALLENGE";
  }

  return "ALLOW";
}

module.exports = { makeDecision };

function calculateRisk(context) {
  let risk = 0;
  let reasons = [];

  if (context.is_new_device) {
    risk += 30;
    reasons.push("NEW_DEVICE");
  }

  if (context.outside_office_hour) {
    risk += 25;
    reasons.push("OUTSIDE_OFFICE_HOUR");
  }

  if (context.role === "admin") {
    risk += 10;
    reasons.push("ADMIN_ROLE");
  }

  return { risk, reasons };
}

module.exports = { calculateRisk };

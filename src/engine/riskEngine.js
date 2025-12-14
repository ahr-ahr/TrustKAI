const policy = require("../policies/riskPolicy");

function calculateRisk(context) {
  let risk = 0;
  let reasons = [];

  // Device rule
  if (context.is_new_device) {
    risk += policy.device.new;
    reasons.push("NEW_DEVICE");
  } else {
    risk += policy.device.known;
    reasons.push("KNOWN_DEVICE");
  }

  // Time rule
  if (context.outside_office_hour) {
    risk += policy.time.outsideOfficeHour;
    reasons.push("OUTSIDE_OFFICE_HOUR");
  }

  // Role rule
  if (policy.role[context.role] !== undefined) {
    risk += policy.role[context.role];
    reasons.push(context.role.toUpperCase() + "_ROLE");
  }

  return { risk, reasons };
}

module.exports = { calculateRisk };

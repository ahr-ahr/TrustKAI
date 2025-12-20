/**
 * Risk Policy Configuration
 * V2: Config-driven risk rules
 */

module.exports = {
  device: {
    new: 30,
    known: -10,
    low_confidence_bonus: 10,
  },
  time: {
    outsideOfficeHour: 25,
  },
  role: {
    admin: 10,
    user: 0,
  },
};

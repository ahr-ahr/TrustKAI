function isOutsideOfficeHour(date = new Date()) {
  const startHour = Number(process.env.OFFICE_START_HOUR || 8);
  const endHour = Number(process.env.OFFICE_END_HOUR || 17);

  const hour = date.getHours(); // 0–23

  // di luar jam kerja
  return hour < startHour || hour >= endHour;
}

module.exports = { isOutsideOfficeHour };

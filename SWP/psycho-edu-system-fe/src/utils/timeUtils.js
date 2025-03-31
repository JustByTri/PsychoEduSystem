export const getTimeFromSlotId = (slotId) => {
  const times = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
  ];
  return times[slotId - 1] || "Unknown";
};

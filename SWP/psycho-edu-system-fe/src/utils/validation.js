export const validateStep = (step, bookingData) => {
  const {
    role,
    selectedDate,
    selectedTime,
    appointmentType,
    selectedConsultant,
    selectedChild,
    userInfo,
  } = bookingData;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  switch (step) {
    case 1:
      if (!role) {
        return "Please select a role";
      }
      break;

    case 2:
      if (!selectedDate || !selectedTime || !appointmentType) {
        return "Please select date, time and appointment type";
      }
      break;

    case 3:
      if (!selectedConsultant) {
        return "Please select a consultant";
      }
      if (role === "parent" && !selectedChild) {
        return "Please select a child";
      }
      break;

    case 4:
      if (!userInfo.name || !userInfo.phone || !userInfo.email) {
        return "Please fill in all required fields";
      }
      if (!emailRegex.test(userInfo.email)) {
        return "Please enter a valid email address";
      }
      if (!phoneRegex.test(userInfo.phone)) {
        return "Please enter a valid 10-digit phone number";
      }
      break;

    default:
      return true;
  }

  return true;
};

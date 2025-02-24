// utils/validation.js

export const validateStep = (step, bookingData) => {
  const { userRole, children } = bookingData;

  // Adjust validation based on user role and flow
  if (userRole === "parent" && children?.length > 1) {
    // Parent with multiple children
    switch (step) {
      case 1: // Child selection
        if (!bookingData.childId) return "Please select a child";
        break;
      case 2: // Consultant type selection
        if (!bookingData.consultantType)
          return "Please select a consultant type";
        break;
      case 3: // Consultant selection (only if counselor type)
        if (
          bookingData.consultantType === "counselor" &&
          !bookingData.consultantId
        )
          return "Please select a counselor";
        break;
      case 4: // Date/time selection
        if (!bookingData.date || !bookingData.time)
          return "Please select a date and time";
        break;
      case 5: // User info form
        if (!validateUserInfo(bookingData))
          return "Please complete all required fields";
        break;
    }
  } else if (userRole === "parent") {
    // Parent with single child
    switch (step) {
      case 1: // Consultant type selection
        if (!bookingData.consultantType)
          return "Please select a consultant type";
        break;
      case 2: // Consultant selection (only if counselor type)
        if (
          bookingData.consultantType === "counselor" &&
          !bookingData.consultantId
        )
          return "Please select a counselor";
        break;
      case 3: // Date/time selection
        if (!bookingData.date || !bookingData.time)
          return "Please select a date and time";
        break;
      case 4: // User info form
        if (!validateUserInfo(bookingData))
          return "Please complete all required fields";
        break;
    }
  } else {
    // Student flow
    switch (step) {
      case 1: // Consultant type selection
        if (!bookingData.consultantType)
          return "Please select a consultant type";
        break;
      case 2: // Consultant selection (only if counselor type)
        if (
          bookingData.consultantType === "counselor" &&
          !bookingData.consultantId
        )
          return "Please select a counselor";
        break;
      case 3: // Date/time selection
        if (!bookingData.date || !bookingData.time)
          return "Please select a date and time";
        break;
      case 4: // User info form
        if (!validateUserInfo(bookingData))
          return "Please complete all required fields";
        break;
    }
  }

  return true;
};

// Helper function to validate user info
const validateUserInfo = (bookingData) => {
  const { name, email, phone, reasonForBooking } = bookingData;

  if (!name || name.trim() === "") return false;
  if (!email || !email.includes("@")) return false;
  if (!phone || phone.length < 10) return false;
  if (!reasonForBooking || reasonForBooking.trim() === "") return false;

  return true;
};

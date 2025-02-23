// context/BookingContext.js
import { createContext, useContext, useState } from "react";

const BookingContext = createContext();

export const useBooking = () => {
  return useContext(BookingContext);
};

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    // User info
    userId: "",
    userName: "",
    userRole: "",

    // Child info (for parents)
    childId: "",
    childName: "",

    // Consultant info
    consultantType: "", // "counselor" or "homeroom"
    consultantId: "",
    consultantName: "",
    isHomeroomTeacher: false,

    // Booking details
    date: "",
    time: "",
    duration: 30, // default duration in minutes

    // Additional info
    reasonForBooking: "",
    additionalNotes: "",

    // Contact info (for confirmation)
    email: "",
    phone: "",
  });

  const updateBookingData = (newData) => {
    setBookingData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const resetBookingData = () => {
    setBookingData({
      userId: "",
      userName: "",
      userRole: "",
      childId: "",
      childName: "",
      consultantType: "",
      consultantId: "",
      consultantName: "",
      isHomeroomTeacher: false,
      date: "",
      time: "",
      duration: 30,
      reasonForBooking: "",
      additionalNotes: "",
      email: "",
      phone: "",
    });
  };

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        updateBookingData,
        resetBookingData,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

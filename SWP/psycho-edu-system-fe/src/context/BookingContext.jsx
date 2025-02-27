import { createContext, useContext, useState, useEffect } from "react";
import { getAuthDataFromLocalStorage } from "../utils/auth";

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
    consultantType: "",
    consultantId: "",
    consultantName: "",
    isHomeroomTeacher: false,
    availableSlots: [], // Thêm trường để lưu availableSlots của consultant
    // Booking details
    date: "",
    time: "",
    slotId: 0,
    appointmentType: "online", // Thêm trường để lưu loại appointment
    duration: 30,
    reasonForBooking: "",
    additionalNotes: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const authData = getAuthDataFromLocalStorage();
    if (authData) {
      updateBookingData({
        userId: authData.userId,
        userRole: authData.role,
        email: authData.email,
        userName: authData.username || "",
      });
    }
  }, []);

  const updateBookingData = (newData) => {
    setBookingData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const resetBookingData = () => {
    const authData = getAuthDataFromLocalStorage();
    setBookingData({
      userId: authData?.userId || "",
      userName: authData?.username || "",
      userRole: authData?.role || "",
      email: authData?.email || "",
      childId: "",
      childName: "",
      consultantType: "",
      consultantId: "",
      consultantName: "",
      isHomeroomTeacher: false,
      availableSlots: [], // Reset availableSlots
      date: "",
      time: "",
      slotId: 0,
      appointmentType: "online", // Reset appointmentType
      duration: 30,
      reasonForBooking: "",
      additionalNotes: "",
      phone: "",
    });
  };

  const isParent = () => bookingData.userRole === "Parent";
  const isStudent = () => bookingData.userRole === "Student";

  return (
    <BookingContext.Provider
      value={{
        bookingData,
        updateBookingData,
        resetBookingData,
        isParent,
        isStudent,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

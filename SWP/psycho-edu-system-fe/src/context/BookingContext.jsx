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
    consultantType: "", // "counselor" or "homeroom"
    consultantId: "",
    consultantName: "",
    isHomeroomTeacher: false,

    // Booking details
    date: "",
    time: "",
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
      date: "",
      time: "",
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

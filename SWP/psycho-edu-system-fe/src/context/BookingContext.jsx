// context/BookingContext.jsx
import { createContext, useContext, useState } from "react";
import { getAuthDataFromLocalStorage } from "../utils/auth"; // Đảm bảo import

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    userId: "",
    childId: "", // Thêm field để lưu ID của child được chọn
    consultantType: "",
    consultantId: "",
    consultantName: "",
    date: "",
    time: "",
    slotId: 0,
    appointmentType: "online",
    userName: "",
    phone: "",
    email: "",
    isHomeroomTeacher: false,
  });

  const resetBookingData = () => {
    setBookingData({
      userId: "",
      childId: "",
      consultantType: "",
      consultantId: "",
      consultantName: "",
      date: "",
      time: "",
      slotId: 0,
      appointmentType: "online",
      userName: "",
      phone: "",
      email: "",
      isHomeroomTeacher: false,
    });
  };

  const updateBookingData = (newData) => {
    setBookingData((prev) => ({ ...prev, ...newData }));
  };

  const isParent = () => {
    const authData = getAuthDataFromLocalStorage();
    return authData?.role === "Parent"; // Giả định role trong authData, bạn có thể điều chỉnh logic
  };

  const value = {
    bookingData,
    updateBookingData,
    resetBookingData,
    isParent,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
};

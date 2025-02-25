import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  FaCalendarAlt,
  FaClock,
  FaVideo,
  FaBuilding,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

import { consultantService } from "../../../api/services/consultant";
import { useBooking } from "../../../context/BookingContext";

export const DateTimeSelection = () => {
  const { bookingData, updateBookingData } = useBooking();

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Thêm timeSlots cố định để test
  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  // Fetch available slots từ API
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (bookingData.consultantId && bookingData.date) {
        try {
          setLoading(true);
          const slots = await consultantService.getAvailableSlots(
            bookingData.consultantId,
            bookingData.date
          );
          setAvailableSlots(slots);
        } catch (error) {
          console.error("Failed to fetch available slots:", error);
          // Nếu API fail, sử dụng timeSlots mặc định
          setAvailableSlots(timeSlots);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAvailableSlots();
  }, [bookingData.consultantId, bookingData.date]);

  // Tính toán các ngày trong tháng
  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  // Kiểm tra slot đã được đặt
  const isSlotBooked = (time) => {
    // Thêm logic kiểm tra slot đã book
    return (
      bookingData.consultantId &&
      bookingData.bookedSlots?.includes(`${bookingData.date} ${time}`)
    );
  };

  // Hàm xử lý khi chọn ngày
  const handleSelectDate = (dateString) => {
    updateBookingData({
      date: dateString,
      time: "", // Reset time when date changes
    });
  };

  // Hàm xử lý khi chọn giờ
  const handleSelectTime = (timeString) => {
    updateBookingData({
      time: timeString,
    });
  };

  // Hàm xử lý khi chọn loại cuộc hẹn
  const handleSelectAppointmentType = (type) => {
    updateBookingData({
      appointmentType: type,
    });
  };

  return (
    <div className="space-y-6">
      {/* Calendar Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Date</h3>
        <div className="p-4 border rounded-lg">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaCalendarAlt className="text-2xl text-gray-600 mr-2" />
              <span className="font-medium">
                {format(currentMonth, "MMMM yyyy")}
              </span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handlePrevMonth}
                disabled={currentMonth <= new Date()}
                className="text-blue-600 hover:text-blue-700 disabled:text-gray-400"
              >
                <FaArrowLeft className="inline mr-1" /> Prev Month
              </button>
              <button
                onClick={handleNextMonth}
                className="text-blue-600 hover:text-blue-700"
              >
                Next Month <FaArrowRight className="inline ml-1" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-600"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {Array(firstDayOfMonth)
              .fill(null)
              .map((_, index) => (
                <div key={`empty-${index}`} />
              ))}
            {days.map((day) => {
              const date = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                day
              );
              const isDisabled = date < new Date();
              const dateString = format(date, "yyyy-MM-dd");
              return (
                <button
                  key={day}
                  onClick={() => !isDisabled && handleSelectDate(dateString)}
                  disabled={isDisabled}
                  className={`p-2 rounded-lg ${
                    bookingData.date === dateString
                      ? "bg-blue-600 text-white"
                      : isDisabled
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "hover:bg-blue-50"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Time Slots Section */}
      {bookingData.date && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Select Time</h3>
          {loading ? (
            <div className="text-center py-4">Loading available slots...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {timeSlots.map((time) => {
                const isBooked = isSlotBooked(time);
                return (
                  <button
                    key={time}
                    onClick={() => !isBooked && handleSelectTime(time)}
                    disabled={isBooked}
                    className={`p-3 rounded-lg border ${
                      isBooked
                        ? "bg-red-50 border-red-200 cursor-not-allowed"
                        : bookingData.time === time
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-600"
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <FaClock className="mr-2" />
                      {time}
                      {isBooked && (
                        <span className="ml-2 text-red-500 text-sm">
                          (Booked)
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Appointment Type Selection */}
      {bookingData.time && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">
            Select Appointment Type
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleSelectAppointmentType("video")}
              className={`p-4 rounded-lg border ${
                bookingData.appointmentType === "video"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200"
              } hover:border-blue-600`}
            >
              <div className="flex items-center">
                <FaVideo className="text-2xl mr-3 text-gray-600" />
                <span>Video Call</span>
              </div>
            </button>
            <button
              onClick={() => handleSelectAppointmentType("in-person")}
              className={`p-4 rounded-lg border ${
                bookingData.appointmentType === "in-person"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200"
              } hover:border-blue-600`}
            >
              <div className="flex items-center">
                <FaBuilding className="text-2xl mr-3 text-gray-600" />
                <span>In-Person</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

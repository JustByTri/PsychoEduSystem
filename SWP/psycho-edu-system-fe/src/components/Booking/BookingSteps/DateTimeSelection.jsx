import { useState, useEffect, useCallback } from "react";
import { useBooking } from "../../../context/BookingContext";
import { getAuthDataFromLocalStorage } from "../../../utils/auth";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  isBefore,
  startOfDay,
} from "date-fns";
import { Box, Typography, Button } from "@mui/material";

export const DateTimeSelection = () => {
  const { updateBookingData, bookingData } = useBooking();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [slots] = useState([
    { id: 1, time: "8:00" },
    { id: 2, time: "9:00" },
    { id: 3, time: "10:00" },
    { id: 4, time: "11:00" },
    { id: 5, time: "13:00" },
    { id: 6, time: "14:00" },
    { id: 7, time: "15:00" },
    { id: 8, time: "16:00" },
  ]);
  const [availableSlotsCache, setAvailableSlotsCache] = useState({});
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointmentType, setAppointmentType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ open: false, message: "" });

  const fetchAvailableSlots = useCallback(
    async (date, consultantId) => {
      const dateKey = format(date, "yyyy-MM-dd");
      if (availableSlotsCache[dateKey]) {
        setAvailableSlots(availableSlotsCache[dateKey]);
        return availableSlotsCache[dateKey];
      }

      setIsLoading(true);
      try {
        const authData = getAuthDataFromLocalStorage();
        const response = await axios.get(
          `https://localhost:7192/api/User/${consultantId}/slots?selectedDate=${dateKey}`,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const slotsData = (response.data.result || response.data).filter(
          (id) => id >= 1 && id <= 8
        );
        setAvailableSlotsCache((prev) => ({ ...prev, [dateKey]: slotsData }));
        setAvailableSlots(slotsData);
        if (!slotsData.length) {
          setErrorModal({
            open: true,
            message: "No available slots for this date.",
          });
        }
        return slotsData;
      } catch (error) {
        setAvailableSlots([]);
        setErrorModal({
          open: true,
          message:
            error.response?.data?.message ||
            "Failed to fetch available slots. Please try again.",
        });
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [availableSlotsCache]
  );

  useEffect(() => {
    if (bookingData.consultantId && selectedDate) {
      fetchAvailableSlots(selectedDate, bookingData.consultantId);
    }
  }, [bookingData.consultantId, selectedDate, fetchAvailableSlots]);

  const daysInMonth = useCallback(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    const firstDayOfWeek = getDay(start);
    const result = [];

    // Thêm các ô trống trước ngày đầu tiên của tháng
    for (let i = 0; i < firstDayOfWeek; i++) {
      result.push(null);
    }

    // Thêm các ngày trong tháng
    days.forEach((day) => {
      result.push({
        day: format(day, "d"),
        weekday: format(day, "EEE")[0], // Lấy chữ cái đầu của thứ (S, M, T, ...)
        fullDate: day,
      });
    });

    // Điền các ô trống để đủ 42 slot (6 tuần)
    while (result.length < 42) {
      result.push(null);
    }

    return result;
  }, [currentMonth]);

  const days = daysInMonth();
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  const handleDayClick = useCallback(
    async (fullDate) => {
      const today = startOfDay(new Date());
      if (isBefore(fullDate, today)) return;

      setSelectedDate(fullDate);
      const dateStr = format(fullDate, "yyyy-MM-dd");
      updateBookingData({
        date: dateStr,
        time: null,
        slotId: null,
        appointmentType: null,
      });

      if (bookingData.consultantId) {
        await fetchAvailableSlots(fullDate, bookingData.consultantId);
      }
    },
    [bookingData.consultantId, updateBookingData, fetchAvailableSlots]
  );

  const handleNextMonth = () =>
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1)
    );
  const handlePrevMonth = () =>
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1)
    );

  const handleSelectSlot = (slot) => {
    if (availableSlots.includes(slot.id)) {
      updateBookingData({
        time: slot.time,
        slotId: slot.id,
      });
    }
  };

  const handleSelectAppointmentType = (type) => {
    setAppointmentType(type);
    updateBookingData({ appointmentType: type });
  };

  const closeErrorModal = () => setErrorModal({ open: false, message: "" });

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-600"
      >
        Loading available slots...
      </motion.div>
    );
  }

  return (
    <Box className="py-6">
      <Typography
        variant="h5"
        sx={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          color: "#333",
          mb: 4,
          textAlign: "center",
        }}
      >
        Select Date, Time, and Appointment Type
      </Typography>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-orange-100 p-6 rounded-2xl shadow-xl mb-8"
      >
        <Box className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <Button
            onClick={handlePrevMonth}
            variant="contained"
            sx={{
              backgroundColor: "#1e88e5",
              "&:hover": { backgroundColor: "#1565c0" },
              textTransform: "none",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Back
          </Button>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: "#333",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {format(currentMonth, "MMMM yyyy")}
          </Typography>
          <Button
            onClick={handleNextMonth}
            variant="contained"
            sx={{
              backgroundColor: "#1e88e5",
              "&:hover": { backgroundColor: "#1565c0" },
              textTransform: "none",
              fontFamily: "Inter, sans-serif",
            }}
          >
            Next
          </Button>
        </Box>
        <Typography
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: "1rem",
            color: "#555",
            textAlign: "center",
            mb: 4,
          }}
        >
          Selected: {format(selectedDate, "eeee, dd/MM/yyyy")}
        </Typography>
        <div className="grid grid-cols-7 gap-2">
          {weekdays.map((weekday, index) => (
            <Typography
              key={`weekday-${index}`}
              sx={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 600,
                color: "#666",
                textAlign: "center",
              }}
            >
              {weekday}
            </Typography>
          ))}
        </div>
        <motion.div
          className="grid grid-cols-7 gap-2 mt-4"
          key={format(currentMonth, "yyyy-MM")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {days.map((d, index) =>
            d ? (
              <motion.button
                key={`${format(currentMonth, "yyyy-MM")}-${index}`}
                className={`w-full h-12 flex items-center justify-center rounded-xl font-medium transition-all duration-300 shadow-md ${
                  format(d.fullDate, "yyyy-MM-dd") ===
                  format(selectedDate, "yyyy-MM-dd")
                    ? "bg-green-500 text-white"
                    : isBefore(d.fullDate, startOfDay(new Date()))
                    ? "bg-gray-200 cursor-not-allowed opacity-50"
                    : "bg-blue-200 hover:bg-blue-300"
                }`}
                onClick={() => handleDayClick(d.fullDate)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isBefore(d.fullDate, startOfDay(new Date()))}
              >
                <Typography
                  sx={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                >
                  {d.day}
                </Typography>
              </motion.button>
            ) : (
              <div
                key={`${format(currentMonth, "yyyy-MM")}-${index}`}
                className="w-full h-12 bg-gray-100 rounded-xl"
              />
            )
          )}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 gap-6"
      >
        <Box className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "1.25rem",
              color: "#333",
              mb: 2,
            }}
          >
            Available Time Slots
          </Typography>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {slots.map((slot, index) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`p-4 border rounded-md cursor-pointer transition-colors ${
                  bookingData.time === slot.time &&
                  availableSlots.includes(slot.id)
                    ? "border-green-500 bg-green-50"
                    : availableSlots.includes(slot.id)
                    ? "border-gray-200 hover:border-green-300 hover:bg-green-50"
                    : "border-gray-200 bg-gray-100 cursor-not-allowed opacity-50"
                }`}
                onClick={() => handleSelectSlot(slot)}
              >
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    textAlign: "center",
                    color: "#333",
                  }}
                >
                  {slot.time}
                </Typography>
              </motion.div>
            ))}
          </div>
        </Box>

        <Box className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              fontSize: "1.25rem",
              color: "#333",
              mb: 2,
            }}
          >
            Select Appointment Type
          </Typography>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {["Online", "Offline"].map((type, index) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 border rounded-md cursor-pointer transition-colors ${
                  appointmentType === type
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                }`}
                onClick={() => handleSelectAppointmentType(type)}
              >
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    textAlign: "center",
                    color: "#333",
                  }}
                >
                  {type}
                </Typography>
              </motion.div>
            ))}
          </div>
        </Box>
      </motion.div>

      <AnimatePresence>
        {errorModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
            >
              <Typography
                variant="h6"
                sx={{
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 700,
                  color: "#ef5350",
                  mb: 2,
                  textAlign: "center",
                }}
              >
                Notification
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Inter, sans-serif",
                  color: "#333",
                  textAlign: "center",
                  mb: 4,
                }}
              >
                {errorModal.message}
              </Typography>
              <Box className="flex justify-center">
                <Button
                  onClick={closeErrorModal}
                  variant="contained"
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    backgroundColor: "#ef5350",
                    "&:hover": { backgroundColor: "#d32f2f" },
                    textTransform: "none",
                    px: 4,
                  }}
                >
                  Close
                </Button>
              </Box>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

import { useState, useEffect } from "react";
import { useBooking } from "../../../context/BookingContext";
import { getAuthDataFromLocalStorage } from "../../../utils/auth";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import moment from "moment";
import { Box, Typography, Button } from "@mui/material";

export const DateTimeSelection = () => {
  const { updateBookingData, bookingData } = useBooking();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [slots, setSlots] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [appointmentType, setAppointmentType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const slotTimes = [
      { id: 1, time: "8:00" },
      { id: 2, time: "9:00" },
      { id: 3, time: "10:00" },
      { id: 4, time: "11:00" },
      { id: 5, time: "13:00" },
      { id: 6, time: "14:00" },
      { id: 7, time: "15:00" },
      { id: 8, time: "16:00" },
    ];
    setSlots(slotTimes);
  }, []);

  const fetchAvailableSlots = async (date, consultantId) => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const authData = getAuthDataFromLocalStorage();
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const response = await axios.get(
        `https://localhost:7192/api/User/${consultantId}/slots?selectedDate=${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const slotsData = response.data.result || response.data || [];
        if (Array.isArray(slotsData)) {
          const filteredSlots = slotsData.filter(
            (slotId) => slotId >= 1 && slotId <= 8
          );
          setAvailableSlots(filteredSlots);
          if (filteredSlots.length === 0) {
            setErrorMessage("No available slots for this date.");
            setIsErrorModalOpen(true);
          }
        } else {
          setAvailableSlots([]);
          setErrorMessage("No available slots for this date.");
          setIsErrorModalOpen(true);
        }
      }
    } catch (error) {
      setAvailableSlots([]);
      setErrorMessage("No available slots on this date.");
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const daysInMonth = () => {
    const days = [];
    const startOfMonth = moment(currentMonth).startOf("month");
    const endOfMonth = moment(currentMonth).endOf("month");
    const totalDays = endOfMonth.date();
    const firstDayOfWeek = startOfMonth.day();
    const totalSlots = 42;

    for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
    for (let i = 0; i < totalDays; i++) {
      const date = startOfMonth.clone().add(i, "days").toDate();
      days.push({
        day: moment(date).date(),
        weekday: ["S", "M", "T", "W", "T", "F", "S"][moment(date).day()],
        fullDate: date,
      });
    }
    const remainingSlots = totalSlots - days.length;
    for (let i = 0; i < remainingSlots; i++) days.push(null);

    return days;
  };

  const days = daysInMonth();
  const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

  const handleDayClick = (fullDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (fullDate < today) return;
    setSelectedDate(fullDate);
    updateBookingData({
      date: moment(fullDate).format("YYYY-MM-DD"),
      time: null,
      slotId: null,
      appointmentType: null,
    });
    if (bookingData.consultantId)
      fetchAvailableSlots(fullDate, bookingData.consultantId);
  };

  const handleNextMonth = () =>
    setCurrentMonth(moment(currentMonth).add(1, "month"));
  const handlePrevMonth = () =>
    setCurrentMonth(moment(currentMonth).subtract(1, "month"));

  const handleSelectSlot = (slot) => {
    if (availableSlots.includes(slot.id)) {
      updateBookingData({
        date: moment(selectedDate).format("YYYY-MM-DD"),
        time: slot.time,
        slotId: slot.id,
      });
    }
  };

  const handleSelectAppointmentType = (type) => {
    setAppointmentType(type);
    updateBookingData({ appointmentType: type });
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
    setErrorMessage("");
  };

  if (isLoading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-600"
      >
        Loading available slots...
      </motion.div>
    );
  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-red-600"
      >
        Error: {error}
      </motion.div>
    );

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
            {moment(currentMonth).format("MMMM YYYY")}
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
          Selected: {moment(selectedDate).format("dddd, DD/MM/YYYY")}
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
          key={currentMonth.format("YYYY-MM")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {days.map((d, index) =>
            d ? (
              <motion.button
                key={`${currentMonth.format("YYYY-MM")}-${index}`}
                className={`w-full h-12 flex items-center justify-center rounded-xl font-medium transition-all duration-300 shadow-md ${
                  moment(d.fullDate).isSame(selectedDate, "day")
                    ? "bg-green-500 text-white"
                    : moment(d.fullDate).isBefore(moment(), "day")
                    ? "bg-gray-200 cursor-not-allowed opacity-50"
                    : "bg-blue-200 hover:bg-blue-300"
                }`}
                onClick={() => handleDayClick(d.fullDate)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={moment(d.fullDate).isBefore(moment(), "day")}
              >
                <Typography
                  sx={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                >
                  {d.day}
                </Typography>
              </motion.button>
            ) : (
              <div
                key={`${currentMonth.format("YYYY-MM")}-${index}`}
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
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Typography>
              </motion.div>
            ))}
          </div>
        </Box>
      </motion.div>

      <AnimatePresence>
        {isErrorModalOpen && (
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
                {errorMessage}
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

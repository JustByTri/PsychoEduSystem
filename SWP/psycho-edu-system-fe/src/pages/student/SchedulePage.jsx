/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Box,
  Modal,
  Fade,
  Button,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthDataFromLocalStorage } from "../../utils/auth";
import moment from "moment";
import { Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SchedulePage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedEventToCancel, setSelectedEventToCancel] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userProfile, setUserProfile] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const authData = getAuthDataFromLocalStorage();
  const userId = authData?.userId;

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

  useEffect(() => {
    if (!userId) {
      setError("User ID not found in token. Please log in again.");
      setIsLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        setIsLoading(true);

        const profileResponse = await axios.get(
          `https://localhost:7192/api/User/profile?userId=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (profileResponse.status === 200 && profileResponse.data.isSuccess) {
          setUserProfile(profileResponse.data.result);
        }

        const selectedDateStr = moment(selectedDate).format("YYYY-MM-DD");
        const response = await axios.get(
          `https://localhost:7192/api/appointments/students/${userId}/appointments?selectedDate=${selectedDateStr}`,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 && response.data.isSuccess) {
          const appointments = response.data.result || [];
          const events = appointments.map((appointment) => {
            const startDateTime = moment(
              `${appointment.date
                .split("/")
                .reverse()
                .join("-")} ${getTimeFromSlotId(appointment.slotId)}`,
              "YYYY-MM-DD HH:mm"
            ).toDate();
            const endDateTime = moment(startDateTime)
              .add(60, "minutes")
              .toDate();

            let title = `Meeting with ${appointment.meetingWith}`;
            if (appointment.meetingWith === "Counselor")
              title = "Mental Health Support";
            else if (appointment.meetingWith === "Teacher")
              title = "Career Guidance";

            return {
              id: appointment.appointmentId,
              title: `${title}  ${appointment.isOnline ? "Online" : "Offline"}`,
              start: startDateTime,
              end: endDateTime,
              details: {
                studentId: appointment.appointmentFor || userId,
                consultantId: appointment.meetingWith,
                bookedBy: appointment.bookedBy,
                appointmentFor: appointment.appointmentFor,
                date: appointment.date.split("/").reverse().join("-"),
                slotId: appointment.slotId,
                meetingType: appointment.isOnline ? "Online" : "Offline",
                isCompleted: appointment.isCompleted,
                isCancelled: appointment.isCancelled,
              },
            };
          });
          setBookings(events);
        } else {
          setBookings([]);
        }
      } catch (error) {
        setBookings([]);
        toast.error("Failed to load schedule.", { position: "top-right" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [userId, authData?.accessToken, selectedDate]);

  const getTimeFromSlotId = (slotId) => {
    const times = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
    ];
    return times[slotId - 1] || "Unknown";
  };

  const handleSelectEvent = (event) => setSelectedEvent(event);
  const closeModal = () => setSelectedEvent(null);

  const handleCancelAppointment = async () => {
    if (!selectedEvent) return;

    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://localhost:7192/api/appointments/${selectedEvent.id}/cancellation`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.isSuccess && response.data.statusCode === 200) {
        setBookings((prev) =>
          prev.map((booking) =>
            booking.id === selectedEvent.id
              ? {
                  ...booking,
                  details: { ...booking.details, isCancelled: true },
                }
              : booking
          )
        );
        setSelectedEvent((prev) => ({
          ...prev,
          details: { ...prev.details, isCancelled: true },
        }));
        setIsConfirmModalOpen(false);
        setSelectedEventToCancel(null);
        setSelectedEvent(null);
        setIsSuccessModalOpen(true);
        toast.success("Appointment cancelled successfully!", {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error("Failed to cancel appointment.", { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };

  const openConfirmModal = (event) => {
    setSelectedEventToCancel(event);
    setIsConfirmModalOpen(true);
  };

  const confirmCancelAppointment = () => handleCancelAppointment();
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedEventToCancel(null);
  };
  const closeSuccessModal = () => setIsSuccessModalOpen(false);

  const handleDayClick = (fullDate) => setSelectedDate(fullDate);
  const handleNextMonth = () =>
    setCurrentMonth(moment(currentMonth).add(1, "month"));
  const handlePrevMonth = () =>
    setCurrentMonth(moment(currentMonth).subtract(1, "month"));
  const handleClearFilters = () => {
    setSelectedDate(new Date());
    setCurrentMonth(moment());
  };

  const filteredBookings = bookings.filter((booking) =>
    moment(booking.start).isSame(selectedDate, "day")
  );

  const getStatus = (event) => {
    const { isCompleted, isCancelled } = event.details;
    if (isCancelled) return "Cancelled";
    if (isCompleted) return "Completed";
    return "Booked";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress size={40} sx={{ color: "#3b82f6" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-6">
        <Typography variant="h6">{error}</Typography>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-gray-900 flex flex-col max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-8"
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            textAlign: "center",
            background: "linear-gradient(to right, #1e88e5, #8e24aa)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          My Schedule
        </Typography>
        {userProfile && (
          <Typography
            variant="body1"
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: "1rem",
              color: "#555",
              textAlign: "center",
              mt: 1,
            }}
          >
            Welcome, {userProfile.fullName || "User"}
          </Typography>
        )}
      </motion.div>

      {/* Calendar Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="bg-orange-100 p-6 rounded-2xl shadow-xl"
      >
        <Box className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <Button
            onClick={handlePrevMonth}
            variant="contained"
            className="bg-blue-500 text-white hover:bg-blue-600"
            sx={{ textTransform: "none", fontFamily: "Inter, sans-serif" }}
          >
            Back
          </Button>
          <Typography
            variant="h5"
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
            className="bg-blue-500 text-white hover:bg-blue-600"
            sx={{ textTransform: "none", fontFamily: "Inter, sans-serif" }}
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
                    : "bg-blue-200 hover:bg-blue-300"
                }`}
                onClick={() => handleDayClick(d.fullDate)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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

      {/* Bookings Section */}
      <Box className="mt-8">
        {filteredBookings.length > 0 ? (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <Card
                    className="rounded-xl shadow-lg bg-orange-50 border border-orange-200 hover:shadow-xl transition-shadow duration-300"
                    sx={{ minWidth: 280, maxWidth: 350 }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 600,
                          fontSize: "1.25rem",
                          color: "#333",
                          mb: 1.5,
                        }}
                      >
                        {booking.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "0.95rem",
                          color: "#666",
                          mb: 1,
                        }}
                      >
                        <strong>Student ID:</strong> {booking.details.studentId}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "0.95rem",
                          color: "#666",
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Clock className="w-5 h-5 mr-2 text-gray-700" />
                        {moment(booking.start).format("HH:mm")} -{" "}
                        {moment(booking.end).format("HH:mm")}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography
                          sx={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "0.9rem",
                            fontWeight: 500,
                            color: "#fff",
                            backgroundColor: "#4caf50",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "12px",
                          }}
                        >
                          {booking.details.meetingType}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "0.9rem",
                            fontWeight: 500,
                            color:
                              getStatus(booking) === "Cancelled"
                                ? "#ef5350"
                                : getStatus(booking) === "Completed"
                                ? "#4caf50"
                                : "#1e88e5",
                          }}
                        >
                          {getStatus(booking)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 1,
                        }}
                      >
                        <Button
                          variant="outlined"
                          size="small"
                          disabled={booking.details.isCancelled}
                          sx={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "0.9rem",
                            color: "#1e88e5",
                            borderColor: "#1e88e5",
                            "&:hover": {
                              backgroundColor: "#e3f2fd",
                              borderColor: "#1e88e5",
                            },
                            textTransform: "none",
                            px: 2,
                          }}
                        >
                          Join
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleSelectEvent(booking)}
                          sx={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "0.9rem",
                            color: "#f57c00",
                            borderColor: "#f57c00",
                            "&:hover": {
                              backgroundColor: "#fff3e0",
                              borderColor: "#f57c00",
                            },
                            textTransform: "none",
                            px: 2,
                          }}
                        >
                          Details
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: { xs: "1.5rem", sm: "2rem" },
              fontWeight: 500,
              color: "#666",
              textAlign: "center",
              mt: 4,
            }}
          >
            No appointments for this date
          </Typography>
        )}
      </Box>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog
          open={Boolean(selectedEvent)}
          onClose={closeModal}
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "16px",
              width: { xs: "90%", sm: 550 }, // Tăng chiều rộng từ 450px lên 550px
              maxWidth: 550,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              p: 3,
            },
          }}
        >
          <DialogTitle
            sx={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "#333",
              pb: 2,
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            {selectedEvent.title}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                {
                  label: "Date",
                  value: moment(selectedEvent.details.date).format(
                    "YYYY-MM-DD"
                  ),
                },
                {
                  label: "Time",
                  value: getTimeFromSlotId(selectedEvent.details.slotId),
                },
                { label: "Student ID", value: selectedEvent.details.studentId },
                {
                  label: "Consultant",
                  value: selectedEvent.details.consultantId,
                },
                {
                  label: "Booked By",
                  value: selectedEvent.details.bookedBy || "Unknown",
                },
                {
                  label: "Meeting Type",
                  value: selectedEvent.details.meetingType,
                },
                { label: "Status", value: getStatus(selectedEvent) },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    py: 0.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 500,
                      fontSize: "1rem",
                      color: "#555",
                    }}
                  >
                    {item.label}:
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "1rem",
                      color: "#333",
                      fontWeight: 400,
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, justifyContent: "space-between" }}>
            {!selectedEvent.details.isCancelled && (
              <Button
                onClick={() => openConfirmModal(selectedEvent)}
                variant="contained"
                color="error"
                sx={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.95rem",
                  textTransform: "none",
                  px: 4, // Đồng bộ padding ngang với nút "Close"
                  py: 1, // Đồng bộ padding dọc với nút "Close"
                  minWidth: 120, // Đặt chiều rộng tối thiểu để đồng đều
                }}
              >
                Cancel Appointment
              </Button>
            )}
            <Button
              onClick={closeModal}
              variant="outlined"
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.95rem",
                color: "#555",
                borderColor: "#555",
                "&:hover": { backgroundColor: "#f5f5f5", borderColor: "#333" },
                textTransform: "none",
                px: 4, // Đồng bộ padding ngang với nút "Cancel"
                py: 1, // Đồng bộ padding dọc với nút "Cancel"
                minWidth: 120, // Đặt chiều rộng tối thiểu để đồng đều
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Confirm Cancellation Modal */}
      <Modal
        open={isConfirmModalOpen}
        onClose={closeConfirmModal}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Fade in={isConfirmModalOpen}>
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              p: 4,
              width: { xs: "90%", sm: 450 },
              maxWidth: 450,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "1.5rem",
                color: "#333",
                mb: 2,
                textAlign: "center",
              }}
            >
              Confirm Cancellation
            </Typography>
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "1rem",
                color: "#666",
                mb: 3,
                textAlign: "center",
              }}
            >
              Are you sure you want to cancel this appointment on{" "}
              {moment(selectedEventToCancel?.details?.date).format(
                "YYYY-MM-DD"
              )}{" "}
              at {getTimeFromSlotId(selectedEventToCancel?.details?.slotId)}?
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <Button
                onClick={confirmCancelAppointment}
                variant="contained"
                color="error"
                sx={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.95rem",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                }}
              >
                Yes
              </Button>
              <Button
                onClick={closeConfirmModal}
                variant="outlined"
                sx={{
                  fontFamily: "Inter, sans-serif",
                  fontSize: "0.95rem",
                  color: "#666",
                  borderColor: "#666",
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                    borderColor: "#444",
                  },
                  textTransform: "none",
                  px: 3,
                  py: 1,
                }}
              >
                No
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Success Modal */}
      <Modal
        open={isSuccessModalOpen}
        onClose={closeSuccessModal}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Fade in={isSuccessModalOpen}>
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              p: 4,
              width: { xs: "90%", sm: 400 },
              maxWidth: 400,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Inter, sans-serif",
                fontWeight: 700,
                fontSize: "1.5rem",
                color: "#4caf50",
                mb: 2,
              }}
            >
              Success!
            </Typography>
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "1rem",
                color: "#333",
                mb: 3,
              }}
            >
              Appointment cancelled successfully!
            </Typography>
            <Button
              onClick={closeSuccessModal}
              variant="contained"
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "0.95rem",
                backgroundColor: "#4caf50",
                "&:hover": { backgroundColor: "#388e3c" },
                textTransform: "none",
                px: 4,
                py: 1,
              }}
            >
              Close
            </Button>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default SchedulePage;

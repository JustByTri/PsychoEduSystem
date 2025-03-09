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
} from "@mui/material";
import axios from "axios";
import { getAuthDataFromLocalStorage } from "../../utils/auth";
import moment from "moment";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "react-router-dom";
const SchedulePage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedEventToCancel, setSelectedEventToCancel] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [userProfile, setUserProfile] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // Modal thông báo thành công

  const authData = getAuthDataFromLocalStorage();
  const userId = authData?.userId;

  const daysInMonth = () => {
    const days = [];
    const startOfMonth = moment(currentMonth).startOf("month");
    const endOfMonth = moment(currentMonth).endOf("month");
    const totalDays = endOfMonth.date();
    const firstDayOfWeek = startOfMonth.day();
    const totalSlots = 42;

    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }

    for (let i = 0; i < totalDays; i++) {
      const date = startOfMonth.clone().add(i, "days").toDate();
      days.push({
        day: moment(date).date(),
        weekday: ["S", "M", "T", "W", "T", "F", "S"][moment(date).day()],
        fullDate: date,
      });
    }

    const remainingSlots = totalSlots - days.length;
    for (let i = 0; i < remainingSlots; i++) {
      days.push(null);
    }

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
          if (!Array.isArray(appointments)) {
            setBookings([]);
          } else if (appointments.length === 0) {
            setBookings([]);
          } else {
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
              if (appointment.meetingWith === "Counselor") {
                title = "Mental Health Support";
              } else if (appointment.meetingWith === "Teacher") {
                title = "Career Guidance";
              }

              return {
                id: appointment.appointmentId,
                googleMeetURL: appointment.googleMeetURL,
                title: `${title} - ${
                  appointment.isOnline ? "Online" : "Offline"
                }`,
                start: startDateTime,
                end: endDateTime,
                details: {
                  studentId: appointment.appointmentFor || userId,
                  consultantId: appointment.meetingWith,
                  bookedBy: appointment.bookedBy,
                  appointmentFor: appointment.appointmentFor,
                  date: appointment.date.split("/").reverse().join("-"),
                  slotId: appointment.slotId,
                  meetingType: appointment.isOnline ? "online" : "offline",
                  isCompleted: appointment.isCompleted,
                  isCancelled: appointment.isCancelled,
                },
              };
            });
            setBookings(events);
          }
        } else {
          setBookings([]);
        }
      } catch (error) {
        setBookings([]);
      } finally {
        setIsLoading(false);
        const timer = setTimeout(() => setIsInitialLoad(false), 500);
        return () => clearTimeout(timer);
      }
    };

    fetchBookings();
  }, [userId, authData.accessToken, selectedDate]);

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

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const navigate = useNavigate();
  const handleJoinChat = (id) => {
    navigate(`/chat/${id}`);
  };
  const closeModal = () => {
    setSelectedEvent(null);
  };

  const handleCancelAppointment = async () => {
    if (!selectedEvent) return;

    try {
      setIsLoading(true);
      const authData = getAuthDataFromLocalStorage();
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
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === selectedEvent.id
              ? {
                  ...booking,
                  details: { ...booking.details, isCancelled: true },
                }
              : booking
          )
        );
        setSelectedEvent((prevEvent) => ({
          ...prevEvent,
          details: { ...prevEvent.details, isCancelled: true },
        }));
        // Đóng các modal cũ và mở modal thông báo thành công
        setIsConfirmModalOpen(false);
        setSelectedEventToCancel(null);
        setSelectedEvent(null);
        setIsSuccessModalOpen(true);
      } else {
        throw new Error(
          response.data.message || "Failed to cancel appointment"
        );
      }
    } catch (error) {
      console.error("Failed to cancel appointment:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openConfirmModal = (event) => {
    setSelectedEventToCancel(event);
    setIsConfirmModalOpen(true);
  };

  const confirmCancelAppointment = async () => {
    if (!selectedEventToCancel) return;
    await handleCancelAppointment();
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedEventToCancel(null);
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  const handleDayClick = (fullDate) => {
    setSelectedDate(fullDate);
  };

  const handleNextMonth = () => {
    setCurrentMonth(moment(currentMonth).add(1, "month"));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(moment(currentMonth).subtract(1, "month"));
  };

  if (isLoading)
    return <div className="text-center text-gray-600">Loading schedule...</div>;
  if (error)
    return <div className="text-center text-red-600">Error: {error}</div>;

  const filteredBookings = bookings.filter((booking) =>
    moment(booking.start).isSame(selectedDate, "day")
  );

  const getStatus = (event) => {
    const { isCompleted, isCancelled } = event.details;
    if (isCancelled) return "Cancelled";
    if (isCompleted) return "Completed";
    return "Booked";
  };

  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen text-black flex flex-col max-w-7xl mx-auto">
      <motion.div
        className="bg-orange-100 p-4 sm:p-6 rounded-2xl shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handlePrevMonth}
              className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg w-full sm:w-auto"
              sx={{ fontFamily: "Roboto, sans-serif", textTransform: "none" }}
            >
              Back
            </Button>
          </motion.div>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem" },
              fontWeight: "bold",
              color: "#333",
              fontFamily: "Roboto, sans-serif",
              textAlign: "center",
            }}
          >
            {moment(currentMonth).format("MMMM YYYY")}
          </Typography>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleNextMonth}
              className="bg-blue-500 text-white hover:bg-blue-600 rounded-lg w-full sm:w-auto"
              sx={{ fontFamily: "Roboto, sans-serif", textTransform: "none" }}
            >
              Next
            </Button>
          </motion.div>
        </div>
        <div className="flex justify-center mb-4">
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: "0.875rem", sm: "1rem" },
              color: "#555",
              fontFamily: "Roboto, sans-serif",
            }}
          >
            Selected: {moment(selectedDate).format("dddd, DD/MM/YYYY")}
          </Typography>
        </div>
        <div className="max-w-full mx-auto">
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {weekdays.map((weekday, index) => (
              <Typography
                key={`weekday-${index}`}
                sx={{
                  fontFamily: "Roboto, sans-serif",
                  fontWeight: 600,
                  color: "#666",
                  textAlign: "center",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {weekday}
              </Typography>
            ))}
          </div>
          <motion.div
            className="grid grid-cols-7 gap-1 sm:gap-2 mt-2"
            key={currentMonth.format("YYYY-MM")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {days.map((d, index) =>
              d ? (
                <motion.button
                  key={`${currentMonth.format("YYYY-MM")}-${index}`}
                  className={`w-full h-10 sm:h-12 flex flex-col items-center justify-center rounded-xl font-medium transition-all duration-300 ease-in-out shadow-md ${
                    moment(d.fullDate).isSame(selectedDate, "day")
                      ? "bg-green-500 text-white scale-105"
                      : "bg-blue-200 hover:bg-blue-300"
                  }`}
                  onClick={() => handleDayClick(d.fullDate)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <span className="text-xs sm:text-sm font-bold">{d.day}</span>
                </motion.button>
              ) : (
                <div
                  key={`${currentMonth.format("YYYY-MM")}-${index}`}
                  className="w-full h-10 sm:h-12 bg-gray-100 rounded-xl"
                />
              )
            )}
          </motion.div>
          {filteredBookings.length === 0 && (
            <Typography
              variant="h6"
              sx={{
                color: "#666",
                textAlign: "center",
                mt: 4,
                mb: 2,
                fontFamily: "Roboto, sans-serif",
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                fontWeight: 500,
              }}
            >
              No appointments for this date
            </Typography>
          )}
        </div>
      </motion.div>
      {filteredBookings.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          {filteredBookings.map((booking) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="rounded-xl shadow-lg bg-orange-50 border border-orange-200">
                <CardContent className="p-4 sm:p-5">
                  <Typography
                    variant="h6"
                    sx={{
                      fontFamily: "Roboto, sans-serif",
                      fontWeight: 600,
                      color: "#333",
                      mb: 1,
                      fontSize: { xs: "1rem", sm: "1.125rem" },
                    }}
                  >
                    {booking.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "Roboto, sans-serif",
                      color: "#666",
                      mb: 1,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    Student ID: {booking.details.studentId}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: "Roboto, sans-serif",
                      color: "#444",
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      fontSize: { xs: "0.75rem", sm: "0.875rem" },
                    }}
                  >
                    <Clock className="w-4 sm:w-5 h-4 sm:h-5 mr-2 text-gray-700" />
                    {moment(booking.start).format("HH:mm")} -{" "}
                    {moment(booking.end).format("HH:mm")}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        fontWeight: 500,
                        color: "#fff",
                        backgroundColor: "#4caf50",
                        px: 2,
                        py: 0.5,
                        borderRadius: "12px",
                      }}
                    >
                      {booking.details.meetingType}
                    </Typography>
                    <Typography component="span">
                      <Button
                        sx={{
                          bgcolor: "#FF7F00",
                          color: "white",
                          textTransform: "none",
                          fontWeight: "bold",
                          "&:hover": { bgcolor: "#E66A00" },
                        }}
                        startIcon={<OpenInNewIcon />}
                        component={Link}
                        to={booking.googleMeetURL}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Join Google Meet
                      </Button>
                    </Typography>
                    <Typography
                      component="span"
                      sx={{
                        fontFamily: "Roboto, sans-serif",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
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
                      mt: 3,
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 1,
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          fontFamily: "Roboto, sans-serif",
                          color: "#1e88e5",
                          borderColor: "#1e88e5",
                          "&:hover": {
                            backgroundColor: "#e3f2fd",
                            borderColor: "#1e88e5",
                          },
                          textTransform: "none",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                        disabled={booking.details.isCancelled}
                        onClick={() => handleJoinChat(booking.id)}
                      >
                        Join
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          fontFamily: "Roboto, sans-serif",
                          color: "#f57c00",
                          borderColor: "#f57c00",
                          "&:hover": {
                            backgroundColor: "#fff3e0",
                            borderColor: "#f57c00",
                          },
                          textTransform: "none",
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                        onClick={() => handleSelectEvent(booking)}
                      >
                        Details
                      </Button>
                    </motion.div>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {selectedEvent && (
        <Dialog
          open={Boolean(selectedEvent)}
          onClose={closeModal}
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: "16px",
              p: 2,
              width: { xs: "90%", sm: "400px" },
              maxWidth: "400px",
            },
          }}
        >
          <DialogTitle
            sx={{
              fontFamily: "Roboto, sans-serif",
              fontWeight: 600,
              color: "#333",
              fontSize: { xs: "1.125rem", sm: "1.25rem" },
            }}
          >
            {selectedEvent.title}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: 500,
                    color: "#555",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Date:
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    color: "#777",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  {moment(selectedEvent.details.date).format("YYYY-MM-DD")}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: 500,
                    color: "#555",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Time:
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    color: "#777",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  {getTimeFromSlotId(selectedEvent.details.slotId)}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: 500,
                    color: "#555",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Student ID:
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    color: "#777",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  {selectedEvent.details.studentId}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: 500,
                    color: "#555",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Consultant:
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    color: "#777",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  {selectedEvent.details.consultantId}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: 500,
                    color: "#555",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Booked By:
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    color: "#777",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  {selectedEvent.details.bookedBy || "Unknown"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: 500,
                    color: "#555",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Meeting Type:
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    color: "#777",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  {selectedEvent.details.meetingType}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: 500,
                    color: "#555",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  Status:
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    color: "#777",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  {getStatus(selectedEvent)}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions sx={{ justifyContent: "space-between", p: 2 }}>
            {!selectedEvent.details.isCancelled && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => openConfirmModal(selectedEvent)}
                  variant="contained"
                  color="error"
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    textTransform: "none",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                >
                  Cancel Appointment
                </Button>
              </motion.div>
            )}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={closeModal}
                variant="outlined"
                sx={{
                  fontFamily: "Roboto, sans-serif",
                  color: "#555",
                  borderColor: "#555",
                  "&:hover": {
                    borderColor: "#333",
                    backgroundColor: "#f5f5f5",
                  },
                  textTransform: "none",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                Close
              </Button>
            </motion.div>
          </DialogActions>
        </Dialog>
      )}

      <Modal
        open={isConfirmModalOpen}
        onClose={closeConfirmModal}
        closeAfterTransition
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Fade in={isConfirmModalOpen}>
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: 2,
              p: 3,
              width: "100%",
              maxWidth: { xs: "90%", sm: "500px" },
              boxShadow: 3,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Roboto, sans-serif",
                fontWeight: "bold",
                mb: 2,
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              }}
            >
              Confirm Cancellation
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "Roboto, sans-serif",
                color: "#666",
                mb: 2,
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              Are you sure you want to cancel this appointment on{" "}
              {moment(selectedEventToCancel?.details?.date).format(
                "YYYY-MM-DD"
              )}{" "}
              at {getTimeFromSlotId(selectedEventToCancel?.details?.slotId)}?
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={confirmCancelAppointment}
                  variant="contained"
                  color="error"
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    textTransform: "none",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                >
                  Yes
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={closeConfirmModal}
                  variant="outlined"
                  sx={{
                    fontFamily: "Roboto, sans-serif",
                    color: "#666",
                    borderColor: "#666",
                    "&:hover": {
                      borderColor: "#444",
                      backgroundColor: "#f5f5f5",
                    },
                    textTransform: "none",
                    fontSize: { xs: "0.75rem", sm: "0.875rem" },
                  }}
                >
                  No
                </Button>
              </motion.div>
            </Box>
          </Box>
        </Fade>
      </Modal>

      {/* Modal thông báo thành công */}
      <Modal
        open={isSuccessModalOpen}
        onClose={closeSuccessModal}
        closeAfterTransition
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Fade in={isSuccessModalOpen}>
          <Box
            sx={{
              backgroundColor: "#fff",
              borderRadius: "16px",
              p: 4,
              width: "100%",
              maxWidth: { xs: "90%", sm: "400px" },
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
              border: "2px solid #4caf50",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontFamily: "Roboto, sans-serif",
                fontWeight: "bold",
                color: "#4caf50",
                mb: 2,
                fontSize: { xs: "1.5rem", sm: "1.75rem" },
              }}
            >
              Success!
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontFamily: "Roboto, sans-serif",
                color: "#333",
                mb: 3,
                fontSize: { xs: "1rem", sm: "1.125rem" },
              }}
            >
              Appointment cancelled successfully.
            </Typography>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={closeSuccessModal}
                variant="contained"
                sx={{
                  fontFamily: "Roboto, sans-serif",
                  backgroundColor: "#4caf50",
                  "&:hover": { backgroundColor: "#388e3c" },
                  textTransform: "none",
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  px: 4,
                  py: 1,
                }}
              >
                Close
              </Button>
            </motion.div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default SchedulePage;

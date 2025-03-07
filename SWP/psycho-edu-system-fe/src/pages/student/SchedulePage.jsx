import {
  CContainer,
  CSpinner,
  CCard,
  CCardBody,
  CRow,
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaClock } from "react-icons/fa";
import React, { useState, useEffect, useRef } from "react";
import {
  format,
  addDays,
  getDaysInMonth,
  startOfMonth,
  isSameDay,
  isBefore,
  parseISO,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

// Updated AppointmentDetailModal component with scroll issue fixed
const AppointmentDetailModal = ({ isOpen, onClose, appointment }) => {
  if (!isOpen || !appointment) return null;

  // Hard-coded data for missing fields
  const hardCodedData = {
    studentName: "Bùi Công Hùng",
    studentCode: "KE0056731/KID",
    level: "KE45 - F3 (IV)",
    lessonDetails: "KE45 - F3 (IV) - LC4 (3) - Reading And Writing Review",
    platform: appointment.platform || "BBB",
    type: appointment.type || "45MINS",
    lessonPlan: "KE45 - F1,2,3 (IV) - LC4 (3) - Lesson Plan",
    answerKey: "KE45 - F1,2,3 (IV) - LC4 (3) - Answer Key",
    studentWeakness: "", // Placeholder for student weakness
    studentEvaluation: {
      academic: "Academic",
      otherTeacher: "Other teacher",
    },
  };

  // Animation variants for sliding in and out
  const modalVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
    exit: {
      x: "100%",
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  // Animation for the Cancel button
  const buttonVariants = {
    hover: { scale: 0.95, transition: { duration: 0.2 } },
    tap: { scale: 0.9, transition: { duration: 0.1 } },
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm z-50 flex justify-end"
      onClick={handleBackdropClick}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="appointment-modal bg-gradient-to-br from-blue-100 via-purple-50 to-gray-100 w-full sm:w-[90%] md:w-[70%] lg:w-[40%] xl:w-[28rem] h-full p-4 sm:p-6 rounded-l-xl shadow-2xl border-l-4 border-blue-600"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6 border-b border-gray-300 pb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            Booking Detail
          </h3>
          <button
            onClick={() => setTimeout(onClose, 300)}
            className="text-gray-600 hover:text-gray-800 rounded-full p-1 hover:bg-gray-200 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body with content - REMOVED scrollbar */}
        <div className="space-y-4 sm:space-y-6 h-[calc(100%-12rem)] scrollbar-hide">
          {/* Student Information Section */}
          <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              Student Info
            </h4>
            <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-200 flex items-center justify-center">
                <span className="text-blue-600">👤</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Student Name</p>
                <p className="font-medium text-sm sm:text-base text-gray-800">
                  {hardCodedData.studentName}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Student Code</p>
                <p className="font-medium text-xs sm:text-sm text-gray-800">
                  {hardCodedData.studentCode}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Level</p>
                <p className="font-medium text-xs sm:text-sm text-gray-800">
                  {hardCodedData.level}
                </p>
              </div>
            </div>
          </div>

          {/* Lesson Information Section */}
          <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              Lesson Details
            </h4>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Lesson</p>
              <p className="font-medium text-xs sm:text-sm text-gray-800">
                {hardCodedData.lessonDetails}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-2">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Platform</p>
                <p className="font-medium text-xs sm:text-sm text-gray-800">
                  {hardCodedData.platform}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Type</p>
                <p className="font-medium text-xs sm:text-sm text-gray-800">
                  {hardCodedData.type}
                </p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs sm:text-sm text-gray-500">Time</p>
              <p className="font-medium text-xs sm:text-sm text-gray-800">
                {format(appointment.date, "EEE, do MMM")} {appointment.time}
              </p>
            </div>
          </div>

          {/* Resources Section */}
          <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              Resources
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm text-gray-500">Lesson Plan</p>
                <a
                  href="#"
                  className="text-blue-600 hover:underline text-xs sm:text-sm"
                >
                  View
                </a>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm text-gray-500">Answer Key</p>
                <a
                  href="#"
                  className="text-blue-600 hover:underline text-xs sm:text-sm"
                >
                  View
                </a>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              Additional Info
            </h4>
            <div className="space-y-2">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Student's Weakness
                </p>
                <p className="font-medium text-xs sm:text-sm text-gray-800">
                  {hardCodedData.studentWeakness || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Booking Status
                </p>
                <p className="font-medium text-xs sm:text-sm text-gray-800 flex items-center">
                  Approved
                  <span className="ml-2 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-600"></span>
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Student Evaluation
                </p>
                <p className="font-medium text-xs sm:text-sm text-purple-600">
                  {hardCodedData.studentEvaluation.academic}{" "}
                  <span className="text-gray-800">
                    {hardCodedData.studentEvaluation.otherTeacher}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-3 mt-4 sm:mt-6 border-t border-gray-300 pt-4">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => {
              const modal = document.querySelector(".appointment-modal");
              if (modal) {
                modal.style.pointerEvents = "none";
                setTimeout(onClose, 300);
              }
            }}
            className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-full text-xs sm:text-sm text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => {
              const modal = document.querySelector(".appointment-modal");
              if (modal) {
                modal.style.pointerEvents = "none";
                setTimeout(onClose, 300);
              }
            }}
            className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-full hover:bg-blue-700 transition-colors"
          >
            Join
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
const SchedulePage = () => {
  const [currentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [animationDirection, setAnimationDirection] = useState("next");
  const calendarContainerRef = useRef(null);
  const [visibleDaysCount, setVisibleDaysCount] = useState(15);
  const [userProfile, setUserProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [modalState, setModalState] = useState({
    visible: false,
    message: "",
    type: "success",
  });
  const [confirmModalState, setConfirmModalState] = useState({
    visible: false,
    appointmentId: null,
  });
  const [detailModalState, setDetailModalState] = useState({
    isOpen: false,
    selectedAppointment: null,
  });

  // Generate all days for the current month
  const generateMonthDays = () => {
    const monthStart = startOfMonth(currentDate);
    const totalDays = getDaysInMonth(currentDate);
    const days = [];

    for (let i = 0; i < totalDays; i++) {
      const currentDay = addDays(monthStart, i);
      const dayNumber = currentDay.getDate();
      const dayOfWeek = format(currentDay, "E")[0];

      days.push({
        day: dayNumber,
        dayOfWeek,
        fullDate: currentDay,
        isToday: isSameDay(currentDay, currentDate),
        isPast:
          isBefore(currentDay, currentDate) &&
          !isSameDay(currentDay, currentDate),
      });
    }

    return days;
  };

  const allDays = generateMonthDays();

  // Fetch user profile data using Axios
  const fetchUserProfile = async () => {
    try {
      const userResponse = await axios.get(
        "https://localhost:7192/api/User/username/student1"
      );
      const userId = userResponse.data.userId;
      const profileResponse = await axios.get(
        `https://localhost:7192/api/User/profile?userId=${userId}`
      );
      if (profileResponse.data.isSuccess) {
        setUserProfile({ ...profileResponse.data.result, userId });
      } else {
        throw new Error(
          profileResponse.data.message || "Failed to get user profile"
        );
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setErrorMessage("Failed to load user profile. Please try again later.");
      setModalState({
        visible: true, // Thay isOpen thành visible
        message: "Failed to load user profile. Please try again later.",
        type: "error",
      });
    }
  };

  // Fetch appointments for the selected date using Axios
  const fetchAppointments = async (date) => {
    if (!userProfile?.userId) return;

    setIsLoading(true);
    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await axios.get(
        `https://localhost:7192/api/appointments/students/${userProfile.userId}/appointments?selectedDate=${formattedDate}`
      );

      if (response.data.isSuccess) {
        const transformedAppointments = response.data.result.map(
          (appointment) => ({
            id: appointment.appointmentId,
            studentId: userProfile.userId,
            student: appointment.appointmentFor || "Unknown Student",
            lesson: appointment.meetingWith || "Unspecified Lesson",
            platform: appointment.isOnline ? "Online" : "Offline",
            sessions: {
              monthly: appointment.monthlySessionsRemaining || 10,
              quarterly: appointment.quarterlySessionsRemaining || 4,
            },
            date: parseISO(appointment.date.split("/").reverse().join("-")),
            time: appointment.timeSlot || "18:00 - 18:45",
            status: appointment.isCancelled
              ? "Cancelled"
              : appointment.isCompleted
              ? "Completed"
              : "Scheduled",
            type: appointment.appointmentType || "45MINS",
            evaluated: appointment.isEvaluated || appointment.isCompleted,
            appointmentId: appointment.appointmentId,
            isCancelled: appointment.isCancelled || false,
          })
        );

        setAppointments(transformedAppointments);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch appointments"
        );
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel an appointment using Axios
  const cancelAppointment = async (appointmentId) => {
    try {
      const response = await axios.get(
        `https://localhost:7192/api/appointments/${appointmentId}/cancellation`
      );
      if (response.data.isSuccess) {
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.appointmentId === appointmentId
              ? { ...appointment, isCancelled: true, status: "Cancelled" }
              : appointment
          )
        );
        setModalState({
          visible: true, // Thay isOpen thành visible
          message:
            response.data.message || "Appointment cancelled successfully!",
          type: "success",
        });
      } else {
        throw new Error(
          response.data.message || "Failed to cancel appointment"
        );
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      setModalState({
        visible: true, // Thay isOpen thành visible
        message:
          error.message || "Failed to cancel appointment. Please try again.",
        type: "error",
      });
    }
  };

  // Handle "View detail" click
  const handleViewDetail = (appointment) => {
    setDetailModalState({
      isOpen: true,
      selectedAppointment: appointment,
    });
  };

  useEffect(() => {
    const updateVisibleDaysCount = () => {
      if (calendarContainerRef.current) {
        const containerWidth = calendarContainerRef.current.offsetWidth;
        const possibleDaysToShow = Math.floor(containerWidth / 68);
        setVisibleDaysCount(Math.max(3, possibleDaysToShow));
      }
    };

    updateVisibleDaysCount();
    window.addEventListener("resize", updateVisibleDaysCount);

    return () => {
      window.removeEventListener("resize", updateVisibleDaysCount);
    };
  }, []);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userProfile?.userId) {
      fetchAppointments(selectedDate);
    }
  }, [selectedDate, userProfile]);

  const handleNext = () => {
    const nextDay = addDays(selectedDate, 1);
    if (nextDay.getMonth() === currentDate.getMonth()) {
      setSelectedDate(nextDay);
      const nextDayIndex = allDays.findIndex((day) =>
        isSameDay(day.fullDate, nextDay)
      );
      const newPage = Math.floor(nextDayIndex / visibleDaysCount);
      if (newPage !== currentPage) {
        setAnimationDirection("next");
        setCurrentPage(newPage);
      }
    }
  };

  const handlePrev = () => {
    const prevDay = addDays(selectedDate, -1);
    if (prevDay.getMonth() === currentDate.getMonth()) {
      setSelectedDate(prevDay);
      const prevDayIndex = allDays.findIndex((day) =>
        isSameDay(day.fullDate, prevDay)
      );
      const newPage = Math.floor(prevDayIndex / visibleDaysCount);
      if (newPage !== currentPage) {
        setAnimationDirection("prev");
        setCurrentPage(newPage);
      }
    }
  };

  const handleSelectDate = (date) => {
    if (!isBefore(date, currentDate) || isSameDay(date, currentDate)) {
      setSelectedDate(date);
    }
  };

  const handleCancelAppointment = (appointmentId) => {
    console.log("Opening confirm modal for:", appointmentId);
    setConfirmModalState({
      visible: true,
      appointmentId: appointmentId,
    });
  };

  const getVisibleDays = (page) => {
    const startIdx = page * visibleDaysCount;
    return allDays.slice(startIdx, startIdx + visibleDaysCount);
  };

  const filteredAppointments = appointments
    .filter(
      (appointment) =>
        format(appointment.date, "yyyy-MM-dd") ===
        format(selectedDate, "yyyy-MM-dd")
    )
    .filter(
      (appointment) =>
        filterStatus === "All" || appointment.status === filterStatus
    );

  const variants = {
    enter: (direction) => ({
      x: direction === "next" ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction === "next" ? -1000 : 1000,
      opacity: 0,
    }),
  };

  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/student/booking");
  };

  const handleChat = (id) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div
      className="w-full min-h-screen bg-gradient-to-br from-blue-200 to-blue-100 dark:from-gray-900 dark:to-gray-800 scrollbar-hide"
      style={{
        transform: "scale(0.5)",
        transformOrigin: "top left",
        width: "200%",
        minHeight: "200%",
      }}
    >
      <CContainer fluid className="max-w-7xl mx-auto px-4 py-6">
        {/* Calendar Header with Days */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-4 mb-6 shadow-lg"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
            <h1 className="text-white text-2xl font-medium">Your Schedule</h1>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-3">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }} // Hiệu ứng phóng to nhẹ khi hover
                whileTap={{ scale: 0.95 }} // Hiệu ứng thu nhỏ khi click
              >
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="bg-gradient-to-r from-white to-blue-50 text-blue-900 rounded-lg pl-4 pr-8 py-2 text-sm border border-blue-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-all duration-300 hover:shadow-xl hover:border-blue-400 appearance-none cursor-pointer"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23333333' width='18px' height='18px'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\")", // Icon mũi tên tùy chỉnh
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.75rem center",
                    backgroundSize: "1rem",
                  }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </motion.div>
              <span
                className="text-blue-100 text-sm"
                style={{ minWidth: "190px", textAlign: "center" }}
              >
                {format(selectedDate, "EEEE, MM/dd/yyyy")}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-800 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
                  onClick={handlePrev}
                  disabled={isSameDay(selectedDate, currentDate)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                    />
                  </svg>
                </button>
                <button
                  className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-800 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
                  onClick={handleNext}
                  disabled={
                    selectedDate.getDate() === allDays[allDays.length - 1].day
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div
            ref={calendarContainerRef}
            className="relative overflow-hidden scrollbar-hide"
            style={{ height: "70px" }}
          >
            <AnimatePresence custom={animationDirection} initial={false}>
              <motion.div
                key={currentPage}
                custom={animationDirection}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="flex justify-center space-x-2 absolute w-full"
              >
                {getVisibleDays(currentPage).map((day) => (
                  <motion.div
                    key={`${currentPage}-${day.day}`}
                    whileHover={{ scale: day.isPast ? 1 : 1.05 }}
                    whileTap={{ scale: day.isPast ? 1 : 0.95 }}
                    onClick={() =>
                      (!day.isPast || day.isToday) &&
                      handleSelectDate(day.fullDate)
                    }
                    className={`flex-shrink-0 flex flex-col items-center justify-center rounded-lg transition-all duration-200 ${
                      day.isPast
                        ? "bg-gray-400 cursor-not-allowed"
                        : isSameDay(day.fullDate, selectedDate)
                        ? "bg-green-500 cursor-pointer hover:bg-green-600"
                        : day.isToday
                        ? "bg-blue-500 cursor-pointer hover:bg-blue-600"
                        : "bg-blue-400 hover:bg-blue-500 cursor-pointer"
                    }`}
                    style={{ width: "60px", height: "60px" }}
                  >
                    <span className="text-blue-100 text-sm">
                      {day.dayOfWeek}
                    </span>
                    <span className="text-white text-xl font-medium">
                      {day.day}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Error message if any */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{errorMessage}</p>
          </div>
        )}

        {/* Appointments Section */}
        <div className="appointments-container scrollbar-hide">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <CSpinner color="primary" />
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredAppointments.map((appointment, index) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: 0.05 * index }}
                    whileHover={{ scale: 1.02 }}
                    onDoubleClick={() => handleViewDetail(appointment)}
                  >
                    <CCard
                      className="shadow-md border-0 bg-blue-50 dark:bg-gray-800"
                      style={{ borderRadius: "15px" }}
                    >
                      <CCardBody className="p-4">
                        {/* Header: Consultant centered, larger and more prominent */}
                        <CRow className="align-items-center mb-3">
                          <CCol xs={12} className="text-center">
                            <span
                              className="text-blue-600 dark:text-blue-300"
                              style={{ fontSize: "16px" }}
                            >
                              Consultant
                            </span>
                            <h5
                              className="mb-0 mt-1"
                              style={{
                                fontWeight: "bold",
                                color: "#2b2d42",
                                fontSize: "24px",
                              }}
                            >
                              {appointment.lesson || "Unknown Consultant"}
                            </h5>
                          </CCol>
                        </CRow>

                        {/* Time, Type, and Status Section */}
                        <CRow className="align-items-center mb-4">
                          <CCol xs={12}>
                            <div className="d-flex align-items-center mb-2">
                              <FaClock
                                className="me-2"
                                style={{ color: "#3b82f6", fontSize: "20px" }}
                              />
                              <span
                                style={{
                                  fontSize: "18px",
                                  color: "#2b2d42",
                                  fontWeight: "500",
                                }}
                              >
                                {format(appointment.date, "EEE, do MMM")}{" "}
                                {appointment.time}
                              </span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <span
                                style={{
                                  fontSize: "16px",
                                  color:
                                    appointment.platform === "Online"
                                      ? "#3b82f6"
                                      : "#8b5cf6",
                                  fontWeight: "500",
                                }}
                              >
                                {appointment.platform}
                              </span>
                              <span
                                style={{
                                  fontSize: "16px",
                                  color:
                                    appointment.status === "Completed"
                                      ? "#22c55e"
                                      : appointment.status === "Cancelled"
                                      ? "#ef4444"
                                      : "#f59e0b",
                                  fontWeight: "500",
                                }}
                              >
                                {appointment.status}
                              </span>
                            </div>
                          </CCol>
                        </CRow>

                        {/* Progress Info - Slightly larger and more readable */}
                        <CRow className="mb-4">
                          <CCol>
                            <div
                              className="p-3 rounded"
                              style={{
                                backgroundColor: "#dbeafe",
                                fontSize: "15px",
                              }}
                            >
                              {appointment.sessions.monthly && (
                                <p className="mb-1">
                                  <span
                                    style={{
                                      color: "#3b82f6",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {appointment.sessions.monthly} more sessions
                                  </span>{" "}
                                  to Fixed Schedule BONUS - Monthly
                                </p>
                              )}
                              {appointment.sessions.quarterly && (
                                <p className="mb-0">
                                  <span
                                    style={{
                                      color: "#8b5cf6",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {appointment.sessions.quarterly} more
                                    sessions
                                  </span>{" "}
                                  to Fixed Schedule BONUS - Quarterly
                                </p>
                              )}
                            </div>
                          </CCol>
                        </CRow>

                        {/* Buttons - Larger and more prominent */}
                        <CRow className="align-items-center">
                          <CCol xs={12} className="text-center">
                            <div className="d-flex flex-wrap justify-content-center gap-2">
                              {appointment.status !== "Completed" &&
                                appointment.status !== "Cancelled" && (
                                  <CButton
                                    color="primary"
                                    className="shadow-sm hover:shadow-md transition-all duration-200"
                                    style={{
                                      borderRadius: "20px",
                                      backgroundColor: "#3b82f6",
                                      borderColor: "#3b82f6",
                                      fontWeight: "bold",
                                      fontSize: "0.9rem",
                                      padding: "8px 20px", // Padding cố định
                                      width: "100px", // Chiều rộng cố định
                                      height: "40px", // Chiều cao cố định
                                      textDecoration: "none",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                    onClick={() => handleChat(appointment.id)}
                                  >
                                    Join
                                  </CButton>
                                )}
                              <CButton
                                color="secondary"
                                className="shadow-sm hover:shadow-md transition-all duration-200"
                                style={{
                                  borderRadius: "20px",
                                  backgroundColor: "#8b5cf6",
                                  borderColor: "#8b5cf6",
                                  fontWeight: "bold",
                                  fontSize: "0.9rem",
                                  padding: "8px 20px", // Padding cố định
                                  width: "100px", // Chiều rộng cố định
                                  height: "40px", // Chiều cao cố định
                                  textDecoration: "none",
                                  color: "white",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                onClick={() => handleViewDetail(appointment)}
                              >
                                Detail
                              </CButton>
                              {appointment.status !== "Cancelled" && (
                                <CButton
                                  color="danger"
                                  className="shadow-sm hover:shadow-md transition-all duration-200"
                                  style={{
                                    borderRadius: "20px",
                                    backgroundColor: "#ef4444",
                                    borderColor: "#ef4444",
                                    fontWeight: "bold",
                                    fontSize: "0.9rem",
                                    padding: "8px 20px", // Padding cố định
                                    width: "100px", // Chiều rộng cố định
                                    height: "40px", // Chiều cao cố định
                                    textDecoration: "none",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                  onClick={() =>
                                    handleCancelAppointment(
                                      appointment.appointmentId
                                    )
                                  }
                                >
                                  Cancel
                                </CButton>
                              )}
                            </div>
                          </CCol>
                        </CRow>
                      </CCardBody>
                    </CCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-10">
              <h5 className="text-blue-600 dark:text-blue-400 text-lg">
                No appointments for this date
              </h5>
              <button
                onClick={handleNavigate}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Schedule a New Appointment
              </button>
            </div>
          )}
        </div>
      </CContainer>
      {/* Notification Modal */}
      <CModal
        visible={confirmModalState.visible}
        onClose={() =>
          setConfirmModalState({ visible: false, appointmentId: null })
        }
        alignment="center"
        backdrop="static"
        className="transition-all duration-300 ease-in-out"
      >
        <CModalHeader className="bg-blue-600 from-purple-600 to-indigo-700 text-white">
          <CModalTitle className="flex items-center">
            <i className="fas fa-exclamation-circle mr-2"></i>
            Confirm Cancellation
          </CModalTitle>
        </CModalHeader>
        <CModalBody className="py-6 bg-gray-50">
          <div className="text-center">
            <i className="fas fa-calendar-times text-indigo-500 mb-4 text-5xl"></i>
            <p className="mb-0 text-lg text-gray-700">
              Are you sure you want to cancel this appointment?
            </p>
          </div>
        </CModalBody>
        <CModalFooter className="border-t-0 flex justify-center space-x-4 bg-gray-50">
          <CButton
            className="bg-gradient-to-r from-teal-400 to-emerald-500 hover:opacity-90 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-teal-200/50 min-w-32 flex items-center justify-center text-white font-medium"
            onClick={async () => {
              await cancelAppointment(confirmModalState.appointmentId);
              setConfirmModalState({ visible: false, appointmentId: null });
            }}
          >
            <i className="fas fa-check mr-2"></i>
            Yes
          </CButton>
          <CButton
            className="bg-gradient-to-r from-rose-500 to-pink-600 hover:opacity-90 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-rose-200/50 min-w-32 text-white font-medium flex items-center justify-center"
            onClick={() =>
              setConfirmModalState({ visible: false, appointmentId: null })
            }
          >
            <i className="fas fa-times mr-2"></i>
            No
          </CButton>
        </CModalFooter>
      </CModal>
      {/* Appointment Detail Modal */}
      <AppointmentDetailModal
        isOpen={detailModalState.isOpen}
        onClose={() =>
          setDetailModalState((prev) => ({
            ...prev,
            isOpen: false,
            selectedAppointment: null,
          }))
        }
        appointment={detailModalState.selectedAppointment}
      />
    </div>
  );
};

export default SchedulePage;

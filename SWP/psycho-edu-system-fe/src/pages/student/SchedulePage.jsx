import React, { useState, useEffect, useRef } from "react";
import { CContainer } from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import { useNavigate } from "react-router-dom";
import {
  format,
  addDays,
  getDaysInMonth,
  startOfMonth,
  isSameDay,
  startOfDay,
  addMonths,
  subMonths,
} from "date-fns";
import apiService from "../../services/apiService";
import CalendarHeader from "../../components/Header/CalendarHeader";
import AppointmentDetailModal from "../../components/Modal/AppointmentDetailModal";
import ConfirmModal from "../../components/Modal/ConfirmModal";
import AppointmentsList from "../../components/StudentSchedule/AppointmentsList";
import { motion } from "framer-motion";
import { getAuthDataFromLocalStorage } from "../../utils/auth";

const globalStyles = `
  :root {
    font-size: 14px;
  }
  * {
    box-sizing: border-box;
  }
`;

const SchedulePage = () => {
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = globalStyles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [confirmModalState, setConfirmModalState] = useState({
    visible: false,
    appointmentId: null,
  });
  const [detailModalState, setDetailModalState] = useState({
    isOpen: false,
    selectedAppointment: null,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [animationDirection, setAnimationDirection] = useState("");
  const [visibleDaysCount, setVisibleDaysCount] = useState(15);
  const [appointmentViewKey, setAppointmentViewKey] = useState(0);
  const calendarContainerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  const navigate = useNavigate();

  const generateMonthDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const totalDays = getDaysInMonth(currentMonth);
    return Array.from({ length: totalDays }, (_, i) => {
      const currentDay = startOfDay(addDays(monthStart, i));
      return {
        day: currentDay.getDate(),
        weekday: format(currentDay, "E")[0],
        fullDate: currentDay,
        isToday: isSameDay(currentDay, new Date()),
        dayOfWeek: format(currentDay, "E")[0],
      };
    });
  };

  const allDays = generateMonthDays();

  const loadUserProfile = async () => {
    try {
      const authData = getAuthDataFromLocalStorage();
      if (!authData || !authData.userId) {
        throw new Error("Authentication data not found. Please log in.");
      }
      const profile = await apiService.fetchUserProfile(authData.userId);
      setUserProfile(profile);
    } catch (error) {
      console.error("Failed to load user:", error);
      setErrorMessage("Failed to load user profile.");
    }
  };

  const loadAppointments = async (date) => {
    if (!userProfile?.userId) return;
    setIsLoading(true);
    try {
      const appointmentsData = await apiService.fetchAppointments(
        userProfile.userId,
        date
      );
      setBookings(appointmentsData || []);
      setAppointmentViewKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to load appointments:", error);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointmentApi = async (appointmentId) => {
    try {
      await apiService.cancelAppointment(appointmentId);
      setBookings((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.appointmentId === appointmentId
            ? { ...appointment, isCancelled: true, status: "Cancelled" }
            : appointment
        )
      );
    } catch (error) {
      setErrorMessage("Không thể hủy cuộc hẹn: " + error.message);
    }
  };

  const handleViewDetail = (appointment) => {
    setDetailModalState({ isOpen: true, selectedAppointment: appointment });
  };

  const handleNext = () => {
    const nextDay = addDays(selectedDate, 1);
    setAnimationDirection("next");
    setSelectedDate(nextDay);
    if (userProfile?.userId) loadAppointments(nextDay);
    if (nextDay.getMonth() !== currentMonth.getMonth()) {
      setCurrentMonth(addMonths(currentMonth, 1));
    }
    const nextDayIndex = allDays.findIndex((day) =>
      isSameDay(day.fullDate, nextDay)
    );
    const halfCount = Math.floor(visibleDaysCount / 2);
    const newPage = Math.max(
      0,
      Math.floor((nextDayIndex - halfCount) / visibleDaysCount)
    );
    setCurrentPage(newPage);
  };

  const handlePrev = () => {
    const prevDay = addDays(selectedDate, -1);
    setAnimationDirection("prev");
    setSelectedDate(prevDay);
    if (userProfile?.userId) loadAppointments(prevDay);
    if (prevDay.getMonth() !== currentMonth.getMonth()) {
      setCurrentMonth(subMonths(currentMonth, 1));
    }
    const prevDayIndex = allDays.findIndex((day) =>
      isSameDay(day.fullDate, prevDay)
    );
    const halfCount = Math.floor(visibleDaysCount / 2);
    const newPage = Math.max(
      0,
      Math.floor((prevDayIndex - halfCount) / visibleDaysCount)
    );
    setCurrentPage(newPage);
  };

  const getVisibleDays = () => {
    const selectedDayIndex = allDays.findIndex((day) =>
      isSameDay(day.fullDate, selectedDate)
    );
    const halfCount = Math.floor(visibleDaysCount / 2);
    let startIndex = Math.max(0, selectedDayIndex - halfCount);
    if (startIndex + visibleDaysCount > allDays.length) {
      startIndex = Math.max(0, allDays.length - visibleDaysCount);
    }
    return allDays.slice(startIndex, startIndex + visibleDaysCount);
  };

  const handleSelectDate = (date) => {
    setAnimationDirection(date > selectedDate ? "next" : "prev");
    setSelectedDate(date);
    if (date.getMonth() !== currentMonth.getMonth()) {
      setCurrentMonth(startOfMonth(date));
    }
    const dateIndex = allDays.findIndex((day) => isSameDay(day.fullDate, date));
    const halfCount = Math.floor(visibleDaysCount / 2);
    const newPage = Math.max(
      0,
      Math.floor((dateIndex - halfCount) / visibleDaysCount)
    );
    setCurrentPage(newPage);
    if (userProfile?.userId) loadAppointments(date);
  };

  const handleCancelAppointment = (appointmentId) => {
    setConfirmModalState({ visible: true, appointmentId });
  };

  const handleNavigate = () => navigate("/student/booking");
  const handleChat = (id) => navigate(`/chat/${id}`);

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
    setSelectedDate(startOfMonth(addMonths(currentMonth, 1)));
    if (userProfile?.userId)
      loadAppointments(startOfMonth(addMonths(currentMonth, 1)));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
    setSelectedDate(startOfMonth(subMonths(currentMonth, 1)));
    if (userProfile?.userId)
      loadAppointments(startOfMonth(subMonths(currentMonth, 1)));
  };

  useEffect(() => {
    const updateVisibleDaysCount = () => {
      if (calendarContainerRef.current) {
        const containerWidth = calendarContainerRef.current.offsetWidth;
        const possibleDaysToShow = Math.floor(containerWidth / 70);
        setVisibleDaysCount(Math.max(5, possibleDaysToShow));
      }
    };
    updateVisibleDaysCount();
    window.addEventListener("resize", updateVisibleDaysCount);
    return () => window.removeEventListener("resize", updateVisibleDaysCount);
  }, []);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        await loadUserProfile();
      } catch (error) {
        console.error("Failed to initialize data:", error);
        setErrorMessage("Failed to load user profile. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    initializeData();
  }, []);

  useEffect(() => {
    if (userProfile?.userId) {
      loadAppointments(selectedDate);
    }
  }, [userProfile, selectedDate]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen bg-gray-50 flex items-center justify-center" // Sửa nền thành bg-gray-50
    >
      <CContainer
        fluid
        className="max-w-[1440px] min-h-[100vh] mx-auto grid grid-rows-[auto_1fr] p-4" // Thêm padding p-4
      >
        <div ref={calendarContainerRef} className="w-full">
          <CalendarHeader
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            allDays={allDays}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            animationDirection={animationDirection}
            setAnimationDirection={setAnimationDirection}
            visibleDaysCount={visibleDaysCount}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            handlePrev={handlePrev}
            handleNext={handleNext}
            handleSelectDate={handleSelectDate}
            getVisibleDays={getVisibleDays}
            handleNextMonth={handleNextMonth}
            handlePrevMonth={handlePrevMonth}
          />
        </div>

        <div className="w-full flex-1 flex flex-col">
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500 text-white rounded-lg mb-4 p-4 shadow-md" // Cập nhật màu đỏ đồng bộ với Cancel
            >
              <p>{errorMessage}</p>
            </motion.div>
          )}
          <motion.div
            key={appointmentViewKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <AppointmentsList
              isLoading={isLoading}
              filteredAppointments={
                filterStatus === "All"
                  ? bookings
                  : bookings.filter(
                      (booking) => booking.status === filterStatus
                    )
              }
              handleViewDetail={handleViewDetail}
              handleCancelAppointment={handleCancelAppointment}
              handleChat={handleChat}
              handleNavigate={handleNavigate}
              selectedDate={selectedDate}
            />
          </motion.div>
        </div>

        <ConfirmModal
          visible={confirmModalState.visible}
          onClose={() =>
            setConfirmModalState({ visible: false, appointmentId: null })
          }
          onConfirm={() => {
            if (confirmModalState.appointmentId) {
              handleCancelAppointmentApi(confirmModalState.appointmentId);
            }
            setConfirmModalState({ visible: false, appointmentId: null });
          }}
          appointmentId={confirmModalState.appointmentId} // Truyền appointmentId
        />

        <AppointmentDetailModal
          isOpen={detailModalState.isOpen}
          handleChat={handleChat}
          onClose={() =>
            setDetailModalState((prev) => ({
              ...prev,
              isOpen: false,
              selectedAppointment: null,
            }))
          }
          appointment={detailModalState.selectedAppointment}
        />
      </CContainer>
    </motion.div>
  );
};

export default SchedulePage;

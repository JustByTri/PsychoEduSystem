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
  isBefore,
} from "date-fns";
import {
  fetchUserProfile,
  fetchAppointments,
  cancelAppointment,
} from "../../services/apiService";
import CalendarHeader from "../../components/Header/CalendarHeader";
import AppointmentDetailModal from "../../components/Modal/AppointmentDetailModal";
import ConfirmModal from "../../components/Modal/ConfirmModal";
import AppointmentsList from "../../components/StudentSchedule/AppointmentsList";

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
  const [currentDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(0);
  const [animationDirection, setAnimationDirection] = useState("");
  const [visibleDaysCount, setVisibleDaysCount] = useState(7);
  const calendarContainerRef = useRef(null);

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
        weekday: dayOfWeek,
        fullDate: currentDay,
      });
    }
    return days;
  };

  const allDays = generateMonthDays();

  const loadUserProfile = async () => {
    try {
      const profile = await fetchUserProfile();
      setUserProfile(profile);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const loadAppointments = async (date) => {
    if (!userProfile?.userId) return;
    setIsLoading(true);
    try {
      const appointmentsData = await fetchAppointments(
        userProfile.userId,
        date
      );
      console.log("Raw appointments from API:", appointmentsData);
      setBookings(appointmentsData);
    } catch (error) {
      console.error("Failed to load appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointmentApi = async (appointmentId) => {
    try {
      await cancelAppointment(appointmentId);
      setBookings((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.appointmentId === appointmentId
            ? { ...appointment, isCancelled: true, status: "Cancelled" }
            : appointment
        )
      );
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
    }
  };

  const handleViewDetail = (appointment) => {
    setDetailModalState({ isOpen: true, selectedAppointment: appointment });
  };

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

  const getVisibleDays = () => {
    const startIndex = currentPage * visibleDaysCount;
    return allDays.slice(startIndex, startIndex + visibleDaysCount);
  };

  const handleSelectDate = (date) => {
    if (!isBefore(date, currentDate) || isSameDay(date, currentDate)) {
      setSelectedDate(date);
      loadAppointments(date); // Vẫn giữ để tải lại dữ liệu khi chọn ngày
    }
  };

  const handleCancelAppointment = (appointmentId) => {
    setConfirmModalState({ visible: true, appointmentId });
  };

  const navigate = useNavigate();
  const handleNavigate = () => navigate("/student/booking");
  const handleChat = (id) => navigate(`/chat/${id}`);

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
    return () => window.removeEventListener("resize", updateVisibleDaysCount);
  }, []);

  useEffect(() => {
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (userProfile?.userId) {
      console.log(
        "Loading appointments for:",
        format(selectedDate, "yyyy-MM-dd")
      );
      loadAppointments(selectedDate);
    }
  }, [selectedDate, userProfile]);

  console.log("Appointments before render:", bookings);

  return (
    <div
      className="w-full bg-gradient-to-br from-blue-200 to-blue-100 dark:from-gray-900 dark:to-gray-800"
      style={{
        transform: "scale(0.5)",
        transformOrigin: "top left",
        width: "200%",
        minHeight: "200%",
      }}
    >
      <CContainer fluid className="max-w-7xl mx-auto px-4 py-6">
        <CalendarHeader
          currentDate={currentDate}
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
        />
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{errorMessage}</p>
          </div>
        )}
        <AppointmentsList
          isLoading={isLoading}
          filteredAppointments={bookings}
          handleViewDetail={handleViewDetail}
          handleCancelAppointment={handleCancelAppointment}
          handleChat={handleChat}
          handleNavigate={handleNavigate}
        />
        <ConfirmModal
          visible={confirmModalState.visible}
          onClose={() =>
            setConfirmModalState({ visible: false, appointmentId: null })
          }
          onConfirm={handleCancelAppointmentApi}
          appointmentId={confirmModalState.appointmentId}
        />
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
      </CContainer>
    </div>
  );
};

export default SchedulePage;

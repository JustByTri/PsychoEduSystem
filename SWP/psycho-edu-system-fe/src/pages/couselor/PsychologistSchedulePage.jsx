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
  parseISO,
  isValid,
} from "date-fns";
import moment from "moment";
import apiService from "../../services/apiService";
import CalendarHeader from "../../components/Header/CalendarHeader";
import PsychologistAppointmentDetail from "../../components/Modal/PsychologistAppointmentDetail"; // Sử dụng component mới
import ConfirmModal from "../../components/Modal/ConfirmModal";
import PsychologistAppointmentsList from "../../components/PsychologistSchedule/PsychologistAppointmentsList";
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

const PsychologistSchedulePage = () => {
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = globalStyles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [confirmModalState, setConfirmModalState] = useState({
    visible: false,
    slotId: null,
  });
  const [detailModalState, setDetailModalState] = useState({
    isOpen: false,
    selectedSlot: null,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [animationDirection, setAnimationDirection] = useState("");
  const [visibleDaysCount, setVisibleDaysCount] = useState(15);
  const [slotsViewKey, setSlotsViewKey] = useState(0);
  const calendarContainerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

  const navigate = useNavigate();
  const authData = getAuthDataFromLocalStorage();
  const teacherId = authData?.userId;

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
      if (!teacherId) {
        throw new Error("Authentication data not found. Please log in.");
      }
      const profile = await apiService.fetchUserProfile(teacherId);
      setUserProfile(profile);
    } catch (error) {
      console.error("Failed to load user:", error);
      setErrorMessage("Failed to load user profile.");
    }
  };

  const fetchSchedules = async (date) => {
    setIsLoading(true);
    try {
      const selectedDateStr = moment(date).format("YYYY-MM-DD");
      const schedules = await apiService.fetchUserSchedules(teacherId);
      const appointments = await apiService.fetchConsultantAppointments(
        teacherId,
        selectedDateStr
      );

      if (!Array.isArray(schedules)) {
        setAvailableSlots([]);
        return;
      }

      const bookedSlotIds = appointments.map(
        (appointment) => appointment.slotId
      );

      const psychologistAvailableSlots = schedules
        .filter(
          (schedule) =>
            moment(schedule.date).isSame(selectedDateStr, "day") &&
            !bookedSlotIds.includes(schedule.slotId)
        )
        .map((schedule) => {
          let parsedDate;
          try {
            parsedDate = parseISO(schedule.date);
            if (!isValid(parsedDate)) throw new Error("Invalid schedule date");
          } catch (error) {
            console.error("Invalid schedule date:", schedule.date, error);
            parsedDate = startOfDay(new Date(selectedDateStr));
          }
          const startHour = parseInt(schedule.slotName.split(":")[0], 10);
          return {
            id: schedule.scheduleId,
            title: "Available Slot",
            slot: schedule.slotId,
            date: parsedDate,
            start: moment(selectedDateStr)
              .set({ hour: startHour, minute: 0 })
              .toDate(),
            end: moment(selectedDateStr)
              .set({ hour: startHour + 1, minute: 0 })
              .toDate(),
            status: "AVAILABLE",
            details: {
              slotId: schedule.slotId,
              date: parsedDate,
              slotName: schedule.slotName,
              createAt: schedule.createAt,
              status: "AVAILABLE",
              studentId: null,
              meetingWith: userProfile?.fullName || "You",
              bookedBy: null,
              appointmentFor: null,
              isOnline: null,
            },
          };
        });

      const appointmentSlots = appointments.map((appointment) => {
        let parsedDate;
        try {
          parsedDate = parseISO(
            appointment.date.split("/").reverse().join("-")
          );
          if (!isValid(parsedDate)) throw new Error("Invalid appointment date");
        } catch (error) {
          console.error("Invalid appointment date:", appointment.date, error);
          parsedDate = startOfDay(new Date(selectedDateStr));
        }
        const localDate = startOfDay(parsedDate);
        const startHour = parseInt(appointment.slotId, 10) + 7;
        return {
          id: appointment.appointmentId,
          title: "Booked Appointment",
          slot: appointment.slotId,
          date: localDate,
          start: moment(selectedDateStr)
            .set({ hour: startHour, minute: 0 })
            .toDate(),
          end: moment(selectedDateStr)
            .set({ hour: startHour + 1, minute: 0 })
            .toDate(),
          status: appointment.isCancelled
            ? "CANCELLED"
            : appointment.isCompleted
            ? "COMPLETED"
            : "SCHEDULED",
          details: {
            slotId: appointment.slotId,
            date: localDate,
            slotName: getTimeFromSlotId(appointment.slotId),
            status: appointment.isCancelled
              ? "CANCELLED"
              : appointment.isCompleted
              ? "COMPLETED"
              : "SCHEDULED",
            meetingWith: appointment.meetingWith || "You",
            studentId: appointment.studentId || null, // Có thể bỏ nếu không dùng
            appointmentId: appointment.appointmentId,
            bookedBy: appointment.bookedBy || "Unknown",
            appointmentFor: appointment.appointmentFor || "Unknown",
            isOnline: appointment.isOnline,
            googleMeetURL: appointment.googleMeetURL,
          },
        };
      });

      setAvailableSlots([...psychologistAvailableSlots, ...appointmentSlots]);
      setSlotsViewKey((prev) => prev + 1);
    } catch (error) {
      console.error("Error fetching psychologist available slots:", error);

      setAvailableSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getTimeFromSlotId = (slotId) => {
    const times = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
    ];
    return times[slotId - 1] || "Unknown";
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await apiService.cancelAppointment(appointmentId);
      setConfirmModalState({ visible: false, slotId: null });
      fetchSchedules(selectedDate);
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      setErrorMessage("Failed to cancel appointment.");
    }
  };

  const handleConfirmCancel = (appointmentId) => {
    setConfirmModalState({ visible: true, slotId: appointmentId });
  };

  const handleNext = () => {
    const nextDay = addDays(selectedDate, 1);
    setAnimationDirection("next");
    setSelectedDate(nextDay);
    fetchSchedules(nextDay);
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
    fetchSchedules(prevDay);
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
    fetchSchedules(date);
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
  };

  const handleNavigateToRegistration = () =>
    navigate("/psychologist/schedule-registration");

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
    setSelectedDate(startOfMonth(addMonths(currentMonth, 1)));
    fetchSchedules(startOfMonth(addMonths(currentMonth, 1)));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
    setSelectedDate(startOfMonth(subMonths(currentMonth, 1)));
    fetchSchedules(startOfMonth(subMonths(currentMonth, 1)));
  };

  const handleViewDetail = (slot) => {
    setDetailModalState({ isOpen: true, selectedSlot: slot });
  };

  const handleChat = (id) => {
    const slot = availableSlots.find((s) => s.id === id);
    navigate(`/chat/${id}`, {
      state: { googleMeetURL: slot?.details?.googleMeetURL || null },
    });
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
        if (teacherId) {
          await fetchSchedules(selectedDate);
        }
      } catch (error) {
        setErrorMessage("Failed to initialize data.");
      } finally {
        setIsLoading(false);
      }
    };
    initializeData();
  }, [teacherId]);

  useEffect(() => {
    if (teacherId && userProfile) {
      fetchSchedules(selectedDate);
    }
  }, [selectedDate, userProfile, teacherId]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full min-h-screen bg-gray-50 flex items-center justify-center"
    >
      <CContainer
        fluid
        className="max-w-[1440px] min-h-[100vh] mx-auto grid grid-rows-[auto_1fr] p-4"
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
              className="bg-red-500 text-white rounded-lg mb-4 p-4 shadow-md"
            >
              <p>{errorMessage}</p>
            </motion.div>
          )}
          <motion.div
            key={slotsViewKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <PsychologistAppointmentsList
              isLoading={isLoading}
              filteredAppointments={
                filterStatus === "All"
                  ? availableSlots
                  : availableSlots.filter(
                      (slot) => slot.status === filterStatus
                    )
              }
              handleViewDetail={handleViewDetail}
              handleChat={handleChat}
              handleCancelAppointment={handleConfirmCancel}
              handleNavigate={handleNavigateToRegistration}
              selectedDate={selectedDate}
            />
          </motion.div>
        </div>

        <ConfirmModal
          visible={confirmModalState.visible}
          onClose={() => setConfirmModalState({ visible: false, slotId: null })}
          onConfirm={() => handleCancelAppointment(confirmModalState.slotId)}
          appointmentId={confirmModalState.slotId}
        />

        <PsychologistAppointmentDetail
          isOpen={detailModalState.isOpen}
          onClose={() =>
            setDetailModalState({ isOpen: false, selectedSlot: null })
          }
          appointment={detailModalState.selectedSlot?.details}
          handleChat={handleChat}
          handleCancelAppointment={handleCancelAppointment}
        />
      </CContainer>
    </motion.div>
  );
};

export default PsychologistSchedulePage;

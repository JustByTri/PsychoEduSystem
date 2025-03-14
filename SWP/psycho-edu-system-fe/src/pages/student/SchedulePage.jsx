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
  startOfDay,
} from "date-fns";
import apiService from "../../services/apiService"; // Import từ apiService.js
import CalendarHeader from "../../components/Header/CalendarHeader";
import AppointmentDetailModal from "../../components/Modal/AppointmentDetailModal";
import ConfirmModal from "../../components/Modal/ConfirmModal";
import AppointmentsList from "../../components/StudentSchedule/AppointmentsList";

// Thêm style trực tiếp vào component
const fadeInAnimation = {
  opacity: 0,
  animation: "fadeIn 0.3s ease-in-out forwards",
};

// Thêm keyframes vào document head
const addKeyframesToHead = () => {
  if (!document.querySelector("#fadeInKeyframes")) {
    const style = document.createElement("style");
    style.id = "fadeInKeyframes";
    style.innerHTML = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `;
    document.head.appendChild(style);
  }
};

const SchedulePage = () => {
  // Thêm keyframes khi component mount
  useEffect(() => {
    addKeyframesToHead();
    return () => {
      const style = document.querySelector("#fadeInKeyframes");
      if (style) style.remove();
    };
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
  const [appointmentViewKey, setAppointmentViewKey] = useState(0); // For simple fade-in animation
  const calendarContainerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [currentDate] = useState(startOfDay(new Date()));

  const generateMonthDays = () => {
    const monthStart = startOfMonth(currentDate);
    const totalDays = getDaysInMonth(currentDate);
    return Array.from({ length: totalDays }, (_, i) => {
      const currentDay = startOfDay(addDays(monthStart, i)); // Chuẩn hóa ngày
      return {
        day: currentDay.getDate(),
        weekday: format(currentDay, "E")[0],
        fullDate: currentDay,
        isPast:
          isBefore(currentDay, currentDate) &&
          !isSameDay(currentDay, currentDate),
        isToday: isSameDay(currentDay, currentDate),
        dayOfWeek: format(currentDay, "E")[0],
      };
    });
  };

  const allDays = generateMonthDays();

  const loadUserProfile = async () => {
    try {
      const profile = await apiService.fetchUserProfile(); // Sử dụng apiService
      setUserProfile(profile);
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  };

  const loadAppointments = async (date) => {
    if (!userProfile?.userId) return;
    const formattedDate = format(date, "yyyy-MM-dd");
    try {
      const appointmentsData = await apiService.fetchAppointments(
        userProfile.userId,
        formattedDate
      ); // Sử dụng apiService
      setBookings(appointmentsData || []);
      setAppointmentViewKey((prev) => prev + 1);
    } catch (error) {
      console.error("Failed to load appointments:", error);
      setBookings([]);
    }
  };

  const handleCancelAppointmentApi = async (appointmentId) => {
    try {
      await apiService.cancelAppointment(appointmentId); // Sử dụng apiService
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
    if (nextDay.getMonth() === currentDate.getMonth()) {
      // Chỉ đặt hướng animation cho calendar
      setAnimationDirection("next");
      setSelectedDate(nextDay);

      if (userProfile?.userId) {
        loadAppointments(nextDay);
      }

      // Tính toán currentPage
      const nextDayIndex = allDays.findIndex((day) =>
        isSameDay(day.fullDate, nextDay)
      );
      const halfCount = Math.floor(visibleDaysCount / 2);
      const newPage = Math.max(
        0,
        Math.floor((nextDayIndex - halfCount) / visibleDaysCount)
      );
      setCurrentPage(newPage);
    }
  };

  const handlePrev = () => {
    const prevDay = addDays(selectedDate, -1);
    if (
      prevDay.getMonth() === currentDate.getMonth() &&
      (!isBefore(prevDay, currentDate) || isSameDay(prevDay, currentDate))
    ) {
      // Chỉ đặt hướng animation cho calendar
      setAnimationDirection("prev");
      setSelectedDate(prevDay);

      if (userProfile?.userId) {
        loadAppointments(prevDay);
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
    }
  };

  const getVisibleDays = () => {
    const selectedDayIndex = allDays.findIndex((day) =>
      isSameDay(day.fullDate, selectedDate)
    );

    const halfCount = Math.floor(visibleDaysCount / 2);
    let startIndex = Math.max(0, selectedDayIndex - halfCount);

    // Đảm bảo không vượt quá giới hạn mảng
    if (startIndex + visibleDaysCount > allDays.length) {
      startIndex = Math.max(0, allDays.length - visibleDaysCount);
    }

    return allDays.slice(startIndex, startIndex + visibleDaysCount);
  };

  const handleSelectDate = (date) => {
    if (!isBefore(date, currentDate) || isSameDay(date, currentDate)) {
      setAnimationDirection(date > selectedDate ? "next" : "prev");

      setSelectedDate(date);

      const dateIndex = allDays.findIndex((day) =>
        isSameDay(day.fullDate, date)
      );
      const halfCount = Math.floor(visibleDaysCount / 2);
      const newPage = Math.max(
        0,
        Math.floor((dateIndex - halfCount) / visibleDaysCount)
      );

      setCurrentPage(newPage);

      if (userProfile?.userId) {
        loadAppointments(date);
      }
    }
  };

  const handleCancelAppointment = (appointmentId) => {
    setConfirmModalState({ visible: true, appointmentId });
  };

  const navigate = useNavigate();
  const handleNavigate = () => navigate("/student/booking");
  const handleChat = (id) => navigate(`/chat/${id}`);

  // Cập nhật số ngày hiển thị dựa trên chiều rộng màn hình
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

  // Tải thông tin người dùng khi component mount
  useEffect(() => {
    if (userProfile?.userId) {
      loadAppointments(selectedDate);
    }
  }, [selectedDate, userProfile]);

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      await loadUserProfile();
      setIsLoading(false);
    };

    initializeData();
  }, []);

  return (
    <div
      className="w-full bg-gradient-to-br white"
      style={{
        transform: "scale(0.5)",
        transformOrigin: "top left",
        width: "200%",
        minHeight: "200%",
      }}
    >
      <CContainer fluid className="max-w-7xl mx-auto px-4 py-6">
        {/* Calendar với hiệu ứng chuỗi/trượt */}
        <div ref={calendarContainerRef}>
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
        </div>

        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{errorMessage}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          /* Phần hiển thị lịch hẹn với hiệu ứng fade-in đơn giản */
          <div key={appointmentViewKey} style={fadeInAnimation}>
            <AppointmentsList
              isLoading={false}
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
          </div>
        )}

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

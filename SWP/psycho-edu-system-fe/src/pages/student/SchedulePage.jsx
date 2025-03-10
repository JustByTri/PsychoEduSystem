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
  parseISO,
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
  const [selectedDate, setSelectedDate] = useState(new Date());
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
  const [currentDate] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(0);
  const [animationDirection, setAnimationDirection] = useState("");
  const [visibleDaysCount, setVisibleDaysCount] = useState(15);
  const [appointmentViewKey, setAppointmentViewKey] = useState(0); // For simple fade-in animation
  const calendarContainerRef = useRef(null);

  const generateMonthDays = () => {
    const monthStart = startOfMonth(currentDate);
    const totalDays = getDaysInMonth(currentDate);
    const days = [];
    for (let i = 0; i < totalDays; i++) {
      const currentDay = addDays(monthStart, i);
      const dayNumber = currentDay.getDate();
      const dayOfWeek = format(currentDay, "E")[0];
      const isPast =
        isBefore(currentDay, currentDate) &&
        !isSameDay(currentDay, currentDate);
      const isToday = isSameDay(currentDay, currentDate);

      days.push({
        day: dayNumber,
        weekday: dayOfWeek,
        fullDate: currentDay,
        isPast,
        isToday,
        dayOfWeek,
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
      setErrorMessage("Không thể tải thông tin người dùng: " + error.message);
    }
  };

  const loadAppointments = async (date) => {
    if (!userProfile?.userId) return;

    try {
      const appointmentsData = await fetchAppointments(
        userProfile.userId,
        date
      );
      console.log("Raw appointments from API:", appointmentsData);
      setBookings(appointmentsData || []);
      // Trigger appointment view animation
      setAppointmentViewKey((prev) => prev + 1);
      return appointmentsData;
    } catch (error) {
      console.error("Failed to load appointments:", error);
      setError("Không thể tải cuộc hẹn. Vui lòng thử lại sau.");
      setBookings([]);
      return [];
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
      // Đặt hướng animation cho calendar
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
    loadUserProfile();
  }, []);

  useEffect(() => {
    if (userProfile?.userId) {
      console.log(
        "Loading appointments for date:",
        format(selectedDate, "yyyy-MM-dd")
      );
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

  // Lọc cuộc hẹn dựa trên trạng thái đã chọn
  const filteredAppointments =
    filterStatus === "All"
      ? bookings
      : bookings.filter((booking) => booking.status === filterStatus);

  console.log("Các cuộc hẹn sẽ hiển thị:", filteredAppointments);

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

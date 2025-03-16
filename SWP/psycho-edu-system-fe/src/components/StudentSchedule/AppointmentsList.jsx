import React, { useState, useEffect, useRef } from "react";
import { CSpinner } from "@coreui/react";
import AppointmentsCard from "./AppointmentCard";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import apiService from "../../services/apiService";

const AppointmentsList = ({
  isLoading,
  filteredAppointments,
  handleViewDetail,
  handleCancelAppointment,
  handleChat,
  handleNavigate,
  selectedDate,
}) => {
  const [appointmentsWithNames, setAppointmentsWithNames] = useState([]);
  const userProfileCache = useRef({}); // Đảm bảo khai báo userProfileCache

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

  const calculateTimeRange = (slotId) => {
    const startTime = getTimeFromSlotId(slotId);
    if (startTime === "Unknown") return "Unknown";
    const [hours, minutes] = startTime.split(":").map(Number);
    const endHours = hours + (minutes + 45 >= 60 ? 1 : 0);
    const endMinutes = (minutes + 45) % 60;
    const endTime = `${endHours.toString().padStart(2, "0")}:${endMinutes
      .toString()
      .padStart(2, "0")}`;
    return `${startTime} - ${endTime}`;
  };

  const fetchNamesForAppointment = async (appointment) => {
    try {
      if (!appointment.studentId) {
        throw new Error(`Invalid studentId: ${appointment.studentId}`);
      }

      // Lấy thông tin sinh viên từ fetchUserProfile
      let studentProfile = userProfileCache.current[appointment.studentId];
      if (!studentProfile) {
        studentProfile = await apiService.fetchUserProfile(
          appointment.studentId
        );
        userProfileCache.current[appointment.studentId] = studentProfile;
      }

      // Sử dụng trực tiếp meetingWith làm tên của psychologist
      const psychologistName =
        appointment.meetingWith || "Unknown Psychologist";

      return {
        ...appointment,
        student:
          studentProfile.fullName || studentProfile.name || "Unknown Student", // Ưu tiên fullName
        lesson: psychologistName, // Sử dụng meetingWith làm tên
      };
    } catch (error) {
      console.error("Error fetching names for appointment:", {
        studentId: appointment.studentId,
        meetingWith: appointment.meetingWith,
        error: error.message,
      });
      return {
        ...appointment,
        student: "Unknown Student",
        lesson: appointment.meetingWith || "Unknown Psychologist", // Fallback nếu có lỗi
      };
    }
  };

  useEffect(() => {
    const fetchAllNames = async () => {
      const appointmentsWithNames = await Promise.all(
        filteredAppointments.map(fetchNamesForAppointment)
      );
      setAppointmentsWithNames(appointmentsWithNames);
    };
    fetchAllNames();
  }, [filteredAppointments]);

  return (
    <div className="appointments-container">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <CSpinner color="primary" />
        </div>
      ) : filteredAppointments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {appointmentsWithNames.map((appointment, index) => (
              <AppointmentsCard
                key={appointment.id}
                student={appointment.student}
                lesson={appointment.lesson}
                date={format(appointment.date, "EEE, dd-MM-yyyy")}
                timeRange={
                  calculateTimeRange(appointment.slot) ||
                  appointment.time ||
                  "Unknown"
                }
                status={
                  appointment.isCancelled
                    ? "Canceled"
                    : appointment.isCompleted
                    ? "Completed"
                    : "Not Yet"
                }
                onJoin={() => handleChat(appointment.id)}
                onCancel={() =>
                  handleCancelAppointment(appointment.appointmentId)
                }
                onViewDetail={() => handleViewDetail(appointment)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-10">
          <h5 className="text-blue-600 text-[clamp(16px,2vw,18px)]">
            No appointments for {format(selectedDate, "EEEE, MM/dd/yyyy")}
          </h5>
          <button
            onClick={handleNavigate}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-[clamp(14px,1.5vw,16px)]"
          >
            Schedule a New Appointment
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;

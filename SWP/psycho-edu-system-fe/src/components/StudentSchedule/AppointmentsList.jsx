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
  const userProfileCache = useRef({});

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
      let studentProfile = userProfileCache.current[appointment.studentId];
      if (!studentProfile) {
        studentProfile = await apiService.fetchUserProfile(
          appointment.studentId
        );
        userProfileCache.current[appointment.studentId] = studentProfile;
      }
      const psychologistName =
        appointment.meetingWith || "Unknown Psychologist";
      return {
        ...appointment,
        student:
          studentProfile.fullName || studentProfile.name || "Unknown Student",
        lesson: psychologistName,
      };
    } catch (error) {
      return {
        ...appointment,
        student: "Unknown Student",
        lesson: appointment.meetingWith || "Unknown Psychologist",
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
    <div className="appointments-container h-full overflow-hidden flex flex-col bg-gray-50">
      <div className="flex-1 flex flex-col">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <CSpinner color="primary" />
          </div>
        ) : filteredAppointments.length > 0 ? (
          <motion.div
            className="flex-1 px-6 py-6 grid grid-cols-3 gap-6 max-h-[calc(100vh-250px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence>
              {appointmentsWithNames.map((appointment) => (
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
                  type={appointment.isOnline ? "Online" : "Offline"}
                  bookedBy={appointment.bookedBy}
                  appointmentFor={appointment.appointmentFor} // Truyền appointmentFor
                  onJoin={() => handleChat(appointment.id)}
                  onCancel={() =>
                    handleCancelAppointment(appointment.appointmentId)
                  }
                  onViewDetail={() => handleViewDetail(appointment)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-center px-6">
            <h5 className="text-gray-600 text-[1.125rem] mb-4">
              No appointments scheduled
            </h5>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNavigate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-[1rem] shadow-md"
            >
              Schedule a New Appointment
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsList;

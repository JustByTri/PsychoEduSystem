import React, { useState, useEffect, useRef, useCallback } from "react";
import { CSpinner } from "@coreui/react";
import AppointmentsCard from "./AppointmentCard";
import { motion, AnimatePresence } from "framer-motion";
import { format, isValid } from "date-fns";
import apiService from "../../services/apiService";

const AppointmentsList = ({
  isLoading,
  filteredAppointments = [], // Default empty array
  handleViewDetail,
  handleCancelAppointment,
  handleChat,
  handleNavigate,
  selectedDate,
}) => {
  const [appointmentsWithNames, setAppointmentsWithNames] = useState([]);
  const userProfileCache = useRef({});
  // Add a ref to track if the component is mounted
  const isMounted = useRef(true);
  // Add a processing flag to prevent multiple concurrent updates
  const [isProcessing, setIsProcessing] = useState(false);

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

  const calculateTimeRange = (slotId) => {
    const startTime = getTimeFromSlotId(slotId);
    if (startTime === "Unknown") return "Unknown";
    const [hours, minutes] = startTime.split(":").map(Number);
    const endHours = hours + (minutes + 45 >= 60 ? 1 : 0); // 45 phút như student
    const endMinutes = (minutes + 45) % 60;
    const endTime = `${endHours.toString().padStart(2, "0")}:${endMinutes
      .toString()
      .padStart(2, "0")}`;
    return `${startTime} - ${endTime}`;
  };

  // Memoize this function to ensure it doesn't change on every render
  const fetchNamesForAppointment = useCallback(async (appointment) => {
    if (!appointment) return null;

    const isPsychologist = !!appointment.details; // Phân biệt student và psychologist
    const details = isPsychologist ? appointment.details : appointment;

    try {
      if (!details || !details.studentId) {
        // Available slot hoặc appointment không có student
        return {
          ...appointment,
          student: "N/A", // Không có student cho available slot
          lesson: details?.meetingWith || "Available Slot",
          bookedBy: details?.bookedBy || "N/A",
          appointmentFor: details?.appointmentFor || "N/A",
        };
      }

      // Check cache first to reduce API calls
      let studentProfile = userProfileCache.current[details.studentId];
      if (!studentProfile) {
        try {
          studentProfile = await apiService.fetchUserProfile(details.studentId);
          userProfileCache.current[details.studentId] = studentProfile;
        } catch (error) {
          console.error(
            `Error fetching profile for studentId: ${details.studentId}`,
            error
          );
          studentProfile = null;
        }
      }

      return {
        ...appointment,
        student:
          studentProfile?.fullName || studentProfile?.name || "Unknown Student",
        lesson: details.meetingWith || "Unknown Psychologist",
        bookedBy: details.bookedBy || "Unknown",
        appointmentFor: details.appointmentFor || "Unknown",
      };
    } catch (error) {
      console.error("Error processing appointment:", error);
      return {
        ...appointment,
        student: "Unknown Student",
        lesson: details?.meetingWith || "Unknown Psychologist",
        bookedBy: details?.bookedBy || "Unknown",
        appointmentFor: details?.appointmentFor || "Unknown",
      };
    }
  }, []);

  // Clean up effect
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Main effect for fetching appointment names
  useEffect(() => {
    // Prevent running if already processing or component unmounted
    if (isProcessing || !isMounted.current) return;

    const fetchAllNames = async () => {
      // Set processing flag to true to prevent concurrent updates
      setIsProcessing(true);

      try {
        if (!filteredAppointments || filteredAppointments.length === 0) {
          if (isMounted.current) {
            setAppointmentsWithNames([]);
          }
          return;
        }

        // Create a stable copy of the array to work with
        const appointments = [...filteredAppointments];
        const promises = appointments.map(fetchNamesForAppointment);
        const results = await Promise.all(promises);

        // Only update state if component is still mounted
        if (isMounted.current) {
          // Filter out any null values
          setAppointmentsWithNames(results.filter(Boolean));
        }
      } catch (error) {
        console.error("Error in fetchAllNames:", error);
        if (isMounted.current) {
          setAppointmentsWithNames([]);
        }
      } finally {
        // Reset processing flag when done
        if (isMounted.current) {
          setIsProcessing(false);
        }
      }
    };

    fetchAllNames();

    // Include filteredAppointments.length in the dependency array
    // instead of the entire filteredAppointments array
    // This prevents unnecessary re-renders when the array reference changes
    // but the actual data remains the same
  }, [fetchNamesForAppointment, filteredAppointments.length]);

  return (
    <div className="appointments-container h-full overflow-hidden flex flex-col bg-gray-50">
      <div className="flex-1 flex flex-col">
        {isLoading || isProcessing ? (
          <div className="flex justify-center items-center h-full">
            <CSpinner color="primary" />
          </div>
        ) : filteredAppointments && filteredAppointments.length > 0 ? (
          <motion.div
            className="flex-1 px-6 py-6 grid grid-cols-3 gap-6 max-h-[calc(100vh-250px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence>
              {appointmentsWithNames.map((appointment) => {
                if (!appointment) return null;

                const isPsychologist = !!appointment.details;
                const details = isPsychologist
                  ? appointment.details
                  : appointment;

                // Create a stable key for React
                const appointmentKey =
                  appointment.id ||
                  details?.appointmentId ||
                  `appointment-${Math.random()}`;

                return (
                  <AppointmentsCard
                    key={appointmentKey}
                    student={appointment.student}
                    lesson={appointment.lesson}
                    date={
                      appointment.date && isValid(new Date(appointment.date))
                        ? format(new Date(appointment.date), "EEE, dd-MM-yyyy")
                        : "Invalid Date"
                    }
                    timeRange={
                      calculateTimeRange(details?.slot || details?.slotId) ||
                      details?.time ||
                      "Unknown"
                    }
                    status={appointment.status || details?.status || "Unknown"}
                    type={details?.type || "N/A"}
                    bookedBy={appointment.bookedBy}
                    appointmentFor={appointment.appointmentFor}
                    onJoin={() => handleChat(appointment.id)}
                    onCancel={() =>
                      handleCancelAppointment(
                        details?.appointmentId || appointment.id
                      )
                    }
                    onViewDetail={() => handleViewDetail(appointment)}
                  />
                );
              })}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center text-center px-6">
            <h5 className="text-gray-600 text-[1.125rem] mb-4">
              No slots or appointments scheduled
            </h5>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNavigate}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-[1rem] shadow-md"
            >
              Register New Slots
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppointmentsList;

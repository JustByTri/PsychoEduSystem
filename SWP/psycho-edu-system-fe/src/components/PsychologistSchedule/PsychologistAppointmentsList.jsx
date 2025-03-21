import React, { useState, useEffect, useRef } from "react";
import { CSpinner, CNav, CNavItem, CNavLink } from "@coreui/react";
import PsychologistAppointmentCard from "./PsychologistAppointmentCard";
import { motion, AnimatePresence } from "framer-motion";
import { format, isValid } from "date-fns";

const PsychologistAppointmentsList = ({
  isLoading,
  filteredBookings,
  filteredAvailableSlots,
  handleViewDetail,
  handleChat,
  handleCancelAppointment,
  handleNavigate,
  selectedDate,
}) => {
  const [appointmentsWithNames, setAppointmentsWithNames] = useState([]);
  const [activeTab, setActiveTab] = useState("booked");
  const [error, setError] = useState(null);
  const userProfileCache = useRef({});

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
    const endHours = hours + (minutes + 45 >= 60 ? 1 : 0);
    const endMinutes = (minutes + 45) % 60;
    const endTime = `${endHours.toString().padStart(2, "0")}:${endMinutes
      .toString()
      .padStart(2, "0")}`;
    return `${startTime} - ${endTime}`;
  };

  const fetchNamesForAppointment = async (appointment) => {
    try {
      if (appointment.status === "AVAILABLE") {
        return {
          ...appointment,
          student: "N/A",
          psychologist: appointment.details.meetingWith || "You",
          bookedBy: "N/A",
          appointmentFor: "N/A",
          isOnline: null,
          showParent: false,
        };
      }
      const studentName =
        appointment.details.appointmentFor || "Unknown Student";
      const isParentBooking =
        appointment.details.bookedBy &&
        appointment.details.bookedBy.trim() !== "" &&
        appointment.details.bookedBy !== appointment.details.appointmentFor;
      return {
        ...appointment,
        student: studentName,
        psychologist: appointment.details.meetingWith || "Unknown Psychologist",
        bookedBy: appointment.details.bookedBy || "Unknown",
        appointmentFor: appointment.details.appointmentFor || "Unknown",
        isOnline: appointment.details.isOnline,
        showParent: isParentBooking,
      };
    } catch (error) {
      console.error("Error fetching names:", error);
      setError("Failed to process appointment data.");
      return {
        ...appointment,
        student: appointment.details.appointmentFor || "Unknown Student",
        psychologist: appointment.details.meetingWith || "Unknown Psychologist",
        bookedBy: appointment.details.bookedBy || "Unknown",
        appointmentFor: appointment.details.appointmentFor || "Unknown",
        isOnline: appointment.details.isOnline,
        showParent: false,
      };
    }
  };

  useEffect(() => {
    const fetchAllNames = async () => {
      setError(null);
      const allAppointments = [...filteredBookings, ...filteredAvailableSlots];
      const appointmentsWithNames = await Promise.all(
        allAppointments.map(fetchNamesForAppointment)
      );
      setAppointmentsWithNames(appointmentsWithNames);
    };
    fetchAllNames();
  }, [filteredBookings, filteredAvailableSlots]);

  const tabVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
  };

  return (
    <div className="appointments-container w-full h-full overflow-hidden flex flex-col bg-[#F5F7FA] overflow-x-hidden">
      <CNav variant="tabs" className="bg-white border-b border-gray-200">
        <CNavItem>
          <CNavLink
            active={activeTab === "booked"}
            onClick={() => setActiveTab("booked")}
            className={`px-6 py-3 text-gray-700 font-semibold cursor-pointer ${
              activeTab === "booked"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "hover:text-blue-500"
            }`}
          >
            Booked Appointments ({filteredBookings.length})
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink
            active={activeTab === "available"}
            onClick={() => setActiveTab("available")}
            className={`px-6 py-3 text-gray-700 font-semibold cursor-pointer ${
              activeTab === "available"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "hover:text-blue-500"
            }`}
          >
            Available Slots ({filteredAvailableSlots.length})
          </CNavLink>
        </CNavItem>
      </CNav>

      <div className="flex-1 p-2 sm:p-3 md:p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <CSpinner color="primary" />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full text-red-600">
            {error}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {activeTab === "booked" && (
              <motion.div
                key="booked"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 w-full max-w-[1248px] mx-auto" // Thay w-[1248px] bằng w-full, giữ max-w-[1248px]
              >
                {filteredBookings.length > 0 ? (
                  appointmentsWithNames
                    .filter((appt) => appt.status !== "AVAILABLE")
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className="w-[300px] min-w-[250px] sm:max-w-[300px] md:max-w-[300px] lg:max-w-[300px]"
                      >
                        <PsychologistAppointmentCard
                          id={appointment.id}
                          student={appointment.student}
                          psychologist={appointment.psychologist}
                          date={
                            isValid(appointment.date)
                              ? format(appointment.date, "EEE, dd-MM-yyyy")
                              : "Invalid Date"
                          }
                          timeRange={calculateTimeRange(
                            appointment.details.slotId
                          )}
                          status={appointment.status}
                          bookedBy={appointment.bookedBy}
                          appointmentFor={appointment.appointmentFor}
                          isOnline={appointment.isOnline}
                          showParent={appointment.showParent}
                          onViewDetail={() => handleViewDetail(appointment)}
                          onChat={() => handleChat(appointment.id)}
                          onCancel={() =>
                            handleCancelAppointment(appointment.id)
                          }
                        />
                      </div>
                    ))
                ) : (
                  <p className="w-full text-center text-gray-600 py-4">
                    No booked appointments for this date
                  </p>
                )}
              </motion.div>
            )}
            {activeTab === "available" && (
              <motion.div
                key="available"
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 w-full max-w-[1248px] mx-auto" // Thay w-[1248px] bằng w-full, giữ max-w-[1248px]
              >
                {filteredAvailableSlots.length > 0 ? (
                  appointmentsWithNames
                    .filter((appt) => appt.status === "AVAILABLE")
                    .map((slot) => (
                      <div
                        key={slot.id}
                        className="w-[300px] min-w-[250px] sm:max-w-[300px] md:max-w-[300px] lg:max-w-[300px]"
                      >
                        <PsychologistAppointmentCard
                          id={slot.id}
                          student={slot.student}
                          psychologist={slot.psychologist}
                          date={
                            isValid(slot.date)
                              ? format(slot.date, "EEE, dd-MM-yyyy")
                              : "Invalid Date"
                          }
                          timeRange={calculateTimeRange(slot.details.slotId)}
                          status={slot.status}
                          bookedBy={slot.bookedBy}
                          appointmentFor={slot.appointmentFor}
                          isOnline={slot.isOnline}
                          showParent={slot.showParent}
                          onViewDetail={() => handleViewDetail(slot)}
                          onChat={() => handleChat(slot.id)}
                          onCancel={() => handleCancelAppointment(slot.id)}
                        />
                      </div>
                    ))
                ) : (
                  <div className="w-full flex flex-col items-center justify-center py-4">
                    <p className="text-gray-600 mb-2">
                      No available slots for this date
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleNavigate}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow-md"
                    >
                      Register New Slots
                    </motion.button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default PsychologistAppointmentsList;

import React from "react";
import { CCard, CCardBody, CSpinner } from "@coreui/react";
import { FaClock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const AppointmentsList = ({
  isLoading,
  filteredAppointments,
  handleViewDetail,
  handleCancelAppointment,
  handleChat,
  handleNavigate,
  selectedDate,
}) => {
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

  return (
    <div className="appointments-container">
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
                whileHover={{ scale: 1.02 }} // Hiệu ứng nổi nhẹ khi hover
                onDoubleClick={() => handleViewDetail(appointment)}
                className="w-full max-w-[400px] mx-auto"
              >
                <CCard className="shadow-md border-0 bg-blue-50 dark:bg-gray-800 rounded-2xl overflow-hidden flex flex-col">
                  <CCardBody className="p-4 flex flex-col gap-4">
                    {/* Consultant Info */}
                    <div className="text-center">
                      <span className="text-blue-600 dark:text-blue-300 text-[clamp(14px,1.5vw,16px)]">
                        Consultant
                      </span>
                      <h5 className="mt-1 mb-0 font-bold text-gray-800 dark:text-gray-200 text-[clamp(20px,2.5vw,24px)]">
                        {appointment.consultant || "Unknown Consultant"}
                      </h5>
                    </div>

                    {/* Date, Time, Type, Status */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-blue-500 text-[clamp(18px,2vw,20px)]" />
                        <span className="text-gray-800 dark:text-gray-200 font-medium text-[clamp(16px,2vw,18px)]">
                          {format(appointment.date, "EEE, do MMM")}{" "}
                          {appointment.slot
                            ? getTimeFromSlotId(appointment.slot)
                            : appointment.time || "Unknown time"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className={`font-medium text-[clamp(14px,1.5vw,16px)] ${
                            appointment.type === "Online"
                              ? "text-blue-500"
                              : "text-purple-500"
                          }`}
                        >
                          {appointment.type}
                        </span>
                        <span
                          className={`font-medium text-[clamp(14px,1.5vw,16px)] ${
                            appointment.status === "Completed"
                              ? "text-green-500"
                              : appointment.status === "Cancelled"
                              ? "text-red-500"
                              : "text-yellow-500"
                          }`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>

                    {/* Buttons - Always show all 4 buttons, gray out if not applicable */}
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => handleChat(appointment.id)}
                        disabled={
                          appointment.status === "Completed" ||
                          appointment.status === "Cancelled"
                        }
                        className={`${
                          appointment.status === "Completed" ||
                          appointment.status === "Cancelled"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-500 hover:bg-blue-600"
                        } text-white font-bold rounded-full shadow-md transition-all duration-200 w-[120px] h-10 flex items-center justify-center text-[clamp(12px,1.2vw,14px)] truncate`}
                      >
                        Join
                      </button>
                      <a
                        href={appointment.googleMeetURL || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (
                            !appointment.googleMeetURL ||
                            appointment.type !== "Online"
                          )
                            e.preventDefault();
                        }}
                        className={`${
                          appointment.type === "Online" &&
                          appointment.googleMeetURL
                            ? "bg-emerald-500 hover:bg-emerald-600"
                            : "bg-gray-400 cursor-not-allowed"
                        } text-white font-bold rounded-full shadow-md transition-all duration-200 w-[120px] h-10 flex items-center justify-center text-[clamp(12px,1.2vw,14px)] truncate`}
                      >
                        G-Meet
                      </a>
                      <button
                        onClick={() => handleViewDetail(appointment)}
                        className="bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-full shadow-md transition-all duration-200 w-[120px] h-10 flex items-center justify-center text-[clamp(12px,1.2vw,14px)] truncate"
                      >
                        Detail
                      </button>
                      <button
                        onClick={() =>
                          handleCancelAppointment(appointment.appointmentId)
                        }
                        disabled={appointment.status === "Cancelled"}
                        className={`${
                          appointment.status === "Cancelled"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600"
                        } text-white font-bold rounded-full shadow-md transition-all duration-200 w-[120px] h-10 flex items-center justify-center text-[clamp(12px,1.2vw,14px)] truncate`}
                      >
                        Cancel
                      </button>
                    </div>
                  </CCardBody>
                </CCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-10">
          <h5 className="text-blue-600 dark:text-blue-400 text-[clamp(16px,2vw,18px)]">
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

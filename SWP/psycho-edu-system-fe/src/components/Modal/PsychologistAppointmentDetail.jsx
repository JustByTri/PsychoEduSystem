import React, { useEffect, useState } from "react";
import { format, startOfDay, parse } from "date-fns";
import { motion } from "framer-motion";
import FeedbackForm from "./FeedbackForm";
import apiService from "../../services/apiService";

const PsychologistAppointmentDetail = ({
  isOpen,
  onClose,
  appointment,
  handleChat,
  handleCancelAppointment,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const parseDate = (dateInput) => {
    if (typeof dateInput === "string") {
      const parsed = parse(dateInput, "EEE, dd-MM-yyyy", new Date());
      return startOfDay(parsed);
    } else if (dateInput instanceof Date) {
      return startOfDay(dateInput);
    } else {
      console.error("Invalid date input:", dateInput);
      return startOfDay(new Date());
    }
  };

  const currentDate = startOfDay(new Date());
  const appointmentDate = appointment ? parseDate(appointment.date) : null;
  const isPastDay = appointmentDate && appointmentDate < currentDate;

  // Không cần fetch studentDetails vì không có studentId
  useEffect(() => {
    setLoading(false); // Không cần loading vì không fetch
  }, [appointment, isOpen]);

  if (!isOpen || !appointment) return null;

  const modalVariants = {
    hidden: { x: "100%", scale: 0.95 },
    visible: { x: 0, scale: 1.05, transition: { duration: 0.3 } },
    exit: {
      x: "100%",
      scale: 0.95,
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  const buttonVariants = {
    hover: { scale: 0.95, transition: { duration: 0.2 } },
    tap: { scale: 0.9, transition: { duration: 0.1 } },
  };

  const confirmModalVariants = {
    hidden: { opacity: 0, y: "-50%" },
    visible: { opacity: 1, y: "0%", transition: { duration: 0.2 } },
    exit: { opacity: 0, y: "-50%", transition: { duration: 0.2 } },
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

  const handleOpenCancelModal = () => {
    setIsCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
  };

  const handleConfirmCancel = async () => {
    try {
      const appointmentId = appointment.appointmentId || appointment.id;
      console.log("Cancelling appointment with ID:", appointmentId);
      const message = await apiService.cancelAppointment(appointmentId);
      console.log("Cancel response:", message);
      handleCancelAppointment(appointmentId);
      setIsCancelModalOpen(false);
      onClose();
    } catch (error) {
      console.error("Error cancelling appointment:", error.message);
      setIsCancelModalOpen(false);
    }
  };

  const displayStatus = isPastDay ? "Completed" : appointment.status;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm z-50 flex justify-end overflow-hidden"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="w-[min(32rem,95%)] h-full bg-gradient-to-br from-blue-100 via-purple-50 to-gray-100 p-6 rounded-l-xl shadow-2xl border-l-4 border-blue-600 flex flex-col"
        >
          <div className="flex flex-col min-h-full overflow-y-scroll scrollbar-hidden">
            <style jsx>{`
              .scrollbar-hidden {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
              .scrollbar-hidden::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b border-gray-300 pb-4">
              <h3 className="text-[clamp(18px,2vw,20px)] font-semibold text-gray-800">
                Appointment Details
              </h3>
              <button
                onClick={() => setTimeout(onClose, 300)}
                className="text-gray-600 hover:text-gray-800 rounded-full p-1 hover:bg-gray-200 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Nội dung chính */}
            <div className="space-y-6 flex-1">
              {loading ? (
                <div className="flex justify-center items-center h-[60%]">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                  <p className="text-[clamp(14px,1.5vw,16px)]">{error}</p>
                </div>
              ) : (
                <>
                  {/* Student Information (chỉ hiển thị nếu không phải AVAILABLE) */}
                  {appointment.status !== "AVAILABLE" && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <h4 className="text-[clamp(14px,1.5vw,16px)] font-medium text-gray-700 mb-3">
                        Student Info
                      </h4>
                      <div className="flex items-center space-x-4 mb-3">
                        <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center">
                          <span className="text-blue-600 text-xl">👤</span>{" "}
                          {/* Avatar mặc định */}
                        </div>
                        <div>
                          <p className="text-[clamp(12px,1.2vw,14px)] text-gray-500">
                            Student Name
                          </p>
                          <p className="font-medium text-[clamp(16px,1.8vw,18px)] text-gray-800">
                            {appointment.appointmentFor || "Unknown"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Appointment Information */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                    <h4 className="text-[clamp(14px,1.5vw,16px)] font-medium text-gray-700 mb-3">
                      Appointment Details
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[clamp(12px,1.2vw,14px)] text-gray-500">
                          Date
                        </p>
                        <p className="font-medium text-[clamp(14px,1.5vw,16px)] text-gray-800">
                          {format(appointment.date, "EEE, dd MMM yyyy")}
                        </p>
                      </div>
                      <div>
                        <p className="text-[clamp(12px,1.2vw,14px)] text-gray-500">
                          Time
                        </p>
                        <p className="font-medium text-[clamp(14px,1.5vw,16px)] text-gray-800">
                          {getTimeFromSlotId(appointment.slotId)}
                        </p>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-[clamp(12px,1.2vw,14px)] text-gray-500">
                          Status
                        </p>
                        <div className="flex items-center min-h-[24px]">
                          <span
                            className={`w-2 h-2 rounded-full mr-2 ${
                              displayStatus === "CANCELLED"
                                ? "bg-red-500"
                                : displayStatus === "COMPLETED"
                                ? "bg-green-500"
                                : displayStatus === "AVAILABLE"
                                ? "bg-yellow-400"
                                : "bg-blue-500"
                            }`}
                          ></span>
                          <p className="font-medium text-[clamp(14px,1.5vw,16px)] text-gray-800">
                            {displayStatus}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-[clamp(12px,1.2vw,14px)] text-gray-500">
                          Meeting Type
                        </p>
                        <p className="font-medium text-[clamp(14px,1.5vw,16px)] text-gray-800">
                          {appointment.isOnline ? "Online" : "Offline"}
                        </p>
                      </div>
                      {appointment.notes && (
                        <div className="col-span-2">
                          <p className="text-[clamp(12px,1.2vw,14px)] text-gray-500">
                            Notes
                          </p>
                          <p className="font-medium text-[clamp(14px,1.5vw,16px)] text-gray-800">
                            {appointment.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <FeedbackForm
                      appointment={appointment}
                      role="PSYCHOLOGIST"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-4 mt-auto border-t border-gray-300 pt-4">
              {appointment.isOnline &&
                !isPastDay &&
                displayStatus === "SCHEDULED" && (
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() =>
                      handleChat(appointment.appointmentId || appointment.id)
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full shadow-md transition-all duration-200 w-[150px] h-12 flex items-center justify-center text-[clamp(14px,1.5vw,16px)] truncate"
                  >
                    Join
                  </motion.button>
                )}
              {!isPastDay && displayStatus === "SCHEDULED" && (
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={handleOpenCancelModal}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold rounded-full shadow-md transition-all duration-200 w-[150px] h-12 flex items-center justify-center text-[clamp(14px,1.5vw,16px)] truncate"
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Modal xác nhận hủy */}
      {isCancelModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-gray-800 bg-opacity-50 flex items-center justify-center"
          onClick={(e) =>
            e.target === e.currentTarget && handleCloseCancelModal()
          }
        >
          <motion.div
            variants={confirmModalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-lg p-6 w-[min(90%,400px)] shadow-lg"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Confirm Cancellation
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel this appointment?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleConfirmCancel}
                className="bg-red-500 hover:bg-red-600 text-white font-medium rounded-md px-4 py-2 transition-colors"
              >
                Confirm
              </button>
              <button
                onClick={handleCloseCancelModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium rounded-md px-4 py-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default PsychologistAppointmentDetail;

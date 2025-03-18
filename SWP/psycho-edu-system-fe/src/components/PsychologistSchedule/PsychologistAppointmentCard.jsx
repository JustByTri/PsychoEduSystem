import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { startOfDay, parse } from "date-fns";

const PsychologistAppointmentCard = ({
  id, // Thêm prop id
  student,
  psychologist,
  date,
  timeRange,
  status,
  bookedBy,
  appointmentFor,
  isOnline,
  showParent,
  onViewDetail,
  onChat,
  onCancel,
}) => {
  const parseDate = (dateString) => {
    const parsed = parse(dateString, "EEE, dd-MM-yyyy", new Date());
    return startOfDay(parsed);
  };

  const currentDate = startOfDay(new Date());
  const appointmentDate = parseDate(date);
  const isPastDay = appointmentDate < currentDate;

  const displayStatus =
    isPastDay && status === "SCHEDULED" ? "COMPLETED" : status;

  const getStatusColorAndEffect = () => {
    switch (displayStatus) {
      case "AVAILABLE":
        return {
          bg: "bg-yellow-500",
          text: "text-yellow-500",
          effect: "border-2 border-green-500",
        };
      case "SCHEDULED":
        return {
          bg: "bg-yellow-500",
          text: "text-yellow-500",
        };
      case "COMPLETED":
        return { bg: "bg-green-500", text: "text-green-500", effect: "" };
      case "CANCELLED":
        return { bg: "bg-red-500", text: "text-red-500", effect: "" };
      default:
        return { bg: "bg-gray-500", text: "text-gray-500", effect: "" };
    }
  };

  const { bg, text, effect } = getStatusColorAndEffect();

  const displayType =
    isOnline === null ? "N/A" : isOnline ? "Online" : "Offline";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(0,0,0,0.05)" }}
      onDoubleClick={onViewDetail}
      className={`w-full h-[290px] ${effect}`}
    >
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 h-full flex flex-col gap-4">
        <div className="flex flex-col gap-4 flex-1 mt-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[1rem] font-semibold text-gray-600 whitespace-nowrap">
              Student
            </span>
            <span className="text-[1rem] font-semibold text-gray-800 truncate max-w-[70%]">
              {student}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[1rem] font-semibold text-gray-600 whitespace-nowrap">
              Psychologist
            </span>
            <span className="text-[1rem] font-semibold text-gray-800 truncate max-w-[70%]">
              {psychologist}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            {showParent ? (
              <>
                <span className="text-[1rem] font-semibold text-gray-600 whitespace-nowrap">
                  Parent
                </span>
                <span className="text-[1rem] font-semibold text-gray-800 truncate max-w-[70%]">
                  {bookedBy}
                </span>
              </>
            ) : (
              <hr className="w-full border-gray-700" />
            )}
          </div>
          <div className="flex items-center justify-between h-3">
            <span className="text-[0.95rem] font-semibold text-gray-800">
              {timeRange}
            </span>
            <span className="text-[0.95rem] font-semibold text-gray-800">
              {date}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span
                className={`flex items-center gap-2 text-[0.95rem] font-semibold ${text}`}
              >
                <span className={`w-3 h-3 ${bg} rounded-full`}></span>
                {displayStatus.toUpperCase()}
              </span>
              {!isPastDay && displayStatus === "SCHEDULED" && (
                <div className="flex gap-2 flex-wrap justify-end">
                  {displayType === "Online" && (
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={onChat}
                      className="text-[1rem] text-white bg-green-500 rounded-lg px-4 py-2 hover:bg-green-600 transition-colors duration-200"
                    >
                      Join
                    </motion.button>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onCancel(id)} // Sử dụng id thay vì appointment.id
                    className="text-[1rem] text-white bg-red-500 rounded-lg px-4 py-2 hover:bg-red-600 transition-colors duration-200"
                  >
                    Cancel
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-[1rem] font-medium text-blue-600 bg-blue-100 rounded-full px-2 py-1"
          >
            {displayType}
          </motion.div>
          <motion.a
            whileHover={{ x: 5 }}
            href="#"
            onClick={onViewDetail}
            className="text-[0.95rem] text-orange-500 hover:underline"
          >
            View detail
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

PsychologistAppointmentCard.propTypes = {
  id: PropTypes.string, // Thêm PropTypes cho id
  student: PropTypes.string,
  psychologist: PropTypes.string,
  date: PropTypes.string,
  timeRange: PropTypes.string,
  status: PropTypes.string,
  bookedBy: PropTypes.string,
  appointmentFor: PropTypes.string,
  isOnline: PropTypes.bool,
  showParent: PropTypes.bool,
  onViewDetail: PropTypes.func,
  onChat: PropTypes.func,
  onCancel: PropTypes.func,
};

export default PsychologistAppointmentCard;

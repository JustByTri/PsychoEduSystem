import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const AppointmentsCard = ({
  student,
  lesson,
  date,
  timeRange,
  status,
  type,
  bookedBy,
  appointmentFor,
  onJoin,
  onCancel,
  onViewDetail,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02, boxShadow: "0 8px 16px rgba(0,0,0,0.05)" }}
      onDoubleClick={onViewDetail}
      className="w-full h-[260px]" // Cố định chiều cao
    >
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 h-full flex flex-col gap-2">
        {/* Nội dung chính */}
        <div className="flex flex-col gap-2 flex-1 mt-2">
          <div className="flex items-center justify-between gap-2 mt-2">
            <span className="text-[0.95rem] font-semibold text-gray-600 whitespace-nowrap">
              Student
            </span>
            <span className="text-[0.95rem] font-semibold text-gray-800 truncate max-w-[70%]">
              {student}
            </span>
          </div>
          {/* Psychologist */}
          <div className="flex items-center justify-between gap-2 mt-2">
            <span className="text-[0.95rem] font-semibold text-gray-600 whitespace-nowrap">
              Psychologist
            </span>
            <span className="text-[0.95rem] font-semibold text-gray-800 truncate max-w-[70%]">
              {lesson}
            </span>
          </div>
          {/* Parent (BookedBy) */}
          {bookedBy && bookedBy !== appointmentFor && (
            <div className="flex items-center justify-between gap-2 mt-2">
              <span className="text-[0.95rem] font-semibold text-gray-600 whitespace-nowrap">
                Parent
              </span>
              <span className="text-[0.95rem] font-semibold text-gray-800 truncate max-w-[70%]">
                {bookedBy}
              </span>
            </div>
          )}
          {/* Date & Time */}
          <div className="flex items-center gap-2 mt-2">
            <span className="w-4 h-4 bg-gray-300 rounded-full flex-shrink-0"></span>
            <span className="text-[0.9rem] font-semibold text-gray-800 truncate">
              {date} | {timeRange}
            </span>
          </div>
          {/* Status & Actions */}
          <div className="flex flex-col gap-1 mt-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span
                className={`flex items-center gap-2 text-[0.9rem] font-semibold ${
                  status === "Completed"
                    ? "text-green-500"
                    : status === "Canceled"
                    ? "text-red-500"
                    : "text-yellow-500 animate-pulse"
                }`}
              >
                <span
                  className={`w-3 h-3 ${
                    status === "Completed"
                      ? "bg-green-500"
                      : status === "Canceled"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  } rounded-full`}
                ></span>
                {status.toUpperCase()}
              </span>
              {status === "Not Yet" && (
                <div className="flex gap-3 flex-wrap justify-end">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onJoin}
                    className="text-[1.25rem] text-white bg-green-500 rounded-lg px-6 py-2.5 hover:bg-green-600 transition-colors duration-200"
                  >
                    Join
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={onCancel}
                    className="text-[1.25rem] text-white bg-red-500 rounded-lg px-6 py-2.5 hover:bg-red-600 transition-colors duration-200"
                  >
                    Cancel
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Type & View Detail */}
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="text-[0.9rem] font-medium text-blue-600 bg-blue-100 rounded-full px-2 py-1"
          >
            {type}
          </motion.div>
          <motion.a
            whileHover={{ x: 5 }}
            href="#"
            onClick={onViewDetail}
            className="text-[0.9rem] text-orange-500 hover:underline"
          >
            View detail
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
};

AppointmentsCard.propTypes = {
  student: PropTypes.string,
  lesson: PropTypes.string,
  date: PropTypes.string,
  timeRange: PropTypes.string,
  status: PropTypes.oneOf(["Completed", "Canceled", "Not Yet"]),
  type: PropTypes.string,
  bookedBy: PropTypes.string,
  appointmentFor: PropTypes.string,
  onJoin: PropTypes.func,
  onCancel: PropTypes.func,
  onViewDetail: PropTypes.func,
};

export default AppointmentsCard;

import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const AppointmentsCard = ({
  student,
  lesson,
  date,
  timeRange,
  status,
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
      className="w-full h-[200px]" // Chiều cao cố định để vừa lưới 3 cột
    >
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 h-full flex flex-col justify-between">
        <div className="flex flex-col gap-2">
          {/* Student */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[0.95rem] font-semibold text-gray-600 whitespace-nowrap">
              Student
            </span>
            <span className="text-[0.95rem] font-semibold text-gray-800 truncate max-w-[70%]">
              {student}
            </span>
          </div>

          {/* Psychologist */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[0.95rem] font-semibold text-gray-600 whitespace-nowrap">
              Psychologist
            </span>
            <span className="text-[0.95rem] font-semibold text-gray-800 truncate max-w-[70%]">
              {lesson}
            </span>
          </div>

          {/* Date & Time */}
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 bg-gray-300 rounded-full flex-shrink-0"></span>
            <span className="text-[0.9rem] font-semibold text-gray-800 truncate">
              {date} | {timeRange}
            </span>
          </div>

          {/* Status & Actions */}
          <div className="flex items-center justify-between gap-2">
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
            <div className="flex gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onJoin}
                className="text-[0.875rem] text-white bg-green-500 rounded-lg px-3 py-1 hover:bg-green-600 transition-colors duration-200"
              >
                Join
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onCancel}
                className="text-[0.875rem] text-white bg-red-500 rounded-lg px-3 py-1 hover:bg-red-600 transition-colors duration-200"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </div>

        {/* View Detail */}
        <div className="flex justify-end">
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
  onJoin: PropTypes.func,
  onCancel: PropTypes.func,
  onViewDetail: PropTypes.func,
};

export default AppointmentsCard;

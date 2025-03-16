import React from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      onDoubleClick={onViewDetail}
      className="w-full max-w-[450px] mx-auto"
    >
      <div className="bg-white rounded-lg shadow-lg p-5 transform scale-100 transition-transform duration-300 hover:scale-[1.02]">
        <div className="flex flex-col gap-2">
          {/* Dòng 1: Student */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-semibold text-gray-600">Student</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-gray-800">
                {student}
              </span>
            </div>
          </div>

          {/* Dòng 2: Lesson (Psychologist) */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-semibold text-gray-600">
              Psychologist
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-semibold text-gray-800">
                {lesson}
              </span>
            </div>
          </div>

          {/* Dòng 3: Date Time */}
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 bg-gray-300 rounded-full"></span>
            <span className="text-lg font-semibold text-gray-800">{date}</span>
            <span className="text-lg text-gray-800">{timeRange}</span>
          </div>

          {/* Dòng 4: Status, Join, Cancel */}
          <div className="flex items-center justify-between gap-2">
            <span
              className={`flex items-center gap-1 text-lg font-semibold ${
                status === "Completed"
                  ? "text-green-500"
                  : status === "Canceled"
                  ? "text-red-500"
                  : "text-yellow-500"
              }`}
            >
              <span
                className={`w-4 h-4 ${
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
              <button
                onClick={onJoin}
                className="text-base text-white bg-green-500 rounded px-5 py-2 hover:bg-green-600 transition-colors duration-200"
              >
                Join
              </button>
              <button
                onClick={onCancel}
                className="text-base text-white bg-red-500 rounded px-5 py-2 hover:bg-red-600 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Dòng 5: View detail */}
          <div className="flex justify-end">
            <a
              href="#"
              onClick={onViewDetail}
              className="text-lg text-orange-500 hover:underline transition-colors duration-200"
            >
              View detail
            </a>
          </div>
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

import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, isSameDay } from "date-fns";

const CalendarHeader = ({
  currentDate,
  selectedDate,
  setSelectedDate,
  allDays,
  animationDirection,
  filterStatus,
  setFilterStatus,
  handlePrev,
  handleNext,
  handleSelectDate,
  getVisibleDays,
}) => {
  const calendarContainerRef = useRef(null);

  const variants = {
    enter: (direction) => ({
      x: direction === "next" ? 50 : -50,
      opacity: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 500, damping: 22, mass: 0.8 },
        opacity: { duration: 0.1 },
      },
    },
    exit: (direction) => ({
      x: direction === "next" ? -50 : 50,
      opacity: 0.8,
      transition: {
        x: { type: "spring", stiffness: 500, damping: 22, mass: 0.8 },
        opacity: { duration: 0.1 },
      },
    }),
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-4 mb-6 shadow-lg"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
        <h1 className="text-white text-2xl font-medium">Your Schedule</h1>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-3">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gradient-to-r from-white to-blue-50 text-blue-900 rounded-lg pl-4 pr-8 py-2 text-sm border border-blue-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-600 transition-all duration-300 hover:shadow-xl hover:border-blue-400 appearance-none cursor-pointer"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23333333' width='18px' height='18px'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
                backgroundSize: "1rem",
              }}
            >
              <option value="All">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </motion.div>
          <span className="text-blue-100 text-sm min-w-[190px] text-center">
            {format(selectedDate, "EEEE, MM/dd/yyyy")}
          </span>
          <div className="flex items-center space-x-2">
            <button
              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-800 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
              onClick={handlePrev}
              disabled={isSameDay(selectedDate, currentDate)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
                />
              </svg>
            </button>
            <button
              className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-800 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
              onClick={handleNext}
              disabled={
                selectedDate.getDate() === allDays[allDays.length - 1].day
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        ref={calendarContainerRef}
        className="relative overflow-hidden h-[70px]"
      >
        <AnimatePresence
          custom={animationDirection}
          initial={false}
          mode="sync" // Sử dụng 'sync' thay vì 'wait' để phản hồi nhanh hơn
        >
          <motion.div
            key={selectedDate.toISOString()}
            custom={animationDirection}
            variants={variants}
            initial={{ opacity: 0.9 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0.9 }}
            className="flex justify-center space-x-2 absolute w-full"
            transition={{ duration: 0.1 }} // Rút ngắn thời gian chuyển đổi
          >
            {getVisibleDays().map((day) => (
              <motion.div
                key={day.day}
                whileHover={{ scale: day.isPast && !day.isToday ? 1 : 1.05 }}
                whileTap={{ scale: day.isPast && !day.isToday ? 1 : 0.95 }}
                // Thêm hiệu ứng animate khi ngày được chọn
                animate={
                  isSameDay(day.fullDate, selectedDate)
                    ? {
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          "0px 0px 0px rgba(0,0,0,0)",
                          "0px 0px 8px rgba(0,128,0,0.5)",
                          "0px 0px 0px rgba(0,0,0,0)",
                        ],
                      }
                    : {}
                }
                transition={
                  isSameDay(day.fullDate, selectedDate)
                    ? {
                        duration: 0.3,
                        ease: "easeInOut",
                        times: [0, 0.5, 1],
                      }
                    : {}
                }
                onClick={() =>
                  (!day.isPast || day.isToday) && handleSelectDate(day.fullDate)
                }
                className={`flex-shrink-0 flex flex-col items-center justify-center rounded-lg transition-all duration-200 ${
                  day.isPast && !day.isToday
                    ? "bg-gray-400 cursor-not-allowed"
                    : isSameDay(day.fullDate, selectedDate)
                    ? "bg-green-500 cursor-pointer hover:bg-green-600"
                    : day.isToday
                    ? "bg-blue-500 cursor-pointer hover:bg-blue-600"
                    : "bg-blue-400 hover:bg-blue-500 cursor-pointer"
                }`}
                style={{ width: "60px", height: "60px" }}
              >
                <span className="text-blue-100 text-sm">{day.dayOfWeek}</span>
                <span className="text-white text-xl font-medium">
                  {day.day}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CalendarHeader;

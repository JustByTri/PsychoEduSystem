import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format, addDays, isSameDay } from "date-fns";

const CalendarHeader = ({
  currentDate,
  selectedDate,
  setSelectedDate,
  allDays,
  currentPage,
  setCurrentPage,
  animationDirection,
  setAnimationDirection,
  visibleDaysCount,
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
      x: direction === "next" ? 1000 : -1000,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({
      x: direction === "next" ? -1000 : 1000,
      opacity: 0,
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
          <span className="text-blue-100 text-sm min-w-[190px] text-center">
            {format(selectedDate, "EEEE, MM/dd/yyyy")}
          </span>
          <div className="flex items-center space-x-2">
            <button
              className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-800 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
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
              className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-800 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-md"
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
        <AnimatePresence custom={animationDirection} initial={false}>
          <motion.div
            key={currentPage}
            custom={animationDirection}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="flex justify-center space-x-2 absolute w-full"
          >
            {getVisibleDays(currentPage).map((day) => (
              <motion.div
                key={`${currentPage}-${day.day}`}
                whileHover={{ scale: day.isPast ? 1 : 1.05 }}
                whileTap={{ scale: day.isPast ? 1 : 0.95 }}
                onClick={() =>
                  (!day.isPast || day.isToday) && handleSelectDate(day.fullDate)
                }
                className={`flex-shrink-0 flex flex-col items-center justify-center rounded-lg transition-all duration-200 ${
                  day.isPast
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

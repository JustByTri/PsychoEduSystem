import React from "react";
import { format } from "date-fns";
import { motion } from "framer-motion"; // Thêm import này

const AppointmentDetailModal = ({ isOpen, onClose, appointment }) => {
  if (!isOpen || !appointment) return null;

  // Hard-coded data for missing fields
  const hardCodedData = {
    studentName: "Phạm Đình Quốc Thịnh",
    studentCode: "KE0056731/KID",
    level: "KE45 - F3 (IV)",
    lessonDetails: "KE45 - F3 (IV) - LC4 (3) - Reading And Writing Review",
    platform: appointment.platform || "BBB",
    type: appointment.type || "45MINS",
    lessonPlan: "KE45 - F1,2,3 (IV) - LC4 (3) - Lesson Plan",
    answerKey: "KE45 - F1,2,3 (IV) - LC4 (3) - Answer Key",
    studentWeakness: "", // Placeholder for student weakness
    studentEvaluation: {
      academic: "Academic",
      otherTeacher: "Other teacher",
    },
  };

  // Animation variants for sliding in and out
  const modalVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
    exit: {
      x: "100%",
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  // Animation for the Cancel button
  const buttonVariants = {
    hover: { scale: 0.95, transition: { duration: 0.2 } },
    tap: { scale: 0.9, transition: { duration: 0.1 } },
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-gray-800 bg-opacity-50 backdrop-blur-sm z-50 flex justify-end"
      onClick={handleBackdropClick}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="appointment-modal bg-gradient-to-br from-blue-100 via-purple-50 to-gray-100 w-full sm:w-[90%] md:w-[70%] lg:w-[40%] xl:w-[28rem] h-full p-4 sm:p-6 rounded-l-xl shadow-2xl border-l-4 border-blue-600"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4 sm:mb-6 border-b border-gray-300 pb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800">
            Booking Detail
          </h3>
          <button
            onClick={() => setTimeout(onClose, 300)}
            className="text-gray-600 hover:text-gray-800 rounded-full p-1 hover:bg-gray-200 transition-colors"
          >
            <svg
              className="w-5 h-5"
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

        {/* Modal Body with content */}
        <div className="space-y-4 sm:space-y-6 h-[calc(100%-12rem)] scrollbar-hide">
          {/* Student Information Section */}
          <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              Student Info
            </h4>
            <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-200 flex items-center justify-center">
                <span className="text-blue-600">👤</span>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Student Name</p>
                <p className="font-medium text-sm sm:text-base text-gray-800">
                  {hardCodedData.studentName}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Student Code</p>
                <p className="font-medium text-xs sm:text-sm text-gray-800">
                  {hardCodedData.studentCode}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Level</p>
                <p className="font-medium text-xs sm:text-sm text-gray-800">
                  {hardCodedData.level}
                </p>
              </div>
            </div>
          </div>

          {/* Lesson Information Section */}
          <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              Lesson Details
            </h4>
            <div>
              <p className="text-xs sm:text-sm text-gray-500">Lesson</p>
              <p className="font-medium text-xs sm:text-sm text-gray-800">
                {hardCodedData.lessonDetails}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-2">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Platform</p>
                <p className="font-medium text-xs sm:text-sm text-gray-800">
                  {hardCodedData.platform}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Type</p>
                <p className="font-medium text-xs sm:text-sm text-gray-800">
                  {hardCodedData.type}
                </p>
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs sm:text-sm text-gray-500">Time</p>
              <p className="font-medium text-xs sm:text-sm text-gray-800">
                {format(appointment.date, "EEE, do MMM")} {appointment.time}
              </p>
            </div>
          </div>

          {/* Resources Section */}
          <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              Resources
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm text-gray-500">Lesson Plan</p>
                <a
                  href="#"
                  className="text-blue-600 hover:underline text-xs sm:text-sm"
                >
                  View
                </a>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm text-gray-500">Answer Key</p>
                <a
                  href="#"
                  className="text-blue-600 hover:underline text-xs sm:text-sm"
                >
                  View
                </a>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
              Additional Info
            </h4>
            <div className="space-y-2">
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Student's Weakness
                </p>
                <p className="font-medium text-xs sm:text-sm text-gray-800">
                  {hardCodedData.studentWeakness || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Booking Status
                </p>
                <p className="font-medium text-xs sm:text-sm text-gray-800 flex items-center">
                  Approved
                  <span className="ml-2 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-600"></span>
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">
                  Student Evaluation
                </p>
                <p className="font-medium text-xs sm:text-sm text-purple-600">
                  {hardCodedData.studentEvaluation.academic}{" "}
                  <span className="text-gray-800">
                    {hardCodedData.studentEvaluation.otherTeacher}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-3 mt-4 sm:mt-6 border-t border-gray-300 pt-4">
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => {
              const modal = document.querySelector(".appointment-modal");
              if (modal) {
                modal.style.pointerEvents = "none";
                setTimeout(onClose, 300);
              }
            }}
            className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-full text-xs sm:text-sm text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </motion.button>
          <motion.button
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => {
              const modal = document.querySelector(".appointment-modal");
              if (modal) {
                modal.style.pointerEvents = "none";
                setTimeout(onClose, 300);
              }
            }}
            className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-full hover:bg-blue-700 transition-colors"
          >
            Join
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AppointmentDetailModal;

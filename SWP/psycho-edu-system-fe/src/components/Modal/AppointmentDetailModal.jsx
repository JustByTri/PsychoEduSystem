import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import axios from "axios";
import { getAuthDataFromLocalStorage } from "../../utils/auth";

const AppointmentDetailModal = ({ isOpen, onClose, appointment }) => {
  const [studentDetails, setStudentDetails] = useState(null);
  const [classDetails, setClassDetails] = useState(null);
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [counselorDetails, setCounselorDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all necessary details when appointment is selected
    const fetchAllDetails = async () => {
      if (!appointment || !isOpen) return;

      try {
        setLoading(true);
        const authData = getAuthDataFromLocalStorage();

        // Log the appointment object to see its structure
        console.log("Appointment data:", appointment);

        // We need to find the correct property that contains the student ID
        // It could be student, studentId, userId, id, etc.
        const studentId =
          appointment.studentId || appointment.student || appointment.id;

        console.log("Extracted student ID:", studentId);

        if (
          !studentId ||
          typeof studentId !== "string" ||
          studentId.includes(" ")
        ) {
          console.error("Invalid student ID format:", studentId);
          throw new Error("Invalid student ID format");
        }

        // Step 1: Fetch student details
        const studentResponse = await axios.get(
          `https://localhost:7192/api/User/profile?userId=${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
            },
          }
        );

        if (studentResponse.data.isSuccess) {
          // Extract base data from API
          const userData = studentResponse.data.result;

          // Calculate age based on birthDay
          const birthYear = new Date(userData.birthDay).getFullYear();
          const currentYear = new Date().getFullYear();
          const age = currentYear - birthYear;

          // Calculate student batch (K-number)
          // You are K17 and born in 2003
          // So: batch = K17 - (2003 - birthYear)
          const batchNumber = 17 - (2003 - birthYear);
          const batch = `K${batchNumber}`;

          // Combine API data with hardcoded student-specific data
          setStudentDetails({
            ...userData,
            age: age,
            batch: batch,
            university: "FPT University",
          });

          // Step 2: Fetch class details
          const classResponse = await axios.get(
            `https://localhost:7192/api/User/${studentId}/class`,
            {
              headers: {
                Authorization: `Bearer ${authData.accessToken}`,
              },
            }
          );

          if (classResponse.data.isSuccess) {
            setClassDetails(classResponse.data.result);

            // Step 3: Fetch teacher details
            const teacherId = classResponse.data.result.teacherId;
            const teacherResponse = await axios.get(
              `https://localhost:7192/api/User/profile?userId=${teacherId}`,
              {
                headers: {
                  Authorization: `Bearer ${authData.accessToken}`,
                },
              }
            );

            if (teacherResponse.data.isSuccess) {
              const teacherData = teacherResponse.data.result;

              // Calculate teacher age
              const teacherBirthYear = new Date(
                teacherData.birthDay
              ).getFullYear();
              const teacherAge = currentYear - teacherBirthYear;

              setTeacherDetails({
                ...teacherData,
                age: teacherAge,
              });
            }
          }

          // Step 4: Fetch counselor details if available
          if (appointment.consultant && appointment.consultantId) {
            const counselorResponse = await axios.get(
              `https://localhost:7192/api/User/profile?userId=${appointment.consultantId}`,
              {
                headers: {
                  Authorization: `Bearer ${authData.accessToken}`,
                },
              }
            );

            if (counselorResponse.data.isSuccess) {
              const counselorData = counselorResponse.data.result;

              // Calculate counselor age using the same method as student and teacher
              const counselorBirthYear = new Date(
                counselorData.birthDay
              ).getFullYear();
              const counselorAge = currentYear - counselorBirthYear;

              setCounselorDetails({
                ...counselorData,
                age: counselorAge,
              });
            }
          }
        } else {
          throw new Error(
            studentResponse.data.message || "Failed to fetch student details"
          );
        }
      } catch (error) {
        console.error("Error fetching details:", error);
        setError("Failed to load appointment details");
        // Fallback data
        setStudentDetails({
          fullName: "Unknown Student",
          email: "",
          phone: "",
          birthDay: "",
          gender: "",
          address: "",
          age: 0,
          batch: "Unknown",
          university: "FPT University",
        });
        setClassDetails({
          classId: 0,
          className: "Unknown",
          teacherId: "",
        });
        setTeacherDetails(null);
        setCounselorDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAllDetails();
  }, [appointment, isOpen]);

  if (!isOpen || !appointment) return null;

  // Animation variants for sliding in and out
  const modalVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
    exit: {
      x: "100%",
      transition: { type: "spring", stiffness: 300, damping: 20 },
    },
  };

  // Animation for the buttons
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

  // Get time from slot ID
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
            Appointment Details
          </h3>
          <button
            onClick={() => setTimeout(onClose, 300)}
            className="text-gray-600 hover:text-gray-800 rounded-full p-1 hover:bg-gray-200 transition-colors"
            aria-label="Close"
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

        {loading ? (
          <div className="flex justify-center items-center h-[60%]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">
            <p>{error}</p>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6 h-[calc(100%-12rem)] overflow-y-auto scrollbar-hide">
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
                  <p className="text-xs sm:text-sm text-gray-500">
                    Student Name
                  </p>
                  <p className="font-medium text-sm sm:text-base text-gray-800">
                    {studentDetails?.fullName || "Unknown"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Student ID</p>
                  <p className="font-medium text-xs sm:text-sm text-gray-800">
                    {appointment.student}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">University</p>
                  <p className="font-medium text-xs sm:text-sm text-gray-800">
                    {studentDetails?.university || "Unknown"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Class</p>
                  <p className="font-medium text-xs sm:text-sm text-gray-800">
                    {classDetails?.className || "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Batch</p>
                  <p className="font-medium text-xs sm:text-sm text-gray-800">
                    {studentDetails?.batch || "Unknown"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Age</p>
                  <p className="font-medium text-xs sm:text-sm text-gray-800">
                    {studentDetails?.age || "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Gender</p>
                  <p className="font-medium text-xs sm:text-sm text-gray-800">
                    {studentDetails?.gender || "Unknown"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Email</p>
                  <p className="font-medium text-xs sm:text-sm text-gray-800 truncate">
                    {studentDetails?.email || "Unknown"}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-xs sm:text-sm text-gray-800">
                    {studentDetails?.phone || "Unknown"}
                  </p>
                </div>
              </div>
            </div>

            {/* Teacher Information Section */}
            {teacherDetails && (
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                  Teacher Info
                </h4>
                <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-200 flex items-center justify-center">
                    <span className="text-green-600">👨‍🏫</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Teacher Name
                    </p>
                    <p className="font-medium text-sm sm:text-base text-gray-800">
                      {teacherDetails.fullName}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Age</p>
                    <p className="font-medium text-xs sm:text-sm text-gray-800">
                      {teacherDetails.age}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Gender</p>
                    <p className="font-medium text-xs sm:text-sm text-gray-800">
                      {teacherDetails.gender}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Email</p>
                    <p className="font-medium text-xs sm:text-sm text-gray-800 truncate">
                      {teacherDetails.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-xs sm:text-sm text-gray-800">
                      {teacherDetails.phone}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Counselor Information Section */}
            {counselorDetails && (
              <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                  Counselor Info
                </h4>
                <div className="flex items-center space-x-3 sm:space-x-4 mb-2 sm:mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-200 flex items-center justify-center">
                    <span className="text-purple-600">👨‍⚕️</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Counselor Name
                    </p>
                    <p className="font-medium text-sm sm:text-base text-gray-800">
                      {counselorDetails.fullName}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-3">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Age</p>
                    <p className="font-medium text-xs sm:text-sm text-gray-800">
                      {counselorDetails.age}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Gender</p>
                    <p className="font-medium text-xs sm:text-sm text-gray-800">
                      {counselorDetails.gender}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Email</p>
                    <p className="font-medium text-xs sm:text-sm text-gray-800 truncate">
                      {counselorDetails.email}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-xs sm:text-sm text-gray-800">
                      {counselorDetails.phone}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Appointment Information Section */}
            <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                Appointment Details
              </h4>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Date</p>
                  <p className="font-medium text-xs sm:text-sm text-gray-800">
                    {format(appointment.date, "EEE, dd MMM yyyy")}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">Time</p>
                  <p className="font-medium text-xs sm:text-sm text-gray-800">
                    {getTimeFromSlotId(appointment.slot)}
                  </p>
                </div>
              </div>

              <div className="mt-2">
                <p className="text-xs sm:text-sm text-gray-500">Status</p>
                <div className="flex items-center justify-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 mb-3 ${
                      appointment.status === "Cancelled"
                        ? "bg-red-500"
                        : appointment.status === "Completed"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  ></span>
                  <p className="font-medium text-xs sm:text-sm text-gray-800">
                    {appointment.status}
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-xs sm:text-sm text-gray-500">Consultant</p>
                <p className="font-medium text-xs sm:text-sm text-gray-800">
                  {appointment.consultant}
                </p>
              </div>

              <div className="mt-2">
                <p className="text-xs sm:text-sm text-gray-500">Meeting Type</p>
                <p className="font-medium text-xs sm:text-sm text-gray-800">
                  {appointment.type}
                </p>
              </div>

              {appointment.googleMeetURL && (
                <div className="mt-3">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Meeting Link
                  </p>
                  <a
                    href={appointment.googleMeetURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-xs sm:text-sm text-blue-600 hover:underline"
                  >
                    Google Meet Link
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

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
            Close
          </motion.button>

          {appointment.status !== "Cancelled" && appointment.googleMeetURL && (
            <motion.a
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              href={appointment.googleMeetURL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-full hover:bg-blue-700 transition-colors"
            >
              Join Meeting
            </motion.a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AppointmentDetailModal;

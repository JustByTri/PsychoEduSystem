import { useState, useEffect, useCallback } from "react";
import { useBooking } from "../../../context/BookingContext";
import { getAuthDataFromLocalStorage } from "../../../utils/auth";
import { motion } from "framer-motion";
import axios from "axios";
import { Card, CardContent } from "@mui/material";

export const ConsultantSelection = () => {
  const { updateBookingData, bookingData, isParent } = useBooking();
  const [consultants, setConsultants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHomeroomTeacher = async (studentId) => {
    const authData = getAuthDataFromLocalStorage();
    try {
      const classResponse = await axios.get(
        `https://localhost:7192/api/User/${studentId}/class`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      const teacherId = classResponse.data.result.teacherId;
      const className = classResponse.data.result.className || "Unknown Class";

      const profileResponse = await axios.get(
        `https://localhost:7192/api/User/profile?userId=${teacherId}`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const teacherProfile = profileResponse.data.result;
      const age = teacherProfile.birthDay
        ? 2025 - parseInt(teacherProfile.birthDay.split("/")[2], 10)
        : "N/A";

      return [
        {
          id: teacherId,
          name: teacherProfile.fullName || "Unknown Teacher",
          phone: teacherProfile.phone || "N/A",
          email: teacherProfile.email || "N/A",
          birthDay: teacherProfile.birthDay || "N/A",
          age,
          role: "Homeroom Teacher",
          className,
          availableSlots: [],
        },
      ];
    } catch (error) {
      setError("Failed to fetch homeroom teacher: " + error.message);
      return [];
    }
  };

  const fetchCounselors = async () => {
    const authData = getAuthDataFromLocalStorage();
    try {
      const response = await axios.get(
        `https://localhost:7192/api/psychologists`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.result.map((psychologist) => {
        const age = psychologist.birthDay
          ? 2025 - new Date(psychologist.birthDay).getFullYear()
          : "N/A";
        return {
          id: psychologist.userId,
          name:
            psychologist.fullName ||
            `Counselor ${psychologist.userId.slice(0, 8)}`,
          phone: psychologist.phoneNumber || "N/A",
          email: psychologist.email || "N/A",
          birthDay: psychologist.birthDay || "N/A",
          age,
          role: "Counselor",
          availableSlots: [],
        };
      });
    } catch (error) {
      setError("Failed to fetch counselors: " + error.message);
      return [];
    }
  };

  useEffect(() => {
    const fetchConsultants = async () => {
      setIsLoading(true);
      try {
        if (!bookingData.consultantType) {
          setError("Please select a consultant type first.");
          return;
        }

        const studentId = !isParent()
          ? bookingData.userId
          : bookingData.childId;
        const consultantList =
          bookingData.consultantType === "homeroom"
            ? await fetchHomeroomTeacher(studentId)
            : await fetchCounselors();

        setConsultants(consultantList.length ? consultantList : []);
        if (!consultantList.length) setError("No consultants available.");
      } catch (error) {
        setError(error.message || "Failed to fetch consultants");
      } finally {
        setIsLoading(false);
      }
    };

    fetchConsultants();
  }, [
    bookingData.consultantType,
    bookingData.userId,
    bookingData.childId,
    isParent,
  ]);

  // Khôi phục hàm handleSelectConsultant
  const handleSelectConsultant = useCallback(
    (consultant) => {
      updateBookingData({
        consultantId: consultant.id,
        consultantName: consultant.name,
        consultantDetails: {
          phone: consultant.phone,
          email: consultant.email,
          age: consultant.age,
          ...(consultant.className && { className: consultant.className }),
        },
        availableSlots: consultant.availableSlots,
      });
    },
    [updateBookingData]
  );

  if (isLoading)
    return <div className="text-center">Loading consultants...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-3xl">
        <h5 className="font-inter font-semibold text-xl sm:text-2xl text-gray-800 mb-6 text-center">
          Select Counselor
        </h5>
        {bookingData.consultantType === "homeroom" && consultants.length > 0 ? (
          <div className="w-full max-w-[90%] sm:max-w-md md:max-w-lg mx-auto">
            <h5 className="font-inter font-semibold text-xl sm:text-2xl text-gray-800 mb-4 text-center">
              Your Homeroom Teacher
            </h5>
            <Card
              className="rounded-xl bg-gray-50 border border-gray-300 w-full hover:shadow-lg transition-shadow duration-300"
              style={{ minWidth: "180px" }}
            >
              <CardContent className="p-3 sm:p-4 flex flex-col items-center">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full justify-center">
                  <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="font-inter font-semibold text-2xl sm:text-3xl text-gray-800">
                      {consultants[0].name?.charAt(0) || "T"}
                    </span>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-inter font-bold text-lg sm:text-xl text-gray-800">
                      {consultants[0].name}
                    </p>
                    <p className="font-inter font-medium text-base sm:text-lg text-gray-600">
                      {consultants[0].role}
                    </p>
                  </div>
                </div>
                <div className="mt-3 sm:mt-4 w-full flex justify-center">
                  <div className="text-left w-full max-w-[240px] sm:max-w-xs space-y-1">
                    <p className="font-inter text-sm sm:text-base text-gray-600 hover:text-blue-700 hover:bg-gray-100 p-1 rounded transition-all duration-200">
                      <strong className="inline-block w-20 sm:w-24">
                        Phone:
                      </strong>{" "}
                      {consultants[0].phone}
                    </p>
                    <p className="font-inter text-sm sm:text-base text-gray-600 hover:text-blue-700 hover:bg-gray-100 p-1 rounded transition-all duration-200">
                      <strong className="inline-block w-20 sm:w-24">
                        Email:
                      </strong>{" "}
                      {consultants[0].email}
                    </p>
                    <p className="font-inter text-sm sm:text-base text-gray-600 hover:text-blue-700 hover:bg-gray-100 p-1 rounded transition-all duration-200">
                      <strong className="inline-block w-20 sm:w-24">
                        Age:
                      </strong>{" "}
                      {consultants[0].age}
                    </p>
                    <p className="font-inter text-sm sm:text-base text-gray-600 hover:text-blue-700 hover:bg-gray-100 p-1 rounded transition-all duration-200">
                      <strong className="inline-block w-20 sm:w-24">
                        Class:
                      </strong>{" "}
                      {consultants[0].className}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          >
            {consultants.map((consultant) => (
              <Card
                key={consultant.id}
                component={motion.div}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`rounded-xl bg-gray-50 border ${
                  bookingData.consultantId === consultant.id
                    ? "border-blue-500"
                    : "border-gray-300"
                } w-full hover:shadow-lg transition-all duration-300`}
                style={{ minWidth: "180px" }}
                onClick={() => handleSelectConsultant(consultant)} // Sử dụng hàm đã định nghĩa
              >
                <CardContent className="p-3 sm:p-4 flex flex-col items-center">
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full justify-center">
                    <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="font-inter font-semibold text-2xl sm:text-3xl text-gray-800">
                        {consultant.name?.charAt(0) || "C"}
                      </span>
                    </div>
                    <div className="text-center sm:text-left">
                      <p
                        className={`font-inter font-bold text-lg sm:text-xl ${
                          bookingData.consultantId === consultant.id
                            ? "text-blue-700"
                            : "text-gray-800"
                        }`}
                      >
                        {consultant.name}
                      </p>
                      <p
                        className={`font-inter font-medium text-base sm:text-lg ${
                          bookingData.consultantId === consultant.id
                            ? "text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        {consultant.role}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 w-full flex justify-center">
                    <div className="text-left w-full max-w-[240px] sm:max-w-xs space-y-1">
                      <p
                        className={`font-inter text-sm sm:text-base ${
                          bookingData.consultantId === consultant.id
                            ? "text-blue-600"
                            : "text-gray-600"
                        } hover:text-blue-700 hover:bg-gray-100 p-1 rounded transition-all duration-200`}
                      >
                        <strong className="inline-block w-20 sm:w-24">
                          Phone:
                        </strong>{" "}
                        {consultant.phone}
                      </p>
                      <p
                        className={`font-inter text-sm sm:text-base ${
                          bookingData.consultantId === consultant.id
                            ? "text-blue-600"
                            : "text-gray-600"
                        } hover:text-blue-700 hover:bg-gray-100 p-1 rounded transition-all duration-200`}
                      >
                        <strong className="inline-block w-20 sm:w-24">
                          Email:
                        </strong>{" "}
                        {consultant.email}
                      </p>
                      <p
                        className={`font-inter text-sm sm:text-base ${
                          bookingData.consultantId === consultant.id
                            ? "text-blue-600"
                            : "text-gray-600"
                        } hover:text-blue-700 hover:bg-gray-100 p-1 rounded transition-all duration-200`}
                      >
                        <strong className="inline-block w-20 sm:w-24">
                          Age:
                        </strong>{" "}
                        {consultant.age}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

import { useState, useEffect, useCallback } from "react";
import { useBooking } from "../../../context/BookingContext";
import { getAuthDataFromLocalStorage } from "../../../utils/auth";
import { motion } from "framer-motion";
import axios from "axios";
import { Card, CardContent } from "@mui/material";

export const ConsultantSelection = () => {
  const { updateBookingData, bookingData, isParent } = useBooking();
  const [consultants, setConsultants] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const authData = getAuthDataFromLocalStorage();
        if (!bookingData.consultantType) {
          setError("No consultant type selected. Please select a type first.");
          return;
        }

        let consultantList = [];
        if (bookingData.consultantType === "homeroom") {
          let studentId = !isParent()
            ? bookingData.userId || authData.userId
            : bookingData.childId;
          if (!studentId) {
            setError("No valid student ID available.");
            return;
          }

          const classResponse = await axios.get(
            `https://localhost:7192/api/User/${studentId}/class`,
            {
              headers: {
                Authorization: `Bearer ${authData.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (classResponse.status === 200) {
            const teacherData = classResponse.data.result || classResponse.data;
            const teacherId = teacherData.teacherId;
            const className = teacherData.className || "Unknown Class";

            const profileResponse = await axios.get(
              `https://localhost:7192/api/User/profile?userId=${teacherId}`,
              {
                headers: {
                  Authorization: `Bearer ${authData.accessToken}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (
              profileResponse.status === 200 &&
              profileResponse.data.isSuccess
            ) {
              const teacherProfile = profileResponse.data.result;
              let age = "N/A";
              if (teacherProfile.birthDay) {
                const [day, month, year] = teacherProfile.birthDay.split("/");
                const birthYear = parseInt(year, 10);
                const currentYear = 2025;
                age = currentYear - birthYear;
              }

              consultantList = [
                {
                  id: teacherId || "unknown-id",
                  name: teacherProfile.fullName || "Unknown Teacher",
                  phone: teacherProfile.phone || "N/A",
                  email: teacherProfile.email || "N/A",
                  birthDay: teacherProfile.birthDay || "N/A",
                  age: age,
                  role: "Homeroom Teacher",
                  className: className,
                  availableSlots: [],
                },
              ];
            } else {
              consultantList = [
                {
                  id: teacherId || "unknown-id",
                  name: `Teacher ${teacherId?.slice(0, 8) || "unknown"}`,
                  phone: "N/A",
                  email: "N/A",
                  birthDay: "N/A",
                  age: "N/A",
                  role: "Homeroom Teacher",
                  className: className,
                  availableSlots: [],
                },
              ];
            }
          }
        } else if (bookingData.consultantType === "counselor") {
          const response = await axios.get(
            `https://localhost:7192/api/psychologists`,
            {
              headers: {
                Authorization: `Bearer ${authData.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status === 200) {
            let data = response.data.result || response.data;
            consultantList = data.map((psychologist) => {
              let age = "N/A";
              if (psychologist.birthDay) {
                const birthDate = new Date(psychologist.birthDay);
                const currentYear = 2025;
                age = currentYear - birthDate.getFullYear();
              }

              return {
                id: psychologist.userId || "unknown-id",
                name:
                  psychologist.fullName ||
                  `Counselor ${psychologist.userId?.slice(0, 8) || "unknown"}`,
                phone: psychologist.phoneNumber || "N/A",
                email: psychologist.email || "N/A",
                birthDay: psychologist.birthDay || "N/A",
                age: age,
                role: "Counselor",
                availableSlots: [],
              };
            });
          }
        }

        if (consultantList.length === 0) setError("No consultants available.");
        else setConsultants(consultantList);
      } catch (error) {
        setError(error.message || "Failed to fetch consultants");
      }
    };

    if (bookingData.consultantType) fetchConsultants();
    else {
      setError("No consultant type selected");
    }
  }, [
    bookingData.consultantType,
    bookingData.isParent,
    bookingData.userId,
    bookingData.childId,
    isParent,
    updateBookingData,
  ]);

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

  if (error)
    return <div className="text-center text-red-600">Error: {error}</div>;

  if (bookingData.consultantType === "homeroom" && consultants.length > 0) {
    const consultant = consultants[0]; // Only one teacher
    return (
      <div className="py-6 px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="w-full max-w-[90%] sm:max-w-md md:max-w-lg">
          <h5 className="font-inter font-semibold text-xl sm:text-2xl text-gray-800 mb-4 text-center">
            Your {consultant.role}
          </h5>
          <Card
            className="rounded-xl bg-gray-50 border border-gray-300 w-full hover:shadow-lg transition-shadow duration-300"
            style={{ minWidth: "180px" }}
          >
            <CardContent className="p-3 sm:p-4 flex flex-col items-center">
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full justify-center">
                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="font-inter font-semibold text-2xl sm:text-3xl text-gray-800">
                    {consultant.name?.charAt(0) || "T"}
                  </span>
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-inter font-bold text-lg sm:text-xl text-gray-800">
                    {consultant.name}
                  </p>
                  <p className="font-inter font-medium text-base sm:text-lg text-gray-600">
                    {consultant.role}
                  </p>
                </div>
              </div>
              <div className="mt-3 sm:mt-4 w-full flex justify-center">
                <div className="text-left w-full max-w-[240px] sm:max-w-xs space-y-1">
                  <p className="font-inter text-sm sm:text-base text-gray-600 hover:text-blue-700 hover:bg-gray-100 p-1 rounded transition-all duration-200">
                    <strong className="inline-block w-20 sm:w-24">
                      Phone:
                    </strong>{" "}
                    {consultant.phone}
                  </p>
                  <p className="font-inter text-sm sm:text-base text-gray-600 hover:text-blue-700 hover:bg-gray-100 p-1 rounded transition-all duration-200">
                    <strong className="inline-block w-20 sm:w-24">
                      Email:
                    </strong>{" "}
                    {consultant.email}
                  </p>
                  <p className="font-inter text-sm sm:text-base text-gray-600 hover:text-blue-700 hover:bg-gray-100 p-1 rounded transition-all duration-200">
                    <strong className="inline-block w-20 sm:w-24">Age:</strong>{" "}
                    {consultant.age}
                  </p>
                  {consultant.role === "Homeroom Teacher" && (
                    <p className="font-inter text-sm sm:text-base text-gray-600 hover:text-blue-700 hover:bg-gray-100 p-1 rounded transition-all duration-200">
                      <strong className="inline-block w-20 sm:w-24">
                        Class:
                      </strong>{" "}
                      {consultant.className}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 flex justify-center">
      <div className="w-full max-w-3xl">
        <h5 className="font-inter font-semibold text-xl sm:text-2xl text-gray-800 mb-6 text-center">
          Select Counselor
        </h5>
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
              onClick={() => handleSelectConsultant(consultant)}
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
      </div>
    </div>
  );
};

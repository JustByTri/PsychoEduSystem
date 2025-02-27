import { useState, useEffect } from "react";
import { useBooking } from "../../../context/BookingContext";
import { getAuthDataFromLocalStorage } from "../../../utils/auth";

export const ConsultantTypeSelection = () => {
  const { updateBookingData, bookingData, isStudent, isParent } = useBooking();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchClassAndTeacher = async (studentId) => {
    try {
      setIsLoading(true);
      const authData = getAuthDataFromLocalStorage();
      const response = await fetch(
        `https://localhost:7192/api/User/${studentId}/class`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch class and teacher");
      }

      const data = await response.json();
      if (data.isSuccess && data.statusCode === 200) {
        return data.result.teacherId; // Chỉ trả về teacherId
      }
      return null;
    } catch (error) {
      setError(error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectType = async (type) => {
    if (type === "homeroom") {
      const studentId = isStudent()
        ? bookingData.userId
        : bookingData.studentId;
      const teacherId = await fetchClassAndTeacher(studentId);
      if (teacherId) {
        updateBookingData({
          consultantType: type,
          consultantId: teacherId, // Lưu teacherId làm consultantId
          consultantName: "", // Không cần tên, để trống
          isHomeroomTeacher: true,
        });
      } else {
        updateBookingData({
          consultantType: type,
          isHomeroomTeacher: true,
        });
      }
    } else {
      updateBookingData({
        consultantType: type,
        consultantId: "",
        consultantName: "",
        isHomeroomTeacher: false,
      });
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="py-6">
      <h2 className="text-xl font-semibold mb-4">Select Consultant Type</h2>
      <div className="space-y-3">
        <div
          onClick={() => handleSelectType("counselor")}
          className={`p-4 border rounded-md cursor-pointer transition-colors
            ${
              bookingData.consultantType === "counselor"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
        >
          Counselor
        </div>
        <div
          onClick={() => handleSelectType("homeroom")}
          className={`p-4 border rounded-md cursor-pointer transition-colors
            ${
              bookingData.consultantType === "homeroom"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
        >
          Homeroom Teacher
        </div>
      </div>
    </div>
  );
};

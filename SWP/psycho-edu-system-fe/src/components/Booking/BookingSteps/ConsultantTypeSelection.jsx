import { useState, useEffect } from "react";
import { useBooking } from "../../../context/BookingContext";
import { getAuthDataFromLocalStorage } from "../../../utils/auth";
import { motion } from "framer-motion"; // Thêm framer-motion
import axios from "axios"; // Thêm axios

export const ConsultantTypeSelection = () => {
  const { updateBookingData, bookingData, isParent } = useBooking();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debug để kiểm tra giá trị
  useEffect(() => {
    console.log("isParent:", isParent());
    console.log("bookingData:", bookingData);
  }, [isParent, bookingData]);

  // Hàm fetch teacherId từ API với axios
  const fetchClassAndTeacher = async (studentId) => {
    if (!studentId) {
      setError("Student ID is required.");
      return null;
    }

    try {
      setIsLoading(true);
      const authData = getAuthDataFromLocalStorage();
      const response = await axios.get(
        `https://localhost:7192/api/User/${studentId}/class`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response for class and teacher:", response.data);

      if (response.data.isSuccess && response.data.statusCode === 200) {
        return response.data.result.teacherId; // Chỉ trả về teacherId
      }
      setError("Invalid response from server.");
      return null;
    } catch (error) {
      console.error("Fetch class and teacher error:", error.message);
      setError(error.message || "Failed to fetch class and teacher");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm xử lý chọn loại consultant
  const handleSelectType = async (type) => {
    setIsLoading(true); // Bắt đầu loading khi click
    setError(null); // Reset lỗi

    let studentId;
    // Lấy studentId: userId nếu không phải parent (student), childId nếu là parent
    studentId = !isParent() ? bookingData.userId : bookingData.childId;

    // Kiểm tra studentId trước khi tiếp tục
    if (!studentId) {
      setError("No valid student ID available. Please check your data.");
      setIsLoading(false);
      return;
    }

    if (type === "homeroom") {
      const teacherId = await fetchClassAndTeacher(studentId);
      if (teacherId) {
        updateBookingData({
          consultantType: type,
          consultantId: teacherId,
          consultantName: "",
          isHomeroomTeacher: true,
        });
      } else {
        updateBookingData({
          consultantType: type,
          isHomeroomTeacher: true,
        });
        setError("Could not fetch homeroom teacher. Please try again.");
      }
    } else {
      updateBookingData({
        consultantType: type,
        consultantId: "",
        consultantName: "",
        isHomeroomTeacher: false,
      });
    }
    setIsLoading(false); // Kết thúc loading
  };

  // useEffect để kiểm tra và fetch nếu đã có consultantType (optional)
  useEffect(() => {
    if (bookingData.consultantType === "homeroom") {
      const studentId = !isParent() ? bookingData.userId : bookingData.childId;
      if (studentId) fetchClassAndTeacher(studentId);
    }
  }, [
    bookingData.consultantType,
    bookingData.userId,
    bookingData.childId,
    isParent,
  ]);

  if (isLoading)
    return (
      <motion.div className="text-center text-gray-600">Loading...</motion.div>
    );
  if (error)
    return (
      <motion.div className="text-center text-red-600">
        Error: {error}
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-6"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Select Consultant Type
      </h2>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-3"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSelectType("counselor")}
          className={`p-4 border rounded-md cursor-pointer transition-colors
            ${
              bookingData.consultantType === "counselor"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
        >
          <p className="text-center font-medium text-gray-800">Counselor</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSelectType("homeroom")}
          className={`p-4 border rounded-md cursor-pointer transition-colors
            ${
              bookingData.consultantType === "homeroom"
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"
            }`}
        >
          <p className="text-center font-medium text-gray-800">
            Homeroom Teacher
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

import { useState, useEffect } from "react";
import { useBooking } from "../../../context/BookingContext";
import { getAuthDataFromLocalStorage } from "../../../utils/auth";
import { motion } from "framer-motion"; // Thêm framer-motion
import axios from "axios"; // Thêm axios

export const ConsultantSelection = () => {
  const { updateBookingData, bookingData, isParent } = useBooking();
  const [consultants, setConsultants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        setIsLoading(true);
        const authData = getAuthDataFromLocalStorage();
        if (!bookingData.consultantType) {
          setError("No consultant type selected. Please select a type first.");
          setIsLoading(false);
          return;
        }

        let consultantList = [];
        if (bookingData.consultantType === "homeroom") {
          let studentId;
          if (!isParent()) {
            // Student: Lấy studentId từ userId trong token
            studentId = bookingData.userId || authData.userId; // Ưu tiên từ bookingData, nếu không dùng authData
            if (!studentId) {
              setError(
                "No valid student ID available. Please check your authentication."
              );
              setIsLoading(false);
              return;
            }
          } else {
            // Parent: Yêu cầu childId đã được chọn từ ChildSelection
            studentId = bookingData.childId;
            if (!studentId) {
              setError(
                "No valid student ID available. Please select a child first."
              );
              setIsLoading(false);
              return;
            }
          }

          const response = await axios.get(
            `https://localhost:7192/api/User/${studentId}/class`, // Truyền studentId để lấy teacherId
            {
              headers: {
                Authorization: `Bearer ${authData.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          console.log("API Response for homeroom teacher:", response.data);
          if (response.status === 200) {
            const teacherData = response.data.result || response.data;
            if (!teacherData || typeof teacherData !== "object") {
              throw new Error(
                "Invalid data format: teacher data is not an object"
              );
            }
            const teacherId = teacherData.teacherId;
            consultantList = [
              {
                id: teacherId || "unknown-id",
                name: `Teacher ${teacherId?.slice(0, 8) || "unknown"}`, // Sử dụng ID thay vì tên
                role: "Homeroom Teacher",
                availableSlots: [], // Sẽ fetch trong DateTimeSelection
              },
            ];
          } else {
            throw new Error(`API error: Status ${response.status}`);
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
            let data = response.data;
            // Xử lý định dạng response
            if (Array.isArray(data)) {
              data = data;
            } else if (data.data && Array.isArray(data.data)) {
              data = data.data;
            } else if (data.result && Array.isArray(data.result)) {
              data = data.result;
            } else if (data && typeof data === "object") {
              data = [data];
            } else {
              throw new Error(
                "Invalid data format: response data is not an array or object"
              );
            }

            if (!Array.isArray(data)) {
              throw new Error(
                "Invalid data format: processed data is not an array"
              );
            }

            const formattedConsultants = data.map((psychologist) => ({
              id: psychologist.userId || "unknown-id",
              name:
                psychologist.fullName ||
                `Counselor ${psychologist.userId?.slice(0, 8) || "unknown"}`,
              role: "Counselor",
              availableSlots: [], // Sẽ fetch trong DateTimeSelection
            }));
            consultantList = formattedConsultants;
          } else {
            throw new Error(`API error: Status ${response.status}`);
          }
        }

        if (consultantList.length === 0) {
          setError("No consultants available.");
        } else {
          setConsultants(consultantList);
        }
      } catch (error) {
        console.error(
          "Error fetching consultants:",
          error.response ? error.response.data : error.message
        );
        setError(error.message || "Failed to fetch consultants");
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingData.consultantType) {
      fetchConsultants();
    } else {
      setIsLoading(false);
      setError("No consultant type selected");
    }
  }, [
    bookingData.consultantType,
    bookingData.isParent,
    bookingData.userId,
    bookingData.childId,
    isParent, // Thêm isParent từ useBooking để kiểm tra vai trò
  ]);

  const handleSelectConsultant = (consultant) => {
    if (!consultant) {
      console.error("Consultant is undefined");
      return;
    }
    console.log("Selected consultant:", consultant);
    updateBookingData({
      consultantId: consultant.id,
      consultantName: consultant.name,
      availableSlots: consultant.availableSlots, // Sẽ cập nhật trong DateTimeSelection
    });
  };

  if (isLoading)
    return (
      <motion.div className="text-center text-gray-600">
        Loading consultants...
      </motion.div>
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
        Select Consultant
      </h2>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-3"
      >
        {consultants.map((consultant, index) => (
          <motion.div
            key={consultant.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`p-4 border rounded-md cursor-pointer transition-colors
              ${
                bookingData.consultantId === consultant.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            onClick={() => handleSelectConsultant(consultant)}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                {consultant.name?.charAt(0) || "C"}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-800">
                  {consultant.name || "Unknown Consultant"}
                </p>
                <p className="text-sm text-gray-500">
                  {consultant.role || "Counselor"}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

import { useState, useEffect } from "react";
import { useBooking } from "../../../context/BookingContext";
import { getAuthDataFromLocalStorage } from "../../../utils/auth";
import { motion } from "framer-motion"; // Thêm framer-motion
import axios from "axios"; // Thêm axios

export const ConsultantSelection = () => {
  const { updateBookingData, bookingData } = useBooking();
  const [consultants, setConsultants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        setIsLoading(true);
        const authData = getAuthDataFromLocalStorage();
        if (bookingData.consultantType === "counselor") {
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
            // Xử lý định dạng response: kiểm tra nếu data là object chứa mảng (data, result, v.v.)
            if (Array.isArray(data)) {
              data = data; // Nếu trực tiếp là mảng
            } else if (data.data && Array.isArray(data.data)) {
              data = data.data; // Nếu có field 'data' là mảng
            } else if (data.result && Array.isArray(data.result)) {
              data = data.result; // Nếu có field 'result' là mảng
            } else if (data && typeof data === "object") {
              // Nếu là object đơn, chuyển thành mảng
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
              id: psychologist.userId || "unknown-id", // Đảm bảo id luôn có giá trị
              name:
                psychologist.fullName ||
                `Counselor ${psychologist.userId?.slice(0, 8) || "unknown"}`, // Giả định fullName từ API, kiểm tra trước khi slice
              role: "Counselor",
              availableSlots: [], // Sẽ fetch trong DateTimeSelection
            }));
            setConsultants(formattedConsultants);
          } else {
            throw new Error(`API error: Status ${response.status}`);
          }
        } else if (bookingData.consultantType === "homeroom") {
          const response = await axios.get(
            `https://localhost:7192/api/User/${bookingData.consultantId}/class`,
            {
              headers: {
                Authorization: `Bearer ${authData.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          console.log("API Response for homeroom teacher:", response.data); // Log response để kiểm tra định dạng
          if (response.status === 200) {
            const teacherData = response.data.result || response.data; // Giả định result hoặc data trực tiếp
            if (!teacherData || typeof teacherData !== "object") {
              throw new Error(
                "Invalid data format: teacher data is not an object"
              );
            }
            const teacherName = await fetchTeacherName(teacherData.teacherId);
            setConsultants([
              {
                id: teacherData.teacherId || "unknown-id",
                name:
                  teacherName ||
                  `Teacher ${teacherData.teacherId?.slice(0, 8) || "unknown"}`,
                role: "Homeroom Teacher",
                availableSlots: [], // Sẽ fetch trong DateTimeSelection
              },
            ]);
          } else {
            throw new Error(`API error: Status ${response.status}`);
          }
        } else {
          throw new Error("No consultant type selected");
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

    const fetchTeacherName = async (teacherId) => {
      try {
        const authData = getAuthDataFromLocalStorage();
        const response = await axios.get(
          `https://localhost:7192/api/User/${teacherId}`,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          return (
            response.data.fullName ||
            `Teacher ${teacherId?.slice(0, 8) || "unknown"}`
          );
        }
        return `Teacher ${teacherId?.slice(0, 8) || "unknown"}`;
      } catch (error) {
        console.error("Error fetching teacher name:", error);
        return `Teacher ${teacherId?.slice(0, 8) || "unknown"}`;
      }
    };

    if (bookingData.consultantType) {
      fetchConsultants();
    } else {
      setIsLoading(false);
      setError("No consultant type selected");
    }
  }, [bookingData.consultantType, bookingData.consultantId]);

  const handleSelectConsultant = (consultant) => {
    if (!consultant) {
      console.error("Consultant is undefined");
      return;
    }
    updateBookingData({
      consultantId: consultant.id,
      consultantName: consultant.name,
      availableSlots: consultant.availableSlots, // Lưu availableSlots (dù trống, sẽ fetch trong DateTimeSelection)
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
    <div className="py-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Select Consultant
      </h2>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-3"
      >
        {consultants.map((consultant, index) => (
          <motion.div
            key={consultant.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }} // Hiệu ứng delay cho từng consultant
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
    </div>
  );
};

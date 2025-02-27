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
        const response = await axios.get(
          `https://localhost:7192/api/psychologists`,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.isSuccess && response.data.statusCode === 200) {
          // Ánh xạ dữ liệu từ API thành format cần thiết
          const formattedConsultants = response.data.result.map(
            (psychologist) => ({
              id: psychologist.userId, // Sử dụng userId làm id (GUID)
              name: psychologist.fullName, // Sử dụng fullName làm tên
              role: "Counselor", // Đặt role cố định là "Counselor"
            })
          );
          setConsultants(formattedConsultants);
        } else {
          throw new Error("Invalid response from API");
        }
      } catch (error) {
        setError(error.message || "Failed to fetch counselors");
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingData.consultantType === "counselor") {
      fetchConsultants();
    } else {
      setIsLoading(false);
      setError("No consultant type selected");
    }
  }, [bookingData.consultantType]);

  const handleSelectConsultant = (consultant) => {
    if (!consultant) {
      console.error("Consultant is undefined");
      return;
    }
    updateBookingData({
      consultantId: consultant.id,
      consultantName: consultant.name,
      availableSlots: [], // Lưu trống, sẽ fetch sau trong DateTimeSelection
    });
  };

  if (isLoading)
    return (
      <div className="text-center text-gray-600">Loading counselors...</div>
    );
  if (error)
    return <div className="text-center text-red-600">Error: {error}</div>;

  return (
    <div className="py-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Select Counselor
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
            transition={{ duration: 0.3, delay: index * 0.1 }} // Hiệu ứng delay cho từng counselor
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
                  {consultant.name || "Unknown Counselor"}
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

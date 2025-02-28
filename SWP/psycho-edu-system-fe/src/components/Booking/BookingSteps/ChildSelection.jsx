import { useState, useEffect } from "react";
import { useBooking } from "../../../context/BookingContext";
import { getAuthDataFromLocalStorage } from "../../../utils/auth";
import { motion } from "framer-motion"; // Thêm framer-motion
import axios from "axios"; // Thêm axios

export const ChildSelection = () => {
  const { updateBookingData, bookingData, isParent } = useBooking();
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy userId (parentId) từ token
  const authData = getAuthDataFromLocalStorage();
  const parentId = authData?.userId; // Giả định userId là parentId

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        setIsLoading(true);
        if (!isParent() || !parentId) {
          setError(
            "Only parents can select a child, and parent ID is required."
          );
          setIsLoading(false);
          return;
        }

        const response = await axios.get(
          `https://localhost:7192/api/relationships/parent/${parentId}`, // API để lấy danh sách children của parent
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const result = response.data.result || response.data; // Xử lý nếu result không tồn tại hoặc là data trực tiếp
          if (!Array.isArray(result)) {
            setError("Invalid data format: expected an array of relationships");
            setIsLoading(false);
            return;
          }

          const uniqueStudents = {};
          const formattedChildren = result
            .filter((relationship) => relationship && relationship.studentId) // Kiểm tra relationship và studentId không undefined
            .map((relationship) => {
              const studentId = relationship.studentId;
              if (!uniqueStudents[studentId]) {
                uniqueStudents[studentId] = true;
                return {
                  id: studentId, // Chỉ dùng studentId làm id (GUID)
                  name:
                    relationship.relationshipName ||
                    `Student ${studentId.slice(0, 8)}`, // Tạo name từ relationshipName hoặc studentId
                  role: "Student", // Đặt role cố định là "Student"
                };
              }
              return null; // Bỏ qua nếu đã xử lý studentId này
            })
            .filter(Boolean); // Loại bỏ các null

          setChildren(formattedChildren);
        } else {
          throw new Error(
            response.data?.message || `API error: Status ${response.status}`
          );
        }
      } catch (error) {
        console.error(
          "Error fetching children:",
          error.response ? error.response.data : error.message
        );
        setError(error.message || "Failed to fetch children");
      } finally {
        setIsLoading(false);
      }
    };

    if (isParent()) {
      fetchChildren();
    } else {
      setIsLoading(false);
      setError("Only parents can select a child");
    }
  }, [isParent, parentId, authData.accessToken]);

  const handleSelectChild = (child) => {
    updateBookingData({
      childId: child.id, // Lưu studentId làm childId
      childName: child.name || "Unknown Student", // Đảm bảo name có giá trị mặc định
    });
  };

  if (isLoading)
    return (
      <motion.div className="text-center text-gray-600">
        Loading children...
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
        Select Student
      </h2>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-3"
      >
        {children.map((child, index) => (
          <motion.div
            key={child.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => handleSelectChild(child)}
            className={`p-4 border rounded-md cursor-pointer transition-colors
              ${
                bookingData.childId === child.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                {child.name ? child.name.charAt(0) || "S" : "S"}{" "}
                {/* Kiểm tra name trước khi dùng charAt, dùng "S" làm mặc định */}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-800">
                  {child.name || "Unknown Student"}
                </p>
                <p className="text-sm text-gray-500">
                  {child.role || "Student"}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

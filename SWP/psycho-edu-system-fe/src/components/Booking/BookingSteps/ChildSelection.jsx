import { useState, useEffect } from "react";
import { useBooking } from "../../../context/BookingContext";
import { getAuthDataFromLocalStorage } from "../../../utils/auth";
import { motion } from "framer-motion";
import axios from "axios";
import { Card, CardContent, Typography, Box } from "@mui/material";

export const ChildSelection = () => {
  const { updateBookingData, bookingData, isParent } = useBooking();
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const authData = getAuthDataFromLocalStorage();
  const parentId = authData?.userId;

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

        // Lấy danh sách relationship
        const relationshipResponse = await axios.get(
          `https://localhost:7192/api/relationships/parent/${parentId}`,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (relationshipResponse.status !== 200) {
          throw new Error("Failed to fetch relationships");
        }

        const relationships =
          relationshipResponse.data.result || relationshipResponse.data;
        if (!Array.isArray(relationships)) {
          setError("Invalid data format: expected an array of relationships");
          setIsLoading(false);
          return;
        }

        // Lấy thông tin profile của từng student
        const uniqueStudents = {};
        const formattedChildrenPromises = relationships
          .filter((rel) => rel && rel.studentId)
          .map(async (relationship) => {
            const studentId = relationship.studentId;
            if (!uniqueStudents[studentId]) {
              uniqueStudents[studentId] = true;

              const profileResponse = await axios.get(
                `https://localhost:7192/api/User/profile?userId=${studentId}`,
                {
                  headers: {
                    Authorization: `Bearer ${authData.accessToken}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (
                profileResponse.data.isSuccess &&
                profileResponse.data.statusCode === 200
              ) {
                const profile = profileResponse.data.result;
                return {
                  id: studentId,
                  fullName:
                    profile.fullName || `Student ${studentId.slice(0, 8)}`, // Lấy fullName từ profile
                  relationshipName: relationship.relationshipName || "Child", // Lấy relationshipName từ relationship
                };
              }
              return null;
            }
            return null;
          });

        const formattedChildren = (
          await Promise.all(formattedChildrenPromises)
        ).filter(Boolean);
        setChildren(formattedChildren);
      } catch (error) {
        setError(error.message || "Failed to fetch children");
      } finally {
        setIsLoading(false);
      }
    };

    if (isParent()) fetchChildren();
    else {
      setIsLoading(false);
      setError("Only parents can select a child");
    }
  }, [isParent, parentId, authData.accessToken]);

  const handleSelectChild = (child) => {
    updateBookingData({
      childId: child.id,
      childName: child.fullName, // Lưu fullName vào bookingData
      relationshipName: child.relationshipName, // Lưu relationshipName nếu cần dùng sau này
    });
  };

  if (isLoading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-600"
      >
        Loading children...
      </motion.div>
    );
  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-red-600"
      >
        Error: {error}
      </motion.div>
    );

  return (
    <Box className="py-6">
      <Typography
        variant="h5"
        sx={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          color: "#333",
          mb: 4,
          textAlign: "center",
        }}
      >
        Select Student
      </Typography>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {children.map((child, index) => (
          <motion.div
            key={child.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card
              className={`rounded-xl shadow-lg border transition-shadow duration-300 cursor-pointer ${
                bookingData.childId === child.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:shadow-xl hover:border-blue-300"
              }`}
              sx={{ minWidth: 200, maxWidth: 300 }}
              onClick={() => handleSelectChild(child)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box className="flex items-center">
                  <Box
                    className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                    sx={{ mr: 2 }}
                  >
                    <Typography
                      sx={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                    >
                      {child.fullName ? child.fullName.charAt(0) : "S"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "#333",
                      }}
                    >
                      {child.fullName} {/* Hiển thị fullName */}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.9rem",
                        color: "#666",
                      }}
                    >
                      {child.relationshipName} {/* Hiển thị relationshipName */}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Box>
  );
};

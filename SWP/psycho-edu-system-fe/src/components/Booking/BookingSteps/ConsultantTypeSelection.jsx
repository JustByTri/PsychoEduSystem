import { useState, useEffect, useCallback, useMemo } from "react";
import { useBooking } from "../../../context/BookingContext";
import { getAuthDataFromLocalStorage } from "../../../utils/auth";
import { motion } from "framer-motion";
import axios from "axios";
import { Card, CardContent, Typography, Box } from "@mui/material";

// Move variants outside component to prevent re-creation
const cardVariants = {
  initial: { scale: 0.9, opacity: 0, y: 20 },
  animate: { scale: 1, opacity: 1, y: 0 },
  hover: {
    scale: 1.03, // Giảm scale khi hover
    y: -5, // Giảm độ nâng lên khi hover
    boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.12)",
    transition: { duration: 0.2, ease: "easeOut" },
  },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

export const ConsultantTypeSelection = () => {
  const { updateBookingData, bookingData, isParent } = useBooking();
  const [error, setError] = useState(null);

  // Memoize authData to prevent unnecessary re-renders
  const authData = useMemo(() => getAuthDataFromLocalStorage(), []);
  const userId = authData?.userId;

  // Optimize useEffect with proper dependency handling
  useEffect(() => {
    const shouldUpdateUserId = !bookingData.userId && userId && !isParent();
    if (shouldUpdateUserId) {
      updateBookingData({ userId });
    }
  }, [userId, isParent, updateBookingData, bookingData.userId]);

  const fetchClassAndTeacher = useCallback(async (studentId) => {
    if (!studentId) {
      setError("Student ID is required.");
      return null;
    }

    try {
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

      if (response.data.isSuccess && response.data.statusCode === 200) {
        return response.data.result.teacherId;
      }
      setError("Invalid response from server.");
      return null;
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch class and teacher"
      );
      return null;
    }
  }, []);

  const handleSelectType = useCallback(
    async (event, type) => {
      event.preventDefault();
      setError(null);

      let studentId = !isParent() ? userId : bookingData.childId;
      if (!studentId) {
        setError(
          isParent()
            ? "No valid student ID available. Please ensure a child is selected."
            : "No valid user ID available. Please check your authentication."
        );
        return;
      }

      // Cập nhật ngay lập tức consultantType để tránh trạng thái loading
      updateBookingData({
        consultantType: type,
        isHomeroomTeacher: type === "homeroom",
      });

      // Nếu là homeroom, thực hiện fetch teacher trong background mà không hiển thị loading
      if (type === "homeroom") {
        fetchClassAndTeacher(studentId).then((teacherId) => {
          if (teacherId) {
            updateBookingData({
              consultantId: teacherId,
              consultantName: "",
            });
          } else {
            // Vẫn hiển thị lỗi nếu có, nhưng không ảnh hưởng đến việc chọn loại consultant
            setError(
              "Could not fetch homeroom teacher. You can continue with the selection."
            );
          }
        });
      } else {
        updateBookingData({
          consultantId: "",
          consultantName: "",
        });
      }
    },
    [
      isParent,
      userId,
      bookingData.childId,
      updateBookingData,
      fetchClassAndTeacher,
    ]
  );

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-red-600 p-4"
      >
        <Typography
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: {
              xs: "clamp(0.75rem, 2vw, 0.875rem)",
              sm: "clamp(0.875rem, 2.5vw, 1rem)",
              md: "clamp(0.875rem, 3vw, 1.125rem)",
            },
            color: "#dc2626",
            textAlign: "center",
          }}
        >
          Error: {error}
        </Typography>
      </motion.div>
    );
  }

  return (
    <Box
      className="py-4 px-3 sm:px-4 lg:px-6 flex justify-center"
      sx={{ width: "100%", overflowX: "hidden" }}
    >
      <Box sx={{ width: "100%", maxWidth: "700px" }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            color: "#333",
            mb: 3,
            textAlign: "center",
            fontSize: {
              xs: "clamp(0.875rem, 3vw, 1rem)",
              sm: "clamp(1rem, 3.5vw, 1.25rem)",
              md: "clamp(1.125rem, 4vw, 1.5rem)",
              lg: "clamp(1.25rem, 4.5vw, 1.75rem)",
            },
            transition: "font-size 0.3s ease-in-out",
          }}
        >
          Select Consultant Type
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            sx={{
              width: "100%",
              maxWidth: "600px", // Giới hạn chiều rộng tối đa của container
            }}
          >
            {["counselor", "homeroom"].map((type) => (
              <Box
                key={type}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Card
                  component={motion.div}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  whileHover="hover"
                  whileTap="tap"
                  className={`rounded-xl border-2 ${
                    bookingData.consultantType === type
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white"
                  }`}
                  sx={{
                    width: "100%",
                    height: { xs: "70px", sm: "80px", md: "90px" },
                    maxWidth: "240px", // Cố định kích thước tối đa
                    cursor: "pointer",
                    "&:hover": {
                      borderColor: "#93c5fd",
                      backgroundColor: "#eff6ff",
                    },
                  }}
                  onClick={(e) => handleSelectType(e, type)}
                >
                  <CardContent
                    sx={{
                      p: { xs: 2, sm: 2.5 },
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                        fontSize: {
                          xs: "clamp(0.75rem, 2.5vw, 0.875rem)",
                          sm: "clamp(0.875rem, 3vw, 1rem)",
                          md: "clamp(0.875rem, 3.5vw, 1.125rem)",
                        },
                        color:
                          bookingData.consultantType === type
                            ? "#1e40af"
                            : "#333",
                        textAlign: "center",
                        transition:
                          "font-size 0.3s ease-in-out, color 0.2s ease-in-out",
                      }}
                    >
                      {type === "counselor" ? "Counselor" : "Homeroom Teacher"}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </motion.div>
        </Box>
      </Box>
    </Box>
  );
};

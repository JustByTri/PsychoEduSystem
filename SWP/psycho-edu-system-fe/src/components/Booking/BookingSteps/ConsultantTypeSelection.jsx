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
    scale: 1.05,
    y: -8,
    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
    transition: { duration: 0.2, ease: "easeOut" },
  },
  tap: { scale: 0.98, transition: { duration: 0.1 } },
};

export const ConsultantTypeSelection = () => {
  const { updateBookingData, bookingData, isParent } = useBooking();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
    } finally {
      setIsLoading(false);
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
          setError("Could not fetch homeroom teacher.");
        }
      } else {
        updateBookingData({
          consultantType: type,
          consultantId: "",
          consultantName: "",
          isHomeroomTeacher: false,
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

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-600 p-4"
      >
        <Typography
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: {
              xs: "clamp(0.875rem, 3vw, 1rem)",
              sm: "clamp(1rem, 3.5vw, 1.25rem)",
              md: "clamp(1.125rem, 4vw, 1.5rem)",
            },
            color: "#666",
            textAlign: "center",
          }}
        >
          Loading...
        </Typography>
      </motion.div>
    );
  }

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
              xs: "clamp(0.875rem, 3vw, 1rem)",
              sm: "clamp(1rem, 3.5vw, 1.25rem)",
              md: "clamp(1.125rem, 4vw, 1.5rem)",
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
      className="py-6 px-4 sm:px-6 lg:px-8 flex justify-center"
      sx={{ width: "100%", overflowX: "hidden" }}
    >
      <Box sx={{ width: "100%", maxWidth: "800px" }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            color: "#333",
            mb: 4,
            textAlign: "center",
            fontSize: {
              xs: "clamp(1rem, 4vw, 1.25rem)",
              sm: "clamp(1.25rem, 4.5vw, 1.5rem)",
              md: "clamp(1.5rem, 5vw, 1.75rem)",
              lg: "clamp(1.75rem, 5.5vw, 2rem)",
            },
            transition: "font-size 0.3s ease-in-out",
          }}
        >
          Select Consultant Type
        </Typography>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
          sx={{ width: "100%" }}
        >
          {["counselor", "homeroom"].map((type) => (
            <Card
              key={type}
              component={motion.div}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
              whileTap="tap"
              className={`rounded-2xl border-2 ${
                bookingData.consultantType === type
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-white"
              }`}
              sx={{
                minWidth: {
                  xs: "200px", // Increased base width
                  sm: "250px", // Wider for small screens
                  md: "300px", // Wider for medium screens
                },
                width: {
                  xs: "100%", // Full width on extra small screens
                  sm: type === "homeroom" ? "auto" : "250px", // Dynamic width for homeroom
                  md: type === "homeroom" ? "auto" : "300px",
                },
                maxWidth: "450px", // Increased max width
                mx: "auto",
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
                  p: { xs: 3, sm: 4 },
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: { xs: "80px", sm: "100px" }, // Ensure consistent height
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 700,
                    fontSize: {
                      xs: "clamp(0.875rem, 3vw, 1rem)",
                      sm: "clamp(1rem, 3.5vw, 1.25rem)",
                      md: "clamp(1.25rem, 4vw, 1.5rem)",
                      lg: "clamp(1.5rem, 4.5vw, 1.75rem)",
                    },
                    color:
                      bookingData.consultantType === type ? "#1e40af" : "#333",
                    textAlign: "center",
                    transition:
                      "font-size 0.3s ease-in-out, color 0.2s ease-in-out",
                    whiteSpace: {
                      xs: "normal", // Allow wrapping on small screens
                      sm: "nowrap", // Prevent wrapping by default
                    },
                    maxWidth: "100%",
                    overflowWrap: "break-word",
                  }}
                >
                  {type === "counselor" ? "Counselor" : "Homeroom Teacher"}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </motion.div>
      </Box>
    </Box>
  );
};

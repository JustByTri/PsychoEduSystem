import { useState, useEffect } from "react";
import { useBooking } from "../../../context/BookingContext";
import { getAuthDataFromLocalStorage } from "../../../utils/auth";
import { motion } from "framer-motion";
import axios from "axios";
import { Card, CardContent, Typography, Box } from "@mui/material";

export const ConsultantTypeSelection = () => {
  const { updateBookingData, bookingData, isParent } = useBooking();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const authData = getAuthDataFromLocalStorage();
  const userId = authData?.userId;

  useEffect(() => {
    if (!bookingData.userId && userId && !isParent()) {
      updateBookingData({ userId });
    }
  }, [userId, isParent, updateBookingData, bookingData.userId]);

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
  };

  const handleSelectType = async (type) => {
    setIsLoading(true);
    setError(null);

    let studentId = !isParent() ? userId : bookingData.childId;
    if (!studentId) {
      setError(
        isParent()
          ? "No valid student ID available. Please ensure a child is selected."
          : "No valid user ID available. Please check your authentication."
      );
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
    setIsLoading(false);
  };

  if (isLoading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-600"
      >
        Loading...
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
        Select Consultant Type
      </Typography>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto"
      >
        {["counselor", "homeroom"].map((type, index) => (
          <motion.div
            key={type}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card
              className={`rounded-xl shadow-lg border transition-shadow duration-300 cursor-pointer ${
                bookingData.consultantType === type
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:shadow-xl hover:border-blue-300"
              }`}
              sx={{ minWidth: 200 }}
              onClick={() => handleSelectType(type)}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    fontSize: "1.25rem",
                    color: "#333",
                    textAlign: "center",
                  }}
                >
                  {type === "counselor" ? "Counselor" : "Homeroom Teacher"}
                </Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Box>
  );
};

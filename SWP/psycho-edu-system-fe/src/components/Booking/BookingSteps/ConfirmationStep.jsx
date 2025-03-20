import { useState, useEffect, useCallback } from "react";
import { useBooking } from "../../../context/BookingContext";
import { getAuthDataFromLocalStorage } from "../../../utils/auth";
import axios from "axios";
import { motion } from "framer-motion";
import { Box, Typography, CircularProgress } from "@mui/material";

export const ConfirmationStep = () => {
  const { bookingData } = useBooking();
  const [consultantDetails, setConsultantDetails] = useState(null);
  const [bookedByDetails, setBookedByDetails] = useState(null); // Thêm state cho bookedBy
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const authData = getAuthDataFromLocalStorage();

  const fetchConsultantDetails = useCallback(async () => {
    if (!bookingData.consultantId) {
      setError("Consultant ID is missing.");
      return;
    }

    try {
      const response = await axios.get(
        `https://localhost:7192/api/User/profile?userId=${bookingData.consultantId}`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.isSuccess && response.data.statusCode === 200) {
        setConsultantDetails(response.data.result);
      } else {
        throw new Error("Failed to fetch consultant details.");
      }
    } catch (err) {
      setError(`Error fetching consultant details: ${err.message}`);
    }
  }, [bookingData.consultantId, authData.accessToken]);

  const fetchBookedByDetails = useCallback(async () => {
    if (!authData.userId) {
      setError("User ID is missing from authentication data.");
      return;
    }

    try {
      const response = await axios.get(
        `https://localhost:7192/api/User/profile?userId=${authData.userId}`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.isSuccess && response.data.statusCode === 200) {
        setBookedByDetails(response.data.result);
      } else {
        throw new Error("Failed to fetch bookedBy details.");
      }
    } catch (err) {
      setError(`Error fetching bookedBy details: ${err.message}`);
    }
  }, [authData.userId, authData.accessToken]);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchConsultantDetails(), fetchBookedByDetails()]);
      setIsLoading(false);
    };
    fetchData();
  }, [fetchConsultantDetails, fetchBookedByDetails]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center py-6"
      >
        <CircularProgress size={40} color="primary" />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-red-600 py-6"
      >
        <Typography variant="h6">{error}</Typography>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Box className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
        <Typography
          variant="h5"
          className="text-lg sm:text-xl font-semibold text-green-800 mb-4 sm:mb-6 text-center"
          sx={{ fontFamily: "Inter, sans-serif" }}
        >
          Booking Summary
        </Typography>

        <Box className="space-y-4 sm:space-y-5">
          {/* Booking Type */}
          <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <Typography
              className="text-gray-600"
              sx={{ fontFamily: "Inter, sans-serif" }}
            >
              Booking Type:
            </Typography>
            <Typography
              className="font-medium text-gray-800"
              sx={{ fontFamily: "Inter, sans-serif" }}
            >
              {bookingData.userRole === "Parent"
                ? "Parent Booking"
                : "Student Booking"}
            </Typography>
          </Box>

          {/* Booked By Information */}
          {bookedByDetails && (
            <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <Typography
                className="text-gray-600"
                sx={{ fontFamily: "Inter, sans-serif" }}
              >
                Booked By:
              </Typography>
              <Box className="text-right">
                <Typography
                  className="font-medium text-gray-800"
                  sx={{ fontFamily: "Inter, sans-serif" }}
                >
                  {bookedByDetails.fullName || "Unknown"} (
                  {bookingData.userRole})
                </Typography>
                <Box className="text-sm text-gray-600 mt-1">
                  <Typography sx={{ fontFamily: "Inter, sans-serif" }}>
                    Phone: {bookedByDetails.phone || "N/A"}
                  </Typography>
                  <Typography sx={{ fontFamily: "Inter, sans-serif" }}>
                    Email: {bookedByDetails.email || "N/A"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}

          {/* Child Information (if parent) */}
          {bookingData.userRole === "Parent" && bookingData.childName && (
            <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <Typography
                className="text-gray-600"
                sx={{ fontFamily: "Inter, sans-serif" }}
              >
                Child:
              </Typography>
              <Typography
                className="font-medium text-gray-800"
                sx={{ fontFamily: "Inter, sans-serif" }}
              >
                {bookingData.childName}{" "}
                {bookingData.childId ? `(${bookingData.childId})` : ""}
              </Typography>
            </Box>
          )}

          {/* Consultant Information */}
          {bookingData.consultantName && (
            <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <Typography
                className="text-gray-600"
                sx={{ fontFamily: "Inter, sans-serif" }}
              >
                Consultant:
              </Typography>
              <Box className="text-right">
                <Typography
                  className="font-medium text-gray-800"
                  sx={{ fontFamily: "Inter, sans-serif" }}
                >
                  {bookingData.consultantName} (
                  {bookingData.consultantType === "homeroom"
                    ? "Homeroom Teacher"
                    : "Counselor"}
                  )
                </Typography>
                {consultantDetails && (
                  <Box className="text-sm text-gray-600 mt-1">
                    <Typography sx={{ fontFamily: "Inter, sans-serif" }}>
                      Phone: {consultantDetails.phone || "N/A"}
                    </Typography>
                    <Typography sx={{ fontFamily: "Inter, sans-serif" }}>
                      Email: {consultantDetails.email || "N/A"}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}

          {/* Date & Time */}
          {bookingData.date && bookingData.time && (
            <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <Typography
                className="text-gray-600"
                sx={{ fontFamily: "Inter, sans-serif" }}
              >
                Date & Time:
              </Typography>
              <Typography
                className="font-medium text-gray-800"
                sx={{ fontFamily: "Inter, sans-serif" }}
              >
                {new Date(bookingData.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                at {bookingData.time}
              </Typography>
            </Box>
          )}

          {/* Appointment Type */}
          <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <Typography
              className="text-gray-600"
              sx={{ fontFamily: "Inter, sans-serif" }}
            >
              Meeting Type:
            </Typography>
            <Typography
              className="font-medium text-gray-800 capitalize"
              sx={{ fontFamily: "Inter, sans-serif" }}
            >
              {bookingData.appointmentType || "Not specified"}
            </Typography>
          </Box>
        </Box>
      </Box>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center"
      >
        <Typography
          sx={{
            fontFamily: "Inter, sans-serif",
            color: "#555",
            fontSize: "0.9rem",
            sm: { fontSize: "1rem" },
          }}
        >
          Please review your booking details above. Click "Confirm Booking" to
          finalize.
        </Typography>
      </motion.div>
    </motion.div>
  );
};

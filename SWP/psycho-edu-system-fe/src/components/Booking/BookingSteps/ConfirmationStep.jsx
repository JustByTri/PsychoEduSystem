import { useEffect, useState } from "react";
import { useBooking } from "../../../context/BookingContext";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { getAuthDataFromLocalStorage } from "../../../utils/auth";
import { toast } from "react-toastify";

export const ConfirmationStep = () => {
  const { bookingData } = useBooking();
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authData = getAuthDataFromLocalStorage();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://localhost:7192/api/User/profile?userId=${bookingData.userId}`,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.isSuccess && response.data.statusCode === 200) {
          setUserProfile(response.data.result);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch user profile"
          );
        }
      } catch (err) {
        setError(err.message);
        toast.error(`Failed to fetch user profile: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [bookingData.userId, authData.accessToken]);

  if (loading) return <CircularProgress sx={{ mx: "auto", mt: 4 }} />;
  if (error)
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 4 }}>
        {error}
      </Typography>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-6"
    >
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
        Booking Summary
      </Typography>
      <Card
        className="rounded-xl shadow-lg bg-green-50 border border-green-200 max-w-2xl mx-auto"
        sx={{ p: 3 }}
      >
        <CardContent>
          <Box className="space-y-4">
            <Box className="flex justify-between">
              <Typography
                sx={{ fontFamily: "Inter, sans-serif", color: "#666" }}
              >
                Booking Type:
              </Typography>
              <Typography
                sx={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
              >
                {bookingData.userRole === "Parent"
                  ? "Parent Booking"
                  : "Student Booking"}
              </Typography>
            </Box>
            {bookingData.userRole === "Parent" && bookingData.childName && (
              <Box className="flex justify-between">
                <Typography
                  sx={{ fontFamily: "Inter, sans-serif", color: "#666" }}
                >
                  Student:
                </Typography>
                <Typography
                  sx={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                >
                  {bookingData.childName}{" "}
                </Typography>
              </Box>
            )}
            {bookingData.consultantName && (
              <Box className="flex justify-between">
                <Typography
                  sx={{ fontFamily: "Inter, sans-serif", color: "#666" }}
                >
                  Consultant:
                </Typography>
                <Typography
                  sx={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                >
                  {bookingData.consultantName}
                </Typography>
              </Box>
            )}
            <Box className="flex justify-between">
              <Typography
                sx={{ fontFamily: "Inter, sans-serif", color: "#666" }}
              >
                Date & Time:
              </Typography>
              <Typography
                sx={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
              >
                {bookingData.date} at {bookingData.time}
              </Typography>
            </Box>
            <Box className="flex justify-between">
              <Typography
                sx={{ fontFamily: "Inter, sans-serif", color: "#666" }}
              >
                Meeting Type:
              </Typography>
              <Typography
                sx={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
              >
                {bookingData.appointmentType || "Not specified"}
              </Typography>
            </Box>
            {userProfile && (
              <Box className="pt-4 border-t">
                <Typography
                  sx={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    color: "#333",
                    mb: 2,
                  }}
                >
                  Contact Information
                </Typography>
                <Typography
                  sx={{ fontFamily: "Inter, sans-serif", color: "#666" }}
                >
                  Name: {userProfile.fullName}
                </Typography>
                <Typography
                  sx={{ fontFamily: "Inter, sans-serif", color: "#666" }}
                >
                  Phone: {userProfile.phone || "Not provided"}
                </Typography>
                <Typography
                  sx={{ fontFamily: "Inter, sans-serif", color: "#666" }}
                >
                  Email: {userProfile.email}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

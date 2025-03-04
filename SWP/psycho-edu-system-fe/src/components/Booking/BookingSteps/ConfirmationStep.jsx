import { useBooking } from "../../../context/BookingContext";
import { motion } from "framer-motion";
import { Box, Typography, Card, CardContent } from "@mui/material";

export const ConfirmationStep = () => {
  const { bookingData } = useBooking();

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
                  Child:
                </Typography>
                <Typography
                  sx={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                >
                  {bookingData.childName}
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
                Name: {bookingData.userName}
              </Typography>
              <Typography
                sx={{ fontFamily: "Inter, sans-serif", color: "#666" }}
              >
                Phone: {bookingData.phone || "Not provided"}
              </Typography>
              <Typography
                sx={{ fontFamily: "Inter, sans-serif", color: "#666" }}
              >
                Email: {bookingData.email}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

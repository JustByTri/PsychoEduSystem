import { useBooking } from "../../../context/BookingContext";
import { motion } from "framer-motion";
import { Box, Typography, TextField } from "@mui/material";

export const UserInfoForm = () => {
  const { bookingData, updateBookingData } = useBooking();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateBookingData({ [name]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-6"
    >
      <Box className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 max-w-2xl mx-auto">
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
          Your Contact Information
        </Typography>
        <Box className="space-y-6">
          <TextField
            label="Full Name"
            name="userName"
            value={bookingData.userName || ""}
            onChange={handleChange}
            fullWidth
            required
            sx={{
              "& .MuiInputBase-root": { fontFamily: "Inter, sans-serif" },
              "& .MuiInputLabel-root": {
                fontFamily: "Inter, sans-serif",
                color: "#666",
              },
            }}
            variant="outlined"
          />
          <TextField
            label="Phone Number"
            name="phone"
            value={bookingData.phone || ""}
            onChange={handleChange}
            fullWidth
            required
            sx={{
              "& .MuiInputBase-root": { fontFamily: "Inter, sans-serif" },
              "& .MuiInputLabel-root": {
                fontFamily: "Inter, sans-serif",
                color: "#666",
              },
            }}
            variant="outlined"
          />
          <TextField
            label="Email"
            name="email"
            value={bookingData.email || ""}
            onChange={handleChange}
            fullWidth
            required
            sx={{
              "& .MuiInputBase-root": { fontFamily: "Inter, sans-serif" },
              "& .MuiInputLabel-root": {
                fontFamily: "Inter, sans-serif",
                color: "#666",
              },
            }}
            variant="outlined"
          />
        </Box>
      </Box>
    </motion.div>
  );
};

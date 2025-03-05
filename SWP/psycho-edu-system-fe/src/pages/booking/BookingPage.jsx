import { useState, useEffect } from "react";
import { BookingProvider, useBooking } from "../../context/BookingContext";
import { ChildSelection } from "../../components/Booking/BookingSteps/ChildSelection";
import { ConsultantTypeSelection } from "../../components/Booking/BookingSteps/ConsultantTypeSelection";
import { ConsultantSelection } from "../../components/Booking/BookingSteps/ConsultantSelection";
import { DateTimeSelection } from "../../components/Booking/BookingSteps/DateTimeSelection";
import { ConfirmationStep } from "../../components/Booking/BookingSteps/ConfirmationStep";
import { ProgressBar } from "../../components/Booking/ProcessBar";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthDataFromLocalStorage } from "../../utils/auth";
import axios from "axios";
import { motion } from "framer-motion";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

const BookingPageContent = () => {
  const {
    isParent,
    bookingData,
    updateBookingData,
    resetBookingData,
    isLoading,
  } = useBooking();
  const [step, setStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(4);
  const [studentId, setStudentId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const authData = getAuthDataFromLocalStorage();

  useEffect(() => {
    let isMounted = true;

    const determineStudentId = async () => {
      if (!isMounted || isLoading) return;

      if (studentId) return;

      if (!isParent()) {
        if (isMounted) {
          setStudentId(bookingData.userId);
          updateBookingData({ appointmentFor: bookingData.userId });
        }
      } else {
        try {
          const response = await axios.get(
            `https://localhost:7192/api/relationships/parent/${bookingData.userId}`,
            {
              headers: {
                Authorization: `Bearer ${authData.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          const result = response.data.result || response.data;
          if (Array.isArray(result) && result.length > 0 && isMounted) {
            const firstChildId = result[0].studentId;
            setStudentId(firstChildId);
            updateBookingData({
              appointmentFor: firstChildId,
              childId: firstChildId,
              children: result,
            });
          }
        } catch (error) {
          toast.error("Failed to fetch children: " + error.message);
        }
      }
    };

    determineStudentId();

    return () => {
      isMounted = false;
    };
  }, [isParent, bookingData.userId, isLoading, updateBookingData]);

  useEffect(() => {
    setTotalSteps(isParent() ? 5 : 4);
  }, [isParent]);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleConfirm = async () => {
    if (
      !studentId ||
      !bookingData.consultantId ||
      !bookingData.date ||
      !bookingData.slotId
    ) {
      toast.error("Please complete all steps before confirming.");
      return;
    }

    setIsSubmitting(true);
    try {
      const appointmentData = {
        bookedBy: bookingData.userId,
        appointmentFor: studentId,
        meetingWith: bookingData.consultantId,
        date: bookingData.date,
        slotId: bookingData.slotId,
        isOnline: bookingData.appointmentType === "online",
      };

      const response = await axios.post(
        "https://localhost:7192/api/appointments",
        appointmentData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.accessToken}`,
          },
        }
      );

      if (!response.data.isSuccess || response.data.statusCode !== 200) {
        throw new Error(response.data.message || "Failed to save appointment");
      }

      toast.success("Booking registered successfully!");
      const schedulePath = isParent()
        ? "/parent/schedule"
        : "/student/schedule";
      setTimeout(() => {
        resetBookingData();
        navigate(schedulePath);
      }, 2000);
    } catch (error) {
      toast.error(`Failed to register appointment: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    if (isLoading) return <CircularProgress sx={{ mx: "auto", mt: 4 }} />;

    if (isParent()) {
      switch (step) {
        case 1:
          return <ChildSelection />;
        case 2:
          return <ConsultantTypeSelection />;
        case 3:
          return <ConsultantSelection />;
        case 4:
          return <DateTimeSelection />;
        case 5:
          return <ConfirmationStep />;
        default:
          return null;
      }
    }
    switch (step) {
      case 1:
        return <ConsultantTypeSelection />;
      case 2:
        return <ConsultantSelection />;
      case 3:
        return <DateTimeSelection />;
      case 4:
        return <ConfirmationStep />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 4, md: 6 }, // Responsive padding
        bgcolor: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        maxWidth: "100%", // Đảm bảo không vượt quá màn hình
        mx: "auto",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        sx={{ mb: { xs: 4, sm: 8 }, textAlign: "center" }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            background: "linear-gradient(to right, #1e88e5, #8e24aa)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" }, // Responsive font size
          }}
        >
          Book an Appointment
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: { xs: "0.9rem", sm: "1rem" },
            color: "#555",
            mt: 1,
          }}
        >
          Follow the steps below to schedule your consultation
        </Typography>
      </motion.div>

      {/* Progress Bar */}
      <ProgressBar currentStep={step} isParent={isParent()} setStep={setStep} />

      {/* Step Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ flex: 1, mt: { xs: 2, sm: 4 } }}
      >
        {renderStepContent()}
      </motion.div>

      {/* Navigation Buttons */}
      <Box
        sx={{
          mt: { xs: 4, sm: 8 },
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" }, // Column trên mobile, row trên desktop
          gap: { xs: 2, sm: 0 }, // Khoảng cách trên mobile
        }}
      >
        {step > 1 && (
          <Button
            onClick={handleBack}
            variant="outlined"
            sx={{
              fontFamily: "Inter, sans-serif",
              px: { xs: 3, sm: 4 },
              py: 1,
              textTransform: "none",
              width: { xs: "100%", sm: "auto" }, // Full width trên mobile
            }}
            disabled={isSubmitting}
          >
            Back
          </Button>
        )}
        {step < totalSteps ? (
          <Button
            onClick={handleNext}
            variant="contained"
            sx={{
              fontFamily: "Inter, sans-serif",
              px: { xs: 3, sm: 4 },
              py: 1,
              ml: { xs: 0, sm: "auto" },
              backgroundColor: "#1e88e5",
              "&:hover": { backgroundColor: "#1565c0" },
              textTransform: "none",
              width: { xs: "100%", sm: "auto" },
            }}
            disabled={isSubmitting}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleConfirm}
            variant="contained"
            sx={{
              fontFamily: "Inter, sans-serif",
              px: { xs: 3, sm: 4 },
              py: 1,
              ml: { xs: 0, sm: "auto" },
              backgroundColor: "#4caf50",
              "&:hover": { backgroundColor: "#388e3c" },
              textTransform: "none",
              width: { xs: "100%", sm: "auto" },
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Confirm Booking"
            )}
          </Button>
        )}
      </Box>

      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

const BookingPage = () => (
  <BookingProvider>
    <BookingPageContent />
  </BookingProvider>
);

export default BookingPage;

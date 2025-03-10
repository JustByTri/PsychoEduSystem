import { useState, useEffect } from "react";
import { BookingProvider, useBooking } from "../../context/BookingContext";
import { ChildSelection } from "../../components/Booking/BookingSteps/ChildSelection";
import { ConsultantTypeSelection } from "../../components/Booking/BookingSteps/ConsultantTypeSelection";
import { ConsultantSelection } from "../../components/Booking/BookingSteps/ConsultantSelection";
import { DateTimeSelection } from "../../components/Booking/BookingSteps/DateTimeSelection";
import { ConfirmationStep } from "../../components/Booking/BookingSteps/ConfirmationStep";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthDataFromLocalStorage } from "../../utils/auth";
import axios from "axios";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";

const BookingPageContent = () => {
  const { isParent, bookingData, updateBookingData, resetBookingData } =
    useBooking();
  const [step, setStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(5);
  const [studentId, setStudentId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // Thêm state để disable nút khi submitting
  const navigate = useNavigate();

  // Lấy authData một lần ngoài useEffect để tránh thay đổi tham chiếu
  const authData = getAuthDataFromLocalStorage();
  const userId = authData?.userId;

  // Xác định studentId dựa trên role (chỉ chạy khi mount hoặc role thay đổi)
  useEffect(() => {
    let isMounted = true;

    const determineStudentId = async () => {
      if (!isMounted) return;
      if (studentId) return;

      if (!isParent()) {
        // Role Student: Lấy studentId từ accessToken (userId)
        if (isMounted) {
          setStudentId(userId);
          updateBookingData({ appointmentFor: userId });
        }
      } else {
        // Role Parent: Lấy studentId từ bookingData.childId hoặc fetch nếu chưa có
        if (bookingData.childId && isMounted) {
          setStudentId(bookingData.childId);
          updateBookingData({ appointmentFor: bookingData.childId });
        } else {
          try {
            const response = await axios.get(
              `https://localhost:7192/api/relationships/parent/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${authData.accessToken}`,
                  "Content-Type": "application/json",
                },
              }
            );
            console.log("API Response for children:", response.data);
            const result = response.data.result || response.data;
            if (Array.isArray(result) && result.length > 0 && isMounted) {
              const firstChildId = result[0].studentId;
              setStudentId(firstChildId);
              updateBookingData({
                appointmentFor: firstChildId,
                childId: firstChildId,
              });
            } else if (isMounted) {
              console.warn("No children found for this parent.");
            }
          } catch (error) {
            console.error("Error fetching children:", error.message);
          }
        }
      }
    };

    determineStudentId();

    // Cleanup
    return () => {
      isMounted = false;
    };
  }, [isParent, userId]);

  useEffect(() => {
    // Cập nhật totalSteps dựa trên role
    setTotalSteps(isParent() ? 5 : 4);
  }, [isParent]);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleNextWithValidation = () => {
    const userInfoStep = isParent() ? 5 : 4; // Bước UserInfoForm
    if (step === userInfoStep) {
      if (!bookingData.userName || !bookingData.phone || !bookingData.email) {
        console.log("Missing fields:", {
          userName: bookingData.userName,
          phone: bookingData.phone,
          email: bookingData.email,
        });
        toast.error("Please fill in all required fields!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
    }
    handleNext();
  };

  const handleConfirm = async () => {
    if (
      !studentId ||
      !bookingData.consultantId ||
      !bookingData.date ||
      !bookingData.slotId
    ) {
      toast.error("Please complete all steps before confirming.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsSubmitting(true); // Disable nút khi bắt đầu submit
    try {
      const authData = getAuthDataFromLocalStorage();
      const appointmentData = {
        bookedBy: userId,
        appointmentFor: studentId,
        meetingWith: bookingData.consultantId,
        date: bookingData.date,
        slotId: bookingData.slotId,
        isOnline: bookingData.appointmentType === "online",
      };

      console.log("Submitting appointment data:", appointmentData);

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

      console.log("Appointment saved successfully:", response.data);

      toast.success("Booking registered successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      const schedulePath = isParent()
        ? "/parent/schedule"
        : "/student/schedule";
      setTimeout(() => {
        resetBookingData();
        navigate(schedulePath);
      }, 3000);
    } catch (error) {
      console.error("Error confirming appointment:", error);
      toast.error(
        `Failed to register appointment: ${
          error.response?.data?.message || error.message
        }`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } finally {
      setIsSubmitting(false); // Enable lại nút sau khi hoàn tất
    }
  };

  const renderStepContent = () => {
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
        width: "960px",
        mx: "auto",
        p: { xs: 1, sm: 2, md: 3 },
        bgcolor: "white",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        position: "relative",
        pb: { xs: 14, sm: 10, md: 8 },
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        sx={{ mb: { xs: 2, sm: 3, md: 4 }, textAlign: "center" }}
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            background: "linear-gradient(to right, #1e88e5, #8e24aa)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            fontSize: { xs: "1.25rem", sm: "1.75rem", md: "2rem" },
            lineHeight: 1.2,
          }}
        >
          Book an Appointment
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: { xs: "0.75rem", sm: "0.85rem", md: "0.9rem" },
            color: "#555",
            mt: 1,
            px: { xs: 1, sm: 0 },
          }}
        >
          Follow the steps below to schedule your consultation
        </Typography>
      </motion.div>

      {renderStepContent()}

      {/* Fixed Navigation Buttons */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: "white",
          boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
          p: { xs: 1, sm: 2, md: 2 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 1.5, sm: 2 },
          zIndex: 1000,
          width: "960px",
          mx: "auto",
        }}
      >
        {step > 1 && (
          <Button
            onClick={handleBack}
            variant="outlined"
            sx={{
              fontFamily: "Inter, sans-serif",
              px: { xs: 2, sm: 3 },
              py: 0.75,
              textTransform: "none",
              width: { xs: "100%", sm: "auto" },
              fontSize: { xs: "0.75rem", sm: "0.85rem" },
              borderColor: "#1e88e5",
              color: "#1e88e5",
              "&:hover": {
                borderColor: "#1565c0",
                color: "#1565c0",
              },
            }}
            disabled={isSubmitting}
          >
            Back
          </Button>
        )}
        {step < totalSteps ? (
          <Button
            onClick={handleNextWithValidation}
            variant="contained"
            sx={{
              fontFamily: "Inter, sans-serif",
              px: { xs: 2, sm: 3 },
              py: 0.75,
              ml: { xs: 0, sm: "auto" },
              backgroundColor: "#1e88e5",
              "&:hover": { backgroundColor: "#1565c0" },
              textTransform: "none",
              width: { xs: "100%", sm: "auto" },
              fontSize: { xs: "0.75rem", sm: "0.85rem" },
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
              px: { xs: 2, sm: 3 },
              py: 0.75,
              ml: { xs: 0, sm: "auto" },
              backgroundColor: "#4caf50",
              "&:hover": { backgroundColor: "#388e3c" },
              textTransform: "none",
              width: { xs: "100%", sm: "auto" },
              fontSize: { xs: "0.75rem", sm: "0.85rem" },
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Confirm Booking"
            )}
          </Button>
        )}
      </Box>

      <ToastContainer />
    </Box>
  );
};

const BookingPage = () => {
  return (
    <BookingProvider>
      <BookingPageContent />
    </BookingProvider>
  );
};

export default BookingPage;

import { useState, useEffect } from "react";
import { BookingProvider, useBooking } from "../../context/BookingContext";
import { ChildSelection } from "../../components/Booking/BookingSteps/ChildSelection";
import { ConsultantTypeSelection } from "../../components/Booking/BookingSteps/ConsultantTypeSelection";
import { ConsultantSelection } from "../../components/Booking/BookingSteps/ConsultantSelection";
import { DateTimeSelection } from "../../components/Booking/BookingSteps/DateTimeSelection";
import { ConfirmationStep } from "../../components/Booking/BookingSteps/ConfirmationStep";
import { UserInfoForm } from "../../components/Booking/BookingSteps/UserInfoForm";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthDataFromLocalStorage } from "../../utils/auth";
import axios from "axios";
import { motion } from "framer-motion"; // Thêm framer-motion để áp dụng hiệu ứng
import { Box, Typography, Button } from "@mui/material"; // Thêm MUI components

const BookingPageContent = () => {
  const { isParent, bookingData, updateBookingData, resetBookingData } =
    useBooking();
  const [step, setStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(5);
  const [studentId, setStudentId] = useState(null);
  const navigate = useNavigate();

  const authData = getAuthDataFromLocalStorage();
  const userId = authData?.userId;

  useEffect(() => {
    let isMounted = true;

    const determineStudentId = async () => {
      if (!isMounted) return;

      if (studentId) return;

      if (!isParent()) {
        if (isMounted) {
          setStudentId(userId);
          updateBookingData({ appointmentFor: userId });
        }
      } else {
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
            const result = response.data.result || response.data;
            if (Array.isArray(result) && result.length > 0 && isMounted) {
              const firstChildId = result[0].studentId;
              setStudentId(firstChildId);
              updateBookingData({
                appointmentFor: firstChildId,
                childId: firstChildId,
              });
            }
          } catch (error) {
            console.error("Error fetching children:", error.message);
          }
        }
      }
    };

    determineStudentId();

    return () => {
      isMounted = false;
    };
  }, [isParent, userId]);

  useEffect(() => {
    setTotalSteps(isParent() ? 6 : 5);
  }, [isParent]);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleNextWithValidation = () => {
    const userInfoStep = isParent() ? 5 : 4;
    if (step === userInfoStep) {
      if (!bookingData.userName || !bookingData.phone || !bookingData.email) {
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
          return <UserInfoForm />;
        case 6:
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
        return <UserInfoForm />;
      case 5:
        return <ConfirmationStep />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 bg-white min-h-screen text-gray-900 flex flex-col max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-8 text-center"
      >
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 700,
            background: "linear-gradient(to right, #1e88e5, #8e24aa)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          Book an Appointment
        </Typography>
        <Typography
          variant="body1"
          sx={{
            fontFamily: "Inter, sans-serif",
            fontSize: "1rem",
            color: "#555",
            mt: 1,
          }}
        >
          Follow the steps below to schedule your consultation
        </Typography>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="mb-8 bg-gray-200 rounded-full overflow-hidden"
      >
        <div
          className="h-2 bg-blue-500 transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </motion.div>

      {/* Step Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {renderStepContent()}
      </motion.div>

      {/* Navigation Buttons */}
      <Box className="mt-8 flex justify-between">
        {step > 1 && (
          <Button
            onClick={handleBack}
            variant="outlined"
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.95rem",
              color: "#555",
              borderColor: "#555",
              "&:hover": { backgroundColor: "#f5f5f5", borderColor: "#333" },
              textTransform: "none",
              px: 4,
              py: 1,
            }}
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
              fontSize: "0.95rem",
              backgroundColor: "#1e88e5",
              "&:hover": { backgroundColor: "#1565c0" },
              textTransform: "none",
              px: 4,
              py: 1,
              ml: "auto",
            }}
          >
            Next
          </Button>
        ) : (
          <Button
            onClick={handleConfirm}
            variant="contained"
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.95rem",
              backgroundColor: "#4caf50",
              "&:hover": { backgroundColor: "#388e3c" },
              textTransform: "none",
              px: 4,
              py: 1,
              ml: "auto",
            }}
          >
            Confirm Booking
          </Button>
        )}
      </Box>

      <ToastContainer />
    </div>
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

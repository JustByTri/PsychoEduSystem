import { useState, useEffect, useCallback } from "react";
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
import { CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import apiService from "../../services/apiService";
const BookingPageContent = () => {
  const { isParent, bookingData, updateBookingData, resetBookingData } =
    useBooking();
  const [step, setStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(5);
  const [studentId, setStudentId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const authData = getAuthDataFromLocalStorage();
  const userId = authData?.userId;

  const determineStudentId = useCallback(async () => {
    if (studentId) return;

    setIsLoading(true);
    setError(null);

    try {
      if (!isParent()) {
        setStudentId(userId);
        updateBookingData({ appointmentFor: userId });
      } else if (bookingData.childId) {
        setStudentId(bookingData.childId);
        updateBookingData({ appointmentFor: bookingData.childId });
      } else {
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
        if (Array.isArray(result) && result.length > 0) {
          const firstChildId = result[0].studentId;
          setStudentId(firstChildId);
          updateBookingData({
            appointmentFor: firstChildId,
            childId: firstChildId,
          });
        } else {
          setError("No children found for this parent.");
        }
      }
    } catch (error) {
      setError("Failed to determine student ID: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [
    isParent,
    userId,
    bookingData.childId,
    authData.accessToken,
    updateBookingData,
  ]);

  useEffect(() => {
    determineStudentId();
  }, [determineStudentId]);

  useEffect(() => {
    setTotalSteps(isParent() ? 5 : 4);
  }, [isParent]);

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleNextWithValidation = () => {
    const userInfoStep = isParent() ? 5 : 4;
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
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

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

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(bookingData.date);
    if (selectedDate < today) {
      toast.error("Meeting date must be in the future.");
      return;
    }

    setIsSubmitting(true);
    try {
      const appointmentData = {
        bookedBy: userId,
        appointmentFor: studentId,
        meetingWith: bookingData.consultantId,
        date: bookingData.date, // "YYYY-MM-DD" từ DateTimeSelection
        slotId: bookingData.slotId,
        isOnline: bookingData.appointmentType === "Online",
      };

      const response = await apiService.bookAppointment(appointmentData);

      if (!response.isSuccess) {
        throw new Error(response.message || "Failed to save appointment");
      }

      toast.success("Booking registered successfully!");
      setTimeout(() => {
        resetBookingData();
        navigate(isParent() ? "/parent/schedule" : "/student/schedule");
      }, 3000);
    } catch (error) {
      const errorMessage = error.message || "Failed to register appointment";
      setError(`Failed to register appointment: ${errorMessage}`);
      if (errorMessage.includes("Meeting date not valid")) {
        toast.error(
          "The selected date is not valid. Please choose a different date or check available slots."
        );
      } else {
        toast.error(`Failed to register appointment: ${errorMessage}`);
      }
    } finally {
      setIsSubmitting(false);
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

  if (isLoading) {
    return <div className="text-center">Loading student data...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="w-[960px] mx-auto p-2 sm:p-4 md:p-6 bg-white min-h-screen flex flex-col overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-4 sm:mb-6 md:mb-8 text-center"
      >
        <div className="flex justify-center items-center w-full px-4 sm:px-6 md:px-8">
          <h1
            className="font-inter font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 
            text-[1.25rem] sm:text-[1.5rem] md:text-[1.75rem] lg:text-[2rem] leading-tight 
            antialiased break-words transition-all duration-300 ease-in-out"
          >
            Book an Appointment
          </h1>
        </div>
        <p
          className="font-inter text-gray-600 mt-2 sm:mt-3 md:mt-4 px-2 sm:px-4 md:px-6 lg:px-0 
          text-[clamp(0.65rem,2.5vw,0.75rem)] sm:text-[clamp(0.75rem,3vw,0.875rem)] 
          md:text-[clamp(0.85rem,3.5vw,1rem)] lg:text-[clamp(0.9rem,4vw,1.125rem)] 
          leading-relaxed break-words transition-all duration-300 ease-in-out"
        >
          Follow the steps below to schedule your consultation
        </p>
      </motion.div>

      <div className="">{renderStepContent()}</div>

      <div className="bg-white p-2 sm:p-4 md:p-6 flex justify-between items-center w-full">
        <button
          onClick={handleBack}
          disabled={step === 1 || isSubmitting}
          className={`font-inter px-4 sm:px-6 py-2 
          text-[clamp(0.65rem,2.5vw,0.75rem)] sm:text-[clamp(0.75rem,3vw,0.875rem)] 
          md:text-[clamp(0.85rem,3.5vw,1rem)] border border-blue-600 text-blue-600 rounded 
          hover:border-blue-800 hover:text-blue-800 transition-colors duration-300 
          ${step > 1 ? "visible" : "invisible"} ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Back
        </button>
        <button
          onClick={step < totalSteps ? handleNextWithValidation : handleConfirm}
          disabled={isSubmitting}
          className={`font-inter px-4 sm:px-6 py-2 
          text-[clamp(0.65rem,2.5vw,0.75rem)] sm:text-[clamp(0.75rem,3vw,0.875rem)] 
          md:text-[clamp(0.85rem,3.5vw,1rem)] rounded text-white 
          ${
            step < totalSteps
              ? "bg-blue-600 hover:bg-blue-800"
              : "bg-green-600 hover:bg-green-800"
          } 
          transition-all duration-300 ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isSubmitting ? (
            <CircularProgress size={20} color="inherit" />
          ) : step < totalSteps ? (
            "Next"
          ) : (
            "Confirm Booking"
          )}
        </button>
      </div>

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

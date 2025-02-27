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
import { getAuthDataFromLocalStorage } from "../../utils/auth"; // Đảm bảo import
import axios from "axios"; // Thêm axios

const BookingPageContent = () => {
  const { isParent, bookingData, resetBookingData } = useBooking();
  const [step, setStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (isParent()) {
      setTotalSteps(6); // Parent: ChildSelection → ConsultantType → ConsultantSelection → DateTimeSelection → UserInfoForm → ConfirmationStep
    } else {
      setTotalSteps(5); // Student: ConsultantType → ConsultantSelection → DateTimeSelection → UserInfoForm → ConfirmationStep
    }
  }, [isParent, bookingData]);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleNextWithValidation = () => {
    const userInfoStep = isParent() ? 5 : 4; // Bước UserInfoForm (cập nhật do thêm ConsultantSelection)
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
    try {
      const authData = getAuthDataFromLocalStorage();
      const appointmentData = {
        bookedBy: bookingData.userId, // ID của người đặt lịch (Parent hoặc Student)
        appointmentFor: isParent() ? bookingData.childId : bookingData.userId, // ID của student
        meetingWith: bookingData.consultantId, // ID của teacher hoặc counselor
        date: bookingData.date, // Ngày từ bookingData
        slotId: bookingData.slotId || 0, // Slot ID từ bookingData
        isOnline: bookingData.appointmentType === "online", // Dựa trên appointmentType
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

      // Điều hướng đến trang schedule dựa trên role
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-blue-500 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {renderStepContent()}

        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
          )}

          {step < totalSteps ? (
            <button
              onClick={handleNextWithValidation}
              className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              className="ml-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Confirm Booking
            </button>
          )}
        </div>
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

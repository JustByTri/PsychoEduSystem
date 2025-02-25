import { useState, useEffect } from "react";
import { BookingProvider, useBooking } from "../../context/BookingContext";
import { ChildSelection } from "../../components/Booking/BookingSteps/ChildSelection";
import { ConsultantTypeSelection } from "../../components/Booking/BookingSteps/ConsultantTypeSelection";
import { ConsultantSelection } from "../../components/Booking/BookingSteps/ConsultantSelection";
import { DateTimeSelection } from "../../components/Booking/BookingSteps/DataTimeSelection";
import { ConfirmationStep } from "../../components/Booking/BookingSteps/ConfirmationStep";
import { UserInfoForm } from "../../components/Booking/BookingSteps/UserInfoForm";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingPageContent = () => {
  const { isParent, bookingData, resetBookingData } = useBooking();
  const [step, setStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    if (isParent()) {
      setTotalSteps(6);
    } else {
      setTotalSteps(5);
    }
  }, [isParent]);

  const handleNext = () => {
    if (
      bookingData.consultantType === "homeroom" &&
      step === (isParent() ? 2 : 1)
    ) {
      setStep(step + 2);
    } else {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (
      bookingData.consultantType === "homeroom" &&
      step === (isParent() ? 4 : 3)
    ) {
      setStep(step - 2);
    } else {
      setStep(step - 1);
    }
  };

  const handleNextWithValidation = () => {
    // Kiểm tra validation ở bước UserInfoForm
    const userInfoStep = isParent() ? 5 : 4; // Bước UserInfoForm
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
    try {
      // // Gửi dữ liệu booking đến backend
      //  const response = await fetch("/api/bookings", {
      //    method: "POST",
      //    headers: {
      //      "Content-Type": "application/json",
      //    },
      //    body: JSON.stringify(bookingData),
      //  });

      //  if (!response.ok) {
      //    throw new Error("Failed to save booking");
      //  }

      //  // Đọc phản hồi từ backend (nếu cần)
      //  const result = await response.json();
      //  console.log("Booking saved successfully:", result);

      // Hiển thị thông báo thành công
      toast.success("Booking registered successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset và chuyển hướng sau 3 giây
      setTimeout(() => {
        resetBookingData();
        navigate("/student/schedule");
      }, 3000);
    } catch (error) {
      console.error("Error confirming booking:", error);
      toast.error("Failed to register booking. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
          return bookingData.consultantType === "counselor" ? (
            <ConsultantSelection />
          ) : (
            <DateTimeSelection />
          );
        case 4:
          return bookingData.consultantType === "counselor" ? (
            <DateTimeSelection />
          ) : (
            <UserInfoForm />
          );
        case 5:
          return bookingData.consultantType === "counselor" ? (
            <UserInfoForm />
          ) : (
            <ConfirmationStep />
          );
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
        return bookingData.consultantType === "counselor" ? (
          <ConsultantSelection />
        ) : (
          <DateTimeSelection />
        );
      case 3:
        return bookingData.consultantType === "counselor" ? (
          <DateTimeSelection />
        ) : (
          <UserInfoForm />
        );
      case 4:
        return bookingData.consultantType === "counselor" ? (
          <UserInfoForm />
        ) : (
          <ConfirmationStep />
        );
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

import { useState } from "react";
import { BookingProvider, useBooking } from "../../context/BookingContext";
import { toast, ToastContainer } from "react-toastify";
import { FaArrowRight, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { validateStep } from "../../utils/validation";
import { RoleSelection } from "../../components/Booking/BookingSteps/RoleSelection";
import { DateTimeSelection } from "../../components/Booking/BookingSteps/DataTimeSelection";
import { ConsultantSelection } from "../../components/Booking/BookingSteps/ConsultantSelection";
import { UserInfoForm } from "../../components/Booking/BookingSteps/UserInfoForm";
import { ConfirmationStep } from "../../components/Booking/BookingSteps/ConfirmationStep";
import { ProgressBar } from "../../components/Booking/ProcessBar";

const BookingPageContent = () => {
  const [step, setStep] = useState(1);
  const bookingData = useBooking(); // Get all booking data from context

  const handleNext = () => {
    const validationResult = validateStep(step, bookingData);
    if (validationResult === true) {
      setStep((prev) => prev + 1);
    } else {
      toast.error(validationResult);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleConfirm = async () => {
    try {
      // Call API to create booking
      toast.success("Booking confirmed successfully!");
    } catch (error) {
      toast.error("Failed to confirm booking");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <ProgressBar currentStep={step} />

        {step === 1 && <RoleSelection />}
        {step === 2 && <DateTimeSelection />}
        {step === 3 && <ConsultantSelection />}
        {step === 4 && <UserInfoForm />}
        {step === 5 && <ConfirmationStep />}

        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 
                        rounded-lg hover:bg-gray-300 transition-colors"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>
          )}

          {step < 5 ? (
            <button
              onClick={handleNext}
              className="ml-auto flex items-center px-4 py-2 bg-blue-600 
                        text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next <FaArrowRight className="ml-2" />
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              className="ml-auto flex items-center px-4 py-2 bg-green-600 
                        text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Confirm Booking <FaCheckCircle className="ml-2" />
            </button>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right" />
    </div>
  );
};

// Wrapper component that provides context
const BookingPage = () => {
  return (
    <BookingProvider>
      <BookingPageContent />
    </BookingProvider>
  );
};

export default BookingPage;

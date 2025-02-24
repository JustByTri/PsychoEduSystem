import { useState, useEffect } from "react";
import { BookingProvider, useBooking } from "../../context/BookingContext";
import { ChildSelection } from "../../components/Booking/BookingSteps/ChildSelection";
import { ConsultantTypeSelection } from "../../components/Booking/BookingSteps/ConsultantTypeSelection";
import { ConsultantSelection } from "../../components/Booking/BookingSteps/ConsultantSelection";
import { DateTimeSelection } from "../../components/Booking/BookingSteps/DataTimeSelection";
import { ConfirmationStep } from "../../components/Booking/BookingSteps/ConfirmationStep";

const BookingPageContent = () => {
  const { isParent, bookingData } = useBooking();
  const [step, setStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(4);

  useEffect(() => {
    // Set total steps based on user role
    if (isParent()) {
      setTotalSteps(5); // Extra step for child selection
    } else {
      setTotalSteps(4);
    }
  }, [isParent]);

  const handleNext = () => {
    // Skip consultant selection if homeroom teacher is selected
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

  const renderStepContent = () => {
    // For Parent role
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
            <ConfirmationStep />
          );
        case 5:
          return <ConfirmationStep />;
        default:
          return null;
      }
    }

    // For Student role
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
          <ConfirmationStep />
        );
      case 4:
        return <ConfirmationStep />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-blue-500 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step content */}
        {renderStepContent()}

        {/* Navigation buttons */}
        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
          )}

          {step < totalSteps && (
            <button
              onClick={handleNext}
              className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
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

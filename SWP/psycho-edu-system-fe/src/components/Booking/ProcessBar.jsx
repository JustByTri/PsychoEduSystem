import { FaCheckCircle } from "react-icons/fa";

export const ProgressBar = ({ currentStep }) => {
  const steps = [
    "Select Role",
    "Select Date & Time",
    "Select Consultant",
    "Your Info",
    "Confirm",
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                index + 1 <= currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index + 1 < currentStep ? <FaCheckCircle /> : index + 1}
            </div>
            <span className="mt-2 text-sm text-gray-600">{step}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 relative">
        <div className="absolute top-0 h-1 bg-gray-200 w-full">
          <div
            className="absolute h-1 bg-blue-600 transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

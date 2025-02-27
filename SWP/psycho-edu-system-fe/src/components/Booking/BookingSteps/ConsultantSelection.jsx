import { useState } from "react";
import { useBooking } from "../../../context/BookingContext";
import { useConsultant } from "../../../hooks/useConsultant";

export const ConsultantSelection = () => {
  const { bookingData, updateBookingData } = useBooking();
  const { consultants, loading, error } = useConsultant(
    bookingData.userRole === "Parent" ? "teacher" : null
  );
  const [children, setChildren] = useState([
    { id: 1, name: "An", age: 8 },
    { id: 2, name: "Minh", age: 10 },
  ]);

  if (loading) return <div>Loading consultants...</div>;
  if (error) return <div>Error loading consultants: {error}</div>;
  if (!Array.isArray(consultants)) {
    console.error("Consultants is not an array:", consultants);
    return <div>No consultants available</div>;
  }

  const handleSelectChild = (child) => {
    updateBookingData({
      childId: child.id,
      childName: child.name,
    });
    console.log("Updated bookingData for child:", { childId: child.id });
  };

  const handleSelectConsultant = (consultant) => {
    updateBookingData({
      consultantId: consultant.id,
      consultantName: consultant.name,
    });
  };
  console.log("Updated bookingData for consultant:", {
    consultantId: consultant.id,
  });

  return (
    <div className="space-y-6">
      {bookingData.userRole === "Parent" && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Select Child</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {children.map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                isSelected={bookingData.childId === child.id}
                onSelect={() => handleSelectChild(child)}
              />
            ))}
          </div>
        </div>
      )}

      <h3 className="text-lg font-medium mb-4">Select Consultant</h3>
      <div className="space-y-4">
        {consultants.map((consultant) => (
          <ConsultantCard
            key={consultant.id}
            consultant={consultant}
            isSelected={bookingData.consultantId === consultant.id} // So sánh trực tiếp
            onSelect={() => handleSelectConsultant(consultant)}
          />
        ))}
      </div>
    </div>
  );
};

const ChildCard = ({ child, isSelected, onSelect }) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    onSelect();
    setTimeout(() => setIsClicked(false), 200);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-4 rounded-lg border w-full transition-all duration-200 
        ${
          isSelected
            ? "border-blue-600 border-2 bg-blue-100 shadow-md hover:border-blue-700 hover:bg-blue-200"
            : "border-gray-200 hover:border-blue-400 hover:shadow-md hover:bg-blue-50"
        }
        ${isClicked ? "scale-95" : "scale-100"}`}
    >
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mb-2 transition-transform duration-200">
          <img
            src="/api/placeholder/64/64"
            alt={child.name}
            className={`w-full h-full object-cover transition-transform duration-200 
              ${isClicked ? "scale-110" : "scale-100"}`}
          />
        </div>
        <h4
          className={`font-medium transition-colors duration-200 ${
            isSelected ? "text-blue-700" : "hover:text-blue-600"
          }`}
        >
          {child.name}
        </h4>
        <p className="text-sm text-gray-600">{child.age} years old</p>
      </div>
    </button>
  );
};

const ConsultantCard = ({ consultant, isSelected, onSelect }) => {
  if (!consultant) return null;

  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    onSelect();
    console.log("Consultant clicked:", consultant, "isSelected:", isSelected);
    setTimeout(() => setIsClicked(false), 200);
  };

  return (
    <button
      onClick={handleClick}
      className={`p-4 rounded-lg border w-full transition-all duration-200
        ${
          isSelected
            ? "bg-blue-600 text-white border-blue-600 shadow-lg"
            : "border-gray-200 hover:bg-blue-50 hover:border-blue-200"
        }
        ${isClicked ? "scale-95" : "scale-100"}`}
    >
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden transition-transform duration-200">
          <img
            src={consultant.image || "/api/placeholder/48/48"}
            alt={consultant.name || "Consultant"}
            className={`w-full h-full object-cover transition-transform duration-200 
              ${isClicked ? "scale-110" : "scale-100"}`}
          />
        </div>
        <div className="ml-3 text-left">
          <h4
            className={`font-medium ${
              isSelected ? "text-white" : "text-gray-900 hover:text-blue-600"
            }`}
          >
            {consultant.name || "Unknown Consultant"}
          </h4>
          <p
            className={`text-sm ${isSelected ? "text-white" : "text-gray-600"}`}
          >
            {consultant.role || "Consultant"}
          </p>
        </div>
        {isSelected && (
          <div className="ml-auto">
            <div
              className={`w-6 h-6 rounded-full bg-white flex items-center justify-center transition-transform duration-200
              ${isClicked ? "scale-125" : "scale-100"}`}
            >
              <svg
                className="w-4 h-4 text-blue-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </button>
  );
};

import { useState } from "react";
import { useBooking } from "../../../context/BookingContext";
import { useConsultant } from "../../../hooks/useConsultant";

export const ConsultantSelection = () => {
  const { role, setSelectedConsultant, selectedChild, setSelectedChild } =
    useBooking();
  const { consultants, loading, error } = useConsultant(
    role === "parent" ? "teacher" : null
  );
  const [children, setChildren] = useState([
    { id: 1, name: "An", age: 8 },
    { id: 2, name: "Minh", age: 10 },
  ]);

  if (loading) return <div>Loading consultants...</div>;
  if (error) return <div>Error loading consultants: {error}</div>;

  // Add safety check for consultants
  if (!Array.isArray(consultants)) {
    console.error("Consultants is not an array:", consultants);
    return <div>No consultants available</div>;
  }

  return (
    <div className="space-y-6">
      {role === "parent" && (
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">Select Child</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {children.map((child) => (
              <ChildCard
                key={child.id}
                child={child}
                isSelected={selectedChild?.id === child.id}
                onSelect={() => setSelectedChild(child)}
              />
            ))}
          </div>
        </div>
      )}

      <h3 className="text-lg font-medium mb-4">
        {role === "parent" ? "Select Consultant" : "Select Consultant"}
      </h3>
      <div className="space-y-4">
        {consultants.map((consultant) => (
          <ConsultantCard
            key={consultant.id}
            consultant={consultant}
            onSelect={() => setSelectedConsultant(consultant)}
          />
        ))}
      </div>
    </div>
  );
};

const ChildCard = ({ child, isSelected, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      className={`p-4 rounded-lg border w-full transition-all duration-200 
        ${
          isSelected
            ? "border-blue-600 bg-blue-50"
            : "border-gray-200 hover:border-blue-400 hover:shadow-md"
        }`}
    >
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden mb-2">
          <img
            src="/api/placeholder/64/64"
            alt={child.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h4 className="font-medium">{child.name}</h4>
        <p className="text-sm text-gray-600">{child.age} years old</p>
      </div>
    </button>
  );
};

const ConsultantCard = ({ consultant, onSelect }) => {
  if (!consultant) return null;

  return (
    <button
      onClick={() => onSelect?.(consultant)}
      className="p-4 rounded-lg border w-full border-gray-200 hover:border-blue-600 hover:shadow-md hover:bg-blue-50 transition-all duration-200"
    >
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
          <img
            src="/api/placeholder/48/48"
            alt={consultant.name || "Consultant"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="ml-3 text-left">
          <h4 className="font-medium">
            {consultant.name || "Unknown Consultant"}
          </h4>
          <p className="text-sm text-gray-600">
            {consultant.role || "Consultant"}
          </p>
        </div>
      </div>
    </button>
  );
};

import { useBooking } from "../../../context/BookingContext";
import { useConsultant } from "../../../hooks/useConsultant";
// import { ConsultantCard } from "../ConsultantCard";

export const ConsultantSelection = () => {
  const { role, setSelectedConsultant } = useBooking();
  const { consultants, loading, error } = useConsultant(
    role === "parent" ? "teacher" : null
  );

  if (loading) return <div>Loading consultants...</div>;
  if (error) return <div>Error loading consultants: {error}</div>;

  // Add safety check for consultants
  if (!Array.isArray(consultants)) {
    console.error("Consultants is not an array:", consultants);
    return <div>No consultants available</div>;
  }

  return (
    <div className="space-y-6">
      {consultants.map((consultant) => (
        <ConsultantCard
          key={consultant.id}
          consultant={consultant}
          onSelect={() => setSelectedConsultant(consultant)}
        />
      ))}
    </div>
  );
};

const ConsultantCard = ({ consultant, onSelect }) => {
  if (!consultant) return null;

  return (
    <button
      onClick={() => onSelect?.(consultant)}
      className="p-4 rounded-lg border w-full border-gray-200 hover:border-blue-600 transition-colors"
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

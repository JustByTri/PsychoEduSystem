import { FaUserTie, FaChild } from "react-icons/fa";
import { useBooking } from "../../../context/BookingContext";

export const RoleSelection = () => {
  const { role, setRole } = useBooking();

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-6">I am a...</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button
          onClick={() => setRole("student")}
          className={`p-6 rounded-lg border ${
            role === "student"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200"
          } hover:border-blue-600 transition-colors`}
        >
          <div className="flex flex-col items-center text-center">
            <FaUserTie className="text-4xl mb-4 text-blue-600" />
            <h3 className="font-semibold text-lg">Student</h3>
            <p className="text-sm text-gray-600 mt-2">
              Book a session with a counselor or your teacher
            </p>
          </div>
        </button>
        <button
          onClick={() => setRole("parent")}
          className={`p-6 rounded-lg border ${
            role === "parent" ? "border-blue-600 bg-blue-50" : "border-gray-200"
          } hover:border-blue-600 transition-colors`}
        >
          <div className="flex flex-col items-center text-center">
            <FaChild className="text-4xl mb-4 text-blue-600" />
            <h3 className="font-semibold text-lg">Parent</h3>
            <p className="text-sm text-gray-600 mt-2">
              Book a session for your child
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

// components/Booking/ConsultantTypeSelection.jsx
import { useState, useEffect } from "react";
import { useBooking } from "../../../context/BookingContext";
import { getAuthDataFromLocalStorage } from "../../../utils/auth";

export const ConsultantTypeSelection = () => {
  const { bookingData, updateBookingData } = useBooking();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConsultantTypeSelect = async (type) => {
    try {
      setLoading(true);
      setError(null);

      if (type === "homeroom") {
        // Determine which student ID to use
        const studentId =
          bookingData.userRole === "Parent"
            ? bookingData.childId
            : bookingData.userId;

        //Them api de lay classId của student

        // Fetch homeroom teacher for the student
        const response = await fetch(
          `https://localhost:7192/api/teachers/${classId}/students`,
          {
            headers: {
              Authorization: `Bearer ${
                getAuthDataFromLocalStorage().accessToken
              }`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch homeroom teacher");
        }
        const data = await response.json();
        const teacher = {
          id: data.teacherId || "default-id",
          name: data.teacherName || "Your Homeroom Teacher",
          // Các thông tin khác nếu cần
        };
        // Update booking data with homeroom teacher info
        updateBookingData({
          consultantType: type,
          consultantId: teacher.id,
          consultantName: teacher.name,
          isHomeroomTeacher: true,
        });
      } else {
        // For counselor type, just update the type
        updateBookingData({
          consultantType: type,
          consultantId: "",
          consultantName: "",
          isHomeroomTeacher: false,
        });
      }
    } catch (err) {
      setError(err.message);
      // Reset consultant type on error
      updateBookingData({
        consultantType: "",
        consultantId: "",
        consultantName: "",
        isHomeroomTeacher: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const consultantTypes = [
    {
      type: "counselor",
      title: "School Counselor",
      description: "Book a session with one of our qualified counselors",
      icon: "👨‍💼",
      benefits: [
        "Choose from multiple counselors",
        "Specialized support for various needs",
        "Flexible scheduling options",
      ],
    },
    {
      type: "homeroom",
      title: "Homeroom Teacher",
      description: "Schedule a meeting with your homeroom teacher",
      icon: "👨‍🏫",
      benefits: [
        "Direct communication with your class teacher",
        "Discuss academic progress",
        "Address class-specific concerns",
      ],
    },
  ];

  return (
    <div className="py-6">
      <h2 className="text-2xl font-semibold mb-2">Select Consultation Type</h2>
      <p className="text-gray-600 mb-6">
        Choose the type of consultation that best suits your needs
      </p>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {consultantTypes.map(({ type, title, description, icon, benefits }) => (
          <div
            key={type}
            onClick={() => !loading && handleConsultantTypeSelect(type)}
            className={`
              relative p-6 rounded-xl border-2 cursor-pointer transition-all
              ${loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg"}
              ${
                bookingData.consultantType === type
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }
            `}
          >
            {/* Icon and Title */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                {icon}
              </div>
              <div className="ml-4">
                <h3 className="font-semibold text-lg">{title}</h3>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </div>

            {/* Benefits */}
            <ul className="space-y-2">
              {benefits.map((benefit, index) => (
                <li
                  key={index}
                  className="flex items-center text-sm text-gray-700"
                >
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  {benefit}
                </li>
              ))}
            </ul>

            {/* Selected indicator */}
            {bookingData.consultantType === type && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
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
        ))}
      </div>

      {loading && (
        <div className="mt-4 text-center text-gray-600">
          Loading consultant information...
        </div>
      )}
    </div>
  );
};

export default ConsultantTypeSelection;

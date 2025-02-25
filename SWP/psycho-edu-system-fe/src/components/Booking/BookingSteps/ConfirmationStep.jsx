import { useBooking } from "../../../context/BookingContext";

export const ConfirmationStep = () => {
  const { bookingData } = useBooking();

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-800 mb-4">
          Booking Summary
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Booking Type:</span>
            <span className="font-medium">
              {bookingData.userRole === "Parent"
                ? "Parent Booking"
                : "Student Booking"}
            </span>
          </div>

          {bookingData.userRole === "Parent" && bookingData.childName && (
            <div className="flex justify-between">
              <span className="text-gray-600">Child:</span>
              <span className="font-medium">{bookingData.childName}</span>
            </div>
          )}

          {bookingData.consultantName && (
            <div className="flex justify-between">
              <span className="text-gray-600">Consultant:</span>
              <span className="font-medium">{bookingData.consultantName}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600">Date & Time:</span>
            <span className="font-medium">
              {bookingData.date} at {bookingData.time}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Meeting Type:</span>
            <span className="font-medium capitalize">
              {bookingData.appointmentType || "Not specified"}
            </span>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Contact Information</h4>
            <div className="space-y-2">
              <p className="text-gray-600">Name: {bookingData.userName}</p>
              <p className="text-gray-600">
                Phone: {bookingData.phone || "Not provided"}
              </p>
              <p className="text-gray-600">Email: {bookingData.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

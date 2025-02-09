import { useBooking } from "../../../context/BookingContext";

export const ConfirmationStep = () => {
  const {
    role,
    selectedConsultant,
    selectedChild,
    selectedDate,
    selectedTime,
    appointmentType,
    userInfo,
  } = useBooking();

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
              {role === "parent" ? "Parent Booking" : "Student Booking"}
            </span>
          </div>

          {role === "parent" && selectedChild && (
            <div className="flex justify-between">
              <span className="text-gray-600">Child:</span>
              <span className="font-medium">{selectedChild.name}</span>
            </div>
          )}

          {selectedConsultant && (
            <div className="flex justify-between">
              <span className="text-gray-600">Consultant:</span>
              <span className="font-medium">{selectedConsultant.name}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600">Date & Time:</span>
            <span className="font-medium">
              {selectedDate} at {selectedTime}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Meeting Type:</span>
            <span className="font-medium capitalize">{appointmentType}</span>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Contact Information</h4>
            <div className="space-y-2">
              <p className="text-gray-600">Name: {userInfo.name}</p>
              <p className="text-gray-600">Phone: {userInfo.phone}</p>
              <p className="text-gray-600">Email: {userInfo.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

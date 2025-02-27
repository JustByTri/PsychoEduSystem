import { useState, useEffect } from "react";
import { useBooking } from "../../../context/BookingContext";
import { getAuthDataFromLocalStorage } from "../../../utils/auth";

export const ConsultantSelection = () => {
  const { updateBookingData, bookingData } = useBooking();
  const [consultants, setConsultants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dữ liệu cứng (mock data) cho consultants với GUID làm id và availableSlots ở định dạng mới
  useEffect(() => {
    const mockConsultants = [
      {
        id: "DB7A5D22-28D9-4C93-8609-8426E8EB6585", // GUID cho Dr. Sarah
        name: "Dr. Sarah",
        role: "Counselor",
        availableSlots: [
          { slotId: 1, slotName: "8:00", isAvailable: true },
          { slotId: 3, slotName: "10:00", isAvailable: true },
          { slotId: 5, slotName: "13:00", isAvailable: false },
          { slotId: 7, slotName: "15:00", isAvailable: true },
        ],
      },
      {
        id: "4b9a6c78-6823-4679-a9d4-3e8b1a2c9d0e", // GUID cho Dr. Emily
        name: "Dr. Emily",
        role: "Counselor",
        availableSlots: [
          { slotId: 2, slotName: "9:00", isAvailable: true },
          { slotId: 4, slotName: "11:00", isAvailable: true },
          { slotId: 6, slotName: "14:00", isAvailable: false },
          { slotId: 8, slotName: "16:00", isAvailable: true },
        ],
      },
      {
        id: "5c0b7d89-7934-578a-b0e5-4f9c2b3d0f1f", // GUID cho Dr. Michael
        name: "Dr. Michael",
        role: "Counselor",
        availableSlots: [
          { slotId: 1, slotName: "8:00", isAvailable: true },
          { slotId: 2, slotName: "9:00", isAvailable: true },
          { slotId: 3, slotName: "10:00", isAvailable: false },
          { slotId: 4, slotName: "11:00", isAvailable: true },
        ],
      },
    ];
    setConsultants(mockConsultants);
    setIsLoading(false);

    // Khi có API, uncomment đoạn code dưới và comment mock data trên
    /*
    const fetchConsultants = async () => {
      try {
        setIsLoading(true);
        const authData = getAuthDataFromLocalStorage();
        const response = await fetch(
          `https://localhost:7192/api/consultants?type=${bookingData.consultantType}`,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch consultants");
        }

        const data = await response.json();
        // Giả sử data là [{ id, name, role, availableSlots }]
        setConsultants(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingData.consultantType) {
      fetchConsultants();
    } else {
      setIsLoading(false);
      setError("No consultant type selected");
    }
    */
  }, [bookingData.consultantType]);

  const handleSelectConsultant = (consultant) => {
    if (!consultant) {
      console.error("Consultant is undefined");
      return;
    }
    updateBookingData({
      consultantId: consultant.id,
      consultantName: consultant.name,
      availableSlots: consultant.availableSlots, // Lưu availableSlots của consultant vào bookingData
    });
  };

  if (isLoading) return <div>Loading consultants...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="py-6">
      <h2 className="text-xl font-semibold mb-4">Select Consultant</h2>
      <div className="space-y-3">
        {consultants.map((consultant) => (
          <div
            key={consultant.id}
            onClick={() => handleSelectConsultant(consultant)}
            className={`p-4 border rounded-md cursor-pointer transition-colors
              ${
                bookingData.consultantId === consultant.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                {consultant.name?.charAt(0) || "C"}
              </div>
              <div className="ml-3">
                <p className="font-medium">
                  {consultant.name || "Unknown Consultant"}
                </p>
                <p className="text-sm text-gray-500">
                  {consultant.role || "Counselor"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import { useState, useEffect } from "react";
import { useBooking } from "../../../context/BookingContext";
import { getAuthDataFromLocalStorage } from "../../../utils/auth";
import Calendar from "react-calendar"; // Sử dụng react-calendar
import "react-calendar/dist/Calendar.css";
import { motion, AnimatePresence } from "framer-motion"; // Thêm AnimatePresence cho modal
import axios from "axios"; // Giữ axios
import moment from "moment"; // Thêm moment để xử lý ngày

export const DateTimeSelection = () => {
  const { updateBookingData, bookingData } = useBooking();
  const [selectedDate, setSelectedDate] = useState(new Date()); // Ngày được chọn từ lịch
  const [slots, setSlots] = useState([]); // Tất cả các slot cứng từ 1 đến 8
  const [availableSlots, setAvailableSlots] = useState([]); // Slots có sẵn từ API
  const [appointmentType, setAppointmentType] = useState("online"); // Mặc định online
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false); // State cho modal lỗi
  const [errorMessage, setErrorMessage] = useState(""); // Thông báo lỗi cho modal

  // Dữ liệu cứng cho các slot (1-8 tương ứng với thời gian)
  useEffect(() => {
    const slotTimes = [
      { id: 1, time: "8:00" },
      { id: 2, time: "9:00" },
      { id: 3, time: "10:00" },
      { id: 4, time: "11:00" },
      { id: 5, time: "13:00" },
      { id: 6, time: "14:00" },
      { id: 7, time: "15:00" },
      { id: 8, time: "16:00" },
    ];
    setSlots(slotTimes);
  }, []);

  const fetchAvailableSlots = async (date, consultantId) => {
    try {
      setIsLoading(true);
      setErrorMessage(""); // Reset lỗi trước khi fetch
      const authData = getAuthDataFromLocalStorage();
      const formattedDate = moment(date).format("YYYY-MM-DD"); // Sử dụng ngày được chọn
      const response = await axios.get(
        `https://localhost:7192/api/User/${consultantId}/slots?selectedDate=${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const slotsData = response.data.result || response.data || [];
        if (Array.isArray(slotsData)) {
          const slotTimes = [
            { slotId: 1, slotName: "8:00", isAvailable: slotsData.includes(1) },
            { id: 2, slotName: "9:00", isAvailable: slotsData.includes(2) },
            {
              slotId: 3,
              slotName: "10:00",
              isAvailable: slotsData.includes(3),
            },
            {
              slotId: 4,
              slotName: "11:00",
              isAvailable: slotsData.includes(4),
            },
            {
              slotId: 5,
              slotName: "13:00",
              isAvailable: slotsData.includes(5),
            },
            {
              slotId: 6,
              slotName: "14:00",
              isAvailable: slotsData.includes(6),
            },
            {
              slotId: 7,
              slotName: "15:00",
              isAvailable: slotsData.includes(7),
            },
            {
              slotId: 8,
              slotName: "16:00",
              isAvailable: slotsData.includes(8),
            },
          ];
          const filteredSlots = slotTimes
            .filter((slot) => slot.isAvailable)
            .map((slot) => slot.slotId);
          setAvailableSlots(filteredSlots);
          if (filteredSlots.length === 0) {
            setErrorMessage(
              "No available slots for the consultant on this date."
            );
            setIsErrorModalOpen(true);
          }
        } else {
          setAvailableSlots([]);
          setErrorMessage(
            "No available slots for the consultant on this date."
          );
          setIsErrorModalOpen(true);
        }
      } else if (response.status === 404) {
        setAvailableSlots([]);
        setErrorMessage("No available slots for the consultant on this date.");
        setIsErrorModalOpen(true);
      } else {
        console.warn(
          "Unexpected API response:",
          response.status,
          response.data
        );
        setAvailableSlots([]);
        setErrorMessage("Unexpected error while fetching slots.");
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      setAvailableSlots([]);
      setErrorMessage("No available slots on this date due to an error.");
      setIsErrorModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset giờ để so sánh ngày
    if (date < today) {
      return; // Không cho chọn ngày đã qua
    }
    setSelectedDate(date);
    updateBookingData({ date: moment(date).format("YYYY-MM-DD") }); // Cập nhật date vào bookingData
    if (bookingData.consultantId) {
      fetchAvailableSlots(date, bookingData.consultantId); // Fetch slots khi chọn ngày
    }
  };

  const handleSelectSlot = (slot) => {
    if (availableSlots.includes(slot.id)) {
      updateBookingData({
        date: moment(selectedDate).format("YYYY-MM-DD"),
        time: slot.time,
        slotId: slot.id,
      });
    }
  };

  const handleSelectAppointmentType = (type) => {
    setAppointmentType(type);
    updateBookingData({ appointmentType: type }); // Lưu loại appointment vào bookingData
  };

  // Đóng modal lỗi
  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
    setErrorMessage("");
  };

  if (isLoading)
    return (
      <motion.div className="text-center text-gray-600">
        Loading available slots...
      </motion.div>
    );
  if (error)
    return (
      <motion.div className="text-center text-red-600">
        Error: {error}
      </motion.div>
    );

  return (
    <div className="py-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Select Date, Time, and Appointment Type
      </h2>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Lịch lớn với hiệu ứng motion, ngày được chọn nổi bật */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mx-auto max-w-6xl"
        >
          <Calendar
            onChange={handleSelectDate} // Sử dụng handleSelectDate để chọn ngày
            value={selectedDate}
            minDate={new Date()}
            navigationLabel={({ date }) =>
              `${date.toLocaleString("default", {
                month: "long",
              })} ${date.getFullYear()}`
            }
            className="border-none rounded-lg shadow-sm w-full text-gray-800 mx-auto"
            tileClassName={({ date }) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              if (date < today)
                return "bg-gray-200 cursor-not-allowed opacity-50";
              if (moment(date).isSame(selectedDate, "day"))
                return "bg-teal-100 border-2 border-teal-500 rounded";
              return "hover:bg-teal-100 transition-all duration-200 rounded";
            }}
            showNeighboringMonth={false}
            prevLabel={<span className="text-gray-800 font-bold">{"<"}</span>}
            nextLabel={<span className="text-gray-800 font-bold">{">"}</span>}
            tileContent={({ date }) => {
              // Chỉ render tileContent khi có availableSlots và ngày khớp
              const dateKey = moment(date).format("YYYY-MM-DD");
              if (
                availableSlots.length > 0 &&
                moment(date).isSame(selectedDate, "day")
              ) {
                return (
                  <div className="text-[10px] text-center mt-[2px]">
                    <span className="text-blue-600">A</span>
                  </div>
                );
              }
              return null; // Không render gì nếu chưa có dữ liệu hoặc ngày không khớp
            }}
          />
        </motion.div>

        {/* Danh sách slots luôn hiển thị */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
        >
          <h3 className="text-lg font-medium mb-2 text-gray-800">
            Available Time Slots
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {slots.map((slot, index) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                className={`p-4 border rounded-md cursor-pointer transition-colors
                  ${
                    bookingData.time === slot.time
                      ? "border-blue-500 bg-blue-50"
                      : availableSlots.includes(slot.id)
                      ? "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                      : "border-gray-200 bg-gray-100 cursor-not-allowed opacity-50"
                  }`}
                onClick={() =>
                  availableSlots.includes(slot.id) && handleSelectSlot(slot)
                }
              >
                <p className="text-center font-medium text-gray-800">
                  {slot.time}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Lựa chọn loại appointment luôn hiển thị */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
        >
          <h3 className="text-lg font-medium mb-2 text-gray-800">
            Select Appointment Type
          </h3>
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectAppointmentType("online")}
              className={`p-4 border rounded-md cursor-pointer transition-colors
                ${
                  appointmentType === "online"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                }`}
            >
              <p className="text-center font-medium text-gray-800">Online</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectAppointmentType("offline")}
              className={`p-4 border rounded-md cursor-pointer transition-colors
                ${
                  appointmentType === "offline"
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300 hover:bg-green-50"
                }`}
            >
              <p className="text-center font-medium text-gray-800">Offline</p>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Modal lỗi khi fetch slot thất bại */}
      <AnimatePresence>
        {isErrorModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
            >
              <h2 className="text-2xl font-bold text-red-600 mb-4 text-center">
                Notification
              </h2>
              <p className="text-gray-700 text-center mb-4">{errorMessage}</p>
              <div className="flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeErrorModal}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

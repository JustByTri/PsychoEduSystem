import { useState, useEffect } from "react";
import { useBooking } from "../../../context/BookingContext";
import { getAuthDataFromLocalStorage } from "../../../utils/auth";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { motion } from "framer-motion"; // Thêm framer-motion
import axios from "axios"; // Thêm axios

// Thiết lập localizer cho react-big-calendar
const localizer = momentLocalizer(moment);

export const DateTimeSelection = () => {
  const { updateBookingData, bookingData } = useBooking();
  const [selectedDate, setSelectedDate] = useState(new Date()); // Ngày được chọn từ lịch
  const [slots, setSlots] = useState([]); // Tất cả các slot cứng từ 1 đến 8
  const [availableSlots, setAvailableSlots] = useState([]); // Slots có sẵn từ API
  const [appointmentType, setAppointmentType] = useState("online"); // Mặc định online
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
    // Không cần sử dụng availableSlots từ bookingData nữa vì sẽ fetch khi chọn ngày
  }, []);

  const fetchAvailableSlots = async (date, consultantId) => {
    try {
      setIsLoading(true);
      const authData = getAuthDataFromLocalStorage();
      const formattedDate = moment(date).format("YYYY-MM-DD");
      const response = await axios.get(
        `https://localhost:7192/api/User/${consultantId}/slots?selectedDate=${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.isSuccess && response.data.statusCode === 200) {
        // Chuyển đổi mảng slotId thành định dạng { slotId, slotName, isAvailable }
        const slotTimes = [
          {
            slotId: 1,
            slotName: "8:00",
            isAvailable: response.data.result.includes(1),
          },
          {
            slotId: 2,
            slotName: "9:00",
            isAvailable: response.data.result.includes(2),
          },
          {
            slotId: 3,
            slotName: "10:00",
            isAvailable: response.data.result.includes(3),
          },
          {
            slotId: 4,
            slotName: "11:00",
            isAvailable: response.data.result.includes(4),
          },
          {
            slotId: 5,
            slotName: "13:00",
            isAvailable: response.data.result.includes(5),
          },
          {
            slotId: 6,
            slotName: "14:00",
            isAvailable: response.data.result.includes(6),
          },
          {
            slotId: 7,
            slotName: "15:00",
            isAvailable: response.data.result.includes(7),
          },
          {
            slotId: 8,
            slotName: "16:00",
            isAvailable: response.data.result.includes(8),
          },
        ];
        setAvailableSlots(
          slotTimes
            .filter((slot) => slot.isAvailable)
            .map((slot) => slot.slotId)
        );
      } else {
        setAvailableSlots([]);
      }
    } catch (error) {
      setError(error.message || "Failed to fetch available slots");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset giờ để so sánh ngày
    if (date < today) {
      return; // Không cho chọn ngày đã qua, không hiển thị thông báo
    }
    setSelectedDate(date);
    updateBookingData({ date: moment(date).format("YYYY-MM-DD") }); // Cập nhật date vào bookingData
    if (bookingData.consultantId) {
      fetchAvailableSlots(date, bookingData.consultantId); // Fetch slots khi click chọn ngày, dựa trên counselor đã chọn
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

  if (isLoading)
    return (
      <div className="text-center text-gray-600">
        Loading available slots...
      </div>
    );
  if (error)
    return <div className="text-center text-red-600">Error: {error}</div>;

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
        {/* Lịch lớn với hiệu ứng motion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
        >
          <Calendar
            localizer={localizer}
            date={selectedDate}
            onNavigate={(newDate) => setSelectedDate(newDate)}
            onSelectSlot={(slotInfo) => handleSelectDate(slotInfo.start)}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 400 }} // Chiều cao lịch
            defaultView="month" // Mặc định hiển thị tháng
            views={["month", "week"]} // Cho phép chuyển giữa tháng và tuần
            selectable // Cho phép chọn ngày
            events={[]} // Không cần sự kiện, chỉ dùng để chọn ngày
            slotPropGetter={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              if (date < today) {
                return {
                  className: "rbc-past-date",
                  style: { backgroundColor: "#e5e7eb", cursor: "not-allowed" },
                };
              } else if (moment(date).isSame(selectedDate, "day")) {
                return {
                  className: "rbc-selected-date",
                  style: {
                    backgroundColor: "#e0f7fa",
                    border: "2px solid #3b82f6",
                    cursor: "pointer",
                  },
                }; // Ngày đã chọn nổi bật
              }
              return {
                className: "rbc-hoverable",
                style: { cursor: "pointer" },
              }; // Tất cả các ngày khác có thể hover
            }}
            components={{
              dateCellWrapper: (props) => {
                const isHovered = props.isHovered; // Kiểm tra trạng thái hover
                const defaultStyle = props.style || {}; // Giá trị mặc định nếu props.style là undefined
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                if (moment(props.value).isSame(selectedDate, "day")) {
                  return <div {...props}>{props.children}</div>; // Giữ style cho ngày đã chọn
                }
                if (props.value < today) {
                  return (
                    <div
                      {...props}
                      style={{
                        ...defaultStyle,
                        backgroundColor: "#e5e7eb", // Màu xám nhạt với Tailwind (gray-200)
                        cursor: "not-allowed",
                        opacity: 0.5,
                      }}
                    >
                      {props.children}
                    </div>
                  );
                }
                return (
                  <div
                    {...props}
                    style={{
                      ...defaultStyle,
                      backgroundColor:
                        isHovered && moment(props.value).isAfter(today, "day")
                          ? "#f5f5f5" // Màu xám rất nhạt (gray-100) khi hover
                          : defaultStyle.backgroundColor || "transparent",
                      border:
                        isHovered && moment(props.value).isAfter(today, "day")
                          ? "2px solid #3b82f6" // Màu xanh đậm (blue-600) với Tailwind
                          : "none",
                      cursor: "pointer",
                    }}
                  >
                    {props.children}
                  </div>
                );
              },
            }}
          />
        </motion.div>

        {/* Danh sách slots với hiệu ứng motion */}
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

        {/* Chọn loại appointment với hiệu ứng motion */}
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
    </div>
  );
};

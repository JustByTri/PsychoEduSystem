import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { motion } from "framer-motion"; // Thêm framer-motion
import axios from "axios"; // Thêm axios
import { getAuthDataFromLocalStorage } from "../../utils/auth"; // Đảm bảo import hàm này

// Thiết lập localizer cho react-big-calendar
const localizer = momentLocalizer(moment);

const SchedulePage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const studentId = "c65eaccf-94a4-4b91-b0f0-713c0e592064"; // ID cố định của student, có thể lấy từ context hoặc params

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const authData = getAuthDataFromLocalStorage();
        const startDate = moment().startOf("month").format("YYYY-MM-DD"); // Lấy ngày đầu tháng hiện tại
        const endDate = moment()
          .endOf("month")
          .add(1, "month")
          .format("YYYY-MM-DD"); // Lấy ngày cuối tháng sau

        const response = await axios.get(
          `https://localhost:7192/api/appointments/students/${studentId}/appointments?startDate=${startDate}&endDate=${endDate}`,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.isSuccess && response.data.statusCode === 200) {
          const events = response.data.result.map((appointment) => {
            const startDateTime = moment(
              `${appointment.date} ${getTimeFromSlotId(appointment.slotId)}`,
              "YYYY-MM-DD hh:mm"
            ).toDate();
            const endDateTime = moment(startDateTime)
              .add(30, "minutes")
              .toDate(); // Giả sử mỗi appointment kéo dài 30 phút

            return {
              id: appointment.appointmentId,
              title: `Meeting with ${getConsultantName(
                appointment.meetingWith
              )} - ${appointment.isOnline ? "Online" : "In-person"}`,
              start: startDateTime,
              end: endDateTime,
              details: {
                consultantId: appointment.meetingWith,
                date: appointment.date,
                slotId: appointment.slotId,
                meetingType: appointment.isOnline ? "online" : "in-person",
                isCompleted: appointment.isCompleted,
                isCancelled: appointment.isCancelled,
              },
            };
          });
          setBookings(events);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch appointments"
          );
        }
      } catch (error) {
        setError(error.message || "Failed to fetch appointments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [studentId]);

  // Hàm lấy thời gian từ slotId (dựa trên slotId từ 1 đến 8)
  const getTimeFromSlotId = (slotId) => {
    const times = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
    ];
    return times[slotId - 1] || "Unknown";
  };

  // Hàm lấy tên counselor (giả định lấy từ API hoặc mock data)
  const getConsultantName = (consultantId) => {
    // Giả định mock data hoặc fetch từ API nếu cần
    const consultants = {
      "db7a5d22-28d9-4c93-8609-8426e8eb6585": "Nguyễn Thị G",
      "e5d1d93b-7d9a-4f83-9374-bb042665cb20": "Trần Văn H",
    };
    return consultants[consultantId] || "Unknown Counselor";
  };

  // Xử lý khi click vào một sự kiện
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  // Đóng modal
  const closeModal = () => {
    setSelectedEvent(null);
  };

  if (isLoading)
    return <div className="text-center text-gray-600">Loading schedule...</div>;
  if (error)
    return <div className="text-center text-red-600">Error: {error}</div>;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-900 mb-6"
      >
        Your Schedule
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
      >
        <Calendar
          localizer={localizer}
          events={bookings}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600 }} // Chiều cao lịch
          defaultView="month" // Mặc định hiển thị tháng
          views={["month", "week"]} // Cho phép chuyển giữa tháng và tuần
          onSelectEvent={handleSelectEvent}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor:
                event.details.meetingType === "online" ? "#3B82F6" : "#10B981", // Màu xanh cho online, xanh lá cho in-person
              color: "white",
              borderRadius: "0.5rem",
              border: "none",
              padding: "0.25rem 0.5rem",
              fontSize: "0.875rem",
            },
          })}
          components={{
            event: (props) => (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rbc-event-content"
                style={props.style}
              >
                {props.title}
              </motion.div>
            ),
          }}
        />
      </motion.div>

      {/* Modal hiển thị chi tiết với hiệu ứng motion */}
      {selectedEvent && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Booking Details
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700">
                <span className="font-medium text-gray-900">Consultant:</span>{" "}
                {selectedEvent.details.consultantId
                  ? getConsultantName(selectedEvent.details.consultantId)
                  : "Unknown Counselor"}
              </p>
              <p className="text-gray-700">
                <span className="font-medium text-gray-900">Date:</span>{" "}
                {moment(selectedEvent.details.date).format("YYYY-MM-DD")}
              </p>
              <p className="text-gray-700">
                <span className="font-medium text-gray-900">Time:</span>{" "}
                {getTimeFromSlotId(selectedEvent.details.slotId)}
              </p>
              <p className="text-gray-700">
                <span className="font-medium text-gray-900">Meeting Type:</span>{" "}
                {selectedEvent.details.meetingType}
              </p>
              <p className="text-gray-700">
                <span className="font-medium text-gray-900">Status:</span>{" "}
                {selectedEvent.details.isCancelled
                  ? "Cancelled"
                  : selectedEvent.details.isCompleted
                  ? "Completed"
                  : "Scheduled"}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default SchedulePage;

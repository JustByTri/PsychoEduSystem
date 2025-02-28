import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { motion } from "framer-motion"; // Thêm framer-motion
import axios from "axios"; // Thêm axios
import { getAuthDataFromLocalStorage } from "../../utils/auth"; // Đảm bảo import hàm này
import ChildSelector from "../../components/Schedule/ChildSelector"; // Import component ChildSelector
import { toast, ToastContainer } from "react-toastify"; // Thêm toast và ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Đảm bảo import CSS của toast

// Thiết lập localizer cho react-big-calendar
const localizer = momentLocalizer(moment);

const ParentSchedulePage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Khởi tạo là false để tránh auto fetch
  const [error, setError] = useState(null);
  const [selectedChildId, setSelectedChildId] = useState(null); // Child được chọn để xem lịch

  // Lấy parentId từ token
  const authData = getAuthDataFromLocalStorage();
  const parentId = authData?.userId;

  // Callback để nhận selectedChildId từ ChildSelector
  const handleChildSelected = (childId) => {
    console.log("Child selected in ParentSchedulePage:", childId);
    setSelectedChildId(childId);
  };

  // Fetch bookings khi selectedChildId thay đổi (chỉ fetch khi có selectedChildId)
  useEffect(() => {
    if (!selectedChildId) {
      setBookings([]);
      setError(null); // Không hiển thị lỗi trừ khi fetch thất bại
      setIsLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const startDate = moment().startOf("month").format("YYYY-MM-DD");
        const endDate = moment()
          .endOf("month")
          .add(1, "month")
          .format("YYYY-MM-DD");

        console.log(`Fetching bookings for studentId: ${selectedChildId}`);
        const response = await axios.get(
          `https://localhost:7192/api/appointments/students/${selectedChildId}/appointments?startDate=${startDate}&endDate=${endDate}`,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const appointments = response.data.result || [];
        if (!Array.isArray(appointments)) {
          setError("Invalid data format: expected an array of appointments");
          setIsLoading(false);
          return;
        }

        const events = appointments.map((appointment) => {
          const startDateTime = moment(
            `${appointment.date} ${getTimeFromSlotId(appointment.slotId)}`,
            "YYYY-MM-DD HH:mm"
          ).toDate();
          const endDateTime = moment(startDateTime).add(60, "minutes").toDate();

          return {
            id: appointment.appointmentId,
            title: `Meeting for Unknown Student with Unknown Consultant - ${
              appointment.isOnline ? "Online" : "In-person"
            }`,
            start: startDateTime,
            end: endDateTime,
            details: {
              studentId: appointment.appointmentFor || selectedChildId,
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
        setError(null);
        setIsLoading(false);
      } catch (error) {
        console.error("Fetch bookings error:", error.message);
        setError("Failed to fetch appointments");
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [selectedChildId, authData.accessToken]);

  // Hàm lấy thời gian từ slotId
  const getTimeFromSlotId = (slotId) => {
    const times = [
      "08:00",
      "09:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
    ];
    return times[slotId - 1] || "Unknown";
  };

  // Xử lý khi click vào một sự kiện
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  // Đóng modal
  const closeModal = () => {
    setSelectedEvent(null);
  };

  // Hủy appointment
  const handleCancelAppointment = async () => {
    if (!selectedEvent) return;

    try {
      setIsLoading(true);
      const authData = getAuthDataFromLocalStorage();
      const response = await axios.post(
        `https://localhost:7192/api/appointments/${selectedEvent.id}/cancellation`,
        {},
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response for cancellation:", response.data);

      if (response.data.isSuccess && response.data.statusCode === 200) {
        // Cập nhật trạng thái isCancelled trong selectedEvent
        setSelectedEvent((prevEvent) => ({
          ...prevEvent,
          details: { ...prevEvent.details, isCancelled: true },
        }));
        // Tải lại danh sách bookings
        const fetchBookings = async () => {
          const startDate = moment().startOf("month").format("YYYY-MM-DD");
          const endDate = moment()
            .endOf("month")
            .add(1, "month")
            .format("YYYY-MM-DD");
          const response = await axios.get(
            `https://localhost:7192/api/appointments/students/${selectedChildId}/appointments?startDate=${startDate}&endDate=${endDate}`,
            {
              headers: {
                Authorization: `Bearer ${authData.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );
          const appointments = response.data.result || [];
          const events = appointments.map((appointment) => {
            const startDateTime = moment(
              `${appointment.date} ${getTimeFromSlotId(appointment.slotId)}`,
              "YYYY-MM-DD HH:mm"
            ).toDate();
            const endDateTime = moment(startDateTime)
              .add(60, "minutes")
              .toDate();
            return {
              id: appointment.appointmentId,
              title: `Meeting for Unknown Student with Unknown Consultant - ${
                appointment.isOnline ? "Online" : "In-person"
              }`,
              start: startDateTime,
              end: endDateTime,
              details: {
                studentId: appointment.appointmentFor || selectedChildId,
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
        };
        fetchBookings();
        toast.success("Appointment cancelled successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } else {
        throw new Error(
          response.data.message || "Failed to cancel appointment"
        );
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error(`Failed to cancel appointment: ${error.message}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
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
      <ChildSelector onChildSelected={handleChildSelected} />{" "}
      {/* Luôn hiển thị */}
      {selectedChildId && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mt-6"
        >
          <Calendar
            localizer={localizer}
            events={bookings}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            defaultView="month"
            views={["month", "week"]}
            onSelectEvent={handleSelectEvent}
            eventPropGetter={(event) => ({
              style: {
                backgroundColor:
                  event.details.meetingType === "online"
                    ? "#3B82F6"
                    : "#10B981",
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
      )}
      {error && !selectedChildId && (
        <div className="text-center text-red-600 mt-4">{error}</div>
      )}
      {/* Modal hiển thị chi tiết với hiệu ứng motion và nút Cancel */}
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
                <span className="font-medium text-gray-900">Student:</span>{" "}
                Student with ID: {selectedEvent.details.studentId}
              </p>
              <p className="text-gray-700">
                <span className="font-medium text-gray-900">Consultant:</span>{" "}
                Consultant with ID: {selectedEvent.details.consultantId}
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
                <span className="font-medium text-gray-900">Completed:</span>{" "}
                {selectedEvent.details.isCompleted ? "Yes" : "No"}
              </p>
              <p className="text-gray-700">
                <span className="font-medium text-gray-900">Cancelled:</span>{" "}
                {selectedEvent.details.isCancelled ? "Yes" : "No"}
              </p>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </motion.button>
              {!selectedEvent.details.isCancelled && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCancelAppointment}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancel Appointment
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
      <ToastContainer /> {/* Thêm ToastContainer để hiển thị toast */}
    </div>
  );
};

export default ParentSchedulePage;

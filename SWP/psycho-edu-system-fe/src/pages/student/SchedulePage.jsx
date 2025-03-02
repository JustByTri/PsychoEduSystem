import { useState, useEffect } from "react";
import { Calendar } from "react-calendar"; // Sử dụng react-calendar
import "react-calendar/dist/Calendar.css";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { getAuthDataFromLocalStorage } from "../../utils/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";

const SchedulePage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Modal xác nhận hủy
  const [selectedEventToCancel, setSelectedEventToCancel] = useState(null); // Sự kiện cần hủy
  const [isInitialLoad, setIsInitialLoad] = useState(true); // State để kiểm soát hiệu ứng ban đầu
  const [selectedDate, setSelectedDate] = useState(new Date()); // Ngày được chọn từ lịch

  const authData = getAuthDataFromLocalStorage();
  const userId = authData?.userId;

  useEffect(() => {
    if (!userId) {
      setError("User ID not found in token. Please log in again.");
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

        const response = await axios.get(
          `https://localhost:7192/api/appointments/students/${userId}/appointments?startDate=${startDate}&endDate=${endDate}`,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("API Response for bookings:", response.data);

        if (response.status === 200) {
          const appointments = response.data.result || [];
          if (!Array.isArray(appointments)) {
            setError("Invalid data format: expected an array of appointments");
            setIsLoading(false);
            return;
          }

          if (appointments.length === 0) {
            setBookings([]);
          } else {
            const events = appointments.map((appointment) => {
              const startDateTime = moment(
                `${appointment.date} ${getTimeFromSlotId(appointment.slotId)}`,
                "YYYY-MM-DD HH:mm"
              ).toDate();
              const endDateTime = moment(startDateTime)
                .add(60, "minutes")
                .toDate();

              let title = `Meeting with ${appointment.meetingWith}`;
              if (appointment.role === "Counselor") {
                title = "Meeting with Counselor";
              } else if (appointment.role === "Teacher") {
                title = "Meeting with Teacher";
              }

              return {
                id: appointment.appointmentId,
                title: `${title} - ${
                  appointment.isOnline ? "Online" : "In-person"
                }`,
                start: startDateTime,
                end: endDateTime,
                details: {
                  studentId: appointment.appointmentFor || userId,
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
          }
        } else if (response.status === 404) {
          setBookings([]);
          setIsLoading(false);
        } else {
          throw new Error(
            response.data?.message || `API error: Status ${response.status}`
          );
        }
      } catch (error) {
        setError(error.message || "Failed to fetch appointments");
      } finally {
        setIsLoading(false);
        // Tắt hiệu ứng sau khi load lần đầu
        const timer = setTimeout(() => setIsInitialLoad(false), 500); // Đợi hiệu ứng hoàn tất (0.5s)
        return () => clearTimeout(timer); // Dọn dẹp timer
      }
    };

    fetchBookings();
  }, [userId, authData.accessToken]);

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

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  const handleCancelAppointment = async () => {
    if (!selectedEvent) return;

    try {
      setIsLoading(true);
      const authData = getAuthDataFromLocalStorage();
      const response = await axios.get(
        `https://localhost:7192/api/appointments/${selectedEvent.id}/cancellation`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response for cancellation:", response.data);

      if (response.data.isSuccess && response.data.statusCode === 200) {
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.id === selectedEvent.id
              ? {
                  ...booking,
                  details: { ...booking.details, isCancelled: true },
                }
              : booking
          )
        );
        setSelectedEvent((prevEvent) => ({
          ...prevEvent,
          details: { ...prevEvent.details, isCancelled: true },
        }));
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
      toast.error(
        `Failed to cancel appointment: ${
          error.response?.data?.message || error.message
        }`,
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Mở modal xác nhận hủy
  const openConfirmModal = (event) => {
    setSelectedEventToCancel(event);
    setIsConfirmModalOpen(true);
  };

  // Xác nhận hủy
  const confirmCancelAppointment = async () => {
    if (!selectedEventToCancel) return;
    await handleCancelAppointment();
    setIsConfirmModalOpen(false);
    setSelectedEventToCancel(null);
  };

  // Đóng modal xác nhận
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedEventToCancel(null);
  };

  if (isLoading)
    return <div className="text-center text-gray-600">Loading schedule...</div>;
  if (error)
    return <div className="text-center text-red-600">Error: {error}</div>;

  // Lọc bookings theo ngày đã chọn
  const filteredBookings = bookings.filter((booking) =>
    moment(booking.start).isSame(selectedDate, "day")
  );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <motion.h1
        initial={isInitialLoad ? { opacity: 0, y: -20 } : false}
        animate={isInitialLoad ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-900 mb-8 text-center"
      >
        Your Schedule
      </motion.h1>

      {/* Container chính căn giữa */}
      {bookings.length === 0 ? (
        <p className="text-gray-500 text-center">
          No appointments found for this month.
        </p>
      ) : (
        <div className="max-w-md mx-auto flex flex-col items-center gap-6">
          {/* Lịch nhỏ gọn, căn giữa */}
          <motion.div
            initial={isInitialLoad ? { opacity: 0, scale: 0.95 } : false}
            animate={isInitialLoad ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center"
          >
            <h2 className="text-xl font-semibold text-[#002B36] mb-4 text-center">
              Pick a Date
            </h2>
            <Calendar
              onChange={setSelectedDate} // Chọn ngày
              value={selectedDate}
              minDate={new Date()}
              navigationLabel={({ date }) =>
                `${date.toLocaleString("default", {
                  month: "long",
                })} ${date.getFullYear()}`
              }
              className="border-none rounded-lg shadow-sm w-full text-[#002B36] mx-auto"
              tileClassName={({ date }) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                if (date < today)
                  return "bg-gray-200 cursor-not-allowed opacity-50";
                if (moment(date).isSame(selectedDate, "day"))
                  return "bg-green-100 border-2 border-green-500 rounded";
                return "hover:bg-green-100 transition-all duration-200 rounded";
              }}
              showNeighboringMonth={false}
              prevLabel={
                <span className="text-[#002B36] font-bold">{"<"}</span>
              }
              nextLabel={
                <span className="text-[#002B36] font-bold">{">"}</span>
              }
              tileContent={({ date }) => {
                const dateKey = moment(date).format("YYYY-MM-DD");
                const hasAppointment = bookings.some(
                  (b) => b.details?.date === dateKey && !b.details?.isCancelled
                );
                return hasAppointment ? (
                  <div className="text-[10px] text-center mt-[2px]">
                    <span className="text-[#10B981]">Appt</span>
                  </div>
                ) : null; // Chỉ hiển thị "Appt" nếu có appointment
              }}
            />
            <p className="mt-2 text-sm text-gray-600 text-center">
              Selected: {selectedDate.toLocaleDateString("en-GB")}
            </p>
            <div className="mt-2 text-xs text-gray-500 text-center">
              <span className="text-[#10B981]">Appt</span>: Has Appointment
            </div>
          </motion.div>

          {/* Danh sách slot */}
          <motion.div
            initial={isInitialLoad ? { opacity: 0, scale: 0.95 } : false}
            animate={isInitialLoad ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
          >
            <h2 className="text-xl font-semibold text-[#002B36] mb-4 text-center">
              Appointments for {selectedDate.toLocaleDateString("en-GB")}
            </h2>
            {filteredBookings.length === 0 ? (
              <p className="text-gray-500 italic text-sm text-center">
                No appointments for this date.
              </p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {filteredBookings.map((booking) => (
                  <div
                    key={booking.id}
                    onClick={() => handleSelectEvent(booking)}
                    className={`p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-200 text-sm ${
                      booking.details.isBooked
                        ? booking.details.isCancelled
                          ? "bg-red-50"
                          : "bg-green-50"
                        : "bg-green-50" // Loại bỏ "Available", chỉ hiển thị booked/cancelled
                    }`}
                  >
                    <span className="font-medium text-[#002B36]">
                      {getTimeFromSlotId(booking.details.slotId)}
                    </span>
                    <span className="ml-2 text-gray-600">
                      {booking.details.isBooked
                        ? booking.details.isCancelled
                          ? "(Cancelled)"
                          : "(Booked)"
                        : "(Not Join Yet)"}{" "}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Modal chi tiết sự kiện */}
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
                {selectedEvent.details.studentId}
              </p>
              <p className="text-gray-700">
                <span className="font-medium text-gray-900">Consultant:</span>{" "}
                {selectedEvent.details.consultantId}
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
                  onClick={() => openConfirmModal(selectedEvent)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Modal xác nhận hủy */}
      <AnimatePresence>
        {isConfirmModalOpen && (
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
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Confirm Cancellation
              </h2>
              <p className="text-gray-700 text-center mb-4">
                Are you sure you want to cancel this appointment on{" "}
                {moment(selectedEventToCancel?.details?.date).format(
                  "YYYY-MM-DD"
                )}{" "}
                at {getTimeFromSlotId(selectedEventToCancel?.details?.slotId)}?
              </p>
              <div className="flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmCancelAppointment}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Yes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeConfirmModal}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  No
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ToastContainer />
    </div>
  );
};

export default SchedulePage;

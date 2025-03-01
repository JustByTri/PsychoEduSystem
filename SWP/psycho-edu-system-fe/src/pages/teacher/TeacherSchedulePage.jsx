import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { getAuthDataFromLocalStorage } from "../../utils/auth";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Thiết lập localizer cho react-big-calendar (dù không sử dụng trong file này, cần cho tương lai)
const localizer = null; // Placeholder, không cần vì không dùng Calendar từ react-big-calendar

const TeacherSchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [noAppointments, setNoAppointments] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // Modal xác nhận hủy
  const [selectedSlotToCancel, setSelectedSlotToCancel] = useState(null); // Slot cần hủy

  const authData = getAuthDataFromLocalStorage();
  const teacherId = authData?.userId;

  const startDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    1
  );
  const endDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth() + 1,
    0
  );

  useEffect(() => {
    if (!teacherId) {
      setNoAppointments(true);
      setIsLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsLoading(true);

        const appointmentResponse = await axios.get(
          `https://localhost:7192/api/appointments/consultants/${teacherId}/appointments?startDate=${
            startDate.toISOString().split("T")[0]
          }&endDate=${endDate.toISOString().split("T")[0]}`,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        let appointments = [];
        if (
          appointmentResponse.status === 200 &&
          appointmentResponse.data.isSuccess
        ) {
          appointments = appointmentResponse.data.result || [];
          if (!Array.isArray(appointments)) {
            setNoAppointments(true);
            setIsLoading(false);
            return;
          }
        } else {
          setNoAppointments(true);
          setBookings([]);
          setIsLoading(false);
          return;
        }

        if (appointments.length === 0) {
          const scheduleResponse = await axios.get(
            `https://localhost:7192/api/Schedule/user-schedules/${teacherId}`,
            {
              headers: {
                Authorization: `Bearer ${authData.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          const schedules = scheduleResponse.data || [];
          if (!Array.isArray(schedules)) {
            setNoAppointments(true);
            setIsLoading(false);
            return;
          }

          const unbookedSlots = schedules.map((slot) => ({
            slotId: slot.slotId,
            date: slot.date.split("T")[0],
            time: slot.slotName,
            isBooked: false,
            scheduleId: slot.scheduleId,
          }));
          setBookings(unbookedSlots);
          setAvailableSlots(unbookedSlots);
        } else {
          const scheduleResponse = await axios.get(
            `https://localhost:7192/api/Schedule/user-schedules/${teacherId}`,
            {
              headers: {
                Authorization: `Bearer ${authData.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          const schedules = scheduleResponse.data || [];
          if (!Array.isArray(schedules)) {
            setNoAppointments(true);
            setIsLoading(false);
            return;
          }

          const allSlots = schedules.map((slot) => ({
            slotId: slot.slotId,
            date: slot.date.split("T")[0],
            time: slot.slotName,
            isBooked: false,
            scheduleId: slot.scheduleId,
          }));

          const bookedSlots = appointments.map((appointment) => ({
            slotId: appointment.slotId,
            date: appointment.date,
            time: getTimeFromSlotId(appointment.slotId),
            isBooked: true,
            appointmentId: appointment.appointmentId,
            isOnline: appointment.isOnline,
            isCompleted: appointment.isCompleted,
            isCancelled: appointment.isCancelled,
            studentId: appointment.studentId || "Unknown",
          }));

          const unbookedSlots = allSlots.filter(
            (slot) =>
              !bookedSlots.some(
                (booked) =>
                  booked.slotId === slot.slotId && booked.date === slot.date
              )
          );

          setBookings([...bookedSlots, ...unbookedSlots]);
          setAvailableSlots(allSlots);
        }
      } catch (error) {
        setNoAppointments(true);
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [teacherId, authData?.accessToken]);

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

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.date ===
      selectedDate
        .toLocaleDateString("en-GB", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })
        .split("/")
        .reverse()
        .join("-") // YYYY-MM-DD
  );

  const closeModal = () => setSelectedSlot(null);

  const handleCancelAppointment = async () => {
    if (!selectedSlot) return;

    try {
      setIsLoading(true);
      const authData = getAuthDataFromLocalStorage();
      const response = await axios.get(
        `https://localhost:7192/api/appointments/${selectedSlot.appointmentId}/cancellation`,
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
            booking.appointmentId === selectedSlot.appointmentId
              ? { ...booking, isCancelled: true }
              : booking
          )
        );
        setSelectedSlot((prevSlot) => ({
          ...prevSlot,
          isCancelled: true,
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
  const openConfirmModal = (slot) => {
    setSelectedSlotToCancel(slot);
    setIsConfirmModalOpen(true);
  };

  // Xác nhận hủy
  const confirmCancelAppointment = async () => {
    if (!selectedSlotToCancel) return;
    await handleCancelAppointment();
    setIsConfirmModalOpen(false);
    setSelectedSlotToCancel(null);
  };

  // Đóng modal xác nhận
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedSlotToCancel(null);
  };

  if (isLoading)
    return <div className="text-center text-gray-600">Loading schedule...</div>;

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-gray-900 mb-8 text-center"
      >
        Your Teacher Schedule
      </motion.h1>

      {/* Container chính căn giữa */}
      {noAppointments ? (
        <p className="text-gray-500 text-center">
          No appointments found for this month.
        </p>
      ) : (
        <div className="max-w-md mx-auto flex flex-col items-center gap-6">
          {/* Lịch nhỏ gọn, căn giữa */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md flex flex-col items-center"
          >
            <h2 className="text-xl font-semibold text-[#002B36] mb-4 text-center">
              Pick a Date
            </h2>
            <Calendar
              onChange={setSelectedDate}
              value={selectedDate}
              minDate={new Date()}
              navigationLabel={({ date }) =>
                `${date.toLocaleString("default", {
                  month: "long",
                })} ${date.getFullYear()}`
              }
              className="border-none rounded-lg shadow-sm w-full text-[#002B36] mx-auto"
              tileClassName="hover:bg-[#65CCB8]/20 transition-all duration-200"
              showNeighboringMonth={false}
              prevLabel={
                <span className="text-[#002B36] font-bold">{"<"}</span>
              }
              nextLabel={
                <span className="text-[#002B36] font-bold">{">"}</span>
              }
              tileContent={({ date }) => {
                const dateKey = date
                  .toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                  .split("/")
                  .reverse()
                  .join("-"); // YYYY-MM-DD
                const dayBookings = bookings.filter(
                  (b) => b.date === dateKey && b.isBooked && !b.isCancelled
                ).length;
                const dayAvailables = bookings.filter(
                  (b) => b.date === dateKey && !b.isBooked
                ).length;
                return (
                  <div className="text-[10px] text-center mt-[2px]">
                    {dayBookings > 0 && (
                      <span className="text-blue-600">{dayBookings} B</span>
                    )}
                    {dayAvailables > 0 && (
                      <span className="text-green-600 ml-1">
                        {dayAvailables} A
                      </span>
                    )}
                  </div>
                );
              }}
            />
            <p className="mt-2 text-sm text-gray-600 text-center">
              Selected: {selectedDate.toLocaleDateString("en-GB")}
            </p>
            <div className="mt-2 text-xs text-gray-500 text-center">
              <span className="text-blue-600">B</span>: Booked |{" "}
              <span className="text-green-600">A</span>: Available
            </div>
          </motion.div>

          {/* Danh sách slot nằm bên dưới, căn giữa */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
          >
            <h2 className="text-xl font-semibold text-[#002B36] mb-4 text-center">
              Slots for {selectedDate.toLocaleDateString("en-GB")}
            </h2>
            {filteredBookings.length === 0 ? (
              <p className="text-gray-500 italic text-sm text-center">
                No slots available or booked for this date.
              </p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {filteredBookings.map((slot) => (
                  <div
                    key={slot.appointmentId || slot.scheduleId}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-200 text-sm ${
                      slot.isBooked
                        ? slot.isCancelled
                          ? "bg-red-50"
                          : "bg-blue-50"
                        : "bg-green-50"
                    }`}
                  >
                    <span className="font-medium text-[#002B36]">
                      {slot.time}
                    </span>
                    <span className="ml-2 text-gray-600">
                      {slot.isBooked
                        ? slot.isCancelled
                          ? "(Cancelled)"
                          : "(Booked)"
                        : "(Available)"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Modal chi tiết slot */}
      {selectedSlot && (
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
              Slot Details
            </h2>
            <div className="space-y-4">
              <p>
                <span className="font-medium">Date:</span>{" "}
                {new Date(selectedSlot.date).toLocaleDateString("en-GB")}
              </p>
              <p>
                <span className="font-medium">Time:</span> {selectedSlot.time}
              </p>
              {selectedSlot.isBooked ? (
                <>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    {selectedSlot.isCancelled ? "Cancelled" : "Booked"}
                  </p>
                  {!selectedSlot.isCancelled && (
                    <>
                      <p>
                        <span className="font-medium">Student ID:</span>{" "}
                        {selectedSlot.studentId}
                      </p>
                      <p>
                        <span className="font-medium">Meeting Type:</span>{" "}
                        {selectedSlot.isOnline ? "Online" : "In-person"}
                      </p>
                      <p>
                        <span className="font-medium">Completed:</span>{" "}
                        {selectedSlot.isCompleted ? "Yes" : "No"}
                      </p>
                    </>
                  )}
                  <p>
                    <span className="font-medium">Appointment ID:</span>{" "}
                    {selectedSlot.appointmentId}
                  </p>
                </>
              ) : (
                <>
                  <p>
                    <span className="font-medium">Status:</span> Available (Not
                    Booked)
                  </p>
                  <p>
                    <span className="font-medium">Schedule ID:</span>{" "}
                    {selectedSlot.scheduleId}
                  </p>
                </>
              )}
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
              {selectedSlot.isBooked && !selectedSlot.isCancelled && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openConfirmModal(selectedSlot)}
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
                {new Date(selectedSlotToCancel?.date).toLocaleDateString(
                  "en-GB"
                )}{" "}
                at {selectedSlotToCancel?.time}?
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
    </div>
  );
};

export default TeacherSchedulePage;

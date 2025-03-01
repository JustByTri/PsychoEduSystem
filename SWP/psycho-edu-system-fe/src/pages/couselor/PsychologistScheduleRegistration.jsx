import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthDataFromLocalStorage } from "../../utils/auth";

const PsychologistScheduleRegistration = () => {
  const authData = getAuthDataFromLocalStorage();
  const userId = authData?.userId;
  const token = authData?.accessToken;

  if (!userId || !token) {
    toast.error("User authentication required. Please log in.", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    return (
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold text-[#002B36] mb-8 text-center">
          Register Your Available Slots
        </h1>
        <p className="text-red-600 text-center">
          User authentication required. Please log in.
        </p>
      </div>
    );
  }

  const timeSlots = [
    { id: 1, time: "8:00 AM" },
    { id: 2, time: "9:00 AM" },
    { id: 3, time: "10:00 AM" },
    { id: 4, time: "11:00 AM" },
    { id: 5, time: "1:00 PM" },
    { id: 6, time: "2:00 PM" },
    { id: 7, time: "3:00 PM" },
    { id: 8, time: "4:00 PM" },
  ];

  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentSelectedSlots, setCurrentSelectedSlots] = useState([]);
  const [selectedDates, setSelectedDates] = useState({});
  const [bookedSlots, setBookedSlots] = useState([]);
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const dateKey = currentDate
      .toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .split("/")
      .reverse()
      .join("-"); // Định dạng YYYY-MM-DD
    setCurrentSelectedSlots(selectedDates[dateKey] || []);
    setErrorMessage(null);
  }, [currentDate, selectedDates]);

  const handleSlotToggle = (slotId) => {
    setCurrentSelectedSlots((prev) =>
      prev.includes(slotId)
        ? prev.filter((id) => id !== slotId)
        : [...prev, slotId]
    );
  };

  const handleAddDate = () => {
    if (currentSelectedSlots.length === 0) {
      setErrorMessage("Please select at least one time slot.");
      toast.error("Please select at least one time slot.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const dateKey = currentDate
      .toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .split("/")
      .reverse()
      .join("-"); // YYYY-MM-DD
    const duplicateSlots = currentSelectedSlots.filter((slotId) =>
      bookedSlots.some(
        (booked) => booked.slotId === slotId && booked.date === dateKey
      )
    );

    if (duplicateSlots.length > 0) {
      const duplicateTimes = duplicateSlots
        .map((slotId) => timeSlots.find((slot) => slot.id === slotId)?.time)
        .join(", ");
      const errorMsg = `You have already booked slot ${duplicateTimes} on ${new Date(
        dateKey
      ).toLocaleDateString("en-GB")}.`;
      setErrorMessage(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    setSelectedDates((prev) => ({
      ...prev,
      [dateKey]: [...currentSelectedSlots],
    }));
    setErrorMessage(null);
  };

  const handleRemoveDate = (dateKey) => {
    setSelectedDates((prev) => {
      const newDates = { ...prev };
      delete newDates[dateKey];
      return newDates;
    });
  };

  const handleSubmit = async () => {
    const bookingDetails = Object.entries(selectedDates).flatMap(
      ([date, slots]) =>
        slots.map((slotId) => ({
          slotId,
          date,
        }))
    );

    if (bookingDetails.length === 0) {
      toast.error("Please add at least one date with slots.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const duplicateBookings = bookingDetails.filter((booking) =>
      bookedSlots.some(
        (booked) =>
          booked.slotId === booking.slotId && booked.date === booking.date
      )
    );

    if (duplicateBookings.length > 0) {
      const duplicateMsg = duplicateBookings
        .map(
          (booking) =>
            `You have already booked slot ${
              timeSlots.find((slot) => slot.id === booking.slotId)?.time
            } on ${new Date(booking.date).toLocaleDateString("en-GB")}`
        )
        .join(", ");
      toast.error(duplicateMsg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setSubmissionStatus(duplicateMsg);
      return;
    }

    const payload = { userId, bookingDetails };

    try {
      const response = await axios.post(
        "https://localhost:7192/api/Schedule/book-slots",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const booked = response.data.bookings.map((booking) => ({
        bookingId: booking.bookingId,
        slotId: booking.slotId,
        date: booking.date.split("T")[0],
        time: timeSlots.find((slot) => slot.id === booking.slotId)?.time,
      }));
      setBookedSlots((prev) => [...prev, ...booked]);

      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setSubmissionStatus(response.data.message);
      setSelectedDates({});
      setErrorMessage(null);
    } catch (error) {
      let errorMsg = "An error occurred while booking.";
      if (error.response) {
        if (error.response.status === 400 && error.response.data) {
          errorMsg =
            error.response.data || "Bad request: Invalid booking data.";
          if (typeof errorMsg === "string") {
            toast.error(errorMsg, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          } else {
            errorMsg = errorMsg.message || JSON.stringify(errorMsg);
            toast.error(errorMsg, {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
        } else {
          errorMsg =
            error.response.data?.message || "An error occurred while booking.";
          toast.error(errorMsg, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } else {
        toast.error(errorMsg, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
      setSubmissionStatus(errorMsg);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-[#002B36] mb-8 text-center"
      >
        Register Your Available Slots - Psychologist
      </motion.h1>

      {/* Container chính căn giữa */}
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
        {/* Card chọn ngày và slot */}
        <div className="flex flex-col lg:flex-row justify-center items-stretch gap-6 w-full max-w-5xl">
          {/* Lịch nhỏ gọn */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
          >
            <h2 className="text-xl font-semibold text-[#002B36] mb-4 text-center">
              Pick a Date
            </h2>
            <Calendar
              onChange={setCurrentDate}
              value={currentDate}
              minDate={new Date()}
              navigationLabel={({ date }) =>
                `${date.toLocaleString("default", {
                  month: "long",
                })} ${date.getFullYear()}`
              }
              className="border-none rounded-lg shadow-sm w-full text-[#002B36] text-sm mx-auto"
              tileClassName={({ date }) => {
                const dateKey = date
                  .toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                  .split("/")
                  .reverse()
                  .join("-"); // YYYY-MM-DD
                const dayBookings = bookedSlots.filter(
                  (b) => b.date === dateKey && b.slotId
                ).length;
                return dayBookings > 0
                  ? "bg-blue-100 rounded-full hover:bg-blue-200"
                  : "hover:bg-teal-100 transition-all duration-200 rounded-full";
              }}
              showNeighboringMonth={false}
              prevLabel={
                <span className="text-[#002B36] font-bold text-lg">{"<"}</span>
              }
              nextLabel={
                <span className="text-[#002B36] font-bold text-lg">{">"}</span>
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
                const dayBookings = bookedSlots.filter(
                  (b) => b.date === dateKey
                ).length;
                return (
                  <div className="text-[10px] text-center mt-[2px]">
                    {dayBookings > 0 && (
                      <span className="text-blue-600">{dayBookings} B</span>
                    )}
                  </div>
                );
              }}
            />
            <p className="mt-2 text-sm text-gray-600 text-center">
              Selected: {currentDate.toLocaleDateString("en-GB")}
            </p>
          </motion.div>

          {/* Chọn khung giờ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
          >
            <h2 className="text-xl font-semibold text-[#002B36] mb-4 text-center">
              Select Slots for{" "}
              <span className="text-[#65CCB8]">
                {currentDate.toLocaleDateString("en-GB")}
              </span>
            </h2>
            <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto">
              {timeSlots.map((slot) => (
                <label
                  key={slot.id}
                  className="flex items-center p-3 bg-gray-100 rounded-lg hover:bg-[#65CCB8]/20 transition-all duration-300 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={currentSelectedSlots.includes(slot.id)}
                    onChange={() => handleSlotToggle(slot.id)}
                    className="mr-3 w-5 h-5 accent-[#65CCB8]"
                  />
                  <span className="text-[#002B36] font-medium">
                    {slot.time}
                  </span>
                </label>
              ))}
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {errorMessage}
              </p>
            )}
            <button
              onClick={handleAddDate}
              className="mt-4 w-full bg-gradient-to-r from-[#65CCB8] to-[#57B8A5] text-white py-2 rounded-lg hover:scale-105 transition-all duration-300"
              title="Add this date and slots to your list"
            >
              Add to List
            </button>
          </motion.div>
        </div>

        {/* Danh sách slot đã chọn */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white p-6 rounded-xl shadow-lg w-full max-w-5xl"
        >
          <h2 className="text-xl font-semibold text-[#002B36] mb-4 text-center">
            Your Selected Slots
          </h2>
          <AnimatePresence>
            {Object.entries(selectedDates).length === 0 ? (
              <p className="text-gray-500 italic text-center">
                No slots selected yet. Add some above!
              </p>
            ) : (
              Object.entries(selectedDates).map(([date, slots]) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-3 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <span className="font-semibold text-[#002B36]">
                      {new Date(date).toLocaleDateString("en-GB")}
                    </span>
                    <div className="text-sm text-gray-700 mt-1">
                      {slots
                        .map(
                          (slotId) =>
                            timeSlots.find((s) => s.id === slotId)?.time
                        )
                        .join(", ")}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveDate(date)}
                    className="text-red-500 hover:text-red-700 font-medium transition-all duration-200"
                  >
                    Remove
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Danh sách slot đã book */}
        {bookedSlots.length > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-5xl"
          >
            <h2 className="text-xl font-semibold text-[#002B36] mb-4 text-center">
              Booked Slots
            </h2>
            <div className="space-y-3">
              {bookedSlots.map((slot) => (
                <div
                  key={slot.bookingId}
                  className="p-4 bg-green-50 rounded-lg shadow-sm"
                >
                  <span className="font-semibold text-[#002B36]">
                    {new Date(slot.date).toLocaleDateString("en-GB")} -{" "}
                    {slot.time}
                  </span>
                  <div className="text-sm text-gray-700 mt-1">
                    Booking ID:{" "}
                    <span className="font-mono">{slot.bookingId}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Nút gửi */}
        <div className="flex justify-center w-full max-w-5xl">
          <button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-[#002B36] to-[#001F28] text-white py-3 px-8 rounded-lg hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Submit Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default PsychologistScheduleRegistration;

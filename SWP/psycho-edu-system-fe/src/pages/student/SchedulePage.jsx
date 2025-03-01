import { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { motion } from "framer-motion";
import axios from "axios";
import { getAuthDataFromLocalStorage } from "../../utils/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const localizer = momentLocalizer(moment);

const SchedulePage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
          style={{ height: 600 }}
          defaultView="month"
          views={["month", "week"]}
          onSelectEvent={handleSelectEvent}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor:
                event.details.meetingType === "online" ? "#3B82F6" : "#10B981",
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
                  onClick={handleCancelAppointment}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
      <ToastContainer />
    </div>
  );
};

export default SchedulePage;

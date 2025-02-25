import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Thiết lập localizer cho react-big-calendar
const localizer = momentLocalizer(moment);

const SchedulePage = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // useEffect(() => {
  //   fetch("/api/user/bookings")
  //     .then((res) => res.json())
  //     .then((data) =>
  //       setBookings(
  //         data.map((booking) => ({
  //           id: booking.id,
  //           title: `${booking.consultantName} - ${booking.type}`,
  //           start: new Date(`${booking.date} ${booking.time}`),
  //           end: new Date(
  //             new Date(`${booking.date} ${booking.time}`).getTime() +
  //               30 * 60000
  //           ),
  //           details: booking,
  //         }))
  //       )
  //     );
  // }, []);   API Backend

  useEffect(() => {
    // Giả lập dữ liệu lịch đã đặt
    const mockBookings = [
      {
        id: 1,
        consultantName: "Dr. Sarah",
        date: "2025-03-01",
        time: "09:00 AM",
        type: "Counselor",
        meetingType: "online",
      },
      {
        id: 2,
        consultantName: "Mr. John",
        date: "2025-03-02",
        time: "02:00 PM",
        type: "Homeroom Teacher",
        meetingType: "in-person",
      },
    ];

    // Chuyển đổi dữ liệu thành định dạng của react-big-calendar
    const events = mockBookings.map((booking) => {
      const startDateTime = moment(
        `${booking.date} ${booking.time}`,
        "YYYY-MM-DD hh:mm A"
      ).toDate();
      const endDateTime = moment(startDateTime).add(30, "minutes").toDate(); // Giả sử mỗi booking kéo dài 30 phút

      return {
        id: booking.id,
        title: `${booking.consultantName} - ${booking.type}`,
        start: startDateTime,
        end: endDateTime,
        details: {
          consultantName: booking.consultantName,
          date: booking.date,
          time: booking.time,
          type: booking.type,
          meetingType: booking.meetingType,
        },
      };
    });

    setBookings(events);
  }, []);

  // Xử lý khi click vào một sự kiện
  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  // Đóng modal
  const closeModal = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Schedule</h1>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
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
                event.details.type === "Counselor" ? "#3B82F6" : "#10B981", // Màu khác nhau cho Counselor và Homeroom
              color: "white",
              borderRadius: "4px",
              border: "none",
            },
          })}
        />
      </div>

      {/* Modal hiển thị chi tiết */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Booking Details
            </h2>
            <div className="space-y-2">
              <p className="text-gray-600">
                <span className="font-medium">Consultant:</span>{" "}
                {selectedEvent.details.consultantName}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Date:</span>{" "}
                {selectedEvent.details.date}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Time:</span>{" "}
                {selectedEvent.details.time}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Type:</span>{" "}
                {selectedEvent.details.type}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Meeting Type:</span>{" "}
                {selectedEvent.details.meetingType}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;

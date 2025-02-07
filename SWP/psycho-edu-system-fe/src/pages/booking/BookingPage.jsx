import React, { useState, createContext, useContext } from "react";
import {
  FaCheckCircle,
  FaChild,
  FaChalkboardTeacher,
  FaUserTie,
  FaCalendarAlt,
  FaClock,
  FaVideo,
  FaBuilding,
  FaArrowRight,
  FaArrowLeft,
} from "react-icons/fa";
import { format } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BookingContext = createContext();

const consultants = [
  {
    id: 1,
    name: "Dr. Sarah",
    role: "Counselor",
    type: "counselor",
    image:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    bookedSlots: ["2024-02-10 09:00 AM", "2024-02-11 02:00 PM"],
  },
  {
    id: 2,
    name: "Prof. Thinh",
    role: "Teacher",
    type: "teacher",
    classId: "class-1",
    image:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    bookedSlots: ["2024-02-12 10:00 AM", "2024-02-13 03:00 PM"],
  },
  {
    id: 3,
    name: "Prof. Ben",
    role: "Teacher",
    type: "teacher",
    classId: "class-2",
    image:
      "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80",
    bookedSlots: ["2024-02-12 11:00 AM", "2024-02-13 04:00 PM"],
  },
];

const children = [
  { id: 1, name: "Tri", grade: "Grade 8", classId: "class-1" },
  { id: 2, name: "Trinh", grade: "Grade 10", classId: "class-2" },
];

const BookingPage = () => {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState(null);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointmentType, setAppointmentType] = useState(null);
  const [userInfo, setUserInfo] = useState({ name: "", phone: "", email: "" });

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!role) {
          toast.error("Please select your role");
          return false;
        }
        break;
      case 2:
        if (!selectedDate || !selectedTime || !appointmentType) {
          toast.error("Please select date, time and appointment type");
          return false;
        }
        break;
      case 3:
        if (!selectedConsultant || (role === "parent" && !selectedChild)) {
          toast.error("Please complete all selections");
          return false;
        }
        break;
      case 4:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;
        if (!userInfo.name || !userInfo.phone || !userInfo.email) {
          toast.error("Please fill all required fields");
          return false;
        }
        if (!emailRegex.test(userInfo.email)) {
          toast.error("Please enter a valid email");
          return false;
        }
        if (!phoneRegex.test(userInfo.phone)) {
          toast.error("Please enter a valid 10-digit phone number");
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleConfirm = () => {
    toast.success("Booking confirmed successfully!");
  };

  return (
    <BookingContext.Provider
      value={{
        role,
        setRole,
        selectedConsultant,
        setSelectedConsultant,
        selectedChild,
        setSelectedChild,
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
        appointmentType,
        setAppointmentType,
        userInfo,
        setUserInfo,
      }}
    >
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <ProgressBar currentStep={step} />

          {step === 1 && <RoleSelection />}
          {step === 2 && <DateTimeSelection />}
          {step === 3 && <ConsultantSelection />}
          {step === 4 && <UserInfoForm />}
          {step === 5 && <ConfirmationStep />}

          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
            )}
            {step < 5 ? (
              <button
                onClick={handleNext}
                className="ml-auto flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Next <FaArrowRight className="ml-2" />
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                className="ml-auto flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirm Booking <FaCheckCircle className="ml-2" />
              </button>
            )}
          </div>
        </div>
        <ToastContainer position="bottom-right" />
      </div>
    </BookingContext.Provider>
  );
};

const ProgressBar = ({ currentStep }) => {
  const steps = [
    "Select Role",
    "Select Consultant",
    "Choose DateTime",
    "Your Info",
    "Confirm",
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                index + 1 <= currentStep
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {index + 1 < currentStep ? <FaCheckCircle /> : index + 1}
            </div>
            <span className="mt-2 text-sm text-gray-600">{step}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 relative">
        <div className="absolute top-0 h-1 bg-gray-200 w-full">
          <div
            className="absolute h-1 bg-blue-600 transition-all duration-500"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

const RoleSelection = () => {
  const { role, setRole } = useContext(BookingContext);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-6">I am a...</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <button
          onClick={() => setRole("student")}
          className={`p-6 rounded-lg border ${
            role === "student"
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200"
          } hover:border-blue-600 transition-colors`}
        >
          <div className="flex flex-col items-center text-center">
            <FaUserTie className="text-4xl mb-4 text-blue-600" />
            <h3 className="font-semibold text-lg">Student</h3>
            <p className="text-sm text-gray-600 mt-2">
              Book a session with a counselor or your teacher
            </p>
          </div>
        </button>
        <button
          onClick={() => setRole("parent")}
          className={`p-6 rounded-lg border ${
            role === "parent" ? "border-blue-600 bg-blue-50" : "border-gray-200"
          } hover:border-blue-600 transition-colors`}
        >
          <div className="flex flex-col items-center text-center">
            <FaChild className="text-4xl mb-4 text-blue-600" />
            <h3 className="font-semibold text-lg">Parent</h3>
            <p className="text-sm text-gray-600 mt-2">
              Book a session for your child
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

const ConsultantSelection = () => {
  const {
    role,
    selectedConsultant,
    setSelectedConsultant,
    selectedChild,
    setSelectedChild,
  } = useContext(BookingContext);
  const [consultantType, setConsultantType] = useState(null);

  const autoSelectTeacher = (child) => {
    const teacherForClass = consultants.find(
      (c) => c.type === "teacher" && c.classId === child.classId
    );
    setSelectedConsultant(teacherForClass);
  };

  const handleChildSelect = (child) => {
    setSelectedChild(child);
    if (consultantType === "teacher") {
      autoSelectTeacher(child);
    }
  };

  return (
    <div className="space-y-6">
      {role === "parent" && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Select Child</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => handleChildSelect(child)}
                className={`p-4 rounded-lg border ${
                  selectedChild?.id === child.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center">
                  <FaChild className="text-2xl mr-3 text-gray-600" />
                  <div className="text-left">
                    <h4 className="font-medium">{child.name}</h4>
                    <p className="text-sm text-gray-600">{child.grade}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Select Consultant Type</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => {
              setConsultantType("counselor");
              setSelectedConsultant(null);
            }}
            className={`p-4 rounded-lg border ${
              consultantType === "counselor"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <FaChalkboardTeacher className="text-2xl mr-3 text-gray-600" />
              <span>Counselor</span>
            </div>
          </button>
          <button
            onClick={() => {
              setConsultantType("teacher");
              if (selectedChild) {
                autoSelectTeacher(selectedChild);
              }
            }}
            className={`p-4 rounded-lg border ${
              consultantType === "teacher"
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <FaUserTie className="text-2xl mr-3 text-gray-600" />
              <span>Homeroom Teacher</span>
            </div>
          </button>
        </div>
      </div>

      {consultantType === "teacher" && selectedConsultant && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium mb-2">Your Assigned Teacher:</h4>
          <div className="flex items-center">
            <img
              src={selectedConsultant.image}
              alt={selectedConsultant.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="ml-3">
              <p className="font-medium">{selectedConsultant.name}</p>
              <p className="text-sm text-gray-600">{selectedConsultant.role}</p>
            </div>
          </div>
        </div>
      )}

      {consultantType === "counselor" && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Select Consultant</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {consultants
              .filter((c) => c.type === "counselor")
              .map((consultant) => (
                <button
                  key={consultant.id}
                  onClick={() => setSelectedConsultant(consultant)}
                  className={`p-4 rounded-lg border ${
                    selectedConsultant?.id === consultant.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center">
                    <img
                      src={consultant.image}
                      alt={consultant.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="ml-3 text-left">
                      <h4 className="font-medium">{consultant.name}</h4>
                      <p className="text-sm text-gray-600">{consultant.role}</p>
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DateTimeSelection = () => {
  const {
    selectedConsultant,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    appointmentType,
    setAppointmentType,
  } = useContext(BookingContext);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const isSlotBooked = (date, time) => {
    const dateTimeString = `${date} ${time}`;
    return selectedConsultant?.bookedSlots?.includes(dateTimeString);
  };

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
  ];

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Date</h3>
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <FaCalendarAlt className="text-2xl text-gray-600 mr-2" />
              <span className="font-medium">
                {format(currentMonth, "MMMM yyyy")}
              </span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handlePrevMonth}
                disabled={currentMonth <= new Date()}
                className="text-blue-600 hover:text-blue-700 disabled:text-gray-400"
              >
                <FaArrowLeft className="inline mr-1" /> Prev Month
              </button>
              <button
                onClick={handleNextMonth}
                className="text-blue-600 hover:text-blue-700"
              >
                Next Month <FaArrowRight className="inline ml-1" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-gray-600"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {Array(firstDayOfMonth)
              .fill(null)
              .map((_, index) => (
                <div key={`empty-${index}`} />
              ))}
            {days.map((day) => {
              const date = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                day
              );
              const isDisabled = date < new Date();
              return (
                <button
                  key={day}
                  onClick={() =>
                    !isDisabled && setSelectedDate(format(date, "yyyy-MM-dd"))
                  }
                  disabled={isDisabled}
                  className={`p-2 rounded-lg ${
                    selectedDate === format(date, "yyyy-MM-dd")
                      ? "bg-blue-600 text-white"
                      : isDisabled
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "hover:bg-blue-50"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Select Time</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {timeSlots.map((time) => {
              const isBooked = isSlotBooked(selectedDate, time);
              return (
                <button
                  key={time}
                  onClick={() => !isBooked && setSelectedTime(time)}
                  disabled={isBooked}
                  className={`p-3 rounded-lg border ${
                    isBooked
                      ? "bg-red-50 border-red-200 cursor-not-allowed"
                      : selectedTime === time
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-blue-600"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <FaClock className="mr-2" />
                    {time}
                    {isBooked && (
                      <span className="ml-2 text-red-500 text-sm">
                        (Booked)
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedTime && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">
            Select Appointment Type
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setAppointmentType("video")}
              className={`p-4 rounded-lg border ${
                appointmentType === "video"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200"
              } hover:border-blue-600`}
            >
              <div className="flex items-center">
                <FaVideo className="text-2xl mr-3 text-gray-600" />
                <span>Video Call</span>
              </div>
            </button>
            <button
              onClick={() => setAppointmentType("in-person")}
              className={`p-4 rounded-lg border ${
                appointmentType === "in-person"
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200"
              } hover:border-blue-600`}
            >
              <div className="flex items-center">
                <FaBuilding className="text-2xl mr-3 text-gray-600" />
                <span>In-Person</span>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const UserInfoForm = () => {
  const { userInfo, setUserInfo } = useContext(BookingContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          name="name"
          value={userInfo.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          value={userInfo.phone}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={userInfo.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
    </div>
  );
};

const ConfirmationStep = () => {
  const {
    role,
    selectedConsultant,
    selectedChild,
    selectedDate,
    selectedTime,
    appointmentType,
    userInfo,
  } = useContext(BookingContext);

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-green-800 mb-4">
          Booking Summary
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Booking Type:</span>
            <span className="font-medium">
              {role === "parent" ? "Parent Booking" : "Student Booking"}
            </span>
          </div>

          {role === "parent" && selectedChild && (
            <div className="flex justify-between">
              <span className="text-gray-600">Child:</span>
              <span className="font-medium">{selectedChild.name}</span>
            </div>
          )}

          {selectedConsultant && (
            <div className="flex justify-between">
              <span className="text-gray-600">Consultant:</span>
              <span className="font-medium">{selectedConsultant.name}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span className="text-gray-600">Date & Time:</span>
            <span className="font-medium">
              {selectedDate} at {selectedTime}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600">Meeting Type:</span>
            <span className="font-medium capitalize">{appointmentType}</span>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-2">Contact Information</h4>
            <div className="space-y-2">
              <p className="text-gray-600">Name: {userInfo.name}</p>
              <p className="text-gray-600">Phone: {userInfo.phone}</p>
              <p className="text-gray-600">Email: {userInfo.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;

import { useState, useEffect } from "react";
import { BookingProvider, useBooking } from "../../context/BookingContext";
import { ChildSelection } from "../../components/Booking/BookingSteps/ChildSelection";
import { ConsultantTypeSelection } from "../../components/Booking/BookingSteps/ConsultantTypeSelection";
import { ConsultantSelection } from "../../components/Booking/BookingSteps/ConsultantSelection";
import { DateTimeSelection } from "../../components/Booking/BookingSteps/DateTimeSelection";
import { ConfirmationStep } from "../../components/Booking/BookingSteps/ConfirmationStep";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAuthDataFromLocalStorage } from "../../utils/auth";
import axios from "axios";

const BookingPageContent = () => {
  const { isParent, bookingData, updateBookingData, resetBookingData } =
    useBooking();
  const [step, setStep] = useState(1);
  const [totalSteps, setTotalSteps] = useState(5);
  const [studentId, setStudentId] = useState(null);
  const navigate = useNavigate();

  // Lấy authData một lần ngoài useEffect để tránh thay đổi tham chiếu
  const authData = getAuthDataFromLocalStorage();
  const userId = authData?.userId;

  // Xác định studentId dựa trên role (chỉ chạy khi mount hoặc role thay đổi)
  useEffect(() => {
    let isMounted = true;

    const determineStudentId = async () => {
      if (!isMounted) return;

      if (studentId) return; // Tránh chạy lại nếu đã có studentId

      if (!isParent()) {
        // Role Student: Lấy studentId từ accessToken (userId)
        if (isMounted) {
          setStudentId(userId);
          updateBookingData({ appointmentFor: userId });
        }
      } else {
        // Role Parent: Lấy studentId từ bookingData.childId hoặc fetch nếu chưa có
        if (bookingData.childId && isMounted) {
          setStudentId(bookingData.childId);
          updateBookingData({ appointmentFor: bookingData.childId });
        } else {
          try {
            const response = await axios.get(
              `https://localhost:7192/api/relationships/parent/${userId}`,
              {
                headers: {
                  Authorization: `Bearer ${authData.accessToken}`,
                  "Content-Type": "application/json",
                },
              }
            );
            console.log("API Response for children:", response.data);
            const result = response.data.result || response.data;
            if (Array.isArray(result) && result.length > 0 && isMounted) {
              const firstChildId = result[0].studentId;
              setStudentId(firstChildId);
              updateBookingData({
                appointmentFor: firstChildId,
                childId: firstChildId,
              });
            } else if (isMounted) {
              console.warn("No children found for this parent.");
            }
          } catch (error) {
            console.error("Error fetching children:", error.message);
          }
        }
      }
    };

    determineStudentId();

    // Cleanup
    return () => {
      isMounted = false;
    };
  }, [isParent, userId]); // Loại bỏ authData.accessToken và bookingData.childId khỏi dependency

  useEffect(() => {
    // Cập nhật totalSteps dựa trên role
    setTotalSteps(isParent() ? 5 : 4);
  }, [isParent]);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleNextWithValidation = () => {
    const userInfoStep = isParent() ? 5 : 4; // Bước UserInfoForm
    if (step === userInfoStep) {
      if (!bookingData.userName || !bookingData.phone || !bookingData.email) {
        console.log("Missing fields:", {
          userName: bookingData.userName,
          phone: bookingData.phone,
          email: bookingData.email,
        });
        toast.error("Please fill in all required fields!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }
    }
    handleNext();
  };

  const handleConfirm = async () => {
    if (
      !studentId ||
      !bookingData.consultantId ||
      !bookingData.date ||
      !bookingData.slotId
    ) {
      toast.error("Please complete all steps before confirming.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const authData = getAuthDataFromLocalStorage();
      const appointmentData = {
        bookedBy: userId, // ID của người đặt lịch (Parent hoặc Student)
        appointmentFor: studentId, // ID của student (từ userId hoặc childId)
        meetingWith: bookingData.consultantId, // ID của teacher hoặc counselor
        date: bookingData.date,
        slotId: bookingData.slotId,
        isOnline: bookingData.appointmentType === "online",
      };

      console.log("Submitting appointment data:", appointmentData);

      const response = await axios.post(
        "https://localhost:7192/api/appointments",
        appointmentData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.accessToken}`,
          },
        }
      );

      if (!response.data.isSuccess || response.data.statusCode !== 200) {
        throw new Error(response.data.message || "Failed to save appointment");
      }

      console.log("Appointment saved successfully:", response.data);

      toast.success("Booking registered successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      const schedulePath = isParent()
        ? "/parent/schedule"
        : "/student/schedule";
      setTimeout(() => {
        resetBookingData();
        navigate(schedulePath);
      }, 3000);
    } catch (error) {
      console.error("Error confirming appointment:", error);
      toast.error(
        `Failed to register appointment: ${
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
    }
  };

  const renderStepContent = () => {
    if (isParent()) {
      switch (step) {
        case 1:
          return <ChildSelection />;
        case 2:
          return <ConsultantTypeSelection />;
        case 3:
          return <ConsultantSelection />;
        case 4:
          return <DateTimeSelection />;
        case 5:
          return <ConfirmationStep />;
        default:
          return null;
      }
    }

    switch (step) {
      case 1:
        return <ConsultantTypeSelection />;
      case 2:
        return <ConsultantSelection />;
      case 3:
        return <DateTimeSelection />;
      case 4:
        return <ConfirmationStep />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-blue-500 transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {renderStepContent()}

        <div className="mt-8 flex justify-between">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </button>
          )}

          {step < totalSteps ? (
            <button
              onClick={handleNextWithValidation}
              className="ml-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              className="ml-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Confirm Booking
            </button>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

const BookingPage = () => {
  return (
    <BookingProvider>
      <BookingPageContent />
    </BookingProvider>
  );
};

export default BookingPage;

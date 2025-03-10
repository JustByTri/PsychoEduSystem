import axios from "axios";
import { parseISO } from "date-fns";

const API_BASE_URL = "https://localhost:7192/api";

// Lấy thông tin profile của user dựa trên username
export const fetchUserProfile = async () => {
  try {
    const userResponse = await axios.get(
      `${API_BASE_URL}/User/username/student1`
    );
    const userId = userResponse.data.userId;
    const profileResponse = await axios.get(
      `${API_BASE_URL}/User/profile?userId=${userId}`
    );
    if (profileResponse.data.isSuccess) {
      return { ...profileResponse.data.result, userId };
    } else {
      throw new Error(
        profileResponse.data.message || "Failed to get user profile"
      );
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to load user profile. Please try again later.");
  }
};

// Lấy danh sách appointments theo ngày và userId
export const fetchAppointments = async (userId, date) => {
  try {
    const formattedDate = date.toISOString().split("T")[0]; // Format yyyy-MM-dd
    console.log("Fetching appointments for date:", formattedDate); // Log ngày gửi đi
    const response = await axios.get(
      `${API_BASE_URL}/appointments/students/${userId}/appointments?selectedDate=${formattedDate}`
    );
    console.log("API response:", response.data); // Log phản hồi từ API
    if (response.data.isSuccess) {
      return response.data.result.map((appointment) => ({
        id: appointment.appointmentId,
        studentId: userId,
        student: appointment.appointmentFor || "Unknown Student",
        lesson: appointment.meetingWith || "Unspecified Lesson",
        platform: appointment.isOnline ? "Online" : "Offline",
        sessions: {
          monthly: appointment.monthlySessionsRemaining || 10,
          quarterly: appointment.quarterlySessionsRemaining || 4,
        },
        date: parseISO(appointment.date.split("/").reverse().join("-")),
        time: appointment.timeSlot || "18:00 - 18:45",
        status: appointment.isCancelled
          ? "Cancelled"
          : appointment.isCompleted
          ? "Completed"
          : "Scheduled",
        type: appointment.appointmentType || "45MINS",
        evaluated: appointment.isEvaluated || appointment.isCompleted,
        appointmentId: appointment.appointmentId,
        isCancelled: appointment.isCancelled || false,
      }));
    } else {
      throw new Error(response.data.message || "Failed to fetch appointments");
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};
// Hủy appointment
export const cancelAppointment = async (appointmentId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/appointments/${appointmentId}/cancellation`
    );
    if (response.data.isSuccess) {
      return response.data.message || "Appointment cancelled successfully!";
    } else {
      throw new Error(response.data.message || "Failed to cancel appointment");
    }
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    throw error;
  }
};

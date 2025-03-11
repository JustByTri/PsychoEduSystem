import axios from "axios";
import { parseISO, startOfDay } from "date-fns";
import { getAuthDataFromLocalStorage } from "../utils/auth";

const API_BASE_URL = "https://localhost:7192/api";

export const fetchUserProfile = async () => {
  try {
    // Get auth data using your existing function
    const authData = getAuthDataFromLocalStorage();

    if (!authData || !authData.accessToken || !authData.userId) {
      throw new Error("Authentication data not found. Please log in.");
    }

    // Fetch profile using the userId from authData
    const profileResponse = await axios.get(
      `${API_BASE_URL}/User/profile?userId=${authData.userId}`,
      {
        headers: {
          Authorization: `Bearer ${authData.accessToken}`,
        },
      }
    );

    if (profileResponse.data.isSuccess) {
      return { ...profileResponse.data.result, userId: authData.userId };
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

export const fetchAppointments = async (userId, date) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/appointments/students/${userId}/appointments?selectedDate=${date}`
    );
    if (response.data.isSuccess) {
      return response.data.result.map((appointment) => {
        const parsedDate = parseISO(
          appointment.date.split("/").reverse().join("-")
        );
        const localDate = startOfDay(parsedDate); // Chuẩn hóa ngày
        return {
          id: appointment.appointmentId,
          studentId: userId,
          student: appointment.appointmentFor || "Unknown Student",
          consultant: appointment.meetingWith || "Unknown Counsultant",
          type: appointment.isOnline ? "Online" : "Offline",
          date: localDate,
          slot: appointment.slotId || 0,
          status: appointment.isCancelled
            ? "Cancelled"
            : appointment.isCompleted
            ? "Completed"
            : "Scheduled",
          appointmentId: appointment.appointmentId,
          isCancelled: appointment.isCancelled || false,
          googleMeetURL: appointment.googleMeetURL || null,
        };
      });
    } else {
      throw new Error(response.data.message || "Failed to fetch appointments");
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};
export const cancelAppointment = async (appointmentId) => {
  try {
    console.log("Cancelling appointment with ID:", appointmentId);

    if (!appointmentId) {
      throw new Error("Appointment ID is undefined");
    }

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

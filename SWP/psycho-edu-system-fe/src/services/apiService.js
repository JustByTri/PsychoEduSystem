import axios from "axios";
import { parseISO, startOfDay } from "date-fns";
import { getAuthDataFromLocalStorage } from "../utils/auth";

const API_BASE_URL = "https://localhost:7192/api";
const authData = getAuthDataFromLocalStorage();

const apiService = {
  // Lấy profile người dùng
  fetchUserProfile: async () => {
    try {
      if (!authData || !authData.accessToken || !authData.userId) {
        throw new Error("Authentication data not found. Please log in.");
      }

      const profileResponse = await axios.get(
        `${API_BASE_URL}/User/profile?userId=${authData.userId}`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
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
  },

  // Kiểm tra sự tồn tại của user (dùng cho email và studentEmail)
  checkUserExistence: async (email) => {
    try {
      if (!authData || !authData.accessToken) {
        throw new Error("Authentication required. Please log in.");
      }

      const response = await axios.get(
        `${API_BASE_URL}/User/check-existence?userName=dummy&email=${email}`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data; // { message: "User does not exist" } hoặc khác
    } catch (error) {
      console.error("Error checking user existence:", error);
      throw error;
    }
  },

  // Tạo tài khoản mới
  createUserAccount: async (userData) => {
    try {
      if (!authData || !authData.accessToken) {
        throw new Error("Authentication required. Please log in.");
      }

      const response = await axios.post(
        `${API_BASE_URL}/User/create-account`,
        userData,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.message) {
        return response.data; // { message: "Account created successfully." }
      } else {
        throw new Error("Failed to create account");
      }
    } catch (error) {
      console.error("Error creating user account:", error);
      throw error;
    }
  },
  // Lấy danh sách appointment của sinh viên
  fetchAppointments: async (userId, date) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/appointments/students/${userId}/appointments?selectedDate=${date}`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.isSuccess) {
        return response.data.result.map((appointment) => {
          const parsedDate = parseISO(
            appointment.date.split("/").reverse().join("-")
          );
          const localDate = startOfDay(parsedDate);
          return {
            id: appointment.appointmentId,
            studentId: userId,
            student: appointment.appointmentFor || "Unknown Student",
            consultant: appointment.meetingWith || "Unknown Consultant",
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
        throw new Error(
          response.data.message || "Failed to fetch appointments"
        );
      }
    } catch (error) {
      throw error;
    }
  },

  // Hủy appointment
  cancelAppointment: async (appointmentId) => {
    try {
      if (!appointmentId) {
        throw new Error("Appointment ID is undefined");
      }

      const response = await axios.get(
        `${API_BASE_URL}/appointments/${appointmentId}/cancellation`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.isSuccess) {
        return response.data.message || "Appointment cancelled successfully!";
      } else {
        throw new Error(
          response.data.message || "Failed to cancel appointment"
        );
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      throw error;
    }
  },

  // Lấy danh sách slot khả dụng trong ngày
  fetchAvailableSlots: async (date) => {
    try {
      if (!authData || !authData.accessToken) {
        throw new Error("Authentication required. Please log in.");
      }

      const response = await axios.get(
        `${API_BASE_URL}/Schedule/available-slots/${date}`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && Array.isArray(response.data)) {
        return response.data; // [{ slotId, slotName, isAvailable }, ...]
      } else {
        throw new Error(
          "Failed to fetch available slots or invalid data format"
        );
      }
    } catch (error) {
      throw new Error();
    }
  },

  // Lấy danh sách slot của consultant
  fetchConsultantSlots: async (consultantId, date) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/User/${consultantId}/slots?selectedDate=${date}`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        return response.data.result || response.data || [];
      } else {
        throw new Error("Failed to fetch consultant slots");
      }
    } catch (error) {
      console.error("Error fetching consultant slots:", error);
      throw error;
    }
  },

  // Lấy danh sách con của phụ huynh
  fetchParentChildren: async (parentId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/relationships/parent/${parentId}`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.result || response.data || [];
    } catch (error) {
      console.error("Error fetching parent children:", error);
      throw error;
    }
  },

  // Đặt lịch hẹn
  bookAppointment: async (appointmentData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/appointments`,
        appointmentData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error booking appointment:", error);
      throw error;
    }
  },

  // Lấy danh sách slot đã book của user
  fetchUserSchedules: async (userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/Schedule/user-schedules/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && Array.isArray(response.data)) {
        return response.data;
      } else {
        throw new Error("Failed to fetch user schedules");
      }
    } catch (error) {
      console.error("Error fetching user schedules:", error);
      throw error;
    }
  },

  // Book slots cho chuyên viên
  bookSlots: async (payload) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/Schedule/book-slots`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to book slots");
      }
    } catch (error) {
      console.error("Error booking slots:", error);
      throw error;
    }
  },

  // Lấy danh sách appointment của chuyên viên
  fetchConsultantAppointments: async (teacherId, date) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/appointments/consultants/${teacherId}/appointments?selectedDate=${date}`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data.isSuccess) {
        return response.data.result || [];
      } else {
        throw new Error("Failed to fetch consultant appointments");
      }
    } catch (error) {
      console.error("Error fetching consultant appointments:", error);
      throw error;
    }
  },
};

export default apiService;

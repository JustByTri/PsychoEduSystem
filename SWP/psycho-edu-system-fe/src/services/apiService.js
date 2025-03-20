import axios from "axios";
import { parseISO, startOfDay, format } from "date-fns";
import { getAuthDataFromLocalStorage } from "../utils/auth";

const API_BASE_URL = "https://localhost:7192/api";
const authData = getAuthDataFromLocalStorage();

const apiService = {
  // Lấy profile người dùng
  fetchUserProfile: async (userId) => {
    try {
      if (!authData || !authData.accessToken) {
        throw new Error("Authentication data not found. Please log in.");
      }

      const profileResponse = await axios.get(
        `${API_BASE_URL}/User/profile?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (profileResponse.data.isSuccess) {
        console.log("User Profile Response:", profileResponse.data.result); // Log dữ liệu
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
  },

  updateUserProfile: async (userId, data, config = {}) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/User/profile/${userId}`,
        data,
        {
          ...config,
          headers: {
            "Content-Type": "application/json",
            ...config.headers,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to update profile"
      );
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
      const formattedDate = format(new Date(date), "yyyy-MM-dd");
      const response = await axios.get(
        `${API_BASE_URL}/appointments/students/${userId}/appointments?selectedDate=${formattedDate}`,
        {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.isSuccess) {
        console.log("API Response:", response.data.result);
        return response.data.result.map((appointment) => {
          const parsedDate = parseISO(
            appointment.date.split("/").reverse().join("-")
          );
          const localDate = startOfDay(parsedDate);
          return {
            id: appointment.appointmentId,
            studentId: appointment.studentId || userId,
            appointmentFor: appointment.appointmentFor, // Không gán mặc định
            bookedBy: appointment.bookedBy, // Không gán mặc định
            meetingWith: appointment.meetingWith, // Không gán mặc định
            type: appointment.isOnline ? "Online" : "Offline",
            date: localDate,
            slot: appointment.slotId || 0,
            status: appointment.isCancelled
              ? "Cancelled"
              : appointment.isCompleted
              ? "Completed"
              : "Scheduled",
            notes: appointment.notes,
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
      console.log(response.data.result);

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
      const { bookedBy, appointmentFor, meetingWith, date, slotId, isOnline } =
        appointmentData;
      if (!bookedBy || !appointmentFor || !meetingWith || !date || !slotId) {
        throw new Error("Missing required fields in appointment data");
      }

      let formattedDate;
      try {
        const parsedDate = parseISO(date);
        formattedDate = format(parsedDate, "yyyy-MM-dd");
      } catch (error) {
        throw new Error("Invalid date format. Please use YYYY-MM-DD");
      }

      const payload = {
        bookedBy: bookedBy, // Giữ nguyên ID của người book
        appointmentFor: appointmentFor,
        meetingWith: meetingWith,
        date: formattedDate,
        slotId: Number(slotId),
        isOnline: Boolean(isOnline),
      };

      console.log("Booking Payload:", payload); // Log payload gửi đi

      const response = await axios.post(
        `${API_BASE_URL}/appointments`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authData.accessToken}`,
          },
        }
      );

      if (!response.data.isSuccess) {
        throw new Error(response.data.message || "Failed to book appointment");
      }

      // Trả về dữ liệu đầy đủ để lưu trữ
      return {
        isSuccess: true,
        message: response.data.message || "Booking successful",
        result: {
          appointmentId: response.data.result?.appointmentId || null,
          bookedBy: payload.bookedBy,
          appointmentFor: payload.appointmentFor,
          meetingWith: payload.meetingWith,
          date: payload.date,
          slotId: payload.slotId,
          isOnline: payload.isOnline,
        },
      };
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Error booking appointment";
      console.error("Error booking appointment:", errorMessage);
      throw {
        statusCode: error.response?.data?.statusCode || 500,
        message: errorMessage,
        isSuccess: false,
        result: null,
      };
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
        // Backend trả về chuỗi "Slots booked successfully!" thay vì object
        const bookedSlots = payload.bookingDetails.map((booking) => ({
          bookingId: null, // Không có bookingId từ response, để null
          slotId: booking.slotId,
          date: booking.date,
        }));

        return {
          isSuccess: true,
          message: response.data || "Slots booked successfully!",
          bookings: bookedSlots, // Tự tạo danh sách bookings dựa trên payload
        };
      } else {
        throw new Error("Failed to book slots");
      }
    } catch (error) {
      console.error("Error booking slots:", error);
      throw new Error(error.response?.data?.message || "Failed to book slots");
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
// Mock data for blogs
const mockBlogs = [
  {
    id: 1,
    title: "5 Ways to Reduce Exam Anxiety",
    thumbnail:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    excerpt:
      "Learn how to manage your emotions and prepare effectively for your exams.",
    content: `
        <h2>1. Create a Study Plan</h2>
        <p>Break down your study material and review consistently each day...</p>
        <h2>2. Practice Deep Breathing</h2>
        <p>When feeling stressed, try deep breathing for 5 minutes...</p>
      `,
    category: "Emotional Health",
    createdAt: "2025-03-15",
  },
  {
    id: 2,
    title: "How to Sleep Better?",
    thumbnail:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
    excerpt:
      "Sleep greatly impacts mental health. Find out how to improve yours!",
    content: `
        <h2>1. Stick to a Sleep Schedule</h2>
        <p>Go to bed and wake up at the same time every day...</p>
        <h2>2. Avoid Screens Before Bed</h2>
        <p>Blue light from screens can disrupt your sleep cycle...</p>
      `,
    category: "Cognitive Health",
    createdAt: "2025-03-10",
  },
  {
    id: 3,
    title: "Finding Joy in School Every Day",
    thumbnail:
      "https://images.pexels.com/photos/3184430/pexels-photo-3184430.jpeg?auto=compress&cs=tinysrgb&w=1920",
    excerpt: "Discover happiness in learning and connecting with friends.",
    content: `
        <h2>1. Build Strong Friendships</h2>
        <p>Be open and share with your friends...</p>
        <h2>2. Join Extracurricular Activities</h2>
        <p>Extracurricular activities help reduce stress and bring joy...</p>
      `,
    category: "Social Health",
    createdAt: "2025-03-08",
  },
];

// Thêm các hàm API mock cho blog
apiService.blog = {
  // Lấy danh sách bài viết
  fetchBlogs: async () => {
    try {
      // Giả lập API call
      return Promise.resolve({
        isSuccess: true,
        result: mockBlogs,
      });
    } catch (error) {
      throw new Error("Failed to fetch blogs");
    }
  },

  // Lấy chi tiết bài viết
  fetchBlogById: async (id) => {
    try {
      const blog = mockBlogs.find((b) => b.id === parseInt(id));
      if (blog) {
        return Promise.resolve({
          isSuccess: true,
          result: blog,
        });
      } else {
        throw new Error("Blog not found");
      }
    } catch (error) {
      throw new Error("Failed to fetch blog");
    }
  },

  // Tạo bài viết mới
  createBlog: async (blogData) => {
    try {
      const newBlog = {
        id: mockBlogs.length + 1,
        ...blogData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      mockBlogs.push(newBlog);
      return Promise.resolve({
        isSuccess: true,
        message: "Blog created successfully",
        result: newBlog,
      });
    } catch (error) {
      throw new Error("Failed to create blog");
    }
  },

  // Cập nhật bài viết
  updateBlog: async (id, blogData) => {
    try {
      const index = mockBlogs.findIndex((b) => b.id === parseInt(id));
      if (index !== -1) {
        mockBlogs[index] = { ...mockBlogs[index], ...blogData };
        return Promise.resolve({
          isSuccess: true,
          message: "Blog updated successfully",
          result: mockBlogs[index],
        });
      } else {
        throw new Error("Blog not found");
      }
    } catch (error) {
      throw new Error("Failed to update blog");
    }
  },

  // Xóa bài viết
  deleteBlog: async (id) => {
    try {
      const index = mockBlogs.findIndex((b) => b.id === parseInt(id));
      if (index !== -1) {
        mockBlogs.splice(index, 1);
        return Promise.resolve({
          isSuccess: true,
          message: "Blog deleted successfully",
        });
      } else {
        throw new Error("Blog not found");
      }
    } catch (error) {
      throw new Error("Failed to delete blog");
    }
  },
};
export default apiService;

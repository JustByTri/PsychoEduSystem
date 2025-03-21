import axios from "axios";
import { parseISO, startOfDay, format } from "date-fns";
import { getAuthDataFromLocalStorage } from "../utils/auth";

const API_BASE_URL = "https://localhost:7192/api";
const authData = getAuthDataFromLocalStorage();

const apiService = {
  // Các API khác giữ nguyên, chỉ cập nhật phần blog
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
        console.log("User Profile Response:", profileResponse.data.result);
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
            Authorization: `Bearer ${authData.accessToken}`,
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
      return response.data;
    } catch (error) {
      console.error("Error checking user existence:", error);
      throw error;
    }
  },

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
        return response.data;
      } else {
        throw new Error("Failed to create account");
      }
    } catch (error) {
      console.error("Error creating user account:", error);
      throw error;
    }
  },

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
            appointmentFor: appointment.appointmentFor,
            bookedBy: appointment.bookedBy,
            meetingWith: appointment.meetingWith,
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
        return response.data;
      } else {
        throw new Error(
          "Failed to fetch available slots or invalid data format"
        );
      }
    } catch (error) {
      throw new Error();
    }
  },

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
        bookedBy: bookedBy,
        appointmentFor: appointmentFor,
        meetingWith: meetingWith,
        date: formattedDate,
        slotId: Number(slotId),
        isOnline: Boolean(isOnline),
      };

      console.log("Booking Payload:", payload);

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
        const bookedSlots = payload.bookingDetails.map((booking) => ({
          bookingId: null,
          slotId: booking.slotId,
          date: booking.date,
        }));

        return {
          isSuccess: true,
          message: response.data || "Slots booked successfully!",
          bookings: bookedSlots,
        };
      } else {
        throw new Error("Failed to book slots");
      }
    } catch (error) {
      console.error("Error booking slots:", error);
      throw new Error(error.response?.data?.message || "Failed to book slots");
    }
  },

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

  // Cập nhật API cho Blog (không yêu cầu Authorization)
  blog: {
    // Lấy danh sách bài viết (phân trang)
    fetchBlogs: async (pageNumber = 1, pageSize = 10) => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/BlogPost/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          const { blogs } = response.data;
          return {
            isSuccess: true,
            result: blogs.map((blog) => ({
              id: blog.blogId,
              title: blog.title,
              content: blog.content,
              category: blog.dimensionName,
              createdAt: format(new Date(blog.createdAt), "yyyy-MM-dd"),
              thumbnail: blog.thumbnail || "https://via.placeholder.com/150",
              excerpt: blog.content.substring(0, 100) + "...",
            })),
            pagination: {
              pageNumber: response.data.pageNumber,
              pageSize: response.data.pageSize,
              totalPages: response.data.totalPages,
              totalRecords: response.data.totalRecords,
            },
          };
        } else {
          throw new Error("Failed to fetch blogs");
        }
      } catch (error) {
        console.error("Error fetching blogs:", error);
        throw new Error(
          error.response?.data?.message || "Failed to fetch blogs"
        );
      }
    },

    // Lấy chi tiết bài viết
    fetchBlogById: async (id) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/BlogPost/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          const blog = response.data;
          return {
            isSuccess: true,
            result: {
              id: blog.blogId,
              title: blog.title,
              content: blog.content,
              category: blog.dimensionName,
              createdAt: format(new Date(blog.createdAt), "yyyy-MM-dd"),
              thumbnail: blog.thumbnail || "https://via.placeholder.com/150",
              excerpt: blog.content.substring(0, 100) + "...",
            },
          };
        } else {
          throw new Error("Blog not found");
        }
      } catch (error) {
        console.error("Error fetching blog by ID:", error);
        throw new Error(
          error.response?.data?.message || "Failed to fetch blog"
        );
      }
    },

    // Tạo bài viết mới (vẫn cần Authorization vì đây là hành động của admin)
    createBlog: async (blogData) => {
      try {
        const payload = {
          title: blogData.title,
          content: blogData.content,
          authorId: authData?.userId || 1,
          dimensionId: mapCategoryToDimensionId(blogData.category),
        };

        const response = await axios.post(`${API_BASE_URL}/BlogPost`, payload, {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          const blog = response.data;
          return {
            isSuccess: true,
            message: "Blog created successfully",
            result: {
              id: blog.blogId,
              title: blog.title,
              content: blog.content,
              category: blog.dimensionName,
              createdAt: format(new Date(blog.createdAt), "yyyy-MM-dd"),
              thumbnail:
                blogData.thumbnail || "https://via.placeholder.com/150",
              excerpt: blog.content.substring(0, 100) + "...",
            },
          };
        } else {
          throw new Error("Failed to create blog");
        }
      } catch (error) {
        console.error("Error creating blog:", error);
        throw new Error(
          error.response?.data?.message || "Failed to create blog"
        );
      }
    },

    // Cập nhật bài viết (vẫn cần Authorization vì đây là hành động của admin)
    updateBlog: async (id, blogData) => {
      try {
        const payload = {
          title: blogData.title,
          content: blogData.content,
          authorId: authData?.userId || 1,
          dimensionId: mapCategoryToDimensionId(blogData.category),
        };

        const response = await axios.put(
          `${API_BASE_URL}/BlogPost/${id}`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          return {
            isSuccess: true,
            message: "Blog updated successfully",
            result: {
              id,
              title: blogData.title,
              content: blogData.content,
              category: blogData.category,
              createdAt: blogData.createdAt,
              thumbnail:
                blogData.thumbnail || "https://via.placeholder.com/150",
              excerpt: blogData.content.substring(0, 100) + "...",
            },
          };
        } else {
          throw new Error("Blog not found");
        }
      } catch (error) {
        console.error("Error updating blog:", error);
        throw new Error(
          error.response?.data?.message || "Failed to update blog"
        );
      }
    },

    // Xóa bài viết (vẫn cần Authorization vì đây là hành động của admin)
    deleteBlog: async (id) => {
      try {
        const response = await axios.delete(`${API_BASE_URL}/BlogPost/${id}`, {
          headers: {
            Authorization: `Bearer ${authData.accessToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          return {
            isSuccess: true,
            message: "Blog deleted successfully",
          };
        } else {
          throw new Error("Blog not found");
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
        throw new Error(
          error.response?.data?.message || "Failed to delete blog"
        );
      }
    },
  },
};

// Hàm ánh xạ category sang dimensionId
const mapCategoryToDimensionId = (category) => {
  const dimensionMap = {
    "Lo Âu": 1,
    "Trầm Cảm": 2,
    "Căng Thẳng": 3,
  };
  return dimensionMap[category] || 1;
};

export default apiService;

import axios from "axios";
const BASE_URL = "https://localhost:7192/";

export const TargetProgramService = {
  createTargetProgram: async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}api/TargetProgram/create`, data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.status, error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      throw error;
    }
  },
  
  getTargetPrograms: async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/TargetProgram/list`, {
        headers: {
          Accept: "*/*",
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.status, error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      console.error("Failed to fetch target programs");
      return []; // Return empty array if there's an error
    }
  },
  
  updateTargetProgram: async (id, data) => {
    try {
      const response = await axios.put(`${BASE_URL}api/TargetProgram/update/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.status, error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      throw error;
    }
  },
  deleteTargetProgram: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}api/TargetProgram/delete/${id}`, {
        headers: {
          Accept: "*/*",
        },
      });
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error("API Error:", error.response.status, error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      throw error;
    }
  }
};
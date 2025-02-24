import axios from "axios";
const BASE_URL = "https://localhost:7192/";
import DecodeJWT from "../../utils/decodeJwt";

export const SurveyService = {
  getSurveys: async () => {
    try {
      const response = await axios.get(`${BASE_URL}api/Survey`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching surveys:", error);
      return [];
    }
  },
  importSurvey: async (data) => {
    try {
      await axios.post(`${BASE_URL}api/Survey/import`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return true;
    } catch (error) {
      console.error("Error importing survey:", error);
      return false;
    }
  },
  getSurveyContent: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}api/Survey/adjust/${id}`);
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching surveys:", error);
      return [];
    }
  },
  updateSurvey: async (surveyId, data) => {
    try {
      const response = await axios.put(
        `${BASE_URL}api/Survey/update/${surveyId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );
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
  updateSurveyProperty: async (surveyId, updatedSurvey) => {
    try {
      const requestBody = {
        isPublic: Boolean(updatedSurvey.isPublic),
        surveyFor: updatedSurvey.surveyFor || "",
        title: updatedSurvey.surveyName || "",
        description: updatedSurvey.description || "",
      };

      const response = await axios.put(
        `${BASE_URL}api/Survey/${surveyId}`,
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );

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
  submitSurvey: async (data) => {
    try {
      const token = localStorage.getItem("user");
      const formattedToken = JSON.parse(token);
      const accessToken = formattedToken.accessToken;
      const userData = DecodeJWT(accessToken);
      const response = await axios.post(
        `${BASE_URL}api/Survey/submit/${userData.userId}`,
        data
      );
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
  checkUserSurveyStatus: async () => {
    try {
      const token = localStorage.getItem("user");
      const formattedToken = JSON.parse(token);
      const accessToken = formattedToken.accessToken;
      const userData = DecodeJWT(accessToken);
      const response = await axios.get(
        `${BASE_URL}api/Survey/user/${userData.userId}`
      );
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
};

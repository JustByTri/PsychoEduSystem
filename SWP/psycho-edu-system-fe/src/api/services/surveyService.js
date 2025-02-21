import axios from "axios";
const BASE_URL = "https://localhost:7192/";
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
  getSurveyContent: async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}api/Survey/eb4f1b88-1cb0-488e-88f3-2c5484eb0aa9`
      );
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching surveys:", error);
      return [];
    }
  },
};

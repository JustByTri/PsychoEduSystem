import axios from "axios";
import DecodeJWT from "../../utils/decodeJwt";

const BASE_URL = "https://localhost:7192/";

export const TargetProgramService = {
  assignStudentToTargetProgram: async (data) => {
    try {
      const token = localStorage.getItem("user");
      if (!token) {
        throw new Error("No authentication token found.");
      }

      const formattedToken = JSON.parse(token);
      const accessToken = formattedToken.accessToken;

      const userData = DecodeJWT(accessToken);
      const studentId = userData?.userId;

      if (!studentId) {
        throw new Error("UserId not found in token.");
      }

      const requestData = {
        studentId: studentId,
        anxiety: data["Lo Âu"],
        depression: data["Trầm Cảm"],
        stress: data["Căng Thẳng"],
      };

      const response = await axios.post(
        `${BASE_URL}api/TargetProgram/assign`,
        requestData,
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
};

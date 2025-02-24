/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../components/Loadings/Loading";
import { useOutletContext } from "react-router-dom";
import { SurveyService } from "../../api/services/surveyService";

const StartUpPage = () => {
  const location = useLocation();
  const context = useOutletContext() || {};
  const navigate = useNavigate();

  const surveyData = location.state?.surveyData ?? context.surveyData;

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!surveyData) {
        setLoading(false);
        return;
      }

      console.log("Survey Data received:", surveyData);

      try {
        const response = await SurveyService.getSurveyContent(surveyData);
        console.log("Survey response:", response);
        localStorage.setItem("questions", JSON.stringify(response));
        console.log("Survey data saved to localStorage ✅");
      } catch (error) {
        console.error("Lỗi khi lưu survey vào localStorage:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyData();
  }, [surveyData]);

  if (isLoading) return <Loading />;

  if (!surveyData) {
    return (
      <div className="text-center text-lg font-semibold mt-10">
        Bạn đã làm khảo sát rồi! Hẹn gặp lại 🎉
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-cover bg-center">
      <div className="flex flex-col justify-center items-center gap-4 text-white text-center">
        <button
          className="bg-[#6D60FE] hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
          onClick={() => navigate("/student/survey-for-student")}
        >
          Start to survey
        </button>
      </div>
    </div>
  );
};

export default StartUpPage;

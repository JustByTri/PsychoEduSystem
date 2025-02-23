import { useState, useEffect } from "react";
import Loading from "../../components/Loadings/Loading";
import { useNavigate } from "react-router-dom";
import { SurveyService } from "../../api/services/surveyService";
const StartUpPage = () => {
  const [isLoading, setLoading] = useState(true);
  const [isPublic, setIsPublic] = useState(false);
  const [fetchedData, setFetchedData] = useState(null);
  const navigate = useNavigate();
  const fetchSurvey = async () => {
    const response = await SurveyService.getSurveyContent(
      "c2f81325-cf14-4e6c-bda8-54ec317cbdf8"
    );
    setIsPublic(response.isPublic);
    setFetchedData(response);
    localStorage.setItem("questions", JSON.stringify(fetchedData));
  };
  useEffect(() => {
    fetchSurvey();
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  if (isLoading) {
    return <Loading />;
  } else if (isPublic === false) {
    return <div className="">Bạn đã làm rồi! Hẹn gặp lại</div>;
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
        <a
          href="#"
          className="text-blue-400 hover:underline text-sm md:text-base mt-2"
        >
          Skip the survey
        </a>
      </div>
    </div>
  );
};

export default StartUpPage;

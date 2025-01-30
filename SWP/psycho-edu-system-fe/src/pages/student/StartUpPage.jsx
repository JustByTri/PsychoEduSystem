import { useState, useEffect } from "react";
import Loading from "../../components/Loadings/Loading";
import data from "../../data/data.json";
import { useNavigate } from "react-router-dom";

const StartUpPage = () => {
  const [isLoading, setLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setFetchedData(data);
    if (fetchedData) {
      localStorage.setItem("questions", JSON.stringify(fetchedData));
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [fetchedData]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-cover bg-center">
      <div className="flex flex-col justify-center items-center gap-4 text-white text-center">
        <button
          className="bg-[#6D60FE] hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105"
          onClick={() => navigate("/survey-for-student")}
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

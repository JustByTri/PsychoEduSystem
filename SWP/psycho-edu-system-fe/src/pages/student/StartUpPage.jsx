import { useState, useEffect } from "react";
import Loading from "../../components/Loadings/Loading";
import data from "../../data/data.json";

const StartUpPage = () => {
  const [isLoading, setLoading] = useState(true);
  const [fetchedData, setFetchedData] = useState(null);

  useEffect(() => {
    setFetchedData(data);
    if (fetchedData) {
      localStorage.setItem("questions", JSON.stringify(fetchedData));
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Set timeout for 2 seconds
  }, [fetchedData]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full text-white text-center grid bg-cover bg-center">
      <div className="flex flex-col justify-center items-center gap-4">
        <button className="bg-[#6D60FE] hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105">
          Start to survey
        </button>
        <a
          href="/student"
          className="text-blue-400 hover:underline text-sm md:text-base mt-2"
        >
          Skip the survey
        </a>
      </div>
    </div>
  );
};

export default StartUpPage;

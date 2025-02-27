/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "../../components/Loadings/Loading";
import { useOutletContext } from "react-router-dom";
import { SurveyService } from "../../api/services/surveyService";
import { motion } from "framer-motion";
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
      try {
        const response = await SurveyService.getSurveyContent(surveyData);
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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-100 to-gray-300">
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white shadow-xl rounded-xl p-8 w-96 text-center"
        >
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-gray-800 text-lg font-semibold mb-6"
          >
            Bạn đã làm khảo sát rồi! Hẹn gặp lại 🎉
          </motion.p>

          <motion.button
            whileHover={{
              scale: 1.08,
              boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="bg-gray-600 hover:bg-gray-800 text-white font-semibold py-3 px-8 rounded-full shadow-md transition-all duration-300"
            onClick={() => navigate(-1)}
          >
            Quay lại
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0A4275] to-[#1877F2]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col justify-center items-center gap-6 text-white text-center p-10 bg-[#0D3A6D] bg-opacity-90 rounded-xl shadow-2xl"
      >
        <h1 className="text-2xl font-bold">Bắt đầu khảo sát</h1>
        <p className="text-lg opacity-80">
          Khám phá và chia sẻ suy nghĩ của bạn.
        </p>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-[#1877F2] hover:bg-[#0A62D0] text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-all duration-300"
          onClick={() => navigate("/student/survey-for-student")}
        >
          Bắt đầu ngay
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="bg-[#0A62D0] hover:bg-[#083A5B] text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-300"
          onClick={() => navigate(-1)}
        >
          Quay lại
        </motion.button>
      </motion.div>
    </div>
  );
};

export default StartUpPage;

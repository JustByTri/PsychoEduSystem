/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserService } from "../../api/services/userService";
import { useEffect, useState } from "react";
import { SurveyService } from "../../api/services/surveyService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const childrenData = await UserService.getChildren();
        setChildren(childrenData);
      } catch (error) {
        console.log(error);
        toast.error("Lỗi khi tải danh sách trẻ!");
      }
    };

    fetchChildren();
  }, []);

  const handleHelpClick = () => {
    toast.success("Liên hệ hỗ trợ qua email hoặc hotline: 1900 123 456", {
      position: "top-right",
      duration: 4000,
    });
  };

  const handleTakeSurvey = async (studentId) => {
    setLoading(true);
    try {
      const surveyStatus = await SurveyService.checkUserSurveyStatus(studentId);
      if (surveyStatus.canTakeSurvey) {
        if (surveyStatus.surveys.length > 0) {
          const surveyData = await SurveyService.getSurveyContent(
            surveyStatus.surveys[0].surveyId
          );
          localStorage.setItem("questions", JSON.stringify(surveyData));
          console.log("Survey data saved to localStorage ✅");
        }
        navigate(`/survey/${studentId}`);
      } else {
        toast.info("Không có khảo sát nào khả dụng!");
      }
    } catch (error) {
      console.log(error);
      toast.error("Lỗi khi kiểm tra trạng thái khảo sát!");
    } finally {
      setLoading(false);
    }
  };

  const handleViewSurveyResults = (studentId) => {
    navigate(`/overall-survey-result/${studentId}`);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-10 bg-gray-50">
      <ToastContainer />
      <motion.h1
        className="text-4xl font-bold text-gray-900 mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Chọn bé để làm khảo sát
      </motion.h1>

      <motion.p
        className="text-gray-700 text-lg text-center max-w-lg mb-8 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Hãy chọn một bé để bắt đầu khảo sát hoặc xem kết quả khảo sát trước đó.
      </motion.p>

      <motion.div
        className={`${
          children.length === 1
            ? "flex justify-center"
            : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-center items-center"
        }`}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } },
        }}
      >
        {children.map((child) => (
          <motion.div
            key={child.studentId}
            className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col items-center transition-transform hover:-translate-y-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="relative">
              <img
                src={
                  child.image ||
                  `https://i.pravatar.cc/150?img=${
                    Math.floor(Math.random() * 70) + 1
                  }`
                }
                alt={child.name}
                className="w-24 h-24 object-cover rounded-full border-4 border-blue-400 shadow-md"
              />
              <div className="absolute inset-0 rounded-full border-2 border-white"></div>
            </div>
            <h2 className="text-lg font-medium text-gray-800 mt-4">
              {child.relationshipName}
            </h2>

            {/* Buttons for survey actions */}
            <div className="mt-4 flex space-x-4">
              <motion.button
                onClick={() => handleTakeSurvey(child.studentId)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md text-sm font-medium hover:bg-blue-600 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Làm survey cho ${child.relationshipName}`}
              >
                Làm Survey
              </motion.button>

              <motion.button
                onClick={() => handleViewSurveyResults(child.studentId)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-md text-sm font-medium hover:bg-green-600 transition"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={`Xem kết quả survey của ${child.relationshipName}`}
              >
                Xem Kết Quả
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer Buttons */}
      <motion.div
        className="mt-12 flex space-x-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <motion.button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md text-lg font-medium hover:bg-blue-700 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Quay lại trang chính"
        >
          Quay lại trang chính
        </motion.button>

        <motion.button
          onClick={handleHelpClick}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg shadow-md text-lg font-medium hover:bg-gray-700 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Trợ giúp"
        >
          Trợ giúp
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Dashboard;

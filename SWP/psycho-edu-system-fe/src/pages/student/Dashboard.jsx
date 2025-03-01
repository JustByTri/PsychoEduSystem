import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { SurveyService } from "../../api/services/surveyService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [surveyResult, setSurveyResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSurveyResult = async () => {
      setLoading(true);
      try {
        const response = await SurveyService.getSurveyResult({ month, year });
        setSurveyResult(response.length > 0 ? response[0] : null);
      } catch (error) {
        console.error("Error fetching survey result:", error);
        setSurveyResult(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyResult();
  }, [month, year]);

  const getBarColor = (points) => {
    if (points <= 9) return "#2ECC71"; // Mild - Green
    if (points <= 13) return "#F1C40F"; // Moderate - Yellow
    if (points <= 20) return "#E67E22"; // Severe - Orange
    return "#E74C3C"; // Extremely Severe - Red
  };

  const chartData = surveyResult
    ? {
        labels: surveyResult.dimensions.map((dim) => dim.dimensionName),
        datasets: [
          {
            label: "DASS-21 Score",
            data: surveyResult.dimensions.map((dim) => dim.points),
            backgroundColor: surveyResult.dimensions.map((dim) =>
              getBarColor(dim.points)
            ),
            borderColor: "#2C3E50",
            borderWidth: 2,
          },
        ],
      }
    : null;

  return (
    <motion.div
      className="h-screen flex flex-col items-center justify-center bg-white text-gray-900 px-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h1
        className="text-4xl font-extrabold mb-6 text-center"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        📊 Mental Health Assessment -{" "}
        <span className="text-blue-500">DASS-21 Results</span>
      </motion.h1>

      {/* Legend */}
      <motion.div
        className="text-lg flex justify-center gap-8 bg-gray-100 px-6 py-3 rounded-lg shadow-md mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-green-600 text-xl">🟢 Mild: 0-9</span>
        <span className="text-yellow-500 text-xl">🟡 Moderate: 10-13</span>
        <span className="text-orange-500 text-xl">🟠 Severe: 14-20</span>
        <span className="text-red-500 text-xl">🔴 Extremely Severe: 21+</span>
      </motion.div>

      {/* Month & Year Selector */}
      <motion.div
        className="flex gap-6 text-lg bg-gray-200 px-6 py-3 rounded-lg shadow-md"
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="px-4 py-2 rounded-md border border-gray-300 shadow-sm cursor-pointer text-xl focus:ring-2 focus:ring-blue-500"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              Month {m}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="px-4 py-2 rounded-md border border-gray-300 shadow-sm cursor-pointer text-xl focus:ring-2 focus:ring-blue-500"
        >
          {Array.from({ length: 5 }, (_, i) => currentYear - i).map((y) => (
            <option key={y} value={y}>
              Year {y}
            </option>
          ))}
        </select>
      </motion.div>

      {loading ? (
        <motion.p
          className="text-2xl mt-8 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Loading data...
        </motion.p>
      ) : surveyResult ? (
        <motion.div
          className="grid grid-cols-2 gap-8 items-center mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Main Info */}

          {/* Larger Chart */}
          {chartData && (
            <motion.div
              className="w-[700px] h-[450px]"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
            >
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 21,
                      ticks: { font: { size: 16 } },
                    },
                    x: { ticks: { font: { size: 16 } } },
                  },
                  plugins: { legend: { display: false } },
                }}
              />
            </motion.div>
          )}
          <motion.div className="text-2xl">
            <p>
              <strong className="text-blue-500">📌 Name:</strong>{" "}
              {surveyResult.studentName}
            </p>
            <p>
              <strong className="text-green-500">📅 Date:</strong>{" "}
              {new Date(surveyResult.surveyDate).toLocaleDateString()}
            </p>
            <p className="text-3xl font-bold">
              <strong className="text-yellow-500">⭐ Total Score:</strong>{" "}
              {surveyResult.totalPoints}
            </p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.p className="text-2xl mt-8 text-gray-500">
          No survey data found. Please select another period.
        </motion.p>
      )}
    </motion.div>
  );
};

export default Dashboard;

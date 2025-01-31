import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SurveyResultPage = () => {
  const [chartData, setChartData] = useState(null);
  const [status, setStatus] = useState("");
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showResources, setShowResources] = useState(false);

  useEffect(() => {
    const fetchedData = localStorage.getItem("surveyScores");
    if (fetchedData) {
      const parsedData = JSON.parse(fetchedData);

      setChartData({
        labels: ["Depression", "Anxiety", "Stress"],
        datasets: [
          {
            label: "Survey Scores",
            data: [
              parsedData.depression,
              parsedData.anxiety,
              parsedData.stress,
            ],
            backgroundColor: ["#4285F4", "#EA4335", "#FBBC05"],
            borderColor: ["#4285F4", "#EA4335", "#FBBC05"],
            borderWidth: 1,
          },
        ],
      });

      const calculateStatus = () => {
        const totalScore =
          parsedData.depression + parsedData.anxiety + parsedData.stress;
        if (totalScore > 21) {
          return {
            message: "High Risk: You may be experiencing significant distress.",
            color: "text-red-500",
            helpNeeded: true,
          };
        } else if (totalScore > 12) {
          return {
            message:
              "Moderate Risk: You may benefit from support or stress management techniques.",
            color: "text-yellow-500",
            helpNeeded: true, // Show resources for moderate risk as well
          };
        } else {
          return {
            message: "Low Risk: You seem to be managing well.",
            color: "text-green-500",
            helpNeeded: false,
          };
        }
      };

      const statusResult = calculateStatus();
      setStatus(statusResult.message);
      if (statusResult.helpNeeded) {
        setShowHelpModal(true);
      }
    }
  }, []);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
      title: {
        display: true,
        text: "Your Survey Results",
        font: {
          size: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `${context.dataset.label}: ${context.formattedValue}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const closeModal = () => setShowHelpModal(false);
  const toggleResources = () => setShowResources(!showResources);

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow-md min-h-screen flex flex-col">
      {" "}
      {/* Added min-h-screen and flex-col for better responsiveness */}
      <h2 className="text-2xl font-semibold mb-4 text-center mt-4">
        Survey Results
      </h2>
      {chartData ? (
        <div className="mt-8 relative flex-grow">
          {" "}
          {/* Added flex-grow to make chart take available space */}
          <Bar data={chartData} options={chartOptions} />
        </div>
      ) : (
        <div className="text-center text-xl font-semibold text-gray-500 mt-8">
          No survey data available. Please complete the survey.
        </div>
      )}
      <div className="mt-6 text-center">
        <p
          className={`text-xl font-semibold ${
            status.includes("High")
              ? "text-red-500"
              : status.includes("Moderate")
              ? "text-yellow-500"
              : "text-green-500"
          }`}
        >
          {status}
        </p>

        {/* Show Resources button (now for both Moderate and High) */}
        {(status.includes("Moderate") || status.includes("High")) && (
          <button
            onClick={toggleResources}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {showResources ? "Hide Resources" : "Show Resources"}{" "}
            {/* Toggle button text */}
          </button>
        )}

        {/* Resources List (Initially hidden) */}
        {showResources && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Helpful Resources</h3>
            <ul className="list-disc pl-6 space-y-2">
              {" "}
              {/* Added space-y-2 for better spacing */}
              <li>
                <a
                  href="https://www.nimh.nih.gov/find-help/index.shtml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  NIMH Find Help
                </a>
              </li>
              <li>
                <a
                  href="https://www.samhsa.gov/find-help/national-helpline"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  SAMHSA National Helpline
                </a>
              </li>
              {/* Add more resources as needed */}
            </ul>
          </div>
        )}
      </div>
      {/* Help Modal (for High Risk) - Improved styling */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          {" "}
          {/* Added z-50 to ensure modal is on top */}
          <div className="bg-white rounded-lg p-8 shadow-md w-full max-w-md">
            {" "}
            {/* Added max-w-md for responsiveness */}
            <h2 className="text-2xl font-semibold mb-4">Seeking Support</h2>
            <p className="mb-4">
              {" "}
              {/* Added margin bottom for spacing */}
              It's important to remember that you're not alone, and help is
              available. Talking to a mental health professional can make a
              significant difference.
            </p>
            <h3 className="text-lg font-semibold mb-2">
              Available Resources:
            </h3>{" "}
            {/* Added a title for resources */}
            <ul className="list-disc pl-6 space-y-2 mb-6">
              {" "}
              {/* Added spacing and margin bottom */}
              <li>
                <a
                  href="https://www.nimh.nih.gov/find-help/index.shtml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  NIMH Find Help
                </a>
              </li>
              <li>
                <a
                  href="https://www.samhsa.gov/find-help/national-helpline"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  SAMHSA National Helpline
                </a>
              </li>
            </ul>
            <div className="text-right">
              <button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyResultPage;

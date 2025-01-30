import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2"; // Importing the Bar chart
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
  const [chartData, setChartData] = useState(null); // Store the chart data
  const [status, setStatus] = useState(""); // Store the status message

  // Fetch data from localStorage and update chart data and status when component mounts
  useEffect(() => {
    const fetchedData = localStorage.getItem("surveyScores");
    if (fetchedData) {
      const parsedData = JSON.parse(fetchedData);

      // Update chart data after scores are fetched
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
            backgroundColor: "rgba(75, 192, 192, 0.6)", // Bar color
            borderColor: "rgba(75, 192, 192, 1)", // Border color
            borderWidth: 1, // Border width for each bar
          },
        ],
      });

      // Define thresholds for categorizing the status
      const getStatus = () => {
        let statusMessage = "";
        if (
          parsedData.depression > 7 ||
          parsedData.anxiety > 7 ||
          parsedData.stress > 7
        ) {
          statusMessage =
            "High risk: You may be experiencing significant distress. Please consider seeking professional help.";
        } else if (
          parsedData.depression > 4 ||
          parsedData.anxiety > 4 ||
          parsedData.stress > 4
        ) {
          statusMessage =
            "Moderate risk: You may benefit from support or stress management techniques.";
        } else {
          statusMessage = "Low risk: You seem to be managing well.";
        }
        return statusMessage;
      };

      // Set the status message based on scores
      setStatus(getStatus());
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <div className="container mx-auto p-4">
      {chartData ? (
        <div className="mt-8">
          <Bar data={chartData} /> {/* Use Bar chart here */}
        </div>
      ) : (
        <div className="text-center text-xl font-semibold">
          No survey data available
        </div>
      )}
      <div className="mt-4 text-center text-xl font-semibold">
        <p>{status}</p>
      </div>
    </div>
  );
};

export default SurveyResultPage;

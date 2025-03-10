import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bar } from "react-chartjs-2";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";
import { DateRange, School } from "@mui/icons-material";
import { SurveyService } from "../../api/services/surveyService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import TargetProgramsPage from "./TargetProgramsPage";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
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
    if (points <= 9) return "#4CAF50";
    if (points <= 13) return "#FFC107";
    if (points <= 20) return "#FF9800";
    return "#F44336";
  };

  const chartData = surveyResult
    ? {
        labels: surveyResult.dimensions.map((dim) => dim.dimensionName),
        datasets: [
          {
            type: "bar",
            label: "DASS-21 Score",
            data: surveyResult.dimensions.map((dim) => dim.points),
            backgroundColor: surveyResult.dimensions.map((dim) =>
              getBarColor(dim.points)
            ),
            borderRadius: 10,
            order: 2,
          },
        ],
      }
    : null;

  return (
    <>
      <TargetProgramsPage />

      <motion.div
        className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-b from-white to-gray-100 px-6 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color="primary"
            gutterBottom
          >
            📊 Mental Health Evaluation
          </Typography>
        </motion.div>

        {/* Month & Year Filters */}
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          <Grid item>
            <FormControl
              sx={{
                minWidth: 160,
                backgroundColor: "white",
                boxShadow: 2,
                borderRadius: 2,
              }}
            >
              <InputLabel>Month</InputLabel>
              <Select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <MenuItem key={m} value={m}>
                    <DateRange sx={{ mr: 1, color: "#1976D2" }} /> Month {m}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item>
            <FormControl
              sx={{
                minWidth: 160,
                backgroundColor: "white",
                boxShadow: 2,
                borderRadius: 2,
              }}
            >
              <InputLabel>Year</InputLabel>
              <Select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {Array.from({ length: 5 }, (_, i) => currentYear - i).map(
                  (y) => (
                    <MenuItem key={y} value={y}>
                      <School sx={{ mr: 1, color: "#1976D2" }} /> Year {y}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {loading ? (
          <CircularProgress size={60} sx={{ mt: 3, color: "#1976D2" }} />
        ) : surveyResult ? (
          <Grid
            container
            spacing={4}
            justifyContent="center"
            sx={{ width: "100%", maxWidth: 1200 }}
          >
            {/* Bar Chart */}
            <Grid item xs={12} md={8}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Card sx={{ boxShadow: 6, borderRadius: 4, p: 3 }}>
                  <CardContent>
                    {chartData && (
                      <div className="w-full h-[400px]">
                        <Bar
                          data={chartData}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: { y: { beginAtZero: true, max: 21 } },
                            plugins: { legend: { display: true } },
                          }}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Legend */}
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Card
                  sx={{
                    boxShadow: 6,
                    borderRadius: 4,
                    p: 3,
                    textAlign: "center",
                    "&:hover": { transform: "scale(1.02)", transition: "0.3s" },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      DASS-21 Levels
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    {[
                      { color: "#4CAF50", label: "Normal (0-9)" },
                      { color: "#FFC107", label: "Moderate (10-13)" },
                      { color: "#FF9800", label: "Severe (14-20)" },
                      { color: "#F44336", label: "Extreme (21+)" },
                    ].map(({ color, label }) => (
                      <Box
                        key={label}
                        display="flex"
                        alignItems="center"
                        mt={2}
                        gap={2}
                      >
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            bgcolor: color,
                            borderRadius: 1,
                          }}
                        />
                        <Typography>{label}</Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        ) : (
          <Typography variant="h6" color="gray" sx={{ mt: 3 }}>
            No data available. Please select another period.
          </Typography>
        )}
      </motion.div>
    </>
  );
};

export default Dashboard;

import React, { useState } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid } from '@mui/material';
import { Line, Bar, Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import StudentHeader from "../../components/Header/StudentHeader";
import StudentSideBar from "../../components/Bar/StudentSideBar";
import { Bold } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SurveyDetailsPage = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Header data
  const studentData = {
    role: "STUDENT",
    name: "LE LY HUY",
    avatar: "https://anhnghethuatvietnam2022.com/wp-content/uploads/2024/11/anh-avatar-vo-tri-16.jpg",
    onLogout: () => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userRole');
      navigate('/');
    }
  };

  // Sample data structure (replace with actual data)
  const categories = ['Anxiety', 'Depression', 'Stress', 'Sleep Quality', 'Social Support'];
  const scores = [75, 45, 60, 80, 65];

  // Line chart data - Progress over time
  const lineChartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [{
      label: 'Mental Health Score',
      data: [65, 59, 80, 70],
      fill: false,
      borderColor: '#65CCB8',
      tension: 0.1
    }]
  };

  // Radar chart data - Category breakdown
  const radarChartData = {
    labels: categories,
    datasets: [{
      label: 'Current Assessment',
      data: scores,
      backgroundColor: 'rgba(101, 204, 184, 0.2)',
      borderColor: '#65CCB8',
      borderWidth: 2,
    }]
  };

  // Bar chart data - Comparison with average
  const barChartData = {
    labels: categories,
    datasets: [
      {
        label: 'Your Score',
        data: scores,
        backgroundColor: '#65CCB8',
      },
      {
        label: 'Average Score',
        data: [70, 50, 55, 75, 60],
        backgroundColor: '#e0e0e0',
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,
      },
    },
  };

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden', bgcolor: '#f5f5f5' }}>
      {/* Header */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <StudentHeader userData={studentData} />
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        display: 'flex', 
        pt: '70px', 
        height: 'calc(100vh - 64px)'
      }}>
        {/* Sidebar */}
        <Box sx={{ 
          position: 'fixed', 
          left: 0, 
          top: '64px', 
          bottom: 0,
          width: 'auto'
        }}>
          <StudentSideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </Box>

        {/* Content Area */}
        <Box sx={{ 
          flex: 1, 
          p: 3, 
          height: '100%', 
          overflowY: 'auto',
          ml: isCollapsed ? '80px' : '260px',
          transition: 'margin-left 0.3s'
        }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', color: '#002B36', fontStyle: 'bold' }}>
            Detailed Survey Results Analysis
          </Typography>

          <Grid container spacing={4}>
            {/* Keep your existing Grid items with charts and table */}
            {/* Progress Over Time */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Progress Over Time</Typography>
                <Box sx={{ height: 300 }}>
                  <Line data={lineChartData} options={chartOptions} />
                </Box>
              </Paper>
            </Grid>

            {/* Category Breakdown */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Category Breakdown</Typography>
                <Box sx={{ height: 300 }}>
                  <Radar data={radarChartData} options={chartOptions} />
                </Box>
              </Paper>
            </Grid>

            {/* Comparison with Average */}
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Comparison with Average</Typography>
                <Box sx={{ height: 300 }}>
                  <Bar data={barChartData} options={chartOptions} />
                </Box>
              </Paper>
            </Grid>

            {/* Detailed Scores Table */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Detailed Scores</Typography>
                <TableContainer>
                  {/* Keep your existing Table component */}
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default SurveyDetailsPage;
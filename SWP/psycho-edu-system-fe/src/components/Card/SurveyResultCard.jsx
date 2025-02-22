import React from 'react';
import { Box, Typography, Paper, LinearProgress, Button, Divider, Grid } from '@mui/material';
import { AlertCircle, ArrowRight, Download } from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';  // Change this line

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const SurveyResultCard = ({ score, onClose }) => {
  const navigate = useNavigate();  // Add this line
  
  // Function to determine stress level and recommendations
  const getAssessment = (score) => {
    if (score <= 25) {
      return {
        level: "Low Risk",
        color: "#4CAF50",
        description: "Your responses indicate low levels of stress and anxiety.",
        recommendations: [
          "Continue practicing self-care",
          "Maintain regular exercise",
          "Keep up with social connections"
        ]
      };
    } else if (score <= 50) {
      return {
        level: "Moderate Risk",
        color: "#FFC107",
        description: "Your responses suggest moderate levels of stress that may benefit from additional support.",
        recommendations: [
          "Consider talking to a counselor",
          "Practice stress management techniques",
          "Establish a regular sleep schedule"
        ]
      };
    } else {
      return {
        level: "High Risk",
        color: "#f44336",
        description: "Your responses indicate significant levels of stress. We strongly recommend seeking professional support.",
        recommendations: [
          "Schedule an appointment with a mental health professional",
          "Reach out to our 24/7 support line",
          "Practice daily relaxation techniques"
        ]
      };
    }
  };

  const assessment = getAssessment(score);

  // Chart data configuration
  const chartData = {
    labels: ['Risk Level', 'Safe Zone'],
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [assessment.color, '#e0e0e0'],
        borderWidth: 0,
        cutout: '70%',
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', borderRadius: 3 }}>
      <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
        Your Mental Health Assessment Results
      </Typography>

      {/* Score and Chart Display */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: 200, position: 'relative' }}>
            <Doughnut data={chartData} options={chartOptions} />
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
              }}
            >
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: assessment.color }}>
                {score}%
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Risk Score
              </Typography>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
              Risk Level
            </Typography>
            <Typography variant="h5" sx={{ color: assessment.color, fontWeight: 600, mb: 2 }}>
              {assessment.level}
            </Typography>
            <Typography variant="body1">
              {assessment.description}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      {/* Recommendations */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Recommendations:
        </Typography>
        <Box sx={{ 
          bgcolor: '#f5f5f5', 
          p: 3, 
          borderRadius: 2,
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }
        }}>
          {assessment.recommendations.map((rec, index) => (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
              }}
            >
              <ArrowRight size={20} style={{ marginRight: 8, color: '#82DBC5' }} />
              <Typography variant="body1">{rec}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Warning Box for High Risk */}
      {score > 50 && (
        <Box 
          sx={{ 
            bgcolor: '#fff3f3', 
            p: 3, 
            borderRadius: 2, 
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 2
          }}
        >
          <AlertCircle color="#f44336" />
          <Typography variant="body1" color="error">
            Based on your responses, we recommend speaking with a mental health professional. 
            Help is available 24/7 through our support line.
          </Typography>
        </Box>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowRight size={18} />}
          onClick={() => navigate('/students/survey/details')}  // This will now work
          sx={{ 
            borderColor: '#82DBC5',
            color: '#82DBC5',
            '&:hover': {
              borderColor: '#65CCB8',
              bgcolor: 'rgba(130, 219, 197, 0.1)'
            }
          }}
        >
          See Details Results
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ 
            bgcolor: '#82DBC5',
            '&:hover': {
              bgcolor: '#65CCB8'
            }
          }}
        >
          Return to Dashboard
        </Button>
      </Box>
    </Paper>
  );
};

export default SurveyResultCard;
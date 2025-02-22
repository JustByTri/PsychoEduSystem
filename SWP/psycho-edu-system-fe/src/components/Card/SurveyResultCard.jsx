import React from 'react';
import { Box, Typography, Paper, LinearProgress, Button, Divider } from '@mui/material';
import { AlertCircle, ArrowRight, Download } from 'lucide-react';

const SurveyResultCard = ({ score, onClose }) => {
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

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto', borderRadius: 3 }}>
      {/* Header */}
      <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 600 }}>
        Your Mental Health Assessment Results
      </Typography>

      {/* Score Display */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ mb: 1, color: 'text.secondary' }}>
          Overall Assessment Score
        </Typography>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 'bold',
              color: assessment.color
            }}
          >
            {score}%
          </Typography>
        </Box>
      </Box>

      {/* Risk Level */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.secondary' }}>
          Risk Level
        </Typography>
        <Typography 
          variant="h5" 
          sx={{ 
            color: assessment.color,
            fontWeight: 600
          }}
        >
          {assessment.level}
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Description */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {assessment.description}
        </Typography>
      </Box>

      {/* Recommendations */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Recommendations:
        </Typography>
        <Box sx={{ bgcolor: '#f5f5f5', p: 3, borderRadius: 2 }}>
          {assessment.recommendations.map((rec, index) => (
            <Box 
              key={index} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: index !== assessment.recommendations.length - 1 ? 2 : 0 
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
          startIcon={<Download size={18} />}
          sx={{ 
            borderColor: '#82DBC5',
            color: '#82DBC5',
            '&:hover': {
              borderColor: '#65CCB8',
              bgcolor: 'rgba(130, 219, 197, 0.1)'
            }
          }}
        >
          Download Report
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
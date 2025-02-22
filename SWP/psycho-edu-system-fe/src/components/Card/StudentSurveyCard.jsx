import React from 'react';
import { Box, Typography, Radio, RadioGroup, FormControlLabel, Button, LinearProgress, Paper } from '@mui/material';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

const StudentSurveyCard = ({ 
  question, 
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  onAnswerChange,
  onNext,
  onPrevious,
  onReset
}) => {
  const progress = (currentQuestion / totalQuestions) * 100;

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        bgcolor: 'white',
        borderRadius: 3,
        p: 4,
        mt: 7,
        width: '100%',
        maxWidth: '800px',
        transition: 'all 0.3s ease'
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Question {currentQuestion} of {totalQuestions}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>
            {Math.round(progress)}% Complete
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 6,
            borderRadius: 3,
            bgcolor: '#f0f0f0',
            '& .MuiLinearProgress-bar': {
              bgcolor: '#82DBC5',
              transition: 'transform 0.5s ease'
            }
          }}
        />
      </Box>

      <Typography 
        variant="h5" 
        sx={{ 
          mb: 2,
          fontWeight: 600,
          color: '#2c3e50',
          lineHeight: 1.3
        }}
      >
        {question.text}
      </Typography>

      <RadioGroup
        value={selectedAnswer}
        onChange={(e) => onAnswerChange(e.target.value)}
        sx={{ mb: 2 }}
      >
        {question.options.map((option, index) => (
          <FormControlLabel
            key={index}
            value={option}
            control={
              <Radio 
                sx={{
                  '&.Mui-checked': {
                    color: '#82DBC5'
                  }
                }}
              />
            }
            label={option}
            sx={{
              mb: 0.5,
              p: 0.5,
              width: '100%',
              borderRadius: 2,
              transition: 'all 0.2s ease',
              bgcolor: selectedAnswer === option ? '#f8fdfb' : 'transparent',
              border: selectedAnswer === option ? '1px solid #82DBC5' : '1px solid transparent',
              '&:hover': {
                bgcolor: '#f8fdfb',
                transform: 'translateX(4px)'
              }
            }}
          />
        ))}
      </RadioGroup>

      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mt: 2,
        pt: 1,
        borderTop: '1px solid #eee'
      }}>
        <Button
          onClick={onPrevious}
          disabled={currentQuestion === 1}
          startIcon={<ArrowLeft size={18} />}
          sx={{
            px: 2.5,
            py: 1,
            bgcolor: '#f5f5f5',
            color: 'text.primary',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              bgcolor: '#e0e0e0'
            },
            '&.Mui-disabled': {
              bgcolor: '#f8f8f8',
              color: '#bbb'
            }
          }}
        >
          Previous
        </Button>

        <Button
          onClick={onReset}
          startIcon={<RotateCcw size={18} />}
          sx={{
            px: 2.5,
            py: 1,
            color: '#dc3545',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              bgcolor: 'rgba(220, 53, 69, 0.1)'
            }
          }}
        >
          Reset
        </Button>

        <Button
          onClick={onNext}
          endIcon={<ArrowRight size={18} />}
          sx={{
            px: 2.5,
            py: 1,
            bgcolor: '#82DBC5',
            color: 'white',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              bgcolor: '#65CCB8'
            }
          }}
        >
          {currentQuestion === totalQuestions ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Paper>
  );
};

export default StudentSurveyCard;

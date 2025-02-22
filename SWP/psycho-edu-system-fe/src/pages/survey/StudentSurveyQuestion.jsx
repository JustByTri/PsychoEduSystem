import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import StudentHeader from '../../components/Header/StudentHeader';
import StudentSideBar from '../../components/Bar/StudentSideBar';
import StudentSurveyCard from '../../components/Card/StudentSurveyCard';
import SurveyResultCard from '../../components/Card/SurveyResultCard';
import { surveyQuestions } from '../../mock/StuSurveyQuesMock';

const StudentSurveyQuestion = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [surveyScore, setSurveyScore] = useState(0);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const studentData = {
    role: "STUDENT",
    name: "LE LY HUY",
    avatar: "https://anhnghethuatvietnam2022.com/wp-content/uploads/2024/11/anh-avatar-vo-tri-16.jpg",
    onLogout: handleLogout
  };

  const handleAnswerChange = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestion]: answer
    });
  };

  const calculateScore = () => {
    const totalQuestions = surveyQuestions.length;
    const answeredQuestions = Object.keys(answers).length;
    const score = Math.round((answeredQuestions / totalQuestions) * 100);
    return score;
  };

  const handleNext = () => {
    if (currentQuestion < surveyQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const score = calculateScore();
      setSurveyScore(score);
      setShowResult(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(1);
    setAnswers({});
  };

  const handleReturnToDashboard = () => {
    navigate('/student');
  };

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden', bgcolor: '#f5f5f5' }}>
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <StudentHeader userData={studentData} />
      </Box>

      <Box sx={{ 
        display: 'flex', 
        pt: '70px', 
        height: 'calc(100vh - 64px)'
      }}>
        <Box sx={{ 
          position: 'fixed', 
          left: 0, 
          top: '64px', 
          bottom: 0, 
          width: '100px'
        }}>
          <StudentSideBar />
        </Box>

        <Box sx={{ 
          flex: 1,
          ml: '100px',
          p: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {showResult ? (
            <SurveyResultCard 
              score={surveyScore}
              onClose={handleReturnToDashboard}
            />
          ) : (
            <StudentSurveyCard
              question={surveyQuestions[currentQuestion - 1]}
              currentQuestion={currentQuestion}
              totalQuestions={surveyQuestions.length}
              selectedAnswer={answers[currentQuestion]}
              onAnswerChange={handleAnswerChange}
              onNext={handleNext}
              onPrevious={handlePrevious}
              onReset={handleReset}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default StudentSurveyQuestion;

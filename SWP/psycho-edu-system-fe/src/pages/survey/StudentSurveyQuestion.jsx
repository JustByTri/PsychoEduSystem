import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [isCollapsed, setIsCollapsed] = useState(true);

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
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 z-50">
        <StudentHeader userData={studentData} />
      </div>

      <div className="flex pt-[64px]">
        <div className={`fixed left-0 top-[64px] bottom-0 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-65'}`}>
          <StudentSideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>

        <div className={`flex-1 transition-all duration-300 ml-${isCollapsed ? '20' : '65'}`}>
          <div className="w-full h-[calc(100vh-64px)] flex items-center justify-center p-4">
            {showResult ? (
              <div style={{ marginTop: '50px' }}>
                <SurveyResultCard 
                  score={surveyScore}
                  onClose={handleReturnToDashboard}
                />
              </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSurveyQuestion;

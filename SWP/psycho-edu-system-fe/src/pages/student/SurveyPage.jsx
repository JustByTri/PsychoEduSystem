import { useEffect, useState } from "react";
import ProgressBar from "../../components/Survey/ProgressBar";
import Question from "../../components/Survey/Question";
import NavigationButtons from "../../components/Survey/NavigationButtons";
import SurveyActions from "../../components/Survey/SurveyActions";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const SurveyPage = () => {
  const [questionsData, setQuestionsData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const storedQuestions = localStorage.getItem("questions");
    if (storedQuestions) {
      setQuestionsData(JSON.parse(storedQuestions));
    }
  }, []);

  if (!questionsData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <span className="text-xl font-medium text-gray-600">Loading...</span>
      </div>
    );
  }

  const handleAnswerSelection = (questionId, answerPoint) => {
    setAnsweredQuestions((prev) => [
      ...prev.filter((item) => item.questionId !== questionId),
      { questionId, answerPoint },
    ]);
  };

  const isAnswered = answeredQuestions.some(
    (item) =>
      item.questionId ===
      questionsData.questions[currentQuestionIndex].questionId
  );

  const currentAnswer = answeredQuestions.find(
    (item) =>
      item.questionId ===
      questionsData.questions[currentQuestionIndex].questionId
  );

  const handleNextQuestion = () => {
    if (
      isAnswered &&
      currentQuestionIndex < questionsData.questions.length - 1
    ) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to submit the survey?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, submit!",
      cancelButtonText: "No, cancel",
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        const scores = { depression: 0, anxiety: 0, stress: 0 };

        // Calculate the total scores
        answeredQuestions.forEach(({ questionId, answerPoint }) => {
          const question = questionsData.questions.find(
            (q) => q.questionId === questionId
          );
          if (question) {
            scores[question.questionType] += answerPoint;
          }
        });

        console.log("Total Scores:", scores);
        Swal.fire(
          "Survey submitted!",
          "Your responses have been saved.",
          "success"
        );

        localStorage.setItem("surveyScores", JSON.stringify(scores));
        setCurrentQuestionIndex(0);
        setAnsweredQuestions([]);
        navigate("/student/survey-result");
      }
    });
  };

  const handleResetSurvey = () => {
    setCurrentQuestionIndex(0);
    setAnsweredQuestions([]);
  };

  const progressPercentage = Math.round(
    (answeredQuestions.length / questionsData.questions.length) * 100
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 bg-white rounded-lg shadow-lg">
      <ProgressBar progressPercentage={progressPercentage} />

      <Question
        question={questionsData.questions[currentQuestionIndex]}
        currentAnswer={currentAnswer}
        handleAnswerSelection={handleAnswerSelection}
      />

      <NavigationButtons
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questionsData.questions.length}
        isAnswered={isAnswered}
        handlePreviousQuestion={handlePreviousQuestion}
        handleNextQuestion={handleNextQuestion}
      />

      <SurveyActions
        answeredQuestions={answeredQuestions}
        totalQuestions={questionsData.questions.length}
        handleSubmit={handleSubmit}
        handleResetSurvey={handleResetSurvey}
      />
    </div>
  );
};

export default SurveyPage;

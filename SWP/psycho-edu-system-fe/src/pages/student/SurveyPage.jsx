import { useEffect, useState } from "react";

const SurveyPage = () => {
  const [questionsData, setQuestionsData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

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
    setAnsweredQuestions((prevAnswered) => [
      ...prevAnswered.filter((item) => item.questionId !== questionId),
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
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (window.confirm("Are you sure you want to submit the survey?")) {
      alert("Survey submitted successfully!");
    }
  };

  const handleResetSurvey = () => {
    setCurrentQuestionIndex(0);
    setAnsweredQuestions([]);
  };

  const progressPercentage = Math.round(
    (currentQuestionIndex / (questionsData.questions.length - 1)) * 100
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div className="text-xs font-semibold inline-block py-1 uppercase">
              Progress: {progressPercentage}%
            </div>
          </div>
          <div className="flex mb-4">
            <div
              className="flex w-full bg-gray-200 rounded-full"
              style={{
                height: "8px",
                backgroundColor: "#e5e5e5",
              }}
            >
              <div
                className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
                style={{
                  width: `${progressPercentage}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="border rounded-md p-4 w-full mx-auto max-w-2xl">
        <h4 className="text-xl lg:text-2xl font-semibold mb-4">
          {questionsData.questions[currentQuestionIndex].questionContent}
        </h4>

        <div>
          {questionsData.questions[currentQuestionIndex].answers.map(
            (answer) => (
              <label
                key={answer.answerId}
                className="flex items-center bg-gray-100 text-gray-700 rounded-md px-3 py-2 my-3 hover:bg-indigo-300 cursor-pointer"
              >
                <input
                  type="radio"
                  name={`question-${questionsData.questions[currentQuestionIndex].questionId}`}
                  value={answer.answerPoint}
                  checked={currentAnswer?.answerPoint === answer.answerPoint}
                  onChange={() =>
                    handleAnswerSelection(
                      questionsData.questions[currentQuestionIndex].questionId,
                      answer.answerPoint
                    )
                  }
                  className="mr-3"
                />
                <i className="pl-2">{answer.answerContent}</i>
              </label>
            )
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 disabled:opacity-50 transition-all duration-300"
        >
          Previous
        </button>
        <button
          onClick={handleNextQuestion}
          disabled={!isAnswered}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-300"
        >
          Next
        </button>
      </div>

      {currentQuestionIndex === questionsData.questions.length - 1 && (
        <div className="mt-6 text-center">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-all duration-300"
          >
            Submit
          </button>
        </div>
      )}

      <div className="mt-4 text-center">
        <button
          onClick={handleResetSurvey}
          className="px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all duration-300"
        >
          Reset Survey
        </button>
      </div>
    </div>
  );
};

export default SurveyPage;

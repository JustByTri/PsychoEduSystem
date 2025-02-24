import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { SurveyService } from "../../../api/services/surveyService";
import { ToastContainer, toast } from "react-toastify";
const SurveyDetail = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 7;
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedAnswers, setEditedAnswers] = useState({});
  const [editedQuestionContent, setEditedQuestionContent] = useState("");
  const [editedSurvey, setEditedSurvey] = useState(null);

  useEffect(() => {
    async function fetchSurvey() {
      const data = await SurveyService.getSurveyContent(id);
      if (data) {
        setSurvey(data);
        setEditedSurvey(data);
      }
    }
    fetchSurvey();
  }, [id]);

  const showAnswers = (question) => {
    setSelectedQuestion(question);
    setEditedAnswers(
      question.answers.reduce((acc, answer) => {
        acc[answer.answerId] = answer.content;
        return acc;
      }, {})
    );
    setEditedQuestionContent(question.content);
    setIsModalOpen(true);
  };

  const handleEditAnswer = (answerId, newContent) => {
    setEditedAnswers({ ...editedAnswers, [answerId]: newContent });
  };

  const saveAnswers = () => {
    if (!selectedQuestion) return;

    const updatedAnswers = selectedQuestion.answers.map((answer) => ({
      ...answer,
      content: editedAnswers[answer.answerId],
    }));

    const updatedQuestions = editedSurvey.questions.map((q) =>
      q.questionId === selectedQuestion.questionId
        ? { ...q, content: editedQuestionContent, answers: updatedAnswers }
        : q
    );

    setEditedSurvey({ ...editedSurvey, questions: updatedQuestions });

    setIsModalOpen(false);
  };

  const handleSaveSurvey = async () => {
    try {
      const updatedSurvey = {
        ...editedSurvey,
        updateAt: new Date().toISOString(),
        createAt: survey.createAt,
      };

      console.log("Final JSON Data:", JSON.stringify(updatedSurvey, null, 2));
      await SurveyService.updateSurvey(id, updatedSurvey);
      toast.success("Survey updated successfully!");
    } catch (error) {
      toast.error("Failed to update survey. Check console for details.", error);
    }
  };

  if (!survey) {
    return (
      <div className="p-6 text-lg text-center font-semibold">Loading...</div>
    );
  }

  const totalPages = Math.ceil(survey.questions.length / questionsPerPage);
  const currentQuestions = editedSurvey.questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  return (
    <div className="p-6 max-w-2xl mx-auto bg-gradient-to-br from-white to-gray-100 shadow-2xl rounded-xl">
      <ToastContainer />
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
        📝 Edit Survey
      </h1>
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
        Questions
      </h2>
      <div className="space-y-4">
        {currentQuestions.map((question) => (
          <div
            key={question.questionId}
            className="border border-gray-300 bg-white shadow-lg rounded-lg p-4 hover:shadow-2xl"
          >
            <p
              className="cursor-pointer text-blue-600 hover:underline font-medium"
              onClick={() => showAnswers(question)}
            >
              {question.content}
            </p>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 shadow-lg"
        >
          ◀ Previous
        </button>
        <span className="text-lg font-semibold text-gray-700">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 shadow-lg"
        >
          Next ▶
        </button>
      </div>

      {/* Save Survey Button */}
      <div className="flex justify-center mt-6">
        <button
          onClick={handleSaveSurvey}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 shadow-md transition-all"
        >
          Save Survey
        </button>
      </div>

      {/* Answer Modal */}
      {isModalOpen && selectedQuestion && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-lg border relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 w-8 h-8 flex items-center justify-center text-sm"
            >
              ✖
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
              <input
                type="text"
                value={editedQuestionContent}
                onChange={(e) => setEditedQuestionContent(e.target.value)}
                className="border px-3 py-2 rounded-lg w-full shadow-inner"
              />
            </h2>

            <ul className="space-y-3 max-h-80 overflow-y-auto">
              {selectedQuestion.answers.length > 0 ? (
                selectedQuestion.answers.map((answer) => (
                  <li
                    key={answer.answerId}
                    className="border border-gray-300 bg-gray-100 p-3 rounded-lg flex items-center justify-between"
                  >
                    <input
                      type="text"
                      value={editedAnswers[answer.answerId]}
                      onChange={(e) =>
                        handleEditAnswer(answer.answerId, e.target.value)
                      }
                      className="border px-3 py-2 rounded-lg flex-grow shadow-inner"
                    />
                    <span className="text-gray-700 font-semibold ml-4">
                      {answer.point} pts
                    </span>
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-center">
                  No answers available.
                </p>
              )}
            </ul>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={saveAnswers}
                className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Save Answers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyDetail;

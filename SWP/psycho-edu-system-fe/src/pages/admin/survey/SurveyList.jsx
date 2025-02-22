import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SurveyService } from "../../../api/services/surveyService";
import { ToastContainer, toast } from "react-toastify";
const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
    target: "",
    title: "",
  });
  const navigate = useNavigate();

  const fetchSurveys = async () => {
    setLoading(true);
    const data = await SurveyService.getSurveys();
    setSurveys(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("Description", formData.description);
    data.append("Target", formData.target);
    data.append("Title", formData.title);

    const success = await SurveyService.importSurvey(data);
    if (success) {
      toast.success("Survey imported successfully!");
      setIsModalOpen(false);
      fetchSurveys();
    } else {
      toast.error("Failed to import survey.");
    }
  };
  const deleteSurvey = (id) => {
    setSurveys(surveys.filter((s) => s.surveyId !== id));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg shadow-lg border border-gray-300">
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-6 text-blue-700">
        Survey Management
      </h1>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 mb-6 rounded-full shadow-md transition duration-300 ease-in-out"
        onClick={() => setIsModalOpen(true)}
      >
        Import Survey
      </button>
      {loading ? (
        <p className="text-center text-gray-600">Loading surveys...</p>
      ) : surveys.length > 0 ? (
        <table className="w-full border text-left bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-blue-400 to-blue-600 text-white">
            <tr>
              <th className="border p-3">Survey Name</th>
              <th className="border p-3">Description</th>
              <th className="border p-3">Public</th>
              <th className="border p-3">Target</th>
              <th className="border p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {surveys.map((survey) => (
              <tr
                key={survey.surveyId}
                className="hover:bg-gray-100 transition duration-200"
              >
                <td className="border p-3">
                  <input
                    type="text"
                    value={survey.surveyName}
                    className="bg-gray-50 rounded-full px-3 py-2 shadow-inner focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </td>
                <td className="border p-3">
                  <input
                    type="text"
                    value={survey.description}
                    className="bg-gray-50 rounded-full px-3 py-2 shadow-inner focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                </td>
                <td className="border p-3">
                  <select
                    value={survey.isPublic ? "true" : "false"}
                    className="bg-gray-50 rounded-full px-3 py-2 shadow-inner focus:ring-2 focus:ring-blue-400 outline-none"
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </td>
                <td className="border p-3">
                  <select
                    value={survey.target}
                    className="bg-gray-50 rounded-full px-3 py-2 shadow-inner focus:ring-2 focus:ring-blue-400 outline-none"
                  >
                    <option value="Student">Student</option>
                    <option value="Parent">Parent</option>
                    <option value="Teacher">Teacher</option>
                  </select>
                </td>
                <td className="border p-3 flex justify-center space-x-4">
                  <button
                    onClick={() => navigate(`/admin/survey/${survey.surveyId}`)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg transition duration-300 ease-in-out"
                  >
                    View
                  </button>
                  <button
                    onClick={() => deleteSurvey(survey.surveyId)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full shadow-lg transition duration-300 ease-in-out"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center text-gray-600">No surveys available.</p>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-md"
          onClick={() => setIsModalOpen(false)} // Close when clicking outside
        >
          <div
            className="relative bg-gradient-to-br from-white to-gray-100 p-8 rounded-2xl shadow-2xl transform transition-transform hover:scale-[1.02] w-full max-w-lg border border-gray-300"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-6 py-2 rounded-full shadow-md">
              Import Survey
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 font-semibold">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 font-semibold">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 font-semibold">Target</label>
                <select
                  name="target"
                  value={formData.target}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition bg-white"
                  required
                >
                  <option value="" disabled>
                    Select Target
                  </option>
                  <option value="Student">Student</option>
                  <option value="Parent">Parent</option>
                  <option value="Teacher">Teacher</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 font-semibold">
                  Upload File (xlsx)
                </label>
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 border rounded-lg shadow-sm bg-gray-50 focus:ring-2 focus:ring-blue-400 focus:outline-none transition cursor-pointer"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transform transition-all duration-200 hover:shadow-lg"
              >
                Import Survey
              </button>
            </form>
            <button
              className="mt-6 w-full px-4 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 transform transition-all duration-200 hover:shadow-lg"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyList;

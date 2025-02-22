import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SurveyService } from "../../../api/services/surveyService";

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
      alert("Survey imported successfully!");
      setIsModalOpen(false);
      fetchSurveys();
    } else {
      alert("Failed to import survey.");
    }
  };
  const deleteSurvey = (id) => {
    setSurveys(surveys.filter((s) => s.surveyId !== id));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen rounded-lg shadow-lg border border-gray-300">
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Import Survey
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-medium">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Description
                </label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Target
                </label>
                <input
                  type="text"
                  name="target"
                  value={formData.target}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium">
                  Upload File
                </label>
                <input
                  type="file"
                  accept=".xlsx"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
              >
                Import Survey
              </button>
            </form>
            <button
              className="mt-4 w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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

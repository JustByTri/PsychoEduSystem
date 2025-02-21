import { useEffect, useState } from "react";
import { SurveyService } from "../../api/services/surveyService";
const SurveyManagementPage = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    description: "",
    target: "",
    title: "",
  });

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
      fetchSurveys(); // Reload surveys after successful import
    } else {
      alert("Failed to import survey.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Survey Management</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setIsModalOpen(true)}
      >
        Import Survey
      </button>
      {loading ? (
        <p className="text-center text-gray-600">Loading surveys...</p>
      ) : surveys.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="py-2 px-4">STT</th>
                <th className="py-2 px-4">Target</th>
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Description</th>
                <th className="py-2 px-4">Public</th>
                <th className="py-2 px-4">Created At</th>
              </tr>
            </thead>
            <tbody>
              {surveys.map((survey, index) => (
                <tr
                  key={survey.surveyId}
                  className="border-b hover:bg-gray-100"
                >
                  <td className="py-2 px-4 text-center">{index + 1}</td>
                  <td className="py-2 px-4">{survey.surveyFor}</td>
                  <td className="py-2 px-4">{survey.surveyName}</td>
                  <td className="py-2 px-4">{survey.description}</td>
                  <td className="py-2 px-4 text-center">
                    {survey.isPublic ? "Yes" : "No"}
                  </td>
                  <td className="py-2 px-4">
                    {new Date(survey.createAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

export default SurveyManagementPage;

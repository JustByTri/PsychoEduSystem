/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SurveyService } from "../../../api/services/surveyService";
import { ToastContainer, toast } from "react-toastify";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";
const SurveyList = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [formData, setFormData] = useState({
    description: "",
    target: "",
    title: "",
  });
  const navigate = useNavigate();

  const fetchSurveys = async () => {
    setLoading(true);
    const data = await SurveyService.getSurveys();
    setSurveys(data.map((survey) => ({ ...survey, isEditing: false })));
    setLoading(false);
  };
  const handleChangeSurvey = (id, field, value) => {
    setSurveys((prevSurveys) =>
      prevSurveys.map((survey) =>
        survey.surveyId === id ? { ...survey, [field]: value } : survey
      )
    );
  };
  const handleSaveSurvey = async (surveyId) => {
    const surveyToUpdate = surveys.find((s) => s.surveyId === surveyId);
    if (!surveyToUpdate) return;

    try {
      await SurveyService.updateSurveyProperty(surveyId, surveyToUpdate);
      toast.success("Survey updated successfully!");
      fetchSurveys();
    } catch (error) {
      toast.error("Failed to update survey.");
    }
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name); // Set the file name
      setFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.info("Please select a file to upload.");
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
      setFile(null);
      setFileName("");
      setFormData({
        description: "",
        target: "",
        title: "",
      });
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
        <div className="overflow-x-auto">
          <table className="min-w-full border text-left bg-white shadow-md rounded-lg">
            <thead className="bg-gradient-to-r from-blue-400 to-blue-600 text-white">
              <tr>
                <th className="border p-3">Survey Name</th>
                <th className="border p-3">Description</th>
                <th className="border p-3">Public</th>
                <th className="border p-3">Target</th>
                <th className="border p-3">Create At</th>
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
                      onChange={(e) =>
                        handleChangeSurvey(
                          survey.surveyId,
                          "surveyName",
                          e.target.value
                        )
                      }
                      className="bg-gray-50 rounded-full px-3 py-2 shadow-inner focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                  </td>
                  <td className="border p-3">
                    <input
                      type="text"
                      value={survey.description}
                      onChange={(e) =>
                        handleChangeSurvey(
                          survey.surveyId,
                          "description",
                          e.target.value
                        )
                      }
                      className="bg-gray-50 rounded-full px-3 py-2 shadow-inner focus:ring-2 focus:ring-blue-400 outline-none"
                    />
                  </td>
                  <td className="border p-3">
                    <select
                      value={survey.isPublic.toString()}
                      onChange={(e) =>
                        handleChangeSurvey(
                          survey.surveyId,
                          "isPublic",
                          e.target.value === "true"
                        )
                      }
                      className="bg-gray-50 rounded-full px-3 py-2 shadow-inner focus:ring-2 focus:ring-blue-400 outline-none"
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </select>
                  </td>
                  <td className="border p-3">
                    <select
                      value={survey.surveyFor}
                      onChange={(e) =>
                        handleChangeSurvey(
                          survey.surveyId,
                          "surveyFor",
                          e.target.value
                        )
                      }
                      className="bg-gray-50 rounded-full px-3 py-2 shadow-inner focus:ring-2 focus:ring-blue-400 outline-none"
                    >
                      <option value="Student">Student</option>
                      <option value="Parent">Parent</option>
                      <option value="Teacher">Teacher</option>
                    </select>
                  </td>
                  <td className="border p-3">
                    <span>
                      {new Date(survey.createAt).toLocaleDateString("en-GB")}
                    </span>
                  </td>
                  <td className="border p-3 flex justify-center space-x-4">
                    <button
                      onClick={() =>
                        navigate(`/admin/survey/${survey.surveyId}`)
                      }
                      className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full shadow-lg transition duration-300 ease-in-out"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleSaveSurvey(survey.surveyId)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full shadow-lg transition duration-300 ease-in-out"
                    >
                      Save
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
        </div>
      ) : (
        <p className="text-center text-gray-600">No surveys available.</p>
      )}

      {isModalOpen && (
        <div>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="contained"
            color="primary"
          >
            Open Modal
          </Button>

          {/* Modal with MUI Dialog and Framer Motion */}
          <Dialog
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            maxWidth="sm"
            fullWidth
            scroll="body"
            PaperComponent={motion.div}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            sx={{
              backdropFilter: "blur(5px)", // Add backdrop blur effect
              backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
            }}
          >
            <DialogTitle
              sx={{
                backgroundColor: "#ffffff",
                textAlign: "center",
                fontWeight: "bold",
                color: "#000",
              }}
            >
              <Box
                sx={{
                  display: "inline-block",
                  padding: "10px",
                  color: "blue",
                }}
              >
                Survey Information
              </Box>
            </DialogTitle>

            <DialogContent sx={{ backgroundColor: "#ffffff", padding: "20px" }}>
              <form onSubmit={handleSubmit}>
                {/* Title Input */}
                <TextField
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                />

                {/* Description Input */}
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  required
                />

                {/* Target Selection */}
                <FormControl fullWidth margin="normal" required>
                  <InputLabel>Target</InputLabel>
                  <Select
                    label="Target"
                    name="target"
                    value={formData.target}
                    onChange={handleChange}
                  >
                    <MenuItem value="">Select Target</MenuItem>
                    <MenuItem value="Student">Student</MenuItem>
                    <MenuItem value="Parent">Parent</MenuItem>
                    <MenuItem value="Teacher">Teacher</MenuItem>
                  </Select>
                </FormControl>

                {/* File Upload */}
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  margin="normal"
                  component="label"
                  className="cursor-pointer py-3"
                >
                  Upload File (xlsx)
                  <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    hidden
                  />
                </Button>
                {fileName && (
                  <p className="mt-2 text-gray-700 font-semibold">
                    Selected File: {fileName}
                  </p>
                )}
                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ marginTop: "20px" }}
                >
                  Import Survey
                </Button>
              </form>
            </DialogContent>

            <DialogActions sx={{ backgroundColor: "#ffffff" }}>
              <Button
                onClick={() => setIsModalOpen(false)}
                color="secondary"
                fullWidth
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
};

export default SurveyList;

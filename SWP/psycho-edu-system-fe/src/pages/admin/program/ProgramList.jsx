import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TargetProgramService } from "../../../api/services/targetProgramService"; // Sử dụng API

const ProgramList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    minPoint: "",
    capacity: "",
    dimensionId: "",
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const data = await TargetProgramService.getTargetPrograms();
      setPrograms(data || []);
    } catch (err) {
      console.error("Error fetching programs:", err);
      setError("Failed to load programs.");
      toast.error("Failed to load programs.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateProgram = async (e) => {
    e.preventDefault();
    try {
      const programData = {
        name: formData.name,
        description: formData.description,
        startDate: new Date(formData.startDate).toISOString(),
        minPoint: parseInt(formData.minPoint),
        capacity: parseInt(formData.capacity),
        dimensionId: parseInt(formData.dimensionId),
      };

      await TargetProgramService.createTargetProgram(programData);
      toast.success("Program created successfully!");
      setIsModalOpen(false);
      setFormData({
        name: "",
        description: "",
        startDate: "",
        minPoint: "",
        capacity: "",
        dimensionId: "",
      });
      fetchPrograms();
    } catch (error) {
      toast.error("Failed to create program.");
      console.error("Error creating program:", error);
    }
  };

  const handleDeleteConfirm = async (programId) => {
    try {
      setLoading(true);
      await TargetProgramService.deleteTargetProgram(programId);
      toast.success("Program deleted successfully!");
      fetchPrograms();
    } catch (error) {
      console.error("Error deleting program:", error);
      toast.error("Failed to delete program.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-white">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Target Programs</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg flex items-center gap-2 transition-all duration-300"
        >
          <FontAwesomeIcon icon={faPlus} />
          Create Program
        </button>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6">
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : programs.length === 0 ? (
          <p className="text-center py-4">No programs found</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-600">
                <th className="py-4 text-left px-4">Name</th>
                <th className="py-4 text-left px-4">Start Date</th>
                <th className="py-4 text-left px-4">Min. Score</th>
                <th className="py-4 text-left px-4">Participants</th>
                <th className="py-4 text-left px-4">Dimension ID</th>
                <th className="py-4 text-left px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {programs.map((program) => (
                <tr key={program.id} className="border-b border-gray-700">
                  <td className="py-4 text-left px-4">{program.name}</td>
                  <td className="py-4 text-left px-4">{program.startDate}</td>
                  <td className="py-4 text-left px-4">{program.minPoint}</td>
                  <td className="py-4 text-left px-4">{program.capacity}</td>
                  <td className="py-4 text-left px-4">{program.dimensionId}</td>
                  <td className="py-4 px-4 flex gap-2">
                    <button
                      className="p-2 text-red-400 hover:text-red-300"
                      onClick={() => handleDeleteConfirm(program.id)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-xl w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-6">Create New Program</h2>
            <form onSubmit={handleCreateProgram} className="space-y-4">
              <label className="block text-white">Program Name</label>
              <input type="text" name="name" placeholder="Enter program name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white" required />

              <label className="block text-white">Description</label>
              <textarea name="description" placeholder="Enter description" value={formData.description} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white" required />

              <label className="block text-white">Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 rounded-lg" required />

              <label className="block text-white">Minimum Score (0 - 100)</label>
              <input type="number" name="minPoint" placeholder="Enter min score" value={formData.minPoint} onChange={handleInputChange} min="0" max="100" className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white" required />

              <label className="block text-white">Participant Limit</label>
              <input type="number" name="capacity" placeholder="Enter max participants" value={formData.capacity} onChange={handleInputChange} min="1" className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white" required />

              <label className="block text-white">Dimension ID</label>
              <input type="number" name="dimensionId" placeholder="Enter Dimension ID" value={formData.dimensionId} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white" required />

              <div className="flex justify-end gap-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-gray-600 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-500 rounded-lg">Create Program</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgramList;

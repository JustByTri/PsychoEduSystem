import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import TargetProgramDelete from "../../../components/Pop-up/TargetProgramDelete";
import TargetProgramEdit from "../../../components/Pop-up/TargetProgramEdit";

const mockCounselors = [
  { id: 1, name: "Dr. Sarah Johnson", specialization: "Anxiety & Depression" },
  { id: 2, name: "Dr. Michael Chen", specialization: "Academic Counseling" },
  { id: 3, name: "Dr. Emily Parker", specialization: "Behavioral Therapy" },
  { id: 4, name: "Dr. James Wilson", specialization: "Career Guidance" },
];

const mockDimensions = [
  { id: 1, name: "Academic Performance" },
  { id: 2, name: "Mental Health" },
  { id: 3, name: "Social Skills" },
  { id: 4, name: "Career Development" },
  { id: 5, name: "Personal Growth" },
];

// Move mockPrograms before the component
const mockPrograms = [
  {
    id: 1,
    name: "Academic Excellence Program",
    startDate: "2024-03-01",
    minimumScore: 70,
    participantLimit: 30,
    counselorName: "Dr. Sarah Johnson",
    dimensionName: "Academic Performance",
  },
  {
    id: 2,
    name: "Stress Management Workshop",
    startDate: "2024-03-15",
    minimumScore: 60,
    participantLimit: 25,
    counselorName: "Dr. Emily Parker",
    dimensionName: "Mental Health",
  },
];

const ProgramList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programs, setPrograms] = useState(mockPrograms);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    minimumScore: 0,
    participantLimit: 0,
    counselorId: "",
    dimensionId: "",
  });
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const handleEditClick = (program) => {
    setSelectedProgram(program);
    setIsEditModalOpen(true);
  };
  const handleDeleteClick = (program) => {
    setSelectedProgram(program);
    setIsDeleteModalOpen(true);
  };
  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedProgram = {
      ...selectedProgram,
      name: formData.get('name'),
      startDate: formData.get('startDate'),
      minimumScore: parseInt(formData.get('minimumScore')),
      participantLimit: parseInt(formData.get('participantLimit')),
      counselorName: mockCounselors.find(c => c.id === parseInt(formData.get('counselorId')))?.name,
      dimensionName: mockDimensions.find(d => d.id === parseInt(formData.get('dimensionId')))?.name,
    };
    
    setPrograms(programs.map(p => p.id === selectedProgram.id ? updatedProgram : p));
    toast.success("Program updated successfully!");
    setIsEditModalOpen(false);
  };
  const handleDeleteConfirm = () => {
    setPrograms(programs.filter(p => p.id !== selectedProgram.id));
    toast.success("Program deleted successfully!");
    setIsDeleteModalOpen(false);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validation for minimum score
    if (name === 'minimumScore') {
      const score = parseInt(value);
      if (score < 0) return;
      if (score > 100) return;
    }
  
    // Validation for program name
    if (name === 'name' && value.length > 150) return;
  
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add API call here
    const newProgram = {
      id: programs.length + 1,
      name: formData.name,
      startDate: formData.startDate,
      minimumScore: formData.minimumScore,
      participantLimit: formData.participantLimit,
      counselorName: mockCounselors.find(c => c.id === parseInt(formData.counselorId))?.name || '',
      dimensionName: mockDimensions.find(d => d.id === parseInt(formData.dimensionId))?.name || '',
    };
    
    setPrograms([...programs, newProgram]);
    toast.success("Program created successfully!");
    setIsModalOpen(false);
    setFormData({
      name: "",
      description: "",
      startDate: "",
      minimumScore: 0,
      participantLimit: 0,
      counselorId: "",
      dimensionId: "",
    });
  };
  return (
    <div className="p-8 text-white">
      <ToastContainer />
      {/* Header Section */}
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

      {/* Programs Table */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="py-4 text-left px-4">Name</th>
              <th className="py-4 text-left px-4">Start Date</th>
              <th className="py-4 text-left px-4">Min. Score</th>
              <th className="py-4 text-left px-4">Participants</th>
              <th className="py-4 text-left px-4">Counselor</th>
              <th className="py-4 text-left px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {programs.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No programs found
                </td>
              </tr>
            ) : (
              programs.map((program) => (
                <tr key={program.id} className="border-b border-gray-700">
                  <td className="py-4 text-left px-4">{program.name}</td>
                  <td className="py-4 text-left px-4">{program.startDate}</td>
                  <td className="py-4 text-left px-4">{program.minimumScore}</td>
                  <td className="py-4 text-left px-4">{program.participantLimit}</td>
                  <td className="py-4 text-left px-4">{program.counselorName}</td>
                  <td className="py-4 px-4 flex gap-2">
                    <button 
                      className="p-2 text-blue-400 hover:text-blue-300"
                      onClick={() => handleEditClick(program)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button 
                      className="p-2 text-red-400 hover:text-red-300"
                      onClick={() => handleDeleteClick(program)}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Program Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-8 rounded-xl w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-6">Create New Program</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Program Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    maxLength={150}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg"
                    required
                  />
                  <span className="text-xs text-gray-400">
                    {formData.name.length}/150 characters
                  </span>
                </div>
                <div>
                  <label className="block mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    min={getCurrentDate()}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Minimum Score</label>
                  <input
                    type="number"
                    name="minimumScore"
                    value={formData.minimumScore}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg"
                    required
                  />
                  <span className="text-xs text-gray-400">Score range: 0-100</span>
                </div>
                <div>
                  <label className="block mb-1">Participant Limit</label>
                  <input
                    type="number"
                    name="participantLimit"
                    value={formData.participantLimit}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Counselor</label>
                  <select 
                    name="counselorId"
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg" 
                    required
                    value={formData.counselorId}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Counselor</option>
                    {mockCounselors.map(counselor => (
                      <option key={counselor.id} value={counselor.id}>
                        {counselor.name} - {counselor.specialization}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-1">Dimension</label>
                  <select 
                    name="dimensionId"
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg" 
                    required
                    value={formData.dimensionId}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Dimension</option>
                    {mockDimensions.map(dimension => (
                      <option key={dimension.id} value={dimension.id}>
                        {dimension.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg"
                    rows="4"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg"
                >
                  Create Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Add these modal components at the end of your return statement */}
      <TargetProgramEdit
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        program={selectedProgram}
        counselors={mockCounselors}
        dimensions={mockDimensions}
      />

      <TargetProgramDelete
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        programName={selectedProgram?.name}
      />
    </div>
  );
};

export default ProgramList;
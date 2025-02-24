import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";

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

const ProgramList = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    minimumScore: 0,
    participantLimit: 0,
    counselorId: "",
    dimensionId: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add API call here
    toast.success("Program created successfully!");
    setIsModalOpen(false);
  };
  // Add some mock programs data
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
  // Update your form section to include the mock data in selects
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
              <th className="py-3 text-left">Name</th>
              <th className="py-3 text-left">Start Date</th>
              <th className="py-3 text-left">Min. Score</th>
              <th className="py-3 text-left">Participants</th>
              <th className="py-3 text-left">Counselor</th>
              <th className="py-3 text-left">Actions</th>
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
                  <td className="py-3">{program.name}</td>
                  <td>{program.startDate}</td>
                  <td>{program.minimumScore}</td>
                  <td>{program.participantLimit}</td>
                  <td>{program.counselorName}</td>
                  <td className="flex gap-2">
                    <button className="p-2 text-blue-400 hover:text-blue-300">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="p-2 text-red-400 hover:text-red-300">
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
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Start Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Minimum Score</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1">Participant Limit</label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg"
                    required
                  />
                </div>
                {/* Update the Counselor select in your modal form */}
                <div>
                  <label className="block mb-1">Counselor</label>
                  <select 
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg" 
                    required
                    value={formData.counselorId}
                    onChange={(e) => setFormData({...formData, counselorId: e.target.value})}
                  >
                    <option value="">Select Counselor</option>
                    {mockCounselors.map(counselor => (
                      <option key={counselor.id} value={counselor.id}>
                        {counselor.name} - {counselor.specialization}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Update the Dimension select in your modal form */}
                <div>
                  <label className="block mb-1">Dimension</label>
                  <select 
                    className="w-full px-3 py-2 bg-gray-700 rounded-lg" 
                    required
                    value={formData.dimensionId}
                    onChange={(e) => setFormData({...formData, dimensionId: e.target.value})}
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
    </div>
  );
};

export default ProgramList;
const TargetProgramEdit = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  program, 
  counselors, 
  dimensions 
}) => {
  if (!isOpen || !program) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-6 text-white">Edit Program</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input type="hidden" name="programId" value={program.id} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-white">Program Name</label>
              <input
                type="text"
                name="name"
                defaultValue={program.name}
                maxLength={150}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-white">Start Date</label>
              <input
                type="date"
                name="startDate"
                defaultValue={program.startDate}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-white">Minimum Score</label>
              <input
                type="number"
                name="minimumScore"
                defaultValue={program.minimumScore}
                min="0"
                max="100"
                className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-white">Participant Limit</label>
              <input
                type="number"
                name="participantLimit"
                defaultValue={program.participantLimit}
                min="1"
                className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-white">Dimension</label>
              <div className="relative">
                <select 
                  name="dimensionId"
                  className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white appearance-none" 
                  required
                  defaultValue={program.dimensionId}
                  style={{ 
                    WebkitAppearance: "none",
                    MozAppearance: "none" 
                  }}
                >
                  <option value="" className="bg-gray-700 text-white">Select Dimension</option>
                  {dimensions.map(dimension => (
                    <option key={dimension.id} value={dimension.id} className="bg-gray-700 text-white">
                      {dimension.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="col-span-2">
              <label className="block mb-1 text-white">Description</label>
              <textarea
                name="description"
                defaultValue={program.description}
                className="w-full px-3 py-2 bg-gray-700 rounded-lg text-white"
                rows="4"
                required
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TargetProgramEdit;
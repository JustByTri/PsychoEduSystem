import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const TargetProgramDelete = ({ isOpen, onClose, onConfirm, programName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
        <div className="text-center">
          <FontAwesomeIcon
            icon={faExclamationTriangle}
            className="text-yellow-400 text-5xl mb-4"
          />
          <h3 className="text-xl font-bold text-white mb-2">Delete Program</h3>
          <p className="text-gray-300 mb-6">
            Are you sure you want to delete "{programName}"? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TargetProgramDelete;
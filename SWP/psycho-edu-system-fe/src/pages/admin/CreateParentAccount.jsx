import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus, faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { getAuthDataFromLocalStorage } from "../../utils/auth";

const CreateParentAccount = () => {
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [studentRelationships, setStudentRelationships] = useState([
    { studentEmail: "", relationshipName: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authData = getAuthDataFromLocalStorage();
  const token = authData?.accessToken;

  const handleAddRelationship = () => {
    setStudentRelationships([
      ...studentRelationships,
      { studentEmail: "", relationshipName: "" },
    ]);
  };

  const handleRemoveRelationship = (index) => {
    setStudentRelationships(studentRelationships.filter((_, i) => i !== index));
  };

  const handleRelationshipChange = (index, field, value) => {
    const updatedRelationships = [...studentRelationships];
    updatedRelationships[index][field] = value;
    setStudentRelationships(updatedRelationships);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      parentName,
      parentEmail,
      studentRelationships,
    };

    try {
      const response = await axios.post(
        "https://localhost:7192/api/User/create-parent-account",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response.data || "Parent account created successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form sau khi thành công
      setParentName("");
      setParentEmail("");
      setStudentRelationships([{ studentEmail: "", relationshipName: "" }]);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Failed to create parent account.";
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold mb-8 text-center drop-shadow-lg"
      >
        Create Parent Account
      </motion.h1>

      {/* Form Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Parent Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                Parent Name
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                placeholder="Enter parent name"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 font-semibold mb-1">
                Parent Email
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                placeholder="Enter parent email"
                required
              />
            </div>
          </div>

          {/* Student Relationships */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200">
              Student Relationships
            </h3>
            {studentRelationships.map((relationship, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col md:flex-row gap-4 bg-gray-800 p-4 rounded-lg"
              >
                <div className="flex-1">
                  <label className="block text-gray-300 text-sm mb-1">
                    Student Email
                  </label>
                  <input
                    type="email"
                    value={relationship.studentEmail}
                    onChange={(e) =>
                      handleRelationshipChange(
                        index,
                        "studentEmail",
                        e.target.value
                      )
                    }
                    className="w-full p-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                    placeholder="Enter student email"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-gray-300 text-sm mb-1">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={relationship.relationshipName}
                    onChange={(e) =>
                      handleRelationshipChange(
                        index,
                        "relationshipName",
                        e.target.value
                      )
                    }
                    className="w-full p-2 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-400 transition-all duration-300"
                    placeholder="e.g., Son, Daughter"
                    required
                  />
                </div>
                {studentRelationships.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveRelationship(index)}
                    className="mt-6 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300"
                  >
                    Remove
                  </button>
                )}
              </motion.div>
            ))}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleAddRelationship}
              className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
            >
              Add Another Relationship
            </motion.button>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-lg transition-all duration-300 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Parent Account"}
          </motion.button>
        </form>
      </motion.section>
    </div>
  );
};

export default CreateParentAccount;

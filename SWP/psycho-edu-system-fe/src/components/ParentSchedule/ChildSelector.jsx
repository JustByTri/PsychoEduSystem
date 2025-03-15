import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { getAuthDataFromLocalStorage } from "../../utils/auth";

const ChildSelector = ({ onChildSelected }) => {
  const [children, setChildren] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy parentId từ token
  const authData = getAuthDataFromLocalStorage();
  const parentId = authData?.userId;

  useEffect(() => {
    if (!parentId) {
      setError("Parent ID not found. Please log in again.");
      setIsLoading(false);
      return;
    }

    const fetchChildren = async () => {
      try {
        setIsLoading(true);
        console.log("Fetching children for parentId:", parentId);

        const response = await axios.get(
          `https://localhost:7192/api/relationships/parent/${parentId}`,
          {
            headers: {
              Authorization: `Bearer ${authData.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const result = response.data.result || response.data;
        if (!Array.isArray(result)) {
          setError("Invalid API response: expected an array of relationships");
          setIsLoading(false);
          return;
        }

        const formattedChildren = result
          .filter((rel) => rel?.studentId)
          .map((rel) => ({
            id: rel.studentId,
            name:
              rel.relationshipName || `Student ${rel.studentId.slice(0, 8)}`,
            role: "Student",
          }));

        if (formattedChildren.length === 0) {
          setError("No children found for this parent.");
        } else {
          setChildren(formattedChildren);
        }
      } catch (error) {
        console.error("Fetch children error:", error.message);
        setError("Failed to fetch children. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildren();
  }, [parentId, authData.accessToken]);

  
  const handleSelectChild = (childId) => {
    console.log("Child selected:", childId);
    onChildSelected(childId);
  };

  if (isLoading)
    return <div className="text-center text-gray-600">Loading...</div>;
  if (error)
    return <div className="text-center text-red-600">Error: {error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md border border-gray-200"
    >
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Select a Student
      </h2>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-3"
      >
        {children.map((child, index) => (
          <motion.div
            key={child.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => handleSelectChild(child.id)}
            className="p-4 border rounded-md cursor-pointer transition-colors hover:border-blue-300"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                {child.name.charAt(0) || "S"}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-800">
                  {child.name} (ID: {child.id})
                </p>
                <p className="text-sm text-gray-500">{child.role}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ChildSelector;

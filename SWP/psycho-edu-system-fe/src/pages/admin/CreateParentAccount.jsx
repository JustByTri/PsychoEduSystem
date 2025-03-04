/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Modal,
  Fade,
  TextField,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserFriends,
  faTrash,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { getAuthDataFromLocalStorage } from "../../utils/auth";
import { motion, AnimatePresence } from "framer-motion";

const CreateParentAccount = () => {
  const [parentName, setParentName] = useState("");
  const [parentEmail, setParentEmail] = useState("");
  const [studentRelationships, setStudentRelationships] = useState([
    { studentEmail: "", relationshipName: "" },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorDetails, setErrorDetails] = useState("");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [errors, setErrors] = useState({ parentName: "", parentEmail: "" });

  const authData = getAuthDataFromLocalStorage();
  const token = authData?.accessToken;

  const validateForm = () => {
    let tempErrors = { parentName: "", parentEmail: "" };
    let isValid = true;

    if (!parentName.trim()) {
      tempErrors.parentName = "Parent name is required";
      isValid = false;
    }
    if (!parentEmail.trim()) {
      tempErrors.parentEmail = "Parent email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(parentEmail)) {
      tempErrors.parentEmail = "Invalid email format";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

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
    if (!validateForm()) return;

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

      setIsSuccessModalOpen(true);
      setTimeout(() => setIsSuccessModalOpen(false), 3000);

      setParentName("");
      setParentEmail("");
      setStudentRelationships([{ studentEmail: "", relationshipName: "" }]);
      setErrors({ parentName: "", parentEmail: "" });
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

      if (error.response && error.response.status === 400) {
        const errorDetail =
          error.response.data?.message ||
          JSON.stringify(error.response.data) ||
          "Bad request: Invalid data.";
        setErrorDetails(errorDetail);
        setIsErrorModalOpen(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearForm = () => {
    setParentName("");
    setParentEmail("");
    setStudentRelationships([{ studentEmail: "", relationshipName: "" }]);
    setErrors({ parentName: "", parentEmail: "" });
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
    setErrorDetails("");
  };

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen text-gray-900 flex justify-center">
      <Box className="w-full max-w-3xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-10"
        >
          <Typography
            variant="h4"
            className="text-center font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
            sx={{ mb: 2 }}
          >
            Create Parent Account
          </Typography>
          <Typography variant="body1" className="text-center text-gray-600">
            Fill in the details below to create a new parent account
          </Typography>
        </motion.div>

        {/* Form Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <Card
            className="p-6 rounded-xl shadow-lg bg-white border border-gray-200"
            sx={{ maxWidth: "100%", width: "100%" }}
          >
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Parent Info */}
                <Box className="space-y-6">
                  <Box className="flex items-center gap-4">
                    <FontAwesomeIcon
                      icon={faUserFriends}
                      className="text-blue-500 w-10 h-10"
                    />
                    <Box className="flex-1">
                      <Typography
                        variant="subtitle1"
                        className="font-semibold text-gray-800 mb-1"
                      >
                        Parent Name
                      </Typography>
                      <TextField
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        placeholder="Enter parent name"
                        fullWidth
                        variant="outlined"
                        size="small"
                        error={!!errors.parentName}
                        helperText={errors.parentName}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": { borderColor: "#3b82f6" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#3b82f6",
                            },
                          },
                        }}
                      />
                    </Box>
                  </Box>
                  <Box className="flex items-center gap-4">
                    <FontAwesomeIcon
                      icon={faUserFriends}
                      className="text-blue-500 w-10 h-10"
                    />
                    <Box className="flex-1">
                      <Typography
                        variant="subtitle1"
                        className="font-semibold text-gray-800 mb-1"
                      >
                        Parent Email
                      </Typography>
                      <TextField
                        type="email"
                        value={parentEmail}
                        onChange={(e) => setParentEmail(e.target.value)}
                        placeholder="Enter parent email"
                        fullWidth
                        variant="outlined"
                        size="small"
                        error={!!errors.parentEmail}
                        helperText={errors.parentEmail}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "&:hover fieldset": { borderColor: "#3b82f6" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#3b82f6",
                            },
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Student Relationships */}
                <Box className="space-y-4">
                  <Typography
                    variant="h6"
                    className="font-semibold text-gray-800 bg-gradient-to-r from-green-600 to-teal-600 text-transparent bg-clip-text"
                  >
                    Student Relationships
                  </Typography>
                  <AnimatePresence>
                    {studentRelationships.map((relationship, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="flex flex-col sm:flex-row gap-4 border-b pb-4 border-gray-300"
                      >
                        <Box className="flex-1">
                          <Typography
                            variant="subtitle2"
                            className="text-gray-700 mb-1"
                          >
                            Student Email
                          </Typography>
                          <TextField
                            type="email"
                            value={relationship.studentEmail}
                            onChange={(e) =>
                              handleRelationshipChange(
                                index,
                                "studentEmail",
                                e.target.value
                              )
                            }
                            placeholder="Enter student email"
                            fullWidth
                            variant="outlined"
                            size="small"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "&:hover fieldset": { borderColor: "#10b981" },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#10b981",
                                },
                              },
                            }}
                          />
                        </Box>
                        <Box className="flex-1">
                          <Typography
                            variant="subtitle2"
                            className="text-gray-700 mb-1"
                          >
                            Relationship
                          </Typography>
                          <TextField
                            value={relationship.relationshipName}
                            onChange={(e) =>
                              handleRelationshipChange(
                                index,
                                "relationshipName",
                                e.target.value
                              )
                            }
                            placeholder="e.g., Son, Daughter"
                            fullWidth
                            variant="outlined"
                            size="small"
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                "&:hover fieldset": { borderColor: "#10b981" },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#10b981",
                                },
                              },
                            }}
                          />
                        </Box>
                        {studentRelationships.length > 1 && (
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => handleRemoveRelationship(index)}
                            className="mt-6 transition-all duration-300 hover:bg-red-50"
                            sx={{ textTransform: "none", minWidth: "80px" }}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddRelationship}
                    className="w-full transition-all duration-300 hover:scale-105"
                    sx={{
                      textTransform: "none",
                      backgroundColor: "#3b82f6",
                      "&:hover": { backgroundColor: "#2563eb" },
                    }}
                    startIcon={<FontAwesomeIcon icon={faPlus} />}
                  >
                    Add Relationship
                  </Button>
                </Box>

                {/* Action Buttons */}
                <Box className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    className="w-full transition-all duration-300 hover:scale-105"
                    sx={{
                      backgroundColor: "#10b981",
                      "&:hover": { backgroundColor: "#059669" },
                      textTransform: "none",
                      py: 1.5,
                    }}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Create Parent Account"
                    )}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleClearForm}
                    className="w-full transition-all duration-300 hover:scale-105"
                    sx={{
                      textTransform: "none",
                      borderColor: "#6b7280",
                      color: "#6b7280",
                      "&:hover": { borderColor: "#4b5563", color: "#4b5563" },
                    }}
                  >
                    Clear Form
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </Box>

      {/* Error Modal */}
      <Modal
        open={isErrorModalOpen}
        onClose={closeErrorModal}
        closeAfterTransition
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Fade in={isErrorModalOpen}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white p-6 rounded-xl shadow-2xl border border-red-200 max-w-md w-full"
          >
            <Typography
              variant="h5"
              className="font-bold text-red-600 mb-4 text-center bg-gradient-to-r from-red-600 to-pink-600 text-transparent bg-clip-text"
            >
              Oops!
            </Typography>
            <Typography
              variant="body1"
              className="text-gray-700 mb-6 text-center"
            >
              {errorDetails}
            </Typography>
            <Box className="flex justify-center">
              <Button
                variant="contained"
                color="error"
                onClick={closeErrorModal}
                className="transition-all duration-300 hover:scale-105"
                sx={{
                  textTransform: "none",
                  backgroundColor: "#ef4444",
                  "&:hover": { backgroundColor: "#dc2626" },
                }}
              >
                Close
              </Button>
            </Box>
          </motion.div>
        </Fade>
      </Modal>

      {/* Success Modal */}
      <Modal
        open={isSuccessModalOpen}
        onClose={closeSuccessModal}
        closeAfterTransition
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Fade in={isSuccessModalOpen}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-white p-6 rounded-xl shadow-2xl border border-green-200 max-w-md w-full"
          >
            <Typography
              variant="h5"
              className="font-bold text-green-600 mb-4 text-center bg-gradient-to-r from-green-600 to-teal-600 text-transparent bg-clip-text"
            >
              Success!
            </Typography>
            <Typography
              variant="body1"
              className="text-gray-700 mb-6 text-center"
            >
              Parent account created successfully!
            </Typography>
            <Box className="flex justify-center">
              <Button
                variant="contained"
                color="primary"
                onClick={closeSuccessModal}
                className="transition-all duration-300 hover:scale-105"
                sx={{
                  backgroundColor: "#10b981",
                  "&:hover": { backgroundColor: "#059669" },
                  textTransform: "none",
                }}
              >
                Close
              </Button>
            </Box>
          </motion.div>
        </Fade>
      </Modal>
    </div>
  );
};

export default CreateParentAccount;

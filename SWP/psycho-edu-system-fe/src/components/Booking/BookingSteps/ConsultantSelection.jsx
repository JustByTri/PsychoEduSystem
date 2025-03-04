import { useState, useEffect } from "react";
import { useBooking } from "../../../context/BookingContext";
import { getAuthDataFromLocalStorage } from "../../../utils/auth";
import { motion } from "framer-motion";
import axios from "axios";
import { Card, CardContent, Typography, Box } from "@mui/material";

export const ConsultantSelection = () => {
  const { updateBookingData, bookingData, isParent } = useBooking();
  const [consultants, setConsultants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        setIsLoading(true);
        const authData = getAuthDataFromLocalStorage();
        if (!bookingData.consultantType) {
          setError("No consultant type selected. Please select a type first.");
          setIsLoading(false);
          return;
        }

        let consultantList = [];
        if (bookingData.consultantType === "homeroom") {
          let studentId = !isParent()
            ? bookingData.userId || authData.userId
            : bookingData.childId;
          if (!studentId) {
            setError("No valid student ID available.");
            setIsLoading(false);
            return;
          }

          const response = await axios.get(
            `https://localhost:7192/api/User/${studentId}/class`,
            {
              headers: {
                Authorization: `Bearer ${authData.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status === 200) {
            const teacherData = response.data.result || response.data;
            const teacherId = teacherData.teacherId;
            consultantList = [
              {
                id: teacherId || "unknown-id",
                name: `Teacher ${teacherId?.slice(0, 8) || "unknown"}`,
                role: "Homeroom Teacher",
                availableSlots: [],
              },
            ];
          }
        } else if (bookingData.consultantType === "counselor") {
          const response = await axios.get(
            `https://localhost:7192/api/psychologists`,
            {
              headers: {
                Authorization: `Bearer ${authData.accessToken}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status === 200) {
            let data = response.data.result || response.data;
            const formattedConsultants = data.map((psychologist) => ({
              id: psychologist.userId || "unknown-id",
              name:
                psychologist.fullName ||
                `Counselor ${psychologist.userId?.slice(0, 8) || "unknown"}`,
              role: "Counselor",
              availableSlots: [],
            }));
            consultantList = formattedConsultants;
          }
        }

        if (consultantList.length === 0) setError("No consultants available.");
        else setConsultants(consultantList);
      } catch (error) {
        setError(error.message || "Failed to fetch consultants");
      } finally {
        setIsLoading(false);
      }
    };

    if (bookingData.consultantType) fetchConsultants();
    else {
      setIsLoading(false);
      setError("No consultant type selected");
    }
  }, [
    bookingData.consultantType,
    bookingData.isParent,
    bookingData.userId,
    bookingData.childId,
    isParent,
  ]);

  const handleSelectConsultant = (consultant) => {
    updateBookingData({
      consultantId: consultant.id,
      consultantName: consultant.name,
      availableSlots: consultant.availableSlots,
    });
  };

  if (isLoading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-gray-600"
      >
        Loading consultants...
      </motion.div>
    );
  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-red-600"
      >
        Error: {error}
      </motion.div>
    );

  return (
    <Box className="py-6">
      <Typography
        variant="h5"
        sx={{
          fontFamily: "Inter, sans-serif",
          fontWeight: 600,
          color: "#333",
          mb: 4,
          textAlign: "center",
        }}
      >
        Select Consultant
      </Typography>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {consultants.map((consultant, index) => (
          <motion.div
            key={consultant.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card
              className={`rounded-xl shadow-lg border transition-shadow duration-300 cursor-pointer ${
                bookingData.consultantId === consultant.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:shadow-xl hover:border-blue-300"
              }`}
              sx={{ minWidth: 200, maxWidth: 300 }}
              onClick={() => handleSelectConsultant(consultant)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box className="flex items-center">
                  <Box
                    className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center"
                    sx={{ mr: 2 }}
                  >
                    <Typography
                      sx={{ fontFamily: "Inter, sans-serif", fontWeight: 500 }}
                    >
                      {consultant.name?.charAt(0) || "C"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "#333",
                      }}
                    >
                      {consultant.name || "Unknown Consultant"}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "Inter, sans-serif",
                        fontSize: "0.9rem",
                        color: "#666",
                      }}
                    >
                      {consultant.role || "Counselor"}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </Box>
  );
};

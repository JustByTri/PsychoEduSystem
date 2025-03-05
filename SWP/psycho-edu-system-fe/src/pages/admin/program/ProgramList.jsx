import { useState, useEffect } from "react";
import { Box, Button, Card, CardContent, Typography, Modal, Fade, TextField, CircularProgress, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TargetProgramService } from "../../../api/services/targetProgramService";
import { motion, AnimatePresence } from "framer-motion";

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
      setError("Failed to load programs.");
      toast.error("Failed to load programs.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateProgram = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.startDate || !formData.capacity) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      await TargetProgramService.createTargetProgram({
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        minPoint: parseInt(formData.minPoint),
        capacity: parseInt(formData.capacity),
        dimensionId: parseInt(formData.dimensionId),
      });
      toast.success("Program created successfully!");
      setIsModalOpen(false);
      setFormData({ name: "", description: "", startDate: "", minPoint: "", capacity: "", dimensionId: "" });
      fetchPrograms();
    } catch (error) {
      toast.error("Failed to create program.");
    }
  };

  return (
    <Box className="p-8 text-gray-900 min-h-screen bg-gray-100">
      <ToastContainer />
      <Card className="p-6 rounded-xl shadow-lg bg-white">
        <CardContent>
          <Typography variant="h4" className="font-bold text-center mb-4">
            Target Programs
          </Typography>
          <Button
            onClick={() => setIsModalOpen(true)}
            variant="contained"
            color="primary"
            startIcon={<FontAwesomeIcon icon={faPlus} />}
          >
            Create Program
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-6 p-6 rounded-xl shadow-lg bg-white">
        {loading ? (
          <CircularProgress className="block mx-auto" />
        ) : error ? (
          <Typography color="error" className="text-center">{error}</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Min. Score</TableCell>
                <TableCell>Participants</TableCell>
                <TableCell>Dimension ID</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {programs.map((program) => (
                <TableRow key={program.id}>
                  <TableCell>{program.name}</TableCell>
                  <TableCell>{program.startDate}</TableCell>
                  <TableCell>{program.minPoint}</TableCell>
                  <TableCell>{program.capacity}</TableCell>
                  <TableCell>{program.dimensionId}</TableCell>
                  <TableCell>
                    <Button color="error" onClick={() => {}}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <Fade in={isModalOpen}>
          <Box className="p-6 bg-white rounded-xl shadow-2xl max-w-md mx-auto mt-20">
            <Typography variant="h5" className="font-bold mb-4">Create New Program</Typography>
            <form onSubmit={handleCreateProgram} className="space-y-4">
              <TextField label="Program Name" name="name" fullWidth required onChange={handleInputChange} />
              <TextField label="Description" name="description" fullWidth onChange={handleInputChange} />
              <TextField label="Start Date" type="date" name="startDate" fullWidth required onChange={handleInputChange} />
              <TextField label="Minimum Score" type="number" name="minPoint" fullWidth onChange={handleInputChange} />
              <TextField label="Participant Limit" type="number" name="capacity" fullWidth required onChange={handleInputChange} />
              <TextField label="Dimension ID" type="number" name="dimensionId" fullWidth onChange={handleInputChange} />
              <Box className="flex justify-end gap-4">
                <Button onClick={() => setIsModalOpen(false)} color="secondary">Cancel</Button>
                <Button type="submit" variant="contained" color="primary">Create</Button>
              </Box>
            </form>
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default ProgramList;

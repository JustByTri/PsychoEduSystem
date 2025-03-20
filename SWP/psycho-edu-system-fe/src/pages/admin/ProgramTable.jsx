/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
  TextField,
  Select,
  MenuItem,
  Box,
} from "@mui/material";

const ProgramTable = ({
  programs,
  role,
  loading,
  error,
  onSelectProgram,
  onUpdateProgram,
}) => {
  const [editingProgram, setEditingProgram] = useState(null);
  const [updatedProgram, setUpdatedProgram] = useState({});

  const handleEditClick = (program) => {
    setEditingProgram(program.programId);
    setUpdatedProgram({ ...program });
  };

  const handleInputChange = (e, field) => {
    setUpdatedProgram((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleUpdate = () => {
    onUpdateProgram(updatedProgram);
    console.log(updatedProgram);
    setEditingProgram(null);
  };

  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <CircularProgress />
        </div>
      ) : error ? (
        <Typography
          align="center"
          color="error"
          sx={{ fontSize: "1.2rem", fontWeight: "bold", my: 3 }}
        >
          {error}
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ mt: 2, borderRadius: "12px" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#1976D2" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Program Name
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Description
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Min Score
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Dimension
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Capacity
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Date & Time
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {programs.map((program) => (
                <TableRow key={program.programId} hover>
                  <TableCell>
                    {editingProgram === program.programId ? (
                      <TextField
                        value={updatedProgram.name}
                        onChange={(e) => handleInputChange(e, "name")}
                        size="small"
                      />
                    ) : (
                      program.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProgram === program.programId ? (
                      <TextField
                        value={updatedProgram.description}
                        onChange={(e) => handleInputChange(e, "description")}
                        size="small"
                      />
                    ) : program.description.length > 50 ? (
                      `${program.description.substring(0, 50)}...`
                    ) : (
                      program.description
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProgram === program.programId ? (
                      <TextField
                        value={updatedProgram.minPoint}
                        onChange={(e) => handleInputChange(e, "minPoint")}
                        size="small"
                        type="number"
                      />
                    ) : (
                      program.minPoint
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProgram === program.programId ? (
                      <Select
                        value={updatedProgram.dimensionName}
                        onChange={(e) => handleInputChange(e, "dimensionName")}
                        size="small"
                        sx={{ minWidth: 120 }}
                      >
                        <MenuItem value={"Lo Âu"}>Lo Âu</MenuItem>
                        <MenuItem value={"Trầm Cảm"}>Trầm Cảm</MenuItem>
                        <MenuItem value={"Căng Thẳng"}>Căng Thẳng</MenuItem>
                      </Select>
                    ) : (
                      program.dimensionName
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProgram === program.programId ? (
                      <TextField
                        value={updatedProgram.capacity}
                        onChange={(e) => handleInputChange(e, "capacity")}
                        size="small"
                        type="number"
                      />
                    ) : (
                      `${program.currentCapacity}/${program.capacity}`
                    )}
                  </TableCell>
                  <TableCell>
                    {program.day} at {program.time}
                  </TableCell>
                  <TableCell>
                    {editingProgram === program.programId ? (
                      <>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Button
                            variant="contained"
                            sx={{
                              bgcolor: "#388E3C",
                              color: "white",
                              "&:hover": { bgcolor: "#2E7D32" },
                            }}
                            onClick={handleUpdate}
                          >
                            Save
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => setEditingProgram(null)}
                          >
                            Cancel
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="contained"
                          sx={{
                            bgcolor: "#0288D1",
                            color: "white",
                            "&:hover": { bgcolor: "#0277BD" },
                            mr: 1,
                          }}
                          onClick={() => onSelectProgram(program)}
                        >
                          View Details
                        </Button>
                        {role === "Admin" && (
                          <Button
                            variant="contained"
                            sx={{
                              bgcolor: "#F57C00",
                              color: "white",
                              "&:hover": { bgcolor: "#E65100" },
                            }}
                            onClick={() => handleEditClick(program)}
                          >
                            Update
                          </Button>
                        )}
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default ProgramTable;

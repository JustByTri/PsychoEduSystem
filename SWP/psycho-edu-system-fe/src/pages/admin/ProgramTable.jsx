/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
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
} from "@mui/material";

const ProgramTable = ({ programs, loading, error, onSelectProgram }) => {
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
                  Date
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Time
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
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {programs.map((program) => (
                <TableRow key={program.programId} hover>
                  <TableCell>{program.name}</TableCell>
                  <TableCell>
                    {program.description.length > 50
                      ? `${program.description.substring(0, 50)}...`
                      : program.description}
                  </TableCell>
                  <TableCell>{program.day}</TableCell>
                  <TableCell>{program.time}</TableCell>
                  <TableCell>{program.minPoint}</TableCell>
                  <TableCell>{program.dimensionName}</TableCell>
                  <TableCell>
                    {program.currentCapacity}/{program.capacity}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      sx={{
                        bgcolor: "#0288D1",
                        color: "white",
                        "&:hover": { bgcolor: "#0277BD" },
                      }}
                      onClick={() => onSelectProgram(program)}
                    >
                      View Details
                    </Button>
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

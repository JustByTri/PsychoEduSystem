/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { TargetProgramService } from "../../api/services/targetProgram";
import { Typography, Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AuthContext from "../../context/auth/AuthContext";
import ProgramDialog from "./ProgramDialog";
import ProgramTable from "./ProgramTable";
import FilterForms from "./FiltersForm";
import CreateProgramDialog from "./CreateProgramDialog";
import { toast } from "react-toastify";
const TargetPrograms = () => {
  const { user } = useContext(AuthContext) || {};
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [filters, setFilters] = useState({
    day: null,
    capacity: "",
    time: null,
    minPoint: "",
    dimensionName: "",
  });
  const [tempFilters, setTempFilters] = useState(filters);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [step, setStep] = useState(1);
  const [programData, setProgramData] = useState({
    name: "",
    description: "",
    minPoint: 0,
    capacity: 0,
    dimensionId: "",
    day: null,
    time: null,
    counselors: [],
  });

  const loadPrograms = async () => {
    setLoading(true);
    try {
      const formattedFilters = {
        ...filters,
        day: filters.day ? filters.day.format("YYYY-MM-DD") : "",
        time: filters.time ? filters.time.format("HH:mm") : "",
      };

      let data;
      if (user?.role === "Admin") {
        data = await TargetProgramService.getTargetPrograms(formattedFilters);
      } else {
        data = await TargetProgramService.getTargetProgramsByUserId(
          formattedFilters
        );
      }

      setPrograms(data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch programs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, [filters]);

  const applyFilters = () => {
    setFilters(tempFilters);
  };
  const onUpdateProgram = async (updatedProgram) => {
    const updatedProgramPayload = {
      programId: updatedProgram.programId,
      name: updatedProgram.name,
      description: updatedProgram.description,
      minPoint: updatedProgram.minPoint,
      capacity: updatedProgram.capacity,
      dimensionId:
        updatedProgram.dimensionName === "Lo Âu"
          ? 1
          : updatedProgram.dimensionName === "Trầm Cảm"
          ? 2
          : updatedProgram.dimensionName === "Căng Thẳng"
          ? 3
          : updatedProgram.dimensionId,
    };
    console.log(updatedProgramPayload);
    try {
      const response = await fetch(
        "https://localhost:7192/api/TargetProgram/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedProgramPayload),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.Error || "Failed to update the program.");
      }
      toast.success("Program updated successfully");
      loadPrograms();
    } catch (error) {
      toast.error("Error updating program: " + error.message);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Typography variant="h4" className="mb-6 text-center" color="primary">
        Student Psychological Support Programs
      </Typography>
      <div className="p-6 max-w-6xl mx-auto">
        {user?.role === "Admin" && (
          <div className="flex space-x-2 mb-4">
            <Button
              variant="contained"
              color="primary"
              onClick={() => setOpenCreateDialog(true)}
            >
              Create
            </Button>
          </div>
        )}
        <FilterForms
          tempFilters={tempFilters}
          setTempFilters={setTempFilters}
          applyFilters={applyFilters}
        />
        <ProgramTable
          programs={programs}
          loading={loading}
          role={user.role}
          error={error}
          onUpdateProgram={onUpdateProgram}
          onSelectProgram={setSelectedProgram}
        />
        <ProgramDialog
          selectedProgram={selectedProgram}
          onClose={() => setSelectedProgram(null)}
        />
      </div>
      <CreateProgramDialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
        reloadPrograms={loadPrograms}
      />
    </LocalizationProvider>
  );
};

export default TargetPrograms;

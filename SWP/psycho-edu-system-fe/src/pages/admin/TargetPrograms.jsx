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
          user?.id,
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
            <Button variant="contained" color="secondary" onClick={() => {}}>
              Update
            </Button>
            <Button variant="contained" color="error" onClick={() => {}}>
              Delete
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
          error={error}
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

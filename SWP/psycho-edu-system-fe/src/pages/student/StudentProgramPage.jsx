import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import StudentHeader from "../../components/Header/StudentHeader";
import StudentSideBar from "../../components/Bar/StudentSideBar";
import ProgramTable from "../../components/Table/ProgramTable";

const StudentProgramPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const studentData = {
    role: "STUDENT",
    name: "LE LY HUY",
    avatar: "https://anhnghethuatvietnam2022.com/wp-content/uploads/2024/11/anh-avatar-vo-tri-16.jpg",
    onLogout: handleLogout
  };

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden', bgcolor: '#f5f5f5' }}>
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <StudentHeader userData={studentData} />
      </Box>

      <Box sx={{ 
        display: 'flex', 
        pt: '70px', 
        height: 'calc(100vh - 64px)'
      }}>
        <Box sx={{ 
          position: 'fixed', 
          left: 0, 
          top: '64px', 
          bottom: 0, 
          width: '100px'
        }}>
          <StudentSideBar />
        </Box>

        <Box sx={{ flex: 1, p: 2, height: '100%', maxWidth: '1300px', ml: '165px' }}>
          <ProgramTable />
        </Box>
      </Box>
    </Box>
  );
};

export default StudentProgramPage;

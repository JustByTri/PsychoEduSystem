import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import StudentHeader from "../../components/Header/StudentHeader";
import StudentSideBar from "../../components/Bar/StudentSideBar";
import ProgramDetailCard from "../../components/Card/ProgramDetailCard";
import ProgramCounselorCard from "../../components/Card/ProgramCounselorCard";

const StudentProgramDetail = () => {
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

        <Box sx={{ 
          flex: 1,
          ml: '100px',
          p: 4,
          height: '100%',
          maxWidth: '1500px',
          mx: 'auto'
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', ml: 10, mt: -2, mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<ArrowLeft />}
          onClick={() => navigate('/student/program')}
          sx={{
            bgcolor: '#65CCB8',
            '&:hover': { bgcolor: '#82DBC5' },
            borderRadius: 2,
            textTransform: 'none'
          }}
        >
          My List Program
        </Button>
      </Box>

          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}>
            <ProgramDetailCard />
            <ProgramCounselorCard />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentProgramDetail;

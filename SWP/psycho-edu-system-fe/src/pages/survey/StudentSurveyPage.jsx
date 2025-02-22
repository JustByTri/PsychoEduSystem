import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentHeader from "../../components/Header/StudentHeader";
import StudentSideBar from "../../components/Bar/StudentSideBar";
import StudentSkipSurvey from "../../components/Pop-up/StudentSkipSurvey";
import { Box } from "@mui/material";

const StudentSurveyPage = () => {
  const navigate = useNavigate();
  const [skipDialogOpen, setSkipDialogOpen] = useState(false);

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

  const handleStart = () => {
    navigate('/student/survey/questions');
  };

  const handleSkip = () => {
    setSkipDialogOpen(true);
  };

  const handleSkipConfirm = () => {
    setSkipDialogOpen(false);
    navigate('/student'); // Navigate to student portal
  };

  const handleSkipCancel = () => {
    setSkipDialogOpen(false);
  };

  return (
    <Box sx={{ height: '100vh', overflow: 'hidden', bgcolor: '#f5f5f5' }}>
      <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50 }}>
        <StudentHeader userData={studentData} />
      </Box>

      <Box sx={{ display: 'flex', pt: '0px', height: 'calc(100vh)' }}>
        <Box sx={{ position: 'fixed', left: 0, top: '50px', bottom: 0, width: '100px' }}>
          <StudentSideBar />
        </Box>

        <Box sx={{ flex: 1, ml: '80px', height: '100%', position: 'relative' }}>
          <div className="w-full h-full flex flex-col items-center justify-center"
            style={{
              backgroundImage: `url('https://thedecisionlab.com/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fthedecisionlab%2FZq0zEEaF0TcGIqOZ_4879b5bc-4680-4c2a-8203-6c0da046ee8b.png%3Fauto%3Dformat%2Ccompress&w=3840&q=75')`,
              backgroundSize: 'cover', 
              backgroundPosition: 'center', 
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="bg-white/80 p-8 rounded-lg shadow-lg backdrop-blur-sm">
              <h1 className="text-3xl font-bold text-center mb-6">Student Survey</h1>
              <div className="flex gap-4">
                <button
                  onClick={handleStart}
                  className="px-6 py-2 bg-[#82DBC5] text-white rounded-lg hover:bg-[#65CCB8] transition-colors"
                >
                  Start Survey
                </button>
                <button
                  onClick={handleSkip}
                  className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Skip Survey
                </button>
              </div>
            </div>
          </div>
        </Box>
      </Box>

      <StudentSkipSurvey 
        open={skipDialogOpen}
        onClose={handleSkipCancel}
        onConfirm={handleSkipConfirm}
      />
    </Box>
  );
};

export default StudentSurveyPage;

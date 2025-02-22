import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentHeader from "../../components/Header/StudentHeader";
import StudentSideBar from "../../components/Bar/StudentSideBar";
import StudentSkipSurvey from "../../components/Pop-up/StudentSkipSurvey";
import { Box } from "@mui/material";

const StudentSurveyPage = () => {
  const navigate = useNavigate();
  const [skipDialogOpen, setSkipDialogOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
    navigate('/students/survey/questions');
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
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 z-50">
        <StudentHeader userData={studentData} />
      </div>

      <div className="flex pt-[64px]">
        <div className="fixed left-0 top-[64px] bottom-0">
          <StudentSideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>

        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-[6s0px]' : 'ml-[160px]'}`}>
          <div className="w-full h-[calc(100vh-64px)] flex flex-col items-center justify-center"
            style={{
              backgroundImage: `url('https://thedecisionlab.com/_next/image?url=https%3A%2F%2Fimages.prismic.io%2Fthedecisionlab%2FZq0zEEaF0TcGIqOZ_4879b5bc-4680-4c2a-8203-6c0da046ee8b.png%3Fauto%3Dformat%2Ccompress&w=3840&q=75')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
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
        </div>
      </div>

      <StudentSkipSurvey 
        open={skipDialogOpen}
        onClose={handleSkipCancel}
        onConfirm={handleSkipConfirm}
      />
    </div>
  );
};

export default StudentSurveyPage;

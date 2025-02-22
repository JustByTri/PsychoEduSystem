import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StudentHeader from "../../components/Header/StudentHeader";
import StudentSideBar from "../../components/Bar/StudentSideBar";
import WelcomeCard from "../../components/Card/WelcomeCard";
import MoodTrackerCard from "../../components/Card/MoodTrackerCard";
import ResourcesCard from "../../components/Card/ResourcesCard";
import UpcomingSessionsCard from "../../components/Card/UpcomingSessionsCard";
import SupportCard from "../../components/Card/SupportCard";

const StudentPortal = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(true);

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
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 z-50">
        <StudentHeader userData={studentData} />
      </div>

      <div className="flex pt-[64px]">
        <div className="fixed left-0 top-[64px] bottom-0">
          <StudentSideBar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        </div>

        <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-[60px]' : 'ml-[250px]'} p-8`}>
          <div className="max-w-[1200px] mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <WelcomeCard studentName={studentData.name} />
            </div>

            <div className="grid grid-cols-12 gap-8">
              {/* Left Column */}
              <div className="col-span-12 lg:col-span-8 space-y-8">
                {/* Mood Tracker */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <MoodTrackerCard />
                </div>
                
                {/* Resources */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <ResourcesCard />
                </div>
              </div>

              {/* Right Column */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                {/* Upcoming Sessions */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <UpcomingSessionsCard />
                </div>
                
                {/* Support Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <SupportCard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentPortal;

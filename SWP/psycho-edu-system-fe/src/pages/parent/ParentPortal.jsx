import { useNavigate } from 'react-router-dom';
import ParentSideBar from "../../components/Bar/ParentSideBar";
import ParentHeader from "../../components/Header/ParentHeader";
import SideBar from "../../components/Navigation/SideBar";
import AuthCard from "../../components/Card/AuthCard";
import FeelingCard from "../../components/Card/FeelingCard";
import QuickLinksCard from "../../components/Card/QuickLinksCard";
import NotesCard from "../../components/Card/NotesCard";
import CounselingCard from "../../components/Card/CounselingCard";

const PortalPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 z-50">
        <ParentHeader onLogout={handleLogout} />
      </div>

      <div className="flex pt-[64px]">
        <div className="fixed left-0 top-[64px] bottom-0 w-[100px]">
          <SideBar />
        </div>

        <div className="flex-1 ml-[100px] p-8 min-h-screen overflow-y-auto">
            <div className="mb-[50px]">
                  <AuthCard />
                </div>
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-8 space-y-8">
                
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <FeelingCard />
                </div>
                
                <div className="bg-white rounded-2xl p-1 shadow-sm mt-[-10px]">
                  <h2 className="text-2xl font-semibold mb-[-30px] mt-4">Quick links</h2>
                  <div className="grid grid-cols-3 gap-2">
                    <QuickLinksCard />
                  </div>
                </div>
              </div>

              <div className="col-span-4 space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <NotesCard />
                </div>
                
                <div className="rounded-2xl">
                  <CounselingCard />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalPage;

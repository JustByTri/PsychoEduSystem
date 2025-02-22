import { useNavigate } from 'react-router-dom';
import ParentHeader from "../../components/Header/ParentHeader";
import AuthCard from "../../components/Card/AuthCard";
import FeelingCard from "../../components/Card/FeelingCard";
import QuickLinksCard from "../../components/Card/QuickLinksCard";
import NotesCard from "../../components/Card/NotesCard";
import CounselingCard from "../../components/Card/CounselingCard";

const CounselorPortal = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 right-0 z-50">
        <ParentHeader onLogout={handleLogout} />
      </div>

      <div className="flex pt-[64px]">
        <div className="flex-1 p-8 min-h-screen overflow-y-auto">
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
                  <h2 className="text-2xl font-semibold mb-[-30px] mt-4">Counselor Dashboard</h2>
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

export default CounselorPortal;

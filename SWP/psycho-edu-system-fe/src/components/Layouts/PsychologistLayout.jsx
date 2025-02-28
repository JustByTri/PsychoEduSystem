import { Outlet } from "react-router-dom";
import PsychologistSidebar from "../Navigation/PsychologistSidebar";
import ParentHeader from "../Header/ParentHeader"; // Tái sử dụng hoặc thay bằng PsychologistHeader nếu cần
import Breadcrumbs from "../Breadcrumbs ";

const PsychologistLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <ParentHeader />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-shrink-0 h-full">
          <PsychologistSidebar />
        </div>
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          <Breadcrumbs />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PsychologistLayout;

import { Outlet } from "react-router-dom";
import SideBar from "../Navigation/SideBar";
import Header from "../Header/Header";
import { useState } from "react";
const PortalLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="bg-gray-100">
      <div className="h-screen flex overflow-hidden bg-gray-200">
        <SideBar isOpen={isSidebarOpen} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header onToggleSidebar={toggleSidebar} />
          <div className="flex-1 overflow-auto p-4 flex justify-center items-center">
            <div className="w-full max-w-7xl px-4">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalLayout;

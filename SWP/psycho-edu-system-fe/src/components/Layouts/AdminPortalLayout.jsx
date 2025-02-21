import { Outlet } from "react-router-dom";
import AdminSidebar from "../Navigation/AdminSidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
const AdminPortalLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="bg-[#1E293B] text-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-lg font-semibold ml-2">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <FontAwesomeIcon
            icon={faUserCircle}
            className="w-7 h-7 text-gray-300"
          />
          <button className="flex items-center space-x-2 hover:text-gray-400">
            <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </header>
      {/* Main layout with Sidebar and Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Fixed height, no scrolling) */}
        <div className="flex-shrink-0 h-full">
          <AdminSidebar />
        </div>

        {/* Outlet (Scrollable Content) */}
        <div className="flex-1 overflow-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default AdminPortalLayout;

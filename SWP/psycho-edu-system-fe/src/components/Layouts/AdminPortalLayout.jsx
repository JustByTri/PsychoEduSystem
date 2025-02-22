import { Outlet } from "react-router-dom";
import AdminSidebar from "../Navigation/AdminSidebar";
import AdminHeader from "../Header/AdminHeader";
const AdminPortalLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <AdminHeader />
      {/* Main layout with Sidebar and Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Fixed height, no scrolling) */}
        <div className="flex-shrink-0 h-full">
          <AdminSidebar />
        </div>

        {/* Outlet (Scrollable Content) */}
        <div className="flex-1 overflow-auto p-4 bg-gradient-to-br from-gray-900 to-gray-800">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
export default AdminPortalLayout;

import { Outlet } from "react-router-dom";
import ParentHeader from "../Header/ParentHeader";
import ParentSidebar from "../Navigation/ParentSidebar";
import Breadcrumbs from "../Breadcrumbs ";
const ParentLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <ParentHeader />

      {/* Main layout with Sidebar and Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Fixed height, no scrolling) */}
        <div className="flex-shrink-0 h-full">
          <ParentSidebar />
        </div>

        {/* Outlet (Scrollable Content) */}
        <div className="flex-1 overflow-auto p-4 bg-gray-50">
          <Breadcrumbs />
          <Outlet />
        </div>
      </div>
    </div>
  );  
};

export default ParentLayout;

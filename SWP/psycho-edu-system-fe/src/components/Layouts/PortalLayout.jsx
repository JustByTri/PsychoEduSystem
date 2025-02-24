import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import SideBar from "../Navigation/SideBar";

const PortalLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header />

      {/* Main layout with Sidebar and Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Fixed height, no scrolling) */}
        <div className="flex-shrink-0 h-full">
          <SideBar />
        </div>

        {/* Outlet (Scrollable Content) */}
        <div className="flex-1 overflow-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PortalLayout;

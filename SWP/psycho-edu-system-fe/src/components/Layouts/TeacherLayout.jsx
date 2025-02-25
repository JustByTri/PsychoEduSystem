import Header from "../Header/Header";
import TeacherSidebar from "../Navigation/TeacherSidebar";
import Breadcrumbs from "../Breadcrumbs ";
import { Outlet } from "react-router-dom";
const TeacherLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <Header />

      {/* Main layout with Sidebar and Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar (Fixed height, no scrolling) */}
        <div className="flex-shrink-0 h-full">
          <TeacherSidebar />
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

export default TeacherLayout;

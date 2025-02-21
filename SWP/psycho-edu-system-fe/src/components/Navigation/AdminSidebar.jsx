import { useState } from "react";
import { Link } from "react-router-dom";
import {
  faTachometerAlt,
  faBookOpen,
  faPoll,
  faUsers,
  faCalendarCheck,
  faChartBar,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const navItems = [
    { icon: faTachometerAlt, label: "Dashboard", path: "/admin" },
    { icon: faBookOpen, label: "Programs", path: "/admin/programs" },
    { icon: faPoll, label: "Surveys", path: "/admin/survey-management" },
    { icon: faUsers, label: "Users", path: "/admin/users" },
    {
      icon: faCalendarCheck,
      label: "Appointments",
      path: "/admin/appointments",
    },
    { icon: faChartBar, label: "Reports", path: "/admin/reports" },
  ];

  const handleToggleMenu = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div
      className={`bg-[#1E293B] text-white shadow-lg transition-all duration-300 h-full ${
        isCollapsed ? "w-20" : "w-72"
      } flex flex-col justify-between`}
      style={{ minHeight: "100vh" }}
    >
      {/* Sidebar Toggle Button */}
      <div className="flex items-center justify-between p-4">
        <button
          className="text-white p-2 w-full rounded-md hover:bg-white/10 transition-all duration-300"
          onClick={handleToggleMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-8 h-8 mx-auto transition-transform duration-300 ${
              isCollapsed ? "rotate-0" : "rotate-180"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow space-y-2 mt-6">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center p-3 mx-3 rounded-md hover:bg-white/10 transition-all duration-300 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="relative">
              <FontAwesomeIcon
                icon={item.icon}
                className="w-7 h-7 text-gray-300"
              />
            </div>
            {!isCollapsed && (
              <span className="ml-5 text-gray-300 font-medium">
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;

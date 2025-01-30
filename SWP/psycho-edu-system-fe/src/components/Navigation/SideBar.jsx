import { useState } from "react";
import { Link } from "react-router-dom";
import {
  faHome,
  faClipboardList,
  faCogs,
  faHistory,
  faFileAlt,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const navItems = [
    { icon: faHome, label: "Home", path: "/student" },
    {
      icon: faClipboardList,
      label: "Survey",
      path: "/student/start-up-survey",
    },
    { icon: faCogs, label: "Program", path: "#" },
    { icon: faHistory, label: "History", path: "#" },
    { icon: faFileAlt, label: "Report", path: "#" },
    { icon: faUser, label: "Account", path: "#" },
  ];

  const handleToggleMenu = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div
      className={`bg-[#65CCB8] text-[#002B36] shadow-md transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-72"
      } flex flex-col justify-between`}
      style={{ minHeight: "100vh" }}
    >
      <div className="flex items-center justify-between p-4">
        <button
          className="text-[#002B36] p-2 w-full rounded-md hover:bg-white/20 transition-all duration-300"
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

      {/* Navigation */}
      <nav className="flex-grow space-y-2 mt-6">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center p-3 mx-3 rounded-md hover:bg-white/20 transition-all duration-300 ${
              isCollapsed ? "justify-center" : ""
            }`}
          >
            <div className="relative">
              <FontAwesomeIcon icon={item.icon} className="w-7 h-7" />
            </div>
            {!isCollapsed && (
              <span className="ml-5 text-[#002B36] font-medium">
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default SideBar;

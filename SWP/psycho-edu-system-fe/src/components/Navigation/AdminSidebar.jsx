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
    { icon: faPoll, label: "Surveys", path: "/admin/survey" },
    { icon: faUsers, label: "Users", path: "/admin/users" },
    {
      icon: faCalendarCheck,
      label: "Appointments",
      path: "/admin/appointments",
    },
    { icon: faChartBar, label: "Reports", path: "/admin/reports" },
  ];

  return (
    <div
      className={`transition-all duration-300 h-full flex flex-col justify-between ${
        isCollapsed ? "w-20" : "w-72"
      }`}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1E293B, #2E3A4E)",
        borderRight: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Sidebar Toggle Button */}
      <div className="flex items-center justify-between p-4">
        <button
          className="text-white p-2 w-full rounded-lg hover:bg-white/10 transition-all duration-300"
          onClick={() => setIsCollapsed(!isCollapsed)}
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
      <nav className="flex-grow space-y-1 mt-6">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center p-3 mx-3 rounded-lg transition-all duration-300 ${
              isCollapsed ? "justify-center" : ""
            }`}
            style={{
              background: "linear-gradient(135deg, #1F2A3A, #2B394D)",
              transition: "background 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(135deg, #243040, #34455A)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(135deg, #1F2A3A, #2B394D)")
            }
          >
            <FontAwesomeIcon
              icon={item.icon}
              className="w-7 h-7 text-gray-300"
            />
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

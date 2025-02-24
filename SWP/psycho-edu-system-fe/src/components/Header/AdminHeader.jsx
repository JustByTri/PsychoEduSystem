import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faSignOutAlt,
  faBell,
  faCog,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/auth/AuthContext";
const AdminHeader = () => {
  const { logout } = useContext(AuthContext) || {};
  const navigate = useNavigate();
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Log Out",
      cancelButtonText: "No, Stay Logged In",
      confirmButtonColor: "#E63946",
      cancelButtonColor: "#3085d6",
      reverseButtons: true,
      focusCancel: true,
      customClass: {
        popup: "rounded-xl shadow-md",
        title: "text-lg font-semibold",
        confirmButton: "px-4 py-2 text-sm font-medium",
        cancelButton: "px-4 py-2 text-sm font-medium",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        // Show success message with auto-close
        Swal.fire({
          title: "Logged Out",
          text: "You have successfully logged out.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          willClose: () => {
            navigate("/");
          },
        });
      }
    });
  };
  return (
    <header
      className="flex justify-between items-center px-6 py-3 text-white transition-all duration-300"
      style={{
        background: "linear-gradient(145deg, #1E293B, #263343)",
        boxShadow:
          "inset 0 2px 4px rgba(255, 255, 255, 0.08), 0 4px 12px rgba(0, 0, 0, 0.2)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      {/* Left Section - Dashboard Title */}
      <div className="flex items-center space-x-3">
        <h1 className="text-xl font-semibold tracking-wide drop-shadow-md">
          Admin Panel
        </h1>
      </div>

      {/* Center Section - Search Bar with Icons Nearby */}
      <div className="flex items-center bg-[#2A3A4F] px-4 py-2 rounded-full transition-all duration-300 focus-within:ring-2 focus-within:ring-[#576D8D]">
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent text-gray-300 outline-none w-40 md:w-56 lg:w-64 transition-all duration-300 placeholder-gray-400"
        />
        <FontAwesomeIcon
          icon={faSearch}
          className="text-gray-400 cursor-pointer hover:text-white transition-all duration-300"
        />
      </div>

      {/* Right Section - Icons & User Actions */}
      <div className="flex items-center space-x-5">
        {/* Notifications */}
        <button className="relative group p-2 rounded-full transition-all duration-300 hover:bg-white/10">
          <FontAwesomeIcon
            icon={faBell}
            className="w-5 h-5 text-gray-300 group-hover:text-white transition-all duration-300"
          />
          <span className="absolute top-1 right-1 w-3 h-3 bg-red-500 border border-gray-800 rounded-full shadow-md animate-pulse"></span>
        </button>

        {/* Settings */}
        <button className="p-2 rounded-full transition-all duration-300 hover:bg-white/10">
          <FontAwesomeIcon
            icon={faCog}
            className="w-5 h-5 text-gray-300 hover:rotate-180 transition-all duration-500"
          />
        </button>

        {/* User Profile */}
        <button className="flex items-center space-x-2 p-2 rounded-lg transition-all duration-300 hover:bg-white/10">
          <FontAwesomeIcon
            icon={faUserCircle}
            className="w-6 h-6 text-gray-300 group-hover:scale-110 transition-all duration-300"
          />
          <span className="hidden md:block text-sm text-gray-300 group-hover:text-white transition-all duration-300">
            Admin
          </span>
        </button>

        {/* Logout Button */}
        <button
          className="p-2 rounded-lg transition-all duration-300 bg-[#E63946] hover:bg-[#C72C3C] hover:shadow-lg hover:scale-105"
          onClick={handleLogout}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 text-white" />
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;

/* eslint-disable no-unused-vars */
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faHome,
  faChartBar,
  faClipboardList,
  faBell,
  faFileAlt,
  faUser,
  faSignOutAlt,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import AuthContext from "../../context/auth/AuthContext";
import LogoHeader from "../../assets/logo-header.png";
import Avatar from "../../assets/avatar.png";

const ParentHeader = () => {
  const { logout } = useContext(AuthContext) || {};
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Log Out",
      cancelButtonText: "No, Stay Logged In",
      confirmButtonColor: "#E63946",
      cancelButtonColor: "#3085d6",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
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
    <header className="flex items-center justify-between sticky top-0 z-50 shadow-sm p-2 bg-[#C9EDE4]">
      <img src={LogoHeader} className="w-32 h-15" />
      <div className="flex items-center space-x-6">
        <div className="relative hidden md:block">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"
          />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 w-full max-w-md rounded-full bg-white focus:ring-4 outline-none shadow-lg transition-all duration-300"
          />
        </div>
        <div className="relative">
          <img
            src={Avatar}
            alt="Profile"
            className="w-12 h-12 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300"
            onClick={toggleDropdown}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-3 py-2 z-50 w-48 bg-[#AEF2E1] rounded-lg shadow-lg transition-all duration-300">
              <Link
                to="/"
                className="block px-4 py-2 text-left text-gray-800 font-medium shadow-md hover:bg-white/20 hover:scale-90 transition-all duration-300"
              >
                Home
              </Link>
              <button
                className="block px-4 py-2 w-full text-left text-gray-800 font-medium shadow-md hover:bg-white/20 hover:scale-90 transition-all duration-300"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default ParentHeader;

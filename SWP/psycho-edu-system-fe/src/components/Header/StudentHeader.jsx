import React, { useState } from "react";
import { Search } from "lucide-react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const StudentHeader = ({ userData = {
  role: "STUDENT",
  name: "NGUYEN SY HEN",
  avatar: "https://anhnghethuatvietnam2022.com/wp-content/uploads/2024/11/anh-avatar-vo-tri-16.jpg",
} }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="w-full h-[70px] bg-[#C9EDE4]">
      <div className="px-4 h-16 flex items-center justify-between">
        {/* Left side - Logo and Search */}
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <img 
              src="/logo.png" 
              alt="FPT Software" 
              className="h-10 rounded-lg" 
            />
          </div>

          {/* Search Bar */}
          <div className="relative ml-4">
            <div className="flex items-center bg-white rounded-full pl-4 pr-2 py-1">
              <span className="text-gray-400 mr-2">≡</span>
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent w-[300px] focus:outline-none text-sm"
              />
              <button className="p-1">
                <Search className="text-gray-400" size={18} />
              </button>
            </div>
          </div>
        </div>


        <div className="flex items-center gap-8 mr-10">
          <div className="relative">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img
                src={userData.avatar}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="text-left">
                <div className="text-xs text-gray-600">WELCOME, {userData.role}</div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-medium">{userData.name}</span>
                  <KeyboardArrowDownIcon 
                    className={`text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                    fontSize="small" 
                  />
                </div>
              </div>
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                <div className="py-1 text-left">
                  <a href="/students/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </a>
                  <a href="/students/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </a>
                  <hr className="my-1" />
                  <a onClick={userData.onLogout} className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer">
                    Sign out
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHeader;

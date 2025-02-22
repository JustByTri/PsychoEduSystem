import React, { useState } from "react";
import { Search } from "lucide-react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const AuthHeader = ({ userData = {
  role: "PARENT",
  name: "NGUYEN THANH TUNG",
  avatar: "https://anhnghethuatvietnam2022.com/wp-content/uploads/2024/11/anh-avatar-vo-tri-16.jpg",
  children: [
    {
      name: "NGUYEN DUC HAI",
      role: "SON",
      avatar: "https://tech24.vn/upload/post/images/2024/09/26/675/avatar-vo-tri-2.jpg"
    },
    {
      name: "NGUYEN DUC MANH",
      role: "SON",
      avatar: "https://anhcute.net/wp-content/uploads/2024/11/anh-avatar-vo-tri.jpg"
    }
  ]
} }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="w-full h-[70px] bg-[#C9EDE4]">
      <div className="px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
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

        {/* Right side - Navigation and Profile */}
        <div className="flex items-center gap-8">
          {/* Navigation Links */}
          <nav className="flex items-center gap-4">
            <a href="/guide" className="text-gray-700 hover:text-gray-900">Guide</a>
            <a href="/how-to-use" className="text-gray-700 hover:text-gray-900">How to use?</a>
          </nav>

          {/* Profile Section with Dropdown */}
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
              <div className="absolute right-0 mt-2 w-54 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                {userData.children.map((child, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer"
                  >
                    <img
                      src={child.avatar}
                      alt={child.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="text-sm font-medium">{child.name}</div>
                      <div className="text-xs text-gray-500 text-left">({child.role})</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthHeader;

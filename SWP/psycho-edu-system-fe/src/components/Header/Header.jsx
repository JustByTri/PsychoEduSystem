import LogoHeader from "../../assets/logo-header.png";
import Avatar from "../../assets/avatar.png";
const Header = ({ onToggleSidebar }) => {
  return (
    <div className="bg-[#C9EDE4] shadow">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <img src={LogoHeader} alt="Logo" className="h-8 sm:h-10" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-center gap-2 md:flex-row md:gap-4 w-full md:w-auto transition-all duration-300">
              <img
                src={Avatar}
                alt="User Avatar"
                className="h-8 sm:h-10 rounded-full object-cover"
              />
              <p className="text-sm font-thin uppercase text-center md:text-left">
                Welcome, Peter Parker
              </p>
            </div>
            <button
              className="text-gray-500 hover:text-gray-600"
              id="open-sidebar"
              onClick={onToggleSidebar}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

import { useState } from "react";
import { Link, useLocation } from "react-router-dom"; // Thêm Link và useLocation
import LoginModal from "../Modal/LoginModal";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faInfoCircle,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // Sử dụng useLocation để kiểm tra đường dẫn
  const clientId =
    "1018910450198-m8sitc37vcjdg1qbe7d3cp00nca00840.apps.googleusercontent.com";

  const links = [
    { to: "/about", title: "About", icon: faInfoCircle },
    { to: "/", title: "Home", icon: faHome },
    { to: "/contact", title: "Contact", icon: faEnvelope },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 shadow-md">
      <nav className="bg-[#26A69A] px-4 lg:px-6 py-2">
        <div className="flex items-center justify-between mx-auto max-w-screen-xl">
          <Link
            to="/"
            className="flex items-center group transition-transform duration-300 hover:scale-105 no-underline"
            aria-label="Mental Health Care Homepage"
          >
            <span className="text-2xl text-[#FFFFFF] font-semibold">
              Mental Health Care©
            </span>
          </Link>
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } w-full lg:flex lg:w-auto lg:order-1 transition-all duration-300 mt-2 ease-in-out`}
            id="mobile-menu"
          >
            <ul className="flex flex-col items-center lg:flex-row lg:items-center lg:space-x-8 w-full lg:mt-0">
              {links.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className={`flex items-center px-3 pt-2 text-sm font-semibold text-[#FFFFFF] hover:text-[#FBBF24] hover:bg-[#F9E79F] lg:hover:bg-transparent transition-all duration-300 rounded-md no-underline
                    }`}
                  >
                    <FontAwesomeIcon icon={link.icon} className="mr-2" />
                    <span>{link.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center space-x-4 lg:order-2">
            <GoogleOAuthProvider clientId={clientId}>
              <LoginModal />
            </GoogleOAuthProvider>
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center p-1.5 text-[#FFFFFF] lg:hidden focus:outline-none focus:ring-2 focus:ring-[#FBBF24] rounded-md"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`w-5 h-5 ${isMenuOpen ? "hidden" : "block"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <svg
                className={`w-5 h-5 ${isMenuOpen ? "block" : "hidden"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

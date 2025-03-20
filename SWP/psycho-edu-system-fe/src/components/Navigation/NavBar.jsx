import { useState } from "react";
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
  const clientId =
    "1018910450198-m8sitc37vcjdg1qbe7d3cp00nca00840.apps.googleusercontent.com";

  const links = [
    { href: "", title: "About", icon: faInfoCircle },
    { href: "", title: "Home", icon: faHome },
    { href: "", title: "Contact", icon: faEnvelope },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (href) => window.location.pathname === href;

  return (
    <header className="sticky top-0 z-50 shadow-md">
      <nav className="bg-teal-100 px-4 lg:px-6 py-2">
        <div className="flex items-center justify-between mx-auto max-w-screen-xl">
          <a
            href="/"
            className="flex items-center group transition-transform duration-200 hover:scale-105 no-underline"
            aria-label="Mental Health Care Homepage"
          >
            <span className="text-2xl text-[#34258a] font-Verdana font-semibold">
              Mental Health Care©
            </span>
          </a>

          {/* Menu chính */}
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } w-full lg:flex lg:w-auto lg:order-1 transition-all duration-300 ease-in-out`}
            id="mobile-menu"
            role="navigation"
          >
            <ul className="flex flex-col items-center lg:flex-row lg:items-center lg:space-x-8 w-full mt-2 lg:mt-2 lg:mb-2 ">
              {links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className={`flex items-center px-3  text-sm font-semibold text-teal-900 hover:text-teal-600 hover:bg-teal-50 lg:hover:bg-transparent transition-all duration-200 rounded-md no-underline ${
                      isActive(link.href)
                        ? "bg-teal-200 text-teal-900 lg:bg-teal-50"
                        : ""
                    }`}
                    aria-label={`${link.title} page`}
                  >
                    <FontAwesomeIcon icon={link.icon} className="mr-2" />
                    <span>{link.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Div chứa Sign In và button toggle */}
          <div className="flex items-center space-x-4 lg:order-2">
            <div className="flex items-center">
              <GoogleOAuthProvider clientId={clientId}>
                <LoginModal/>
              </GoogleOAuthProvider>
            </div>
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center p-1.5 text-teal-900 lg:hidden focus:outline-none focus:ring-2 focus:ring-teal-300 rounded-md"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`w-5 h-5 ${isMenuOpen ? "hidden" : "block"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
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
                xmlns="http://www.w3.org/2000/svg"
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

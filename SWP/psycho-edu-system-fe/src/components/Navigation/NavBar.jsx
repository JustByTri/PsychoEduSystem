import { useState } from "react";
import LoginModal from "../Modal/LoginModal";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faInfoCircle,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons"; // Import Font Awesome icons
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const clientId =
    "1018910450198-m8sitc37vcjdg1qbe7d3cp00nca00840.apps.googleusercontent.com";

  const links = [
    { href: "", title: "About", icon: <FontAwesomeIcon icon={faInfoCircle} /> },
    { href: "", title: "Home", icon: <FontAwesomeIcon icon={faHome} /> },
    { href: "", title: "Contact", icon: <FontAwesomeIcon icon={faEnvelope} /> },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 shadow-md">
      <nav className="bg-[#A8E0D6] px-4 lg:px-6 py-2.5">
        <div className="flex flex-wrap items-center justify-between mx-auto max-w-screen-xl">
          <a href="/" className="flex items-center">
            <span className="self-center text-2xl text-[#34258a] font-Verdana font-semibold">
              Mental Health Care©
            </span>
          </a>
          <div className="flex items-center lg:order-2">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center p-2 ml-1 text-sm text-black border-none rounded-none lg:hidden focus:ring-0 focus:outline-none"
              aria-controls="mobile-menu-2"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`w-6 h-6 ${isMenuOpen ? "hidden" : "block"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <svg
                className={`w-6 h-6 ${isMenuOpen ? "block" : "hidden"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } justify-between items-center w-full lg:flex lg:w-auto lg:order-2`}
            id="mobile-menu-2"
          >
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-16 lg:mt-0">
              {links.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="block py-2 pr-4 pl-3 text-sm text-[#002B36] hover:text-[#65CCB8] font-semibold hover:bg-[#C9EDE4] lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 transition"
                  >
                    {link.icon} <span>{link.title}</span>
                  </a>
                </li>
              ))}
              <li>
                <GoogleOAuthProvider clientId={clientId}>
                  <LoginModal />
                </GoogleOAuthProvider>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

import { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import AuthContext from "../../context/auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faInfoCircle,
  faEnvelope,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const { isAuthenticated, user, login, logout, loginGoogle } =
    useContext(AuthContext) || {};
  const role = user?.role || "";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [isOpenUserMenu, setIsOpenUserMenu] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const clientId =
    "1018910450198-m8sitc37vcjdg1qbe7d3cp00nca00840.apps.googleusercontent.com";

  const links = [
    {
      path: "/about",
      title: "About",
      icon: <FontAwesomeIcon icon={faInfoCircle} />,
    },
    { path: "/", title: "Home", icon: <FontAwesomeIcon icon={faHome} /> },
    {
      path: "/contact",
      title: "Contact",
      icon: <FontAwesomeIcon icon={faEnvelope} />,
    },
  ];

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const handleNavigate = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleOutsideClick = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsLoginModal(false);
    }
  };

  useEffect(() => {
    if (isLoginModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isLoginModal]);

  const handleGoogleSuccess = async (response) => {
    try {
      const role = await loginGoogle(response.credential);
      if (role === "Student") navigate("/student");
      setIsLoginModal(false);
      toast.success("Logged in with Google!");
    } catch (error) {
      toast.error(error.message || "Google login failed!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const role = await login(email, password);
      switch (role) {
        case "Admin":
          navigate("/admin");
          break;
        case "Student":
          navigate("/student");
          break;
        case "Parent":
          navigate("/parent");
          break;
        case "Teacher":
          navigate("/teacher");
          break;
        case "Psychologist":
          navigate("/psychologist");
          break;
        default:
          toast.error("Invalid role detected!");
          return;
      }
      setIsLoginModal(false);
      toast.success("Logged in successfully!");
    } catch (error) {
      toast.error(error.message || "Login failed!");
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#E63946",
      cancelButtonColor: "#3085d6",
      customClass: { popup: "rounded-xl shadow-md" },
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: "Logged Out",
          text: "You have successfully logged out.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          willClose: () => navigate("/"),
        });
      }
    });
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  };

  const buttonVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95 },
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <header className="sticky top-0 z-50 shadow-md">
        <nav className="bg-gradient-to-r from-blue-500 to-blue-700 px-4 lg:px-6 py-1.5">
          <div className="flex items-center justify-between mx-auto max-w-6xl">
            {" "}
            {/* Changed from max-w-screen-xl to max-w-6xl */}
            <motion.a
              href="/"
              className="flex items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-xl text-blue-100 font-Verdana font-bold tracking-tight drop-shadow-md">
                Mental Health Care©
              </span>
            </motion.a>
            <button
              onClick={toggleMenu}
              className="lg:hidden p-2 text-blue-200 rounded-lg hover:bg-blue-600/50 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-colors"
            >
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
            <AnimatePresence>
              {(isMenuOpen || window.innerWidth >= 1024) && (
                <motion.div
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full lg:w-auto lg:order-2"
                >
                  <ul className="flex flex-col pt-2 lg:flex-row lg:space-x-8 lg:mt-0 bg-blue-600/20 lg:bg-transparent lg:p-0 rounded-lg lg:rounded-none shadow-md lg:shadow-none">
                    {links.map((link, index) => (
                      <motion.li
                        key={index}
                        custom={index}
                        variants={buttonVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        whileTap="tap"
                      >
                        <button
                          onClick={() => handleNavigate(link.path)}
                          className="flex items-center w-full py-2 px-3 text-sm text-blue-100 font-semibold hover:bg-blue-600 hover:text-blue-50 transition-colors rounded-md lg:hover:bg-transparent lg:hover:text-blue-200 lg:p-0"
                        >
                          <span className="mr-2">{link.icon}</span>
                          <span>{link.title}</span>
                        </button>
                      </motion.li>
                    ))}
                    <motion.li
                      custom={links.length}
                      variants={buttonVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {isAuthenticated === false ? (
                        <button
                          onClick={() => setIsLoginModal(true)}
                          className="flex items-center w-full py-2 px-3 text-sm text-blue-100 font-semibold hover:bg-blue-600 hover:text-blue-50 transition-colors rounded-md lg:hover:bg-transparent lg:hover:text-blue-200 lg:p-0"
                        >
                          <FontAwesomeIcon icon={faUser} className="mr-2" />
                          Sign In
                        </button>
                      ) : (
                        <div className="relative">
                          <button
                            onClick={() => setIsOpenUserMenu(!isOpenUserMenu)}
                            className="flex items-center w-full py-2 px-3 text-sm text-blue-100 font-semibold hover:bg-blue-600 hover:text-blue-50 transition-colors rounded-md lg:hover:bg-transparent lg:hover:text-blue-200 lg:p-0"
                          >
                            <FontAwesomeIcon icon={faUser} className="mr-2" />
                            User
                          </button>
                          {isOpenUserMenu && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="absolute right-0 mt-2 w-48 bg-blue-600/90 rounded-lg shadow-xl text-blue-100 p-2"
                            >
                              <ul className="space-y-1">
                                <li>
                                  <button
                                    onClick={() =>
                                      handleNavigate(`/${role.toLowerCase()}`)
                                    }
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-blue-50 rounded-md transition-colors"
                                  >
                                    Portal
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() => handleNavigate("/profile")}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-blue-50 rounded-md transition-colors"
                                  >
                                    Profile
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={() =>
                                      handleNavigate("/switch-account")
                                    }
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-blue-500 hover:text-blue-50 rounded-md transition-colors"
                                  >
                                    Switch Account
                                  </button>
                                </li>
                                <li>
                                  <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-red-600 hover:text-blue-50 rounded-md transition-colors"
                                  >
                                    Sign Out
                                  </button>
                                </li>
                              </ul>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </motion.li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
            {isLoginModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
              >
                <motion.div
                  initial={{ scale: 0.8, y: -50 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.8, y: -50 }}
                  className="relative p-6 w-full max-w-md bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-2xl"
                  ref={modalRef}
                >
                  <button
                    onClick={() => setIsLoginModal(false)}
                    className="absolute top-4 right-4 text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                  <h3 className="text-xl font-bold text-blue-600 text-center mb-4">
                    Sign In
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 rounded-md bg-white text-blue-900 border border-blue-200 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all"
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 rounded-md bg-white text-blue-900 border border-blue-200 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all"
                      required
                    />
                    <div className="flex justify-between items-center text-sm">
                      <label className="flex items-center text-blue-500">
                        <input type="checkbox" className="mr-2" />
                        Remember me
                      </label>
                      <a href="#" className="text-blue-400 hover:underline">
                        Lost Password?
                      </a>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-md hover:from-blue-500 hover:to-blue-700 focus:ring-4 focus:ring-blue-200 transition-all shadow-md hover:shadow-lg"
                    >
                      Login
                    </button>
                  </form>
                  <hr className="my-4 border-blue-100" />
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => toast.error("Google login failed!")}
                  />
                </motion.div>
              </motion.div>
            )}
          </div>
        </nav>
        <ToastContainer position="top-right" autoClose={3000} />
      </header>
    </GoogleOAuthProvider>
  );
};

export default Navbar;

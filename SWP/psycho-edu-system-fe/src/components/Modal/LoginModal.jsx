/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect, useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import AuthContext from "../../context/auth/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LoginModal = () => {
  const { isAuthenticated, user, login, logout, loginGoogle } =
    useContext(AuthContext) || {};
  const role = user?.role || "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef(null);

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
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isLoginModal]);

  const handleGoogleSuccess = async (response) => {
    try {
      const role = await loginGoogle(response.credential);
      if (role === "Student") navigate("/student");
      setIsLoginModal(false);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleGoogleError = (error) => {
    toast.error(error);
  };

  const handleOpenMenu = () => {
    if (isOpenMenu) {
      setIsOpenMenu(false);
    } else {
      setIsOpenMenu(true);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#E63946",
      cancelButtonColor: "#3085d6",
      reverseButtons: false,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const role = await login(email, password);
      console.log(role);
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
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <>
      <ToastContainer />
      {isAuthenticated === false ? (
        <a
          className="flex items-center py-2 px-3 text-sm font-semibold text-teal-900 hover:text-teal-600 transition-all duration-200 no-underline"
          onClick={() => setIsLoginModal(true)}
        >
          <FontAwesomeIcon icon={faUser} className="mr-2" />
          Sign In
        </a>
      ) : (
        <div className="relative cursor-pointer">
          <div
            onClick={handleOpenMenu}
            className="flex items-center py-2 px-3 text-sm font-semibold text-teal-900 hover:text-teal-600 hover:bg-teal-50 lg:hover:bg-transparent transition-all duration-200 rounded-md no-underline"
          >
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            <span>User</span>
          </div>
          {isOpenMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute right-0 mt-2 w-44 bg-teal-50 rounded-lg shadow-lg text-left"
            >
              <ul className="py-2 px-1 text-sm font-medium text-teal-900">
                <li>
                  <a
                    href={role}
                    className="block px-4 py-2 hover:bg-teal-200 hover:text-teal-600 hover:rounded-sm no-underline"
                  >
                    Portal
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-teal-200 hover:text-teal-600 hover:rounded-sm no-underline"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-teal-200 hover:text-teal-600 hover:rounded-sm no-underline"
                  >
                    Switch Account
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-teal-200 hover:text-teal-600 hover:rounded-sm no-underline"
                    onClick={handleLogout}
                  >
                    Sign out
                  </a>
                </li>
              </ul>
            </motion.div>
          )}
        </div>
      )}

      {isLoginModal && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative p-6 w-full max-w-md bg-white rounded-lg shadow-xl"
            ref={modalRef}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-teal-900">Sign In</h3>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-teal-300"
                onClick={() => setIsLoginModal(false)}
              >
                <svg
                  className="w-4 h-4"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="mb-6 flex justify-center relative">
              <img
                src="https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmJyMndqOG9sYjQ5ZmxiNW1uejhmbjdnNjg3eGg3MXl1eGx1M2xodiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JVmYAO3MkGNiM/giphy.gif"
                alt="Welcome Animation"
                className="w-full max-w-[400px] h-60 object-cover object-[30%_43%] transform transition-all duration-300"
              />
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  className="w-full p-3 bg-teal-50 text-teal-900 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
                  placeholder="Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className="w-full p-3 bg-teal-50 text-teal-900 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-teal-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-3 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-300 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
              >
                Login
              </button>
            </form>

            <div className="mt-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                size="large"
                theme="outline"
                text="signin_with"
                shape="pill" // Bo viền tròn hơn (thay vì rectangular)
                className="py-3 hover:shadow-lg hover:scale-105 transition-all duration-200 border-teal-600 text-teal-900 font-semibold" // Tùy chỉnh thêm
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default LoginModal;

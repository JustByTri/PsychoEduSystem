/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect, useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";

{/* huy old code
import { useNavigate } from "react-router-dom";
import LogoutModal from "./LogoutModal";

const ROLES = {
  ADMIN: 'admin',
  COUNSELOR: 'counselor',
  PARENT: 'parent',
  STUDENT: 'student'
};

const ROLE_ROUTES = {
  [ROLES.ADMIN]: '/admin',
  [ROLES.COUNSELOR]: '/counselor',
  [ROLES.PARENT]: '/parent',
  [ROLES.STUDENT]: '/students'
};

const LoginModal = () => {
  const navigate = useNavigate();
*/}

import AuthContext from "../../context/auth/AuthContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
const LoginModal = () => {
  const { isAuthenticated, user, login, logout, loginGoogle } =
    useContext(AuthContext) || {};
  const role = user?.role || "";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  {/* huy old code
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    return isLoggedIn ? JSON.parse(isLoggedIn) : false;
  });
  */}

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
      {/* huy old code
      if (response.credential) {
        const userRole = ROLES.STUDENT;
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('isLoggedIn', 'true');
        setIsAuthenticated(true);
        toast.success("Login success");
        navigate(ROLE_ROUTES[userRole]);
      */}
      const role = await loginGoogle(response.credential);
      if (role === "Admin") {
        navigate("/admin");
      } else if (role === "Student") {
        navigate("/student");
      } else {
        navigate("/");
      }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const role = await login(email, password);
      if (role === "Admin") {
        navigate("/admin");
      } else if (role === "Student") {
        navigate("/student");
      } else {
        navigate("/");
      }
      setIsLoginModal(false);
    } catch (error) {
      toast.error(error);
    }
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    
    // Example email patterns for different roles
    const emailPatterns = {
      [ROLES.ADMIN]: /@admin\.com$/,
      [ROLES.COUNSELOR]: /@counselor\.com$/,
      [ROLES.PARENT]: /@parent\.com$/
    };

    let userRole = null;
    
    // Determine role based on email pattern
    Object.entries(emailPatterns).forEach(([role, pattern]) => {
      if (pattern.test(email)) {
        userRole = role;
      }
    });

    if (userRole && password.length >= 6) {
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('isLoggedIn', 'true');
      setIsAuthenticated(true);
      toast.success("Login success");
      navigate(ROLE_ROUTES[userRole]);
      setIsLoginModal(false);
    } else {
      toast.error("Invalid credentials");
    }
  };

  return (
    <>
      <ToastContainer />
      {isAuthenticated === false ? (
        <a
          className="block py-2 pr-4 pl-3 text-[#3B945E] text-sm hover:text-[#65CCB8] font-semibold hover:bg-[#C9EDE4] lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 transition cursor-pointer"
          onClick={() => setIsLoginModal(true)}
        >
          Sign In
        </a>
      ) : (
        <div className="relative cursor-pointer">
          <div
            onClick={handleOpenMenu}
            className="block py-2 pr-4 pl-3 text-sm text-[#3B945E] hover:text-[#65CCB8] font-semibold hover:bg-[#C9EDE4] lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 transition"
          >
            User
          </div>
          {isOpenMenu && (
            <div className="absolute right-0 mt-2 w-44 bg-[#dbf7f1] rounded-lg shadow-2xl text-left">
              <ul
                className="py-2 px-1 text-sm font-thin text-blue-700"
                aria-labelledby="dropdownDefaultButton"
              >
                <li>
                  <a
                    href={role}
                    className="block px-4 py-2 font-bold hover:bg-[#3B945E] hover:text-slate-50 hover:rounded-sm shadow-sm"
                  >
                    Portal
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 font-bold hover:bg-[#3B945E] hover:text-slate-50 hover:rounded-sm shadow-sm"
                  >
                    Profile
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 font-bold hover:bg-[#3B945E] hover:text-slate-50 hover:rounded-sm shadow-sm"
                  >
                    Switch Account
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 font-bold hover:bg-[#3B945E] hover:text-slate-50 hover:rounded-sm shadow-md"
                    onClick={handleLogout}
                  >
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}

      {isLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative p-4 w-full max-w-md max-h-full drop-shadow-lg">
            <div ref={modalRef} className="relative bg-white rounded-lg">
              <div className="flex items-center justify-between p-4 md:p-5">
                <h3 className="text-xl font-bold text-blue-600 flex-grow text-center">
                  Sign In
                </h3>
                <button
                  type="button"
                  className=" text-gray-400 border-none focus:ring-0 focus:outline-none hover:bg-gray-200 hover:text-gray-900 w-8 h-8 ms-auto inline-flex justify-center items-center"
                  data-modal-hide="authentication-modal"
                  onClick={() => setIsLoginModal(false)}
                >
                  <svg
                    className="w-3 h-3"
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
              <h5 className="text-xs font-light italic text-gray-400">
                Please input your account information
              </h5>

              <div className="p-4 md:p-5">

                {/*
                <form className="space-y-4" onSubmit={handleEmailLogin}>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                */}

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <input
                      type="text"
                      className="bg-gray-100 text-gray-900 text-sm block w-full p-2.5 focus:outline-none"
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-100 text-gray-900 text-sm block w-full p-2.5 focus:outline-none"
                      required
                    />
                  </div>
                  <div className="flex justify-between">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="remember"
                          type="checkbox"
                          value=""
                          className="w-4 h-4"
                        />
                      </div>
                      <label
                        htmlFor="remember"
                        className="ms-2 text-sm font-medium text-gray-400"
                      >
                        Remember me
                      </label>
                    </div>
                    <a
                      href="#"
                      className="text-sm text-blue-400 hover:underline"
                    >
                      Lost Password?
                    </a>
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 text-center rounded-none shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    Login
                  </button>
                </form>
                <hr className="h-px my-5 bg-gray-200 border-0" />
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginModal;

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
      reverseButtons: false, // Đặt Yes bên trái, No bên phải
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
          className="block py-2 pr-4 pl-3 text-[#002B36] text-sm hover:text-[#65CCB8] font-semibold hover:bg-[#C9EDE4] lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 transition cursor-pointer"
          onClick={() => setIsLoginModal(true)}
        >
          <FontAwesomeIcon icon={faUser} /> Sign In
        </a>
      ) : (
        <div className="relative cursor-pointer">
          <div
            onClick={handleOpenMenu}
            className="block py-2 pr-4 pl-3 text-sm text-[#002B36] hover:text-[#65CCB8] font-semibold hover:bg-[#C9EDE4] lg:hover:bg-transparent lg:border-0 lg:hover:text-primary-700 lg:p-0 transition"
          >
            <FontAwesomeIcon icon={faUser} /> <span>User</span>
          </div>
          {isOpenMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute right-0 mt-2 w-44 bg-[#dbf7f1] rounded-lg shadow-2xl text-left"
            >
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
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative p-4 w-full max-w-md max-h-full drop-shadow-lg"
          >
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
                  <hr className="h-px my-8 bg-gray-200 border-0"></hr>
                  <div>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Password"
                      className="bg-gray-100 text-gray-900 text-sm block w-full p-2.5 focus:outline-none"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <hr className="h-px my-8 bg-gray-200 border-0"></hr>
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
                <hr className="h-px my-5 bg-gray-200 border-0"></hr>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default LoginModal;

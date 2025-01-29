import { useState, useRef, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import LogoutModal from "./LogoutModal";
const LoginModal = () => {
  const [isLoginModal, setIsLoginModal] = useState(false);
  const [isLogoutModal, setIsLogoutModal] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    return isLoggedIn ? JSON.parse(isLoggedIn) : false;
  });
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

  useEffect(() => {
    localStorage.setItem("isLoggedIn", JSON.stringify(isAuthenticated));
  }, [isAuthenticated]);

  const handleGoogleSuccess = (response) => {
    try {
      if (response.credential) {
        toast.success("Login success");
        setIsAuthenticated(true);
      } else {
        toast.error("Login failed");
        setIsAuthenticated(false);
      }
    } catch (error) {
      toast.error(`Login failed: ${error.message}`);
    } finally {
      setIsLoginModal(false);
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

  const handleLogoutModal = () => {
    setIsLogoutModal(true);
    setIsOpenMenu(false);
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
                    href="student"
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
                    onClick={handleLogoutModal}
                  >
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
      {isLogoutModal && (
        <>
          <LogoutModal
            isLogoutModal={isLogoutModal}
            setIsLogoutModal={setIsLogoutModal}
          />
        </>
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
                <form className="space-y-4" action="#">
                  <div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="bg-gray-100 text-gray-900 text-sm block w-full p-2.5 focus:outline-none"
                      placeholder="Email"
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
                          required
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
          </div>
        </div>
      )}
    </>
  );
};

export default LoginModal;

import { useNavigate } from "react-router-dom";

const SideBar = ({ isOpen }) => {
  let navigate = useNavigate();
  return (
    <div
      className={`absolute bg-[#65CCB8] text-white w-56 min-h-screen transition-transform transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } ease-in-out duration-300`}
      id="sidebar"
    >
      <div className="p-4">
        <ul className="mt-4 py-20">
          <li>
            <a
              className="block px-2 py-3 mb-2 text-gray-900 font-medium rounded-md hover:bg-[#00B277] hover:text-white cursor-pointer"
              href="/"
            >
              Home
            </a>
          </li>
          <li>
            <a
              className="block px-2 py-3 mb-2 text-gray-900 font-medium rounded-md hover:bg-[#00B277] hover:text-white cursor-pointer"
              onClick={() => navigate("start-up-survey")}
            >
              Survey
            </a>
          </li>
          <li>
            <a
              className="block px-2 py-3 mb-2 text-gray-900 font-medium rounded-md hover:bg-[#00B277] hover:text-white cursor-pointer"
              href="/"
            >
              Program
            </a>
          </li>
          <li>
            <a
              className="block px-2 py-3 mb-2 text-gray-900 font-medium rounded-md hover:bg-[#00B277] hover:text-white cursor-pointer"
              href="/"
            >
              History
            </a>
          </li>
          <li>
            <a
              className="block px-2 py-3 mb-2 text-gray-900 font-medium rounded-md hover:bg-[#00B277] hover:text-white cursor-pointer"
              href="/"
            >
              Report
            </a>
          </li>
          <li>
            <a
              className="block px-2 py-3 mb-2 text-gray-900 font-medium rounded-md hover:bg-[#00B277] hover:text-white cursor-pointer"
              href="/"
            >
              Account
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};
export default SideBar;

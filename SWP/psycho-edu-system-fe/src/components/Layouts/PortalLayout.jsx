import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import SideBar from "../Navigation/SideBar";
const PortalLayout = () => {
  return (
    <div className="flex flex-col ">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-shrink-0">
          <SideBar />
        </div>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PortalLayout;

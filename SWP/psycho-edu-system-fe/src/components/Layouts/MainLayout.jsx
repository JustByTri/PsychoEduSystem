import { Outlet } from "react-router-dom";
import Navbar from "../Navigation/NavBar";
import Notification from "../Notifications/Notification";

const MainLayout = () => {
  return (
    <>
      <Notification />
      <Navbar />
      <Outlet />
    </>
  );
};

export default MainLayout;

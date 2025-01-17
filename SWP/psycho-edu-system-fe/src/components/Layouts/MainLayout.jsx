import { Outlet } from "react-router-dom";
import Navbar from "../Navigation/NavBar";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet /> {/* Dynamic routing for child components */}
    </>
  );
};

export default MainLayout;

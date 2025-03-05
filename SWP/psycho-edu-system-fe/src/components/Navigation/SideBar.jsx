import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faChartBar,
  faClipboardList,
  faBell,
  faCalendarPlus,
  faCalendarAlt,
  faUser,
  faFileAlt,
  faTachometerAlt,
  faBookOpen,
  faPoll,
  faUsers,
  faCalendarCheck,
  faUserPlus,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../context/auth/AuthContext";

const drawerWidth = 240;
const headerHeight = 64;

const SideBar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user } = useContext(AuthContext) || {};

  // Define navItems based on user role
  const navItems = getNavItems(user?.role);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? 80 : drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isCollapsed ? 80 : drawerWidth,
          transition: "width 0.3s",
          backgroundColor: "#FFFFFF",
          color: "#333333", // Chữ tối màu
          marginTop: `${headerHeight}px`,
          height: `calc(100vh - ${headerHeight}px)`,
          borderRight: "1px solid #E0E0E0",
          display: "flex",
          alignItems: "center",
        },
      }}
    >
      <Toolbar>
        <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
          <MenuIcon sx={{ color: "#333333" }} />
        </IconButton>
      </Toolbar>

      <List sx={{ width: "100%", textAlign: "center" }}>
        {navItems.map((item, index) => (
          <ListItem
            key={index}
            disablePadding
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <ListItemButton
              component={Link}
              to={item.path}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                paddingY: 1.5,
              }}
            >
              <ListItemIcon sx={{ color: "#333333", minWidth: "auto" }}>
                {/* Use FontAwesomeIcon component */}
                <FontAwesomeIcon icon={item.icon} />
              </ListItemIcon>
              {!isCollapsed && (
                <ListItemText
                  primary={item.label}
                  sx={{ color: "#333333", fontSize: "14px" }}
                />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

// Function to return navItems based on user role
const getNavItems = (role) => {
  switch (role) {
    case "Student":
      return [
        { icon: faHome, label: "Home", path: "/student" },
        { icon: faBookOpen, label: "Program", path: "/student/program" },
        {
          icon: faCalendarAlt,
          label: "Schedules",
          path: "/student/schedule",
        },
        { icon: faCalendarCheck, label: "Booking", path: "/student/booking" },
        // { icon: faUserCircle, label: "Account", path: "#" },
      ];
    case "Teacher":
      return [
        { icon: faHome, label: "Home", path: "/teacher" },
        // {
        //   icon: faChartBar,
        //   label: "Student Progress",
        //   path: "/teacher/progress",
        // },
        // {
        //   icon: faClipboardList,
        //   label: "Assignments",
        //   path: "/teacher/assignments",
        // },
        // {
        //   icon: faBell,
        //   label: "Notifications",
        //   path: "/teacher/notifications",
        // },
        { icon: faCalendarPlus, label: "Book Slots", path: "/teacher/slot" },
        { icon: faCalendarAlt, label: "Schedule", path: "/teacher/schedule" },
        // { icon: faUser, label: "Account", path: "/teacher/account" },
      ];
    case "Psychologist":
      return [
        { icon: faHome, label: "Dashboard", path: "/psychologist" },
        { icon: faBell, label: "Schedule", path: "/psychologist/schedule" },
        { icon: faFileAlt, label: "Book Slots", path: "/psychologist/slot" },
      ];
    case "Parent":
      return [
        { icon: faHome, label: "Home", path: "/parent" },
        // {
        //   icon: faChartBar,
        //   label: "Student Progress",
        //   path: "/parent/progress",
        // // },
        // {
        //   icon: faClipboardList,
        //   label: "Assignments",
        //   path: "/parent/assignments",
        // },
        { icon: faBell, label: "Schedule", path: "/parent/schedule" },
        { icon: faFileAlt, label: "Booking", path: "/parent/booking" },
      ];
    case "Admin":
      return [
        { icon: faTachometerAlt, label: "Dashboard", path: "/admin" },
        { icon: faBookOpen, label: "Programs", path: "/admin/programs" },
        { icon: faPoll, label: "Surveys", path: "/admin/survey" },
        {
          icon: faUserPlus,
          label: "Create Parent",
          path: "/admin/create-parent",
        },
        // { icon: faUsers, label: "Users", path: "/admin/users" },
        // {
        //   icon: faCalendarCheck,
        //   label: "Appointments",
        //   path: "/admin/appointments",
        // },
        // { icon: faChartBar, label: "Reports", path: "/admin/reports" },
      ];
    default:
      return [];
  }
};

export default SideBar;

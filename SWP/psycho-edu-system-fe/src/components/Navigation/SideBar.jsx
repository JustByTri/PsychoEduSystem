import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Tooltip,
  Badge,
  Divider,
  Box,
  Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
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
  faQuestionCircle,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@mui/material/styles";

// Reduced scale for the sidebar - making it even smaller
const drawerWidth = 220; // Reduced from 240
const collapsedWidth = 55; // Reduced from 65
const headerHeight = 64;

// Define custom colors based on gradient - more blue-focused
const customColors = {
  sidebar: {
    background: "linear-gradient(to bottom right, #E6F0FF, #EBF5FF, #F5F9FF)", // More blue tint
    activeItem: "rgba(25, 118, 210, 0.1)", // More blue active background
    hoverItem: "rgba(25, 118, 210, 0.05)", // More blue hover background
    border: "#1976D2", // Stronger blue border
    icon: "#1976D2", // Stronger blue icon
    text: "#0A1929", // Darker text for better contrast with blue
    divider: "rgba(25, 118, 210, 0.25)", // More blue divider
    badge: "#F44336", // Keeping red for badges for good contrast
  },
};

const SideBar = ({ userRole = "Student" }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubMenu, setOpenSubMenu] = useState({});
  const location = useLocation();
  const theme = useTheme();

  // Use custom colors
  const colors = customColors;

  // Define navItems based on user role
  const navItems = getNavItems(userRole);

  // Toggle submenu open/close
  const handleSubMenuToggle = (menuId) => {
    setOpenSubMenu((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  // Set collapsed state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check on initial load

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Animation styles - smaller elements
  const getItemStyle = (path) => {
    const isActive =
      location.pathname === path || location.pathname.startsWith(`${path}/`);

    return {
      display: "flex",
      flexDirection: isCollapsed ? "column" : "row",
      alignItems: isCollapsed ? "center" : "flex-start",
      textAlign: isCollapsed ? "center" : "left",
      paddingY: 1, // Reduced padding
      paddingX: 1.2, // Reduced padding
      marginX: 0.6, // Reduced margin
      marginY: 0.3, // Reduced margin
      borderRadius: "8px", // Smaller border radius
      backgroundColor: isActive ? colors.sidebar.activeItem : "transparent",
      color: isActive ? colors.sidebar.icon : colors.sidebar.text,
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        backgroundColor: colors.sidebar.hoverItem,
        transform: "translateX(4px)", // Smaller hover transform
      },
    };
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? collapsedWidth : drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isCollapsed ? collapsedWidth : drawerWidth,
          transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          background: colors.sidebar.background,
          color: colors.sidebar.text,
          marginTop: `${headerHeight}px`,
          height: `calc(100vh - ${headerHeight}px)`,
          borderRight: `1px solid ${colors.sidebar.border}`,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0px 1px 6px rgba(0, 0, 0, 0.08)", // Lighter shadow
        },
      }}
    >
      {/* Toggle Button */}
      <Toolbar
        sx={{
          justifyContent: isCollapsed ? "center" : "flex-end",
          minHeight: "36px !important", // Smaller toolbar
        }}
      >
        <Tooltip title={isCollapsed ? "Expand" : "Collapse"}>
          <IconButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            sx={{
              transition: "transform 0.3s",
              "&:hover": { transform: "scale(1.1)" },
              color: colors.sidebar.icon,
              padding: 0.6, // Reduced padding
              fontSize: "0.9rem", // Smaller icon
            }}
          >
            {isCollapsed ? (
              <MenuIcon fontSize="small" />
            ) : (
              <ChevronLeftIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      </Toolbar>

      <Divider sx={{ backgroundColor: colors.sidebar.divider }} />

      {/* Navigation Menu */}
      <List
        sx={{
          width: "100%",
          padding: 0.6, // Reduced padding
          flexGrow: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "2px", // Thinner scrollbar
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: colors.sidebar.divider,
            borderRadius: "2px",
          },
        }}
      >
        {navItems.map((item, index) =>
          item.subItems ? (
            <Box key={index}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => handleSubMenuToggle(item.label)}
                  sx={getItemStyle(item.path)}
                >
                  <ListItemIcon
                    sx={{
                      color: "inherit",
                      minWidth: isCollapsed ? "auto" : 32, // Reduced icon area
                      mr: isCollapsed ? 0 : 1.2,
                    }}
                  >
                    <FontAwesomeIcon icon={item.icon} size="xs" />{" "}
                    {/* Smaller icon */}
                  </ListItemIcon>

                  {!isCollapsed && (
                    <>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{ fontSize: "0.85rem" }} // Smaller font size
                      />
                      {openSubMenu[item.label] ? (
                        <ExpandLess fontSize="small" />
                      ) : (
                        <ExpandMore fontSize="small" />
                      )}
                    </>
                  )}
                </ListItemButton>
              </ListItem>

              {!isCollapsed && (
                <Collapse
                  in={openSubMenu[item.label]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem, subIndex) => (
                      <ListItem key={subIndex} disablePadding>
                        <ListItemButton
                          component={Link}
                          to={subItem.path}
                          sx={{
                            ...getItemStyle(subItem.path),
                            pl: 3, // Reduced padding
                          }}
                        >
                          <ListItemIcon sx={{ color: "inherit", minWidth: 32 }}>
                            <FontAwesomeIcon icon={subItem.icon} size="xs" />{" "}
                            {/* Smaller icon */}
                          </ListItemIcon>
                          <ListItemText
                            primary={subItem.label}
                            primaryTypographyProps={{ fontSize: "0.8rem" }} // Smaller font size
                          />

                          {subItem.badge && (
                            <Badge
                              badgeContent={subItem.badge}
                              color="error"
                              sx={{
                                ml: 0.5,
                                "& .MuiBadge-badge": {
                                  fontSize: "0.65rem", // Smaller badge text
                                  height: 14,
                                  minWidth: 14,
                                },
                              }}
                            />
                          )}
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ) : (
            <ListItem key={index} disablePadding>
              <Tooltip
                title={isCollapsed ? item.label : ""}
                placement="right"
                arrow
                disableHoverListener={!isCollapsed}
              >
                <ListItemButton
                  component={Link}
                  to={item.path}
                  sx={getItemStyle(item.path)}
                >
                  <ListItemIcon
                    sx={{
                      color: "inherit",
                      minWidth: isCollapsed ? "auto" : 32, // Reduced icon area
                      mr: isCollapsed ? 0 : 1.2,
                    }}
                  >
                    <FontAwesomeIcon icon={item.icon} size="xs" />{" "}
                    {/* Smaller icon */}
                  </ListItemIcon>

                  {!isCollapsed && (
                    <>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{ fontSize: "0.85rem" }} // Smaller font size
                      />

                      {item.badge && (
                        <Badge
                          badgeContent={item.badge}
                          color="error"
                          sx={{
                            "& .MuiBadge-badge": {
                              backgroundColor: colors.sidebar.badge,
                              fontSize: "0.65rem", // Smaller badge text
                              height: 14,
                              minWidth: 14,
                              animation: "pulse 2s infinite",
                              "@keyframes pulse": {
                                "0%": { transform: "scale(1)" },
                                "50%": { transform: "scale(1.1)" },
                                "100%": { transform: "scale(1)" },
                              },
                            },
                          }}
                        />
                      )}
                    </>
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          )
        )}
      </List>
    </Drawer>
  );
};

// Function to return navItems based on user role with enhanced menu structure
const getNavItems = (role) => {
  switch (role) {
    case "Student":
      return [
        { icon: faHome, label: "Dashboard", path: "/student" },
        {
          icon: faBookOpen,
          label: "Learning Program",
          path: "/student/program",
          subItems: [
            {
              icon: faBookOpen,
              label: "My Courses",
              path: "/student/program/my-courses",
            },
            {
              icon: faBookOpen,
              label: "Explore",
              path: "/student/program/explore",
            },
          ],
        },
        {
          icon: faCalendarAlt,
          label: "Schedule",
          path: "/student/schedule",
          badge: 2,
        },
        {
          icon: faCalendarCheck,
          label: "Book Session",
          path: "/student/booking",
        },
        {
          icon: faClipboardList,
          label: "Assignments",
          path: "/student/assignments",
          badge: 5,
        },
        {
          icon: faChartBar,
          label: "Progress",
          path: "/student/progress",
        },
        {
          icon: faEnvelope,
          label: "Messages",
          path: "/student/messages",
          badge: 3,
        },
        { icon: faUserCircle, label: "Account", path: "/student/account" },
      ];
    case "Teacher":
      return [
        { icon: faHome, label: "Home", path: "/teacher" },
        {
          icon: faChartBar,
          label: "Student Management",
          path: "/teacher/students",
          subItems: [
            {
              icon: faUsers,
              label: "Student List",
              path: "/teacher/students/list",
            },
            {
              icon: faChartBar,
              label: "Student Progress",
              path: "/teacher/students/progress",
            },
            {
              icon: faClipboardList,
              label: "Assignments",
              path: "/teacher/students/assignments",
            },
          ],
        },
        {
          icon: faCalendarPlus,
          label: "Available Slots",
          path: "/teacher/slot",
          badge: 1,
        },
        {
          icon: faCalendarAlt,
          label: "Teaching Schedule",
          path: "/teacher/schedule",
        },
        {
          icon: faBell,
          label: "Notifications",
          path: "/teacher/notifications",
          badge: 3,
        },
        {
          icon: faEnvelope,
          label: "Messages",
          path: "/teacher/messages",
          badge: 2,
        },
        { icon: faUser, label: "Account", path: "/teacher/account" },
      ];
    case "Psychologist":
      return [
        { icon: faHome, label: "Home", path: "/psychologist" },
        {
          icon: faCalendarAlt,
          label: "Appointments",
          path: "/psychologist/schedule",
          badge: 2,
        },
        {
          icon: faCalendarPlus,
          label: "Available Slots",
          path: "/psychologist/slot",
        },
        {
          icon: faUsers,
          label: "Students",
          path: "/psychologist/students",
          subItems: [
            {
              icon: faUsers,
              label: "Student List",
              path: "/psychologist/students/list",
            },
            {
              icon: faFileAlt,
              label: "Psychology Profiles",
              path: "/psychologist/students/profiles",
            },
          ],
        },
        {
          icon: faEnvelope,
          label: "Messages",
          path: "/psychologist/messages",
          badge: 1,
        },
        { icon: faUser, label: "Account", path: "/psychologist/account" },
      ];
    case "Parent":
      return [
        { icon: faHome, label: "Home", path: "/parent" },
        {
          icon: faUsers,
          label: "My Children",
          path: "/parent/children",
          subItems: [
            { icon: faUsers, label: "List", path: "/parent/children/list" },
            {
              icon: faChartBar,
              label: "Learning Progress",
              path: "/parent/children/progress",
            },
            {
              icon: faClipboardList,
              label: "Assignments",
              path: "/parent/children/assignments",
            },
          ],
        },
        {
          icon: faCalendarAlt,
          label: "Class Schedule",
          path: "/parent/schedule",
        },
        {
          icon: faCalendarPlus,
          label: "Book Appointment",
          path: "/parent/booking",
        },
        {
          icon: faBell,
          label: "Notifications",
          path: "/parent/notifications",
          badge: 4,
        },
        {
          icon: faEnvelope,
          label: "Messages",
          path: "/parent/messages",
          badge: 2,
        },
        { icon: faUser, label: "Account", path: "/parent/account" },
      ];
    case "Admin":
      return [
        { icon: faTachometerAlt, label: "Dashboard", path: "/admin" },
        {
          icon: faBookOpen,
          label: "Program Management",
          path: "/admin/programs",
          subItems: [
            {
              icon: faBookOpen,
              label: "Program List",
              path: "/admin/programs/list",
            },
            {
              icon: faBookOpen,
              label: "Add Program",
              path: "/admin/programs/create",
            },
          ],
        },
        {
          icon: faUsers,
          label: "User Management",
          path: "/admin/users",
          subItems: [
            { icon: faUsers, label: "User List", path: "/admin/users/list" },
            {
              icon: faUserPlus,
              label: "Add Parent",
              path: "/admin/users/create-parent",
            },
            {
              icon: faUserPlus,
              label: "Add Teacher",
              path: "/admin/users/create-teacher",
            },
            {
              icon: faUserPlus,
              label: "Add Student",
              path: "/admin/users/create-student",
            },
          ],
        },
        {
          icon: faCalendarCheck,
          label: "Appointment Management",
          path: "/admin/appointments",
          badge: 3,
        },
        {
          icon: faPoll,
          label: "Surveys",
          path: "/admin/survey",
          subItems: [
            { icon: faPoll, label: "Survey List", path: "/admin/survey/list" },
            {
              icon: faPoll,
              label: "Create Survey",
              path: "/admin/survey/create",
            },
            {
              icon: faChartBar,
              label: "Survey Reports",
              path: "/admin/survey/reports",
            },
          ],
        },
        { icon: faChartBar, label: "Reports", path: "/admin/reports" },
        {
          icon: faQuestionCircle,
          label: "Support",
          path: "/admin/support",
        },
      ];
    default:
      return [];
  }
};

export default SideBar;

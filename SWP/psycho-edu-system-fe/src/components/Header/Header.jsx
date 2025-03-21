import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Fade,
  ListItemIcon,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import MailIcon from "@mui/icons-material/Mail";
import PersonIcon from "@mui/icons-material/Person";
import Swal from "sweetalert2";
import AuthContext from "../../context/auth/AuthContext";
import LogoHeader from "../../assets/logo-header.png";
import DecodeJWT from "../../utils/decodeJwt";

const Header = () => {
  const { logout } = useContext(AuthContext) || {};
  const [anchorEl, setAnchorEl] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
      confirmButtonColor: "#FF6F61", // Coral
      cancelButtonColor: "#26A69A", // Teal
      reverseButtons: false,
      focusCancel: true,
    }).then((result) => {
      if (result.isConfirmed) {
        logout();
        Swal.fire({
          title: "Logged Out",
          text: "You have successfully logged out.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
          willClose: () => navigate("/"),
        });
      }
    });
    handleMenuClose();
  };

  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      try {
        const formattedToken = JSON.parse(token);
        const accessToken = formattedToken?.accessToken;
        if (accessToken && typeof accessToken === "string") {
          const userData = DecodeJWT(accessToken);
          if (userData) {
            setProfile(userData);
          }
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const avatarMap = {
    Admin: "https://cdn-icons-png.flaticon.com/512/2202/2202112.png",
    Student: "https://cdn-icons-png.flaticon.com/512/3048/3048122.png",
    Teacher: "https://cdn-icons-png.flaticon.com/512/3048/3048127.png",
    Psychologist: "https://cdn-icons-png.flaticon.com/512/2921/2921838.png",
    Parent: "https://cdn-icons-png.flaticon.com/512/1460/1460669.png",
  };

  const getAvatar = (role) =>
    avatarMap[role] || "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  if (!profile) {
    return <div className="text-center text-gray-500 py-4">Loading...</div>;
  }

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#26A69A", // Teal
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        px: 2,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          py: 1,
        }}
      >
        <Box display="flex" alignItems="center">
          <img
            src={LogoHeader}
            alt="Logo"
            style={{ width: 130, height: "auto" }}
          />
        </Box>
        <Box display="flex" alignItems="center">
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              display: "flex",
              alignItems: "center",
              color: "#F7FAFC",
              "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
            }}
          >
            <Avatar
              src={getAvatar(profile.role)}
              alt="Profile"
              sx={{
                width: 44,
                height: 44,
                border: "2px solid #F9E79F", // Soft Yellow
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.15)",
                },
              }}
            />
            <Typography
              sx={{
                ml: 1,
                fontWeight: 500,
                fontSize: "1rem",
                color: "#F7FAFC",
              }}
            >
              {profile && profile.fullName
                ? profile.fullName
                : profile?.Username || "User"}
            </Typography>
            <ArrowDropDownIcon sx={{ color: "#FBBF24" }} />
          </IconButton>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          TransitionComponent={Fade}
          sx={{ mt: 1 }}
          PaperProps={{
            elevation: 0,
            sx: {
              borderRadius: 2,
              minWidth: 250,
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#FFFFFF", // White
              p: 1,
              border: "1px solid #E5E7EB",
            },
          }}
        >
          <Box display="flex" alignItems="center" px={2} py={1}>
            <Avatar
              src={getAvatar(profile.role)}
              sx={{
                width: 50,
                height: 50,
                border: "2px solid #F9E79F", // Soft Yellow
                mr: 1,
              }}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight={600} color="#26A69A">
                {profile.fullName || profile.Username || "User"}
              </Typography>
              <Typography
                variant="body2"
                color="#666"
                display="flex"
                alignItems="center"
              >
                <MailIcon fontSize="small" sx={{ mr: 0.5, color: "#FBBF24" }} />
                {profile.Email}
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ my: 1, borderColor: "#E5E7EB" }} />
          <MenuItem
            component={Link}
            to="/profile"
            onClick={handleMenuClose}
            sx={{
              fontSize: "0.95rem",
              py: 1,
              color: "#26A69A",
              "&:hover": { backgroundColor: "#F9E79F", color: "#26A69A" }, // Soft Yellow
            }}
          >
            <ListItemIcon>
              <PersonIcon fontSize="small" sx={{ color: "#FBBF24" }} />
            </ListItemIcon>
            Profile
          </MenuItem>
          <MenuItem
            component={Link}
            to="/"
            onClick={handleMenuClose}
            sx={{
              fontSize: "0.95rem",
              py: 1,
              color: "#26A69A",
              "&:hover": { backgroundColor: "#F9E79F", color: "#26A69A" }, // Soft Yellow
            }}
          >
            <ListItemIcon>
              <HomeIcon fontSize="small" sx={{ color: "#FBBF24" }} />
            </ListItemIcon>
            Home
          </MenuItem>
          <Divider sx={{ my: 1, borderColor: "#E5E7EB" }} />
          <MenuItem
            onClick={handleLogout}
            sx={{
              fontSize: "0.95rem",
              py: 1,
              color: "#FF6F61", // Coral
              "&:hover": { backgroundColor: "#F9E79F", color: "#FF8A80" }, // Soft Yellow + Coral nhạt
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: "#FF6F61" }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

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
import SettingsIcon from "@mui/icons-material/Settings";
import Swal from "sweetalert2";
import AuthContext from "../../context/auth/AuthContext";
import LogoHeader from "../../assets/logo-header.png";
import AvatarImg from "../../assets/avatar.png";
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
      confirmButtonColor: "#D32F2F",
      cancelButtonColor: "#1976D2",
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
        const accessToken = formattedToken.accessToken;

        if (accessToken) {
          const userData = DecodeJWT(accessToken);
          setProfile(userData);
          console.log(userData);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);
  return (
    <AppBar
      position="sticky"
      sx={{ backgroundColor: "white", boxShadow: 3, px: 2 }}
    >
      <Toolbar
        sx={{ display: "flex", justifyContent: "space-between", py: 0.2 }}
      >
        {/* Logo */}
        <Box display="flex" alignItems="center">
          <img
            src={LogoHeader}
            alt="Logo"
            style={{ width: 130, height: "auto" }}
          />
        </Box>

        {/* Profile Avatar */}
        <Box display="flex" alignItems="center">
          <IconButton
            onClick={handleMenuOpen}
            sx={{ display: "flex", alignItems: "center", color: "#333" }}
          >
            <Avatar
              src={AvatarImg}
              alt="Profile"
              sx={{
                width: 44,
                height: 44,
                boxShadow: 3,
                transition: "0.3s",
                "&:hover": { transform: "scale(1.1)", boxShadow: 6 },
              }}
            />
            <Typography
              sx={{ ml: 1, fontWeight: 500, fontSize: "1rem", color: "#333" }}
            >
              {profile.fullName === "" ? profile.Username : profile.fullName}
            </Typography>
            <ArrowDropDownIcon sx={{ color: "#555" }} />
          </IconButton>
        </Box>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          TransitionComponent={Fade}
          sx={{ mt: 1 }}
          PaperProps={{
            elevation: 4,
            sx: {
              borderRadius: 3,
              minWidth: 250,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              p: 1,
              backgroundColor: "#fff",
            },
          }}
        >
          {/* User Info */}
          <Box display="flex" alignItems="center" px={2} py={1}>
            <Avatar
              src={AvatarImg}
              sx={{ width: 50, height: 50, boxShadow: 2, mr: 1 }}
            />
            <Box>
              <Typography variant="subtitle1" fontWeight={600}></Typography>
              <Typography variant="body2" color="text.secondary">
                <MailIcon fontSize="small" sx={{ mr: 0.5, color: "#1976D2" }} />
                {profile.Email}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ my: 1 }} />

          <MenuItem
            component={Link}
            to="/profile"
            onClick={handleMenuClose}
            sx={{
              fontSize: "0.95rem",
              py: 1,
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            <ListItemIcon>
              <PersonIcon fontSize="small" sx={{ color: "#1976D2" }} />
            </ListItemIcon>
            Profile
          </MenuItem>

          <MenuItem
            component={Link}
            to="/settings"
            onClick={handleMenuClose}
            sx={{
              fontSize: "0.95rem",
              py: 1,
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            <ListItemIcon>
              <SettingsIcon fontSize="small" sx={{ color: "#1976D2" }} />
            </ListItemIcon>
            Settings
          </MenuItem>

          <MenuItem
            component={Link}
            to="/"
            onClick={handleMenuClose}
            sx={{
              fontSize: "0.95rem",
              py: 1,
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            <ListItemIcon>
              <HomeIcon fontSize="small" sx={{ color: "#1976D2" }} />
            </ListItemIcon>
            Home
          </MenuItem>

          <Divider sx={{ my: 1 }} />

          <MenuItem
            onClick={handleLogout}
            sx={{
              fontSize: "0.95rem",
              py: 1,
              color: "#D32F2F",
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            <ListItemIcon>
              <LogoutIcon fontSize="small" sx={{ color: "#D32F2F" }} />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

import { motion } from "framer-motion"; // Importing Framer Motion for animations
import Banner from "../../components/Banners/Banner"; // Your Banner Component
import BlogSection from "../../components/Blog/BlogSection"; // Import BlogSection
import { Box, Typography, Container, Button } from "@mui/material"; // Import MUI components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faHeart,
  faUsers,
  faRunning,
} from "@fortawesome/free-solid-svg-icons";

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      style={{ backgroundColor: "#F7FAFC" }} // Xám nhạt làm nền chính
    >
      {/* The Banner component will be placed here */}
      <Banner />

      {/* Additional Content Section */}
      <Box
        sx={{
          paddingY: "50px", // Tăng padding để tạo không gian thoáng
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h4"
              align="center"
              sx={{
                marginBottom: "20px",
                fontWeight: 700,
                color: "#1E3A8A", // Navy blue cho tiêu đề
                fontSize: { xs: "2rem", md: "2.5rem" }, // Responsive font size
              }}
            >
              Start Your Learning Journey with FPTU
            </Typography>
            <Typography
              variant="body1"
              align="center"
              sx={{
                marginBottom: "40px",
                color: "#666",
                fontSize: "1.1rem",
                lineHeight: "1.8",
                maxWidth: "800px",
                mx: "auto", // Căn giữa
              }}
            >
              At FPT University, we equip students with the skills, knowledge,
              and global mindset to succeed in an ever-changing world. Take the
              next step towards your future and unlock opportunities to thrive
              in the modern world.
            </Typography>
            <Box sx={{ textAlign: "center" }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#1E3A8A", // Navy blue cho button
                    color: "#FFFFFF",
                    padding: "12px 40px",
                    fontSize: "1rem",
                    fontWeight: 600,
                    borderRadius: "25px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                    "&:hover": {
                      backgroundColor: "#2B4A9B", // Navy blue đậm hơn khi hover
                      boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
                    },
                    textTransform: "none", // Không viết hoa chữ
                  }}
                >
                  Explore Programs
                </Button>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Features Section */}
      <Box
        sx={{
          paddingY: "50px",
          backgroundColor: "#1E3A8A", // Navy blue làm nền cho section này
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h4"
              align="center"
              sx={{
                marginBottom: "60px",
                fontWeight: 700,
                color: "#FFFFFF", // Trắng cho tiêu đề trên nền navy blue
                fontSize: { xs: "2rem", md: "2.5rem" },
              }}
            >
              Why Choose FPTU?
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  lg: "1fr 1fr 1fr 1fr",
                }, // Responsive grid
                gap: "30px",
              }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)", // Nền trong suốt với kính mờ
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  padding: "30px",
                  textAlign: "center",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <FontAwesomeIcon
                  icon={faBrain}
                  style={{
                    fontSize: "48px",
                    color: "#FBBF24",
                    marginBottom: "20px",
                  }} // Vàng nhạt cho icon
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 600,
                    marginBottom: "10px",
                  }}
                >
                  Cognitive Growth
                </Typography>
                <Typography variant="body2" sx={{ color: "#D1D5DB" }}>
                  Develop critical thinking and problem-solving skills for a
                  successful career.
                </Typography>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  padding: "30px",
                  textAlign: "center",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <FontAwesomeIcon
                  icon={faHeart}
                  style={{
                    fontSize: "48px",
                    color: "#FBBF24",
                    marginBottom: "20px",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 600,
                    marginBottom: "10px",
                  }}
                >
                  Emotional Support
                </Typography>
                <Typography variant="body2" sx={{ color: "#D1D5DB" }}>
                  Access resources to manage stress and build emotional
                  resilience.
                </Typography>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  padding: "30px",
                  textAlign: "center",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <FontAwesomeIcon
                  icon={faUsers}
                  style={{
                    fontSize: "48px",
                    color: "#FBBF24",
                    marginBottom: "20px",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 600,
                    marginBottom: "10px",
                  }}
                >
                  Community Engagement
                </Typography>
                <Typography variant="body2" sx={{ color: "#D1D5DB" }}>
                  Join a vibrant community to connect, collaborate, and grow
                  together.
                </Typography>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "16px",
                  padding: "30px",
                  textAlign: "center",
                  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <FontAwesomeIcon
                  icon={faRunning}
                  style={{
                    fontSize: "48px",
                    color: "#FBBF24",
                    marginBottom: "20px",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 600,
                    marginBottom: "10px",
                  }}
                >
                  Holistic Development
                </Typography>
                <Typography variant="body2" sx={{ color: "#D1D5DB" }}>
                  Balance academics with extracurriculars for all-around growth.
                </Typography>
              </motion.div>
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Blog Section */}
      <Box
        sx={{
          paddingY: "0px",
          backgroundColor: "#F7FAFC", // Nền xám nhạt đồng bộ với trang
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Box id="blog-section">
              <BlogSection />
            </Box>
          </motion.div>
        </Container>
      </Box>

      {/* Footer Section */}
      <Box
        sx={{
          backgroundColor: "#1E3A8A", // Navy blue cho footer
          color: "#FFFFFF",
          paddingY: "20px",
          marginTop: "20px",
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: { xs: "column", md: "row" }, // Stack in small screens
              alignItems: "center",
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <Typography
              variant="body1"
              sx={{ marginBottom: { xs: "20px", md: 0 }, fontSize: "0.9rem" }}
            >
              © 2025 FPTU Education System. All rights reserved.
            </Typography>
            <Box sx={{ display: "flex", gap: "20px" }}>
              <Typography
                variant="body2"
                sx={{
                  color: "#FBBF24", // Vàng nhạt cho link
                  cursor: "pointer",
                  "&:hover": { color: "#FFFFFF", transition: "color 0.3s" },
                }}
              >
                Privacy Policy
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#FBBF24",
                  cursor: "pointer",
                  "&:hover": { color: "#FFFFFF", transition: "color 0.3s" },
                }}
              >
                Terms of Service
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#FBBF24",
                  cursor: "pointer",
                  "&:hover": { color: "#FFFFFF", transition: "color 0.3s" },
                }}
              >
                Contact Us
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </motion.div>
  );
};

export default HomePage;

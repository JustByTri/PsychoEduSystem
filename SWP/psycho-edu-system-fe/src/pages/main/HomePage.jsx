import { motion } from "framer-motion"; // Importing Framer Motion for animations
import Banner from "../../components/Banners/Banner"; // Your Banner Component
import { Box, Typography, Container, Button } from "@mui/material"; // Import MUI components

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* The Banner component will be placed here */}
      <Banner />

      {/* Additional Content Section */}
      <Box
        sx={{
          paddingY: "60px", // Add vertical padding for spacing
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            sx={{
              marginBottom: "20px",
              fontWeight: 600,
              color: "#333",
            }}
          >
            Start Your Learning Journey with FPTU
          </Typography>
          <Typography
            variant="body1"
            align="center"
            sx={{
              marginBottom: "30px",
              color: "#666",
              fontSize: "1.1rem",
              lineHeight: "1.8",
            }}
          >
            At FPT University, we equip students with the skills, knowledge, and
            global mindset to succeed in an ever-changing world. Take the next
            step towards your future and unlock opportunities to thrive in the
            modern world.
          </Typography>
          <Box sx={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              sx={{
                padding: "12px 30px",
                fontSize: "1rem",
                borderRadius: "25px",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                "&:hover": {
                  backgroundColor: "#1976d2", // Darker shade for hover effect
                },
              }}
            >
              Explore Programs
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer Section */}
      <Box
        sx={{
          backgroundColor: "#1f1f1f",
          color: "#fff",
          paddingY: "20px",
          marginTop: "40px",
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
              sx={{ marginBottom: { xs: "10px", md: 0 } }}
            >
              © 2025 FPTU Education System. All rights reserved.
            </Typography>
            <Box sx={{ display: "flex", gap: "20px" }}>
              <Typography variant="body2">Privacy Policy</Typography>
              <Typography variant="body2">Terms of Service</Typography>
              <Typography variant="body2">Contact Us</Typography>
            </Box>
          </Box>
        </Container>
      </Box>
    </motion.div>
  );
};

export default HomePage;

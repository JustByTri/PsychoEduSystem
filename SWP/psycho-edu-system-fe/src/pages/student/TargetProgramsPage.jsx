import React, { useState, useEffect } from "react";
import { TargetProgramService } from "../../api/services/targetProgram";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import Slider from "react-slick";
import { motion } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TargetProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch programs
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const data = await TargetProgramService.getTargetPrograms();
        setPrograms(data);
      } catch (err) {
        setError("Failed to load programs.");
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const handleEnroll = async (programId) => {
    try {
      const result = await TargetProgramService.registerTargetProgram(
        programId
      );
      alert(result.message || "Successfully enrolled!");
    } catch (error) {
      alert("Failed to enroll. Please try again.");
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Display 3 items at once
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false, // Hides navigation arrows for a cleaner look
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2, // For medium screens, show 2 items at once
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1, // For small screens, show 1 item
        },
      },
    ],
  };

  return (
    <div
      className="target-programs-container"
      style={{ padding: "40px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#333" }}
      >
        Target Programs
      </Typography>

      {loading ? (
        <Typography variant="h6" align="center">
          Loading programs...
        </Typography>
      ) : error ? (
        <Typography variant="h6" align="center" color="error">
          {error}
        </Typography>
      ) : (
        <Slider {...sliderSettings}>
          {programs.length ? (
            programs.map((program) => (
              <motion.div
                key={program.programId}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    overflow: "hidden",
                    position: "relative",
                    width: "100%",
                    height: 250, // Increase card height
                    "&:hover .details": {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
                      backdropFilter: "blur(20px)", // Add blur effect on hover
                    },
                    transition:
                      "transform 0.3s, box-shadow 0.3s, backdrop-filter 0.3s",
                  }}
                >
                  <Card sx={{ height: "100%" }}>
                    <CardContent>
                      <Typography
                        variant="h6"
                        component="h3"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: "bold", color: "#1976d2" }}
                      >
                        {program.name}
                      </Typography>

                      {/* Program Summary */}
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Date:</strong> {program.startDate}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="body2" color="textSecondary">
                            <strong>Capacity:</strong> {program.capacity}
                          </Typography>
                        </Grid>
                      </Grid>

                      {/* Hoverable Details */}
                      <Box
                        className="details"
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: "rgba(0, 0, 0, 0.5)",
                          color: "#fff",
                          padding: "20px",
                          opacity: 0,
                          transform: "translateY(100%)",
                          transition: "opacity 0.3s ease, transform 0.3s ease",
                          borderRadius: "inherit",
                        }}
                      >
                        <Typography variant="body2" paragraph>
                          <strong>Description:</strong> {program.description}
                        </Typography>
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Date:</strong> {program.startDate}
                            </Typography>
                          </Grid>
                          <Grid item xs={6}>
                            <Typography variant="body2">
                              <strong>Capacity:</strong> {program.capacity}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Typography variant="body2" mt={1}>
                          <strong>Dimension:</strong> {program.dimensionName}
                        </Typography>
                        <Typography variant="body2" mt={1}>
                          <strong>Counselor:</strong>{" "}
                          {program.counselor.fullName}
                        </Typography>

                        {/* Enroll Button Inside Hoverable Details */}
                        <Box mt={2}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleEnroll(program.programId)}
                            disabled={program.capacity === 0}
                            sx={{
                              backgroundColor:
                                program.capacity === 0 ? "#e0e0e0" : "#1976d2",
                              "&:hover": {
                                backgroundColor:
                                  program.capacity === 0
                                    ? "#c7c7c7"
                                    : "#1565c0",
                              },
                              padding: "10px 20px",
                              fontSize: "16px",
                              borderRadius: "50px",
                              boxShadow: "none",
                            }}
                          >
                            {program.capacity === 0 ? "Full" : "Enroll"}
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Paper>
              </motion.div>
            ))
          ) : (
            <Typography variant="h6" align="center">
              No programs available
            </Typography>
          )}
        </Slider>
      )}
    </div>
  );
};

export default TargetProgramsPage;

/* eslint-disable react/prop-types */
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  List,
  ListItem,
  Box,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "react-router-dom";

const ProgramDialog = ({ selectedProgram, onClose }) => {
  if (!selectedProgram) return null;

  return (
    <Dialog
      open={Boolean(selectedProgram)}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      sx={{ "& .MuiPaper-root": { borderRadius: "12px", overflow: "hidden" } }}
    >
      <DialogTitle
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          bgcolor: "#005EA6",
          color: "white",
          py: 2,
        }}
      >
        {selectedProgram.name}
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: "white", px: 4, py: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={6}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#005EA6", mb: 2 }}
            >
              📝 Program Details
            </Typography>
            <List dense sx={{ color: "#333" }}>
              <ListItem>
                <strong>Description:</strong> {selectedProgram.description}
              </ListItem>
              <ListItem>
                <strong>Date:</strong> {selectedProgram.day}
              </ListItem>
              <ListItem>
                <strong>Time:</strong> {selectedProgram.time}
              </ListItem>
              <ListItem>
                <strong>Minimum Score:</strong> {selectedProgram.minPoint}
              </ListItem>
              <ListItem>
                <strong>Capacity:</strong> {selectedProgram.capacity}
              </ListItem>
              <ListItem>
                <strong>Dimension:</strong> {selectedProgram.dimensionName}
              </ListItem>
            </List>
          </Grid>

          <Grid item xs={6}>
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", color: "#005EA6", mb: 2 }}
            >
              👨‍⚕️ Counselor Information
            </Typography>
            <Box
              sx={{
                p: 2,
                bgcolor: "#F0F8FF",
                borderRadius: "8px",
                boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
              }}
            >
              <Typography>
                <strong>Name:</strong> {selectedProgram.counselor.fullName}
              </Typography>
              <Typography>
                <strong>Email:</strong> {selectedProgram.counselor.email}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {selectedProgram.counselor.phone}
              </Typography>
              <Typography>
                <strong>Address:</strong> {selectedProgram.counselor.address}
              </Typography>
              <Typography>
                <strong>Link:</strong>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#FF7F00",
                    color: "white",
                    textTransform: "none",
                    fontWeight: "bold",
                    "&:hover": { bgcolor: "#E66A00" },
                  }}
                  startIcon={<OpenInNewIcon />}
                  component={Link}
                  to={selectedProgram.counselor.googleMeetURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Google Meet
                </Button>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{ bgcolor: "#F0F8FF", py: 2, justifyContent: "center" }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: "#005EA6",
            color: "white",
            "&:hover": { bgcolor: "#003D73" },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProgramDialog;

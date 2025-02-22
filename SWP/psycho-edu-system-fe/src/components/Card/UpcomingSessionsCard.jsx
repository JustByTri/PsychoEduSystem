import React from "react";
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Button } from "@mui/material";
import { Calendar, Clock } from 'lucide-react';

const UpcomingSessionsCard = () => {
  const sessions = [
    {
      title: "Stress Management",
      date: "Mar 15, 2024",
      time: "10:00 AM",
      counselor: "Dr. Sarah Johnson"
    },
    {
      title: "Anxiety Support Group",
      date: "Mar 17, 2024",
      time: "2:00 PM",
      counselor: "Dr. Michael Chen"
    }
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Upcoming Sessions</Typography>
      <List>
        {sessions.map((session, index) => (
          <ListItem 
            key={index}
            sx={{ 
              mb: 2, 
              bgcolor: '#f8f8f8', 
              borderRadius: 2,
              flexDirection: 'column',
              alignItems: 'flex-start'
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              {session.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calendar size={16} />
                <Typography variant="body2">{session.date}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Clock size={16} />
                <Typography variant="body2">{session.time}</Typography>
              </Box>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {session.counselor}
            </Typography>
          </ListItem>
        ))}
      </List>
      <Button 
        fullWidth 
        variant="contained" 
        sx={{ 
          bgcolor: '#82DBC5',
          '&:hover': { bgcolor: '#65CCB8' }
        }}
      >
        Schedule New Session
      </Button>
    </Box>
  );
};

export default UpcomingSessionsCard;
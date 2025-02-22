import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MoodTrackerCard = () => {
  const moodData = [
    { day: 'Mon', mood: 3 },
    { day: 'Tue', mood: 4 },
    { day: 'Wed', mood: 2 },
    { day: 'Thu', mood: 5 },
    { day: 'Fri', mood: 4 },
    { day: 'Sat', mood: 3 },
    { day: 'Sun', mood: 4 },
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Your Mood History</Typography>
      <Box sx={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={moodData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="mood" stroke="#82DBC5" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default MoodTrackerCard; 
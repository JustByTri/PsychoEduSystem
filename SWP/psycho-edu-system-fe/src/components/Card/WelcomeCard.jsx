import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Sun } from 'lucide-react';

const WelcomeCard = ({ studentName }) => {
  return (
    <Box 
      sx={{ 
        background: 'linear-gradient(135deg, #82DBC5 0%, #65CCB8 100%)',
        borderRadius: 4,
        p: 4,
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Box>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          Welcome back, {studentName}!
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
          How are you feeling today? Remember, it's okay to not be okay.
        </Typography>
        <Button 
          variant="contained" 
          sx={{ 
            bgcolor: 'white', 
            color: '#82DBC5',
            '&:hover': { bgcolor: '#f5f5f5' }
          }}
        >
          Take Daily Check-in
        </Button>
      </Box>
      <Sun size={64} />
    </Box>
  );
};

export default WelcomeCard; 
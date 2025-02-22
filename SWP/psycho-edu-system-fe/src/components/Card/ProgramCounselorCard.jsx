import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const CounselorCard = () => {
  const counselorData = {
    name: "Dr. Jenny",
    image: "/counselor.jpg",
    experience: "4 Years",
    major: "Psychology"
  };

  return (
    <Paper 
      elevation={3}
      sx={{ 
        bgcolor: '#C9EDE4',
        borderRadius: 2,
        width: '300px',
        height: '543px',
        p: 3,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <Box sx={{ mb: 2 }}>
        <img 
          src={counselorData.image}
          alt={counselorData.name}
          style={{
            width: '200px',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '8px',
            border: '2px solid #82DBC5'
          }}
        />
      </Box>

      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 'bold',
          mb: 3
        }}
      >
        {counselorData.name}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Typography 
          sx={{ 
            fontWeight: 'bold',
            mb: 0.5
          }}
        >
          Year of Experience
        </Typography>
        <Typography>
          {counselorData.experience}
        </Typography>
      </Box>

      {/* Major */}
      <Box>
        <Typography 
          sx={{ 
            fontWeight: 'bold',
            mb: 0.5
          }}
        >
          Major
        </Typography>
        <Typography>
          {counselorData.major}
        </Typography>
      </Box>
    </Paper>
  );
};

export default CounselorCard;

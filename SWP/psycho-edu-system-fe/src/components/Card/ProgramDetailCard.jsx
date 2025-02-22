import React from 'react';
import { Box, Typography, Paper, Button } from '@mui/material';

const ProgramDetailCard = () => {
  const programData = {
    title: "Supports stress reduction",
    image: "/stress-cat.jpg",
    status: "Stress",
    date: "22/01/2025",
    time: "9:00 - 10:00",
    room: "NET1805",
    meetingUrl: "https://meet.google.com/oac-dqke-dmj",
    ratings: {
      emotional: 1,
      cognitive: 1,
      social: 1,
      physical: 1
    },
    counselor: {
      name: "Dr. Jenny",
      image: "/counselor.jpg",
      experience: "4 Years",
      major: "Psychology"
    }
  };

  const handleJoinMeet = () => {
    window.open(programData.meetingUrl, '_blank', 'noopener,noreferrer');
  };

  const renderStars = (count) => {
    return [...Array(5)].map((_, index) => (
      <span key={index} style={{ color: index < count ? 'black' : 'gray', fontSize: '24px' }}>
        ★
      </span>
    ));
  };

  return (
    <Paper 
      elevation={3} 
      sx={{ 
        bgcolor: '#C9EDE4',
        borderRadius: 2,
        p: 4,
        width: '100%',
        maxWidth: '800px'
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 4, ml: 2 }}>
        {programData.title}
      </Typography>

      <Box sx={{ display: 'flex', mb: 4 }}>
        <Box sx={{ width: '300px', ml: 2 }}>
          <img 
            src={programData.image}
            alt="Program"
            style={{ 
              width: '100%',
              height: '250px',
              objectFit: 'cover',
              borderRadius: '8px',
              border: '2px solid #82DBC5'
            }}
          />
        </Box>

        <Box sx={{ flex: 1, ml: 8 }}>
          <Box sx={{ display: 'grid', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
              <Typography sx={{ width: '80px', fontWeight: 600, textAlign: 'left' }}>Status</Typography>
              <Typography sx={{ fontWeight: 500 }}>{programData.status}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
              <Typography sx={{ width: '80px', fontWeight: 600, textAlign: 'left' }}>Date</Typography>
              <Typography sx={{ fontWeight: 500 }}>{programData.date}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
              <Typography sx={{ width: '80px', fontWeight: 600, textAlign: 'left' }}>Time</Typography>
              <Typography sx={{ fontWeight: 500 }}>{programData.time}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
              <Typography sx={{ width: '80px', fontWeight: 600, textAlign: 'left' }}>Room</Typography>
              <Typography sx={{ fontWeight: 500 }}>{programData.room}</Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3 }}>
            <Button 
              variant="contained"
              onClick={handleJoinMeet}
              sx={{
                bgcolor: '#82DBC5',
                '&:hover': { bgcolor: '#65CCB8' },
                borderRadius: '20px',
                px: 4,
                py: 1.5,
                textTransform: 'none',
                fontSize: '16px',
                boxShadow: 'none'
              }}
            >
              Join With Meet
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ 
        height: '1px', 
        bgcolor: 'rgba(0,0,0,0.2)', 
        mx: 2,
        mb: 4 
      }} />

      {/* Ratings */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2, mb: 4 }}>
        <Box>
          <Typography sx={{ fontWeight: 500, mb: 1 }}>Emotional</Typography>
          {renderStars(programData.ratings.emotional)}
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 500, mb: 1 }}>Cognitive</Typography>
          {renderStars(programData.ratings.cognitive)}
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 500, mb: 1 }}>Social</Typography>
          {renderStars(programData.ratings.social)}
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 500, mb: 1 }}>Physical</Typography>
          {renderStars(programData.ratings.physical)}
        </Box>
      </Box>
    </Paper>
  );
};

export default ProgramDetailCard;

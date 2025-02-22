import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Phone, MessageCircle } from 'lucide-react';

const SupportCard = () => {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Need Support?</Typography>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" sx={{ mb: 2 }}>
          24/7 Crisis Helpline
        </Typography>
        <Button
          fullWidth
          startIcon={<Phone />}
          sx={{ 
            mb: 2,
            bgcolor: '#82DBC5',
            color: 'white',
            '&:hover': { bgcolor: '#65CCB8' }
          }}
        >
          Call Now
        </Button>
        <Button
          fullWidth
          startIcon={<MessageCircle />}
          sx={{ 
            bgcolor: '#f5f5f5',
            color: 'text.primary',
            '&:hover': { bgcolor: '#e0e0e0' }
          }}
        >
          Chat with Counselor
        </Button>
      </Box>
      <Typography variant="body2" color="text.secondary" align="center">
        Remember, you're not alone. We're here to help 24/7.
      </Typography>
    </Box>
  );
};

export default SupportCard; 
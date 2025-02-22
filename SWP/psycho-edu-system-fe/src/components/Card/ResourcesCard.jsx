import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import { Book, Video, Headphones, Users } from 'lucide-react';

const ResourcesCard = () => {
  const resources = [
    { icon: Book, title: 'Articles', count: 12 },
    { icon: Video, title: 'Videos', count: 8 },
    { icon: Headphones, title: 'Podcasts', count: 5 },
    { icon: Users, title: 'Group Sessions', count: 3 }
  ];

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3 }}>Mental Health Resources</Typography>
      <Grid container spacing={3}>
        {resources.map((resource, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Paper 
              sx={{ 
                p: 2, 
                textAlign: 'center',
                cursor: 'pointer',
                transition: '0.3s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
            >
              <resource.icon size={24} className="mx-auto mb-2" />
              <Typography variant="subtitle2">{resource.title}</Typography>
              <Typography variant="h6" color="primary">{resource.count}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ResourcesCard; 
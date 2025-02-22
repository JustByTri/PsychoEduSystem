import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from '@mui/material';
import { AlertTriangle } from 'lucide-react';

const StudentSkipSurvey = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          width: '100%',
          maxWidth: '400px',
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        pt: 3,
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
          <AlertTriangle size={32} color="#f59e0b" />
        </Box>
        Skip Survey
      </DialogTitle>

      <DialogContent sx={{ pb: 3 }}>
        <Typography align="center" sx={{ color: '#666' }}>
          Are you sure you want to skip this survey? You can always take it later.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          sx={{
            px: 3,
            py: 1,
            bgcolor: '#f5f5f5',
            color: 'text.primary',
            '&:hover': {
              bgcolor: '#e0e0e0'
            }
          }}
        >
          No, Continue Survey
        </Button>
        <Button
          onClick={onConfirm}
          sx={{
            px: 3,
            py: 1,
            bgcolor: '#82DBC5',
            color: 'white',
            '&:hover': {
              bgcolor: '#65CCB8'
            }
          }}
        >
          Yes, Skip
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StudentSkipSurvey;

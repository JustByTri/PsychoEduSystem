import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Chip, TablePagination, TableSortLabel } from '@mui/material';

const ProgramTable = () => {
  const navigate = useNavigate();
  const programs = [
    {
      id: 1,
      title: "Supports insomnia",
      date: "17/01/2025",
      startTime: "12:30",
      endTime: "14:45",
      location: "NET1445",
      meetingUrl: "https://meet.google.com/oac-dqke-dmj",
      status: "Closed"
    },
    {
      id: 2,
      title: "Supports stress reduction",
      date: "22/01/2025",
      startTime: "17:30",
      endTime: "19:30",
      location: "NET1912",
      meetingUrl: "https://meet.google.com/oac-dqke-dmj",
      status: "Available"
    }
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [orderBy, setOrderBy] = React.useState('');
  const [order, setOrder] = React.useState('asc');

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleTitleClick = (id) => {
    navigate(`/student/program/${id}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
      {/*
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          endIcon={<ArrowForward />}
          sx={{
            bgcolor: '#65CCB8',
            '&:hover': { bgcolor: '#82DBC5' },
            borderRadius: 2,
            textTransform: 'none'
          }}
        >
          My Program
        </Button>
      </Box>
      */}

      <Paper 
        elevation={0} 
        sx={{ 
          mt: 5, // Added margin top
          borderRadius: 2, 
          overflow: 'hidden',
          flex: 1,
          minHeight: 0
        }}
      >
        <TableContainer sx={{ maxHeight: '100%' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ bgcolor: '#e8e8e8' }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                    No
                  </Typography>
                </TableCell>
                <TableCell sx={{ bgcolor: '#e8e8e8' }}>
                  <TableSortLabel
                    active={orderBy === 'title'}
                    direction={orderBy === 'title' ? order : 'asc'}
                    onClick={() => handleSort('title')}
                  >
                    <Typography variant="subtitle2" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                      Title Name
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ bgcolor: '#e8e8e8' }}>
                  <TableSortLabel
                    active={orderBy === 'date'}
                    direction={orderBy === 'date' ? order : 'asc'}
                    onClick={() => handleSort('date')}
                  >
                    <Typography variant="subtitle2" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                      Date
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ bgcolor: '#e8e8e8' }}>
                  <TableSortLabel
                    active={orderBy === 'startTime'}
                    direction={orderBy === 'startTime' ? order : 'asc'}
                    onClick={() => handleSort('startTime')}
                  >
                    <Typography variant="subtitle2" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                      Start Time
                    </Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell sx={{ bgcolor: '#e8e8e8' }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                    End Time
                  </Typography>
                </TableCell>
                <TableCell sx={{ bgcolor: '#e8e8e8' }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                    Location
                  </Typography>
                </TableCell>
                <TableCell sx={{ bgcolor: '#e8e8e8' }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                    Meeting URL
                  </Typography>
                </TableCell>
                <TableCell sx={{ bgcolor: '#e8e8e8' }}>
                  <Typography variant="subtitle2" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                    Status
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {programs.length > 0 ? (
                programs.map((program) => (
                  <TableRow
                    key={program.id}
                    sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}
                  >
                    <TableCell>{program.id}</TableCell>
                    <TableCell 
                      sx={{ 
                        fontWeight: 600,
                        cursor: 'pointer',
                        '&:hover': { 
                          color: '#65CCB8',
                          textDecoration: 'underline'
                        }
                      }}
                      onClick={() => handleTitleClick(program.id)}
                    >
                      {program.title}
                    </TableCell>
                    <TableCell>{program.date}</TableCell>
                    <TableCell>{program.startTime}</TableCell>
                    <TableCell>{program.endTime}</TableCell>
                    <TableCell>{program.location}</TableCell>
                    <TableCell>
                      <a 
                        href={program.meetingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#2196f3', textDecoration: 'none' }}
                      >
                        {program.meetingUrl}
                      </a>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={program.status}
                        size="small"
                        sx={{
                          color: program.status === 'Available' ? '#4caf50' : '#f44336',
                          bgcolor: 'transparent',
                          border: 'none',
                          fontWeight: 600
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={8} 
                    align="center" 
                    sx={{ 
                      py: 8,
                      fontSize: '1rem',
                      color: 'text.secondary'
                    }}
                  >
                    There are currently no targeted support programs.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {programs.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <TablePagination
            component="div"
            count={programs.length}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
            sx={{
              '.MuiTablePagination-toolbar': {
                minHeight: 'auto',
              },
              '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                margin: 0,
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default ProgramTable;

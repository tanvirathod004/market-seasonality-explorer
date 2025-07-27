import React from 'react';
import { Box, Typography } from '@mui/material';

const CalendarLegend = () => {
  return (
    <>
      <Box sx={{ width: 20, height: 20, backgroundColor: '#0c5721ff', borderRadius: '3px', mr: 1 }} />
      <Typography>Low  </Typography> &nbsp; &nbsp; &nbsp;
      <Box sx={{ width: 20, height: 20, backgroundColor: '#bd951eff', borderRadius: '3px', mr: 1 }} />
      <Typography>Medium</Typography> &nbsp; &nbsp; &nbsp;
      <Box sx={{ width: 20, height: 20, backgroundColor: '#851c13ff', borderRadius: '3px', mr: 1 }} />
      <Typography>High</Typography> &nbsp; &nbsp; &nbsp;
      <Box
        sx={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          backgroundColor: 'rgba(13, 13, 11, 0.65)',
          mr: 1,
        }}
      />
      <Typography>Liquidity (Circle size indicates volume)</Typography>
      &nbsp; &nbsp;
      <Typography sx={{ color: 'green', fontWeight: 'bold', mr: 1 }}>▲</Typography>
      <Typography>Positive Performance</Typography>
      <Typography sx={{ color: 'red', fontWeight: 'bold', mr: 1 }}>▼</Typography>
      <Typography>Negative Performance</Typography>
      <Typography sx={{ color: 'gray', fontWeight: 'bold', mr: 1 }}>•</Typography>
      <Typography>Neutral Performance</Typography>
    </>
  );
};

export default CalendarLegend;

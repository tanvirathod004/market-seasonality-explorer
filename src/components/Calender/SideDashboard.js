import { Card, CardContent, Grid, Typography, Box } from '@mui/material';
import React, { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip as ReTooltip, CartesianGrid } from 'recharts';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TimelineIcon from '@mui/icons-material/Timeline';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import BarChartIcon from '@mui/icons-material/BarChart';

const SideDashboard = ({ data, loading, error, symbol }) => {
    if (loading) return <p>Loading detailed data...</p>;
    if (error) return <p>{error}</p>;
    if (!data) return <p>No Detailed Data</p>

    const titleMapping = {
        open: 'Open',
        close: 'Close',
        high: 'High',
        low: 'Low',
        volatility: 'Volatility',
        volume: 'volume',
        ma20: 'MA 20',
        ma50: 'MA 50',
    };

    const iconMapping = {
        open: <ShowChartIcon />,
        close: <TrendingDownIcon />,
        high: <TrendingUpIcon  color="success"/>,
        low: <TrendingDownIcon  color='error'/>,
        volatility: <TimelineIcon />,
        volume: <BarChartIcon />,
        ma20: <EqualizerIcon />,
        ma50: <EqualizerIcon />,
    };

    return (
        <div>
            <Box sx={{ flexGrow: 1, padding: 2 }}>
                <Grid container spacing={3}>
                    {Object.keys(titleMapping)
                        .map((key, index) => (
                            <React.Fragment key={index}>
                                <Grid item xs={6}>
                                    <Card
                                        sx={{ background: '#2e2f31', height: '80px', width: '350px', alignContent: 'center', borderLeft: '2px solid rebeccapurple' }}>
                                        <Box sx={{ display: 'flex' }}>
                                            <Box sx={{ marginLeft: '10px', marginTop: '10px' }}>{iconMapping[key]}</Box>
                                            <Box sx={{ marginLeft: '30px'}}>
                                                <Typography variant="subtitle2" sx={{color: '#6b72db'}}>{titleMapping[key]}</Typography>
                                                <Typography variant="h6" fontWeight="bold" sx={{color: '#e7ede7a6'}}>
                                                    {data?.[key] !== undefined ? data[key] : 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Box>

                                    </Card>
                                </Grid>
                            </React.Fragment>
                        ))}
                </Grid>
            </Box>


            <div style={{ width: '400px', padding: '20px' }}>
                {data.chartData && (
                    <LineChart width={720} height={300} data={data.chartData}>
                        <XAxis dataKey="time" />
                        <YAxis domain={['dataMin', 'dataMax']} />
                        <CartesianGrid strokeDasharray="3 3" />
                        <ReTooltip />
                        <Line type="monotone" dataKey="close" stroke="#bd2d0cff" dot={false} />
                        <Line type="monotone" dataKey="open" stroke="#126522ff" dot={false} />
                    </LineChart>
                )}
            </div>
        </div>
    )
}

export default SideDashboard

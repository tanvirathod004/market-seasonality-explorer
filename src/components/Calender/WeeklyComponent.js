import React from 'react';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import {
    Card,
    CardContent,
    Grid,
    Typography,
    Box
} from '@mui/material';
import BarChartIcon from '@mui/icons-material/BarChart';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';

const formatWeekRange = (weekStartStr) => {
    const startDate = new Date(weekStartStr);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const startStr = startDate.toLocaleDateString(undefined, options);
    const endStr = endDate.toLocaleDateString(undefined, options);

    return `${startStr} - ${endStr}`;
};

const WeeklyComponent = ({ weeklyData, calendarRange }) => {
    if (!weeklyData || Object.keys(weeklyData).length === 0) {
        return <div>No weekly data available</div>;
    }

    const filteredWeeks = Object.entries(weeklyData).filter(([weekStartStr]) => {
        return (
            (!calendarRange.start || weekStartStr >= calendarRange.start) &&
            (!calendarRange.end || weekStartStr <= calendarRange.end)
        );
    });

    if (filteredWeeks.length === 0) {
        return <div>No data for visible weeks</div>;
    }

    return (
        <Box>
            {filteredWeeks.map(([weekStartStr, data]) => {
                const isPositive = data.performance >= 0;
                const performanceColor = isPositive ? 'green' : 'red';

                return (
                    <Card
                        key={weekStartStr}
                        sx={{
                            backgroundColor: '#1b1a1a',
                            marginBottom: 1,
                            padding: 1,
                            borderLeft: `5px solid ${performanceColor}`,
                            borderRadius: 2
                        }}
                    >
                        <CardContent>
                            {/* Week Header */}
                            <Typography variant="h6" gutterBottom textAlign="center">
                                Week: {formatWeekRange(weekStartStr)}
                            </Typography>

                            {/* Metrics Row */}
                            <Box
                                display="flex"
                                justifyContent="space-around"
                                alignItems="center"
                                flexWrap="wrap"
                                gap={3}
                                mt={2}
                            >
                                {/* Volatility */}
                                <Box display="flex" alignItems="center" gap={1}>
                                    <MonitorHeartIcon color="primary" />
                                    <Typography variant="body1">
                                        <strong>Avg. Volatility:</strong> {(data.volatility * 100).toFixed(2)}%
                                    </Typography>
                                </Box>

                                {/* Liquidity */}
                                <Box display="flex" alignItems="center" gap={1}>
                                    <BarChartIcon color="secondary" />
                                    <Typography variant="body1">
                                        <strong>Total Volume:</strong> {data.liquidity.toLocaleString()}
                                    </Typography>
                                </Box>

                                {/* Performance */}
                                <Box display="flex" alignItems="center" gap={1}>
                                    {isPositive ? (
                                        <ArrowCircleUpIcon sx={{ color: 'green' }} />
                                    ) : (
                                        <ArrowCircleDownIcon sx={{ color: 'red' }} />
                                    )}
                                    <Typography variant="body1" sx={{ color: performanceColor }}>
                                        <strong>Performance:</strong> {(data.performance * 100).toFixed(2)}%
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                );
            })}
        </Box>
    );
};

export default WeeklyComponent;

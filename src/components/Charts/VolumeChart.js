import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Typography, Box } from '@mui/material';

const VolumeChart = ({ weeklyData, monthlyData, currentView }) => {
    const dataArray1 = Object.entries(weeklyData).map(([week, val]) => ({
        week,
        volatility: val.volatility,
        liquidity: val.liquidity,
        performance: val.performance,
        performancePercent: val.performance * 100,
    })).sort((a, b) => new Date(a.week) - new Date(b.week));

    const dataArray2 = Object.entries(monthlyData).map(([month, val]) => ({
        month,
        volatility: val.volatility,
        liquidity: val.liquidity,
        performance: val.performance,
        performancePercent: val.performance * 100,
    })).sort((a, b) => new Date(a.month + '-01') - new Date(b.month + '-01'));

    const customizedDot = (props) => {
        const { cx, cy, payload } = props;
        const color = payload.performance >= 0 ? 'green' : 'red';
        return (
            <circle cx={cx} cy={cy} r={5} fill={color} stroke="none" />
        );
    };

    if (dataArray1.length === 0) {
        return <Typography>No weekly data available for this range.</Typography>;
    }

    if (dataArray2.length === 0) {
        return <Typography>No monthly data available for this range.</Typography>;
    }


    return (
        <div>
            <Typography sx={{ textAlign: "center" }}>{currentView === 'dayGridMonth' ? 'Monthly' : 'Weekly'} Performance Chart</Typography>
            {currentView === 'dayGridMonth' ? (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dataArray2} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" tickFormatter={m => m.slice(5)} />
                        <YAxis />
                        <Tooltip formatter={(value) => `${(value * 100).toFixed(2)}%`} />
                        <Line
                            type="monotone"
                            dataKey="performance"
                            stroke="#82ca9d"
                            dot={customizedDot}
                            strokeWidth={2}
                            yAxisId={0}
                            name="Monthly Performance"
                        />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={dataArray1} margin={{ top: 20, right: 30, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" tickFormatter={w => w.slice(5)} />
                        <YAxis />
                        <Tooltip formatter={(value) => `${(value * 100).toFixed(2)}%`} />
                        <Line
                            type="monotone"
                            dataKey="performance"
                            stroke="#8884d8"
                            dot={customizedDot}
                            strokeWidth={2}
                            yAxisId={0}
                            name="Weekly Performance"
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}




        </div>
    )
}

export default VolumeChart

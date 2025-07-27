import React from 'react';

// Helper to format month heading nicely
const formatMonth = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
};

const MonthlyComponent = ({ monthlyData }) => {
    if (!monthlyData || Object.keys(monthlyData).length === 0) {
        return <div style={{ textAlign: 'center', color: '#ccc' }}>No monthly data available</div>;
    }

    const entries = Object.entries(monthlyData);
    const entryCount = entries.length;

    // Determine card width based on number of items
    const getCardWidth = () => {
        if (entryCount === 1) return '100%';
        if (entryCount === 2) return '48%';
        return '300px'; // fixed width for multiple cards
    };

    return (
        <div
            style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: entryCount === 1 ? 'center' : 'space-between',
                gap: '16px',
                padding: '20px',
                backgroundColor: '#121212',
                borderRadius: '8px',
            }}
        >
            {entries.map(([monthStr, data]) => (
                <div
                    key={monthStr}
                    style={{
                        flex: `1 1 ${getCardWidth()}`,
                        backgroundColor: '#1b1a1a',
                        color: '#fff',
                        padding: '16px',
                        borderRadius: '10px',
                        borderTop: '5px solid green',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
                        minWidth: '260px',
                    }}
                >
                    <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '8px' }}>
                        {formatMonth(monthStr)}
                    </div>
                    <div>Avg. Volatility: {(data.volatility * 100).toFixed(2)}%</div>
                    <div>Total Liquidity: {data.liquidity.toLocaleString()}</div>
                    <div>
                        Performance:{' '}
                        <span style={{ color: data.performance >= 0 ? 'lightgreen' : 'tomato' }}>
                            {(data.performance * 100).toFixed(2)}%
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MonthlyComponent;

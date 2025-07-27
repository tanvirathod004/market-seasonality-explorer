import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import Tooltip from '@mui/material/Tooltip';
import './calender.css'
import CloseIcon from '@mui/icons-material/Close';
import { Box, Drawer, IconButton, Divider, Grid, Card, Slide } from '@mui/material';
import '../Dashboard/component.css'
import SideDashboard from './SideDashboard';
import { mean, std } from 'mathjs';
import OrderBook from './OrderBook';
import WeeklyComponent from './WeeklyComponent';
import MonthlyComponent from './MonthlyComponent';
import CalendarLegend from './CalendarLegend';
import VolumeChart from '../Charts/VolumeChart';
import { getWeekStartDateStr } from '../../utils/dates'
import { API } from '../../services/api';


const CalendarComponent = ({ symbolValue, orderBook, filterMetric }) => {

  let str = symbolValue;
  let symbolSelected = str.replace(/"/g, '');
  const [volatilityData, setVolatilityData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [detailedData, setDetailedData] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);
  const [calendarRange, setCalendarRange] = useState({ start: null, end: null });
  const [weeklyData, setWeeklyData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});
  const [currentView, setCurrentView] = useState('dayGridMonth');

  const handleDateClick = (arg) => {
    setDrawerOpen(true)
    setSelectedDate(arg.date.toISOString().split('T')[0]);
  };


  // ---------------------Weekly month view----------------------
  const handleDatesSet = (arg) => {
    setCurrentView(arg.view.type);
    setCalendarRange({ start: arg.startStr, end: arg.endStr });
  };


  useEffect(() => {
    if (!calendarRange.start || !calendarRange.end || !volatilityData) return;

    // Convert volatilityData (object) to array for filtering
    const dailyEntries = Object.entries(volatilityData);

    // Filter daily data within the calendar's visible date range
    const filteredData = {};
    dailyEntries.forEach(([dateStr, data]) => {
      if (dateStr >= calendarRange.start && dateStr <= calendarRange.end) {
        filteredData[dateStr] = data;
      }
    });

    // Aggregate filtered data
    const wData = aggregateWeekly(filteredData);
    const mData = aggregateMonthly(filteredData);

    setWeeklyData(wData);
    setMonthlyData(mData);

  }, [calendarRange, volatilityData]);

  // Aggregate daily data into weekly summaries
  const aggregateWeekly = (dailyData) => {
    const weeks = {};
    Object.entries(dailyData).forEach(([dateStr, data]) => {
      const weekStart = getWeekStartDateStr(dateStr);
      if (!weeks[weekStart]) weeks[weekStart] = {
        volatilitySum: 0,
        liquiditySum: 0,
        performanceSum: 0,
        count: 0
      };
      weeks[weekStart].volatilitySum += data.volatility;
      weeks[weekStart].liquiditySum += data.liquidity;
      weeks[weekStart].performanceSum += data.performance;
      weeks[weekStart].count += 1;
    });

    // Compute averages etc.
    const weeklyData = {};
    Object.entries(weeks).forEach(([weekStart, w]) => {
      weeklyData[weekStart] = {
        volatility: w.volatilitySum / w.count,
        liquidity: w.liquiditySum,
        performance: w.performanceSum, // or average if makes sense
      };
    });
    return weeklyData;
  };

  // Aggregate daily data to monthly summaries
  const aggregateMonthly = (dailyData) => {
    const months = {};
    Object.entries(dailyData).forEach(([dateStr, data]) => {
      const monthStr = dateStr.slice(0, 7); // 'yyyy-mm'
      if (!months[monthStr]) months[monthStr] = {
        volatilitySum: 0,
        liquiditySum: 0,
        performanceSum: 0,
        count: 0
      };
      months[monthStr].volatilitySum += data.volatility;
      months[monthStr].liquiditySum += data.liquidity;
      months[monthStr].performanceSum += data.performance;
      months[monthStr].count += 1;
    });

    const monthlyData = {};
    Object.entries(months).forEach(([monthStr, m]) => {
      monthlyData[monthStr] = {
        volatility: m.volatilitySum / m.count,
        liquidity: m.liquiditySum,
        performance: m.performanceSum,
      };
    });
    return monthlyData;
  };

  // ------------------------Weekly month view -------------------------

  useEffect(() => {

    const startTime = new Date("2024-08-01T00:00:00Z").getTime(); // ms
    const endTime = new Date("2024-08-05T00:00:00Z").getTime();

    const fetchKlinesAndComputeVolatility = async () => {
      try {
        // Fetch last 30 days of daily klines for BTCUSDT as example
        const response = await axios.get(`https://api.binance.com/api/v3/${API.GET_KLINES}`, {
          params: {
            symbol: symbolSelected,
            interval: '1d',
            limit: 31,
            // startTime: startTime,
            // endTime: endTime
          },
        });
        const klines = response.data;
        const volData = {};
        klines.forEach(kline => {
          const open = parseFloat(kline[1]);
          const close = parseFloat(kline[4]);
          const volume = parseFloat(kline[5]);
          const date = new Date(kline[0]);
          const dateStr = date.toISOString().split('T')[0]; // yyyy-mm-dd format

          volData[dateStr] = {
            volatility: Math.abs(close - open) / open,
            liquidity: volume,
            performance: (close - open) / open
          };
        });
        setVolatilityData(volData);
      } catch (error) {
        console.error('Error fetching klines:', error);
      }
    };

    fetchKlinesAndComputeVolatility();
  }, [symbolSelected]);



  // ---------------------------Data Visualisation Layer -------------------------------------
  const getVolatilityColor = (vol) => {
    if (vol === undefined) return 'transparent';
    if (vol < 0.01) return '#0c5721ff'; // light green low volatility
    if (vol < 0.03) return '#bd951eff'; // yellow medium
    return '#851c13ff'; // red high volatility
  };



  const renderLiquidity = (liq) => {
    if (!liq) return null;
    const maxVolume = Math.max(...Object.values(volatilityData).map(d => d.liquidity || 1));
    const radius = (liq / maxVolume) * 20 + 6; // 6--26px radius
    return (
      <div
        style={{
          width: radius,
          height: radius,
          borderRadius: '50%',
          background: 'rgba(13, 13, 11, 0.65)',
          position: 'absolute',
          left: 8,
          bottom: 2,
          top: 45,
          pointerEvents: 'none',
        }}
        title={`Liquidity: ${liq}`}
      />

    );
  };

  const getPerfIndicator = (perf) => {
    if (perf > 0.01) return <span style={{ color: 'green' }}>▲</span>;
    if (perf < -0.01) return <span style={{ color: 'red' }}>▼</span>;
    return <span style={{ color: 'gray' }}>•</span>;
  };

  // ---------------------------Data Visualisation Layer -------------------------------------



  // ------------------------Calender Cell--------------------------------------------------------
  const renderDayCell = (arg) => {
    const dateStr = arg.date.toISOString().split('T')[0];
    const daily = volatilityData[dateStr] || {};
    const { volatility, liquidity, performance } = daily;

    const tooltipText = (
      <>
        <div>Volatility: {(volatility * 100 || 0).toFixed(2)}%</div>
        <div>Liquidity: {(liquidity || 0).toLocaleString()}</div>
        <div>Performance: {((performance || 0) * 100).toFixed(2)}%</div>
      </>
    );

    return (
      <Tooltip title={tooltipText} arrow>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <div>{arg.dayNumberText} {(filterMetric == 'performance' || filterMetric == 'all') && getPerfIndicator(performance)}</div>
          {liquidity && (filterMetric == 'liquidity' || filterMetric == 'all') && renderLiquidity(liquidity)}
          {volatility !== undefined && (
            <div
              style={{
                position: 'absolute',
                top: 22,
                right: 2,
                fontSize: '0.75em',
                color: '#222',
                fontWeight: 'bold'
              }}
              title={`Volatility: ${(volatility * 100).toFixed(2)}%`}
            >
              {(volatility * 100).toFixed(2)}%
            </div>
          )}
        </div>
      </Tooltip>
    );
  };


  // Color full day cell background by volatility
  const handleDayCellDidMount = (arg) => {
    const dateStr = arg.date.toISOString().split('T')[0];
    const { volatility } = volatilityData[dateStr] || {};
    const bgColor = (filterMetric == 'volatility' || filterMetric == 'all') && getVolatilityColor(volatility);

  if (bgColor) {
    arg.el.style.backgroundColor = bgColor;
    arg.el.style.color = '#000'; // optional: set text color for contrast
    arg.el.style.fontWeight = 'bold';
  } else {
    arg.el.style.backgroundColor = 'transparent';
  }
};

// ------------------------------Calender Cell--------------------------------------------------------





// =----------------------------DEtailed View-=============--------------------------------------------
useEffect(() => {
  if (!selectedDate) {
    setDetailedData(null);
    setErrorDetails(null);
    return;
  }


  const processKlinesForDashboard = (klines) => {
    const closes = klines.map(k => parseFloat(k[4]));
    const highs = klines.map(k => parseFloat(k[2]));
    const lows = klines.map(k => parseFloat(k[3]));
    const volumes = klines.map(k => parseFloat(k[5]));

    const open = parseFloat(klines[0][1]);
    const close = closes[closes.length - 1];
    const high = Math.max(...highs);
    const low = Math.min(...lows);
    const volume = volumes.reduce((a, b) => a + b, 0);

    // Calculate returns for volatility (standard deviation of returns)
    const returns = closes.slice(1).map((c, i) => (c - closes[i]) / closes[i]);
    const volatility = returns.length > 0 ? std(returns) : 0;

    // Calculate Moving Averages (MA20, MA50)
    const movingAverage = (data, period) => {
      if (data.length < period) return null;
      return data.slice(data.length - period).reduce((a, b) => a + b, 0) / period;
    }
    const ma20 = movingAverage(closes, 20);
    const ma50 = movingAverage(closes, 50);

    const chartData = klines.map(kline => {
      const time = new Date(kline[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return {
        open: parseFloat(kline[1]),
        time,
        close: parseFloat(kline[4]),
      };
    });

    return { open, close, high, low, volume, volatility, ma20, ma50, chartData };
  };


  const fetchDetails = async () => {
    setLoadingDetails(true);
    setErrorDetails(null);

    try {
      // Fetch klines for the selected day with interval = 1m or 1h if you want intraday, or '1d' for daily
      // Here we use 1m for detailed prices and compute indicators

      const startTimestamp = new Date(selectedDate).getTime();
      const endTimestamp = startTimestamp + 24 * 60 * 60 * 1000 - 1; // End of selected date

      const response = await axios.get(`https://api.binance.com/api/v3/${API.GET_KLINES}`, {
        params: {
          symbol: symbolSelected,
          interval: '1m',          // 1-minute candlesticks for detailed data
          startTime: startTimestamp,
          endTime: endTimestamp,
          limit: 1440,              // Max 1440 mins = 1 day
        }
      });

      const klines = response.data;
      if (!klines || klines.length === 0) {
        setErrorDetails('No detailed data available for this date');
        setDetailedData(null);
        setLoadingDetails(false);
        return;
      }

      // Process klines to extract detailed OHLC, volume...
      // Optionally calculate volatility (std dev), moving averages, RSI etc.

      const processedData = processKlinesForDashboard(klines);
      setDetailedData(processedData);
    } catch (err) {
      setErrorDetails('Failed to fetch detailed data');
      setDetailedData(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  fetchDetails();
}, [selectedDate, symbolSelected]);

// =-------------------DEtailed View-=============--------------

return (
  <>
    <Box className="calender-box">
      <Grid container spacing={2}>
        <Card className='calender-card'>
          <Grid item xs={8}>
            {currentView === 'timeGridWeek' &&
              <WeeklyComponent
                weeklyData={weeklyData}
                calendarRange={calendarRange}
              />
            }
            {currentView === 'dayGridMonth' && (
              <MonthlyComponent
                monthlyData={monthlyData}
                calendarRange={calendarRange} />
            )}

            <FullCalendar
              key={symbolValue}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={currentView}
              datesSet={handleDatesSet}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek'
              }}
              height={550}
              aspectRatio={2.5}
              dateClick={handleDateClick}
              selectable={true}
              dayCellContent={renderDayCell}  // Custom day cell content for more content and tooltip
              dayCellDidMount={handleDayCellDidMount} // get voloaity color
            />

            <div style={{ marginTop: 16, display: 'flex' }}>
              <CalendarLegend />
            </div>
          </Grid>
        </Card>


        <Grid item size={4}>
          <Card style={{ height: '350px', padding: '10px', marginBottom: '20px' }}>
            <VolumeChart
              weeklyData={weeklyData}
              monthlyData={monthlyData}
              calendarRange={calendarRange}
              currentView={currentView}
            />
          </Card>
          <Card style={{ height: '450px', padding: '10px', marginBottom: '20px' }}>
            <OrderBook
              bids={orderBook?.bids}
              asks={orderBook?.asks}
            />
          </Card>
        </Grid>
      </Grid>


    </Box>


    <Drawer open={drawerOpen} onClose={() => setDrawerOpen(!drawerOpen)} anchor="right" transitionDuration={500} >
      <Slide direction="left" in={drawerOpen} mountOnEnter unmountOnExit timeout={500}>
        <Box className={`drawer-container drawer-width-50`} role="presentation" sx={{
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
          backgroundColor: '#1b1a1a',
        }}>
          <Box className="drawer-header">
            <p>{symbolSelected}</p>
            <IconButton className="closeFormButton" sx={{ width: '28px', height: '28px' }} disableRipple onClick={() => setDrawerOpen(!drawerOpen)}>
              <CloseIcon sx={{ fontSize: '24px' }} />
            </IconButton>

          </Box>
          <Divider />
          <Box sx={{ width: 800 }}>
            <SideDashboard
              data={detailedData}
              loading={loadingDetails}
              error={errorDetails}
              symbol={symbolSelected}
            />
          </Box>
        </Box>

      </Slide>

    </Drawer>

  </>
);
}

export default CalendarComponent;
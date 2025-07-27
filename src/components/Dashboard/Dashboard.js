import React, { useState, useEffect, useRef } from 'react'
import { Typography, Box, IconButton, Card, CardContent, MenuItem, FormControl, Select, InputLabel } from '@mui/material';
import './component.css'
import axios from 'axios';
import CalendarComponent from '../Calender/CalenderComponent'
import { useTheme } from '@mui/material/styles';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {API} from '../../services/api';

const Dashboard = () => {
    const wsRef = useRef(null);
    const lastUpdateIdRef = useRef(null);
    const bufferRef = useRef([]);
    const theme = useTheme();
    const printRef = useRef();

    const [orderBook, setOrderBook] = useState([])
    const [symbolData, setsymbolData] = useState([]);
    const [symbolValue, setSymbolValue] = useState('ETHBTC')
    const [filterMetric, setFilterMetric] = useState('all'); // default metric for color-coding

    const ITEM_HEIGHT = 30; // Default height per item
    const MAX_ITEMS = 8;

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * MAX_ITEMS,
                overflowY: 'auto',
            },
        },
    };


    useEffect(() => {
        const getData = async () => {
            try {
                const result = await axios.get(`https://api.binance.com/api/v3/${API.GET_SYMBOLS}`);
                if (result?.data) {
                    setsymbolData(result?.data?.symbols)
                }
            }
            catch (err) {
                console.log('error')
            }
        }
        getData();
    }, [])

    useEffect(() => {
        const fetchOrderBook = async () => {
            try {
                let str = symbolValue;
                let cleaned = str.replace(/"/g, '');
                const res = await axios.get(`https://api.binance.com/api/v3/${API.GET_ORDER_BOOK}`, {
                    params: { symbol: cleaned ? cleaned : 'ETHBTC', limit: 10 }
                });
                console.log('res', res)
                setOrderBook(res.data)
            } catch (err) {
                console.error("Orderbook Error", err);
            }
        };

        fetchOrderBook();
        const interval = setInterval(fetchOrderBook, 5000); // refresh every 5s

        return () => clearInterval(interval);
    }, [symbolValue]);

    // Function to download tge view in pdf
    const handleDownloadPdf = () => {
        const input = printRef.current;
        html2canvas(input).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });
            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('market-seasonality.pdf');
        });
    }


    return (
        <Box sx={{
            backgroundColor: theme.palette.primary.main, padding: 1
        }} ref={printRef}>

            <Card className="header-card">
                <CardContent>
                    <Typography variant='h5'> Market Seasonality Explorer </Typography>
                </CardContent>
            </Card>

            <Box className="symbol-dropdown">
                <FormControl className='dropdown-formcontrol'>
                    <InputLabel id="demo-simple-select-label">Symbol</InputLabel>
                    <Select
                        id="symbolValue"
                        name='symbolValue'
                        value={symbolValue}
                        label="Symbols"
                        MenuProps={MenuProps}
                        onChange={(e) => setSymbolValue(e.target.value)}
                        className='select-design'
                    >
                        {symbolData?.slice(0, 20).map((item) => (
                            <MenuItem key={item.symbol} value={item?.symbol}>{item?.symbol}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl className='dropdown-formcontrol'>
                    <InputLabel id="demo-simple-select-label">Metric</InputLabel>
                    <Select
                        id="filterMetric"
                        name='filterMetric'
                        value={filterMetric}
                        label="Metric"
                        MenuProps={MenuProps}
                        onChange={(e) => setFilterMetric(e.target.value)}
                        className='select-design'
                    >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="volatility">Volatility</MenuItem>
                        <MenuItem value="liquidity">Liquidity</MenuItem>
                        <MenuItem value="performance">Performance</MenuItem>
                    </Select>
                </FormControl>



                <Box>
                    <IconButton onClick={() => handleDownloadPdf()}>
                        <PictureAsPdfIcon />
                    </IconButton>
                </Box>
            </Box>


            <CalendarComponent
                symbolValue={symbolValue}
                filterMetric={filterMetric}
                orderBook={orderBook}
            />
        </Box>
    )
}

export default Dashboard

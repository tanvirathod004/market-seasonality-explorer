import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Typography, Box, Button } from '@mui/material';

const OrderBook = ({bids, asks}) => {
    return (
        <div>
            <Box display="flex" justifyContent="space-between" width="100%">
                <Box width="48%">
                    <Typography variant="h6" color="green" align="center">Bids</Typography>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Price</TableCell>
                                <TableCell align="right">Size</TableCell>
                                <TableCell align="right">Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bids?.map(([price, size], idx) => (
                                <TableRow key={idx}>
                                    <TableCell style={{ color: 'green' }}>{price}</TableCell>
                                    <TableCell align="right">{size}</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Button color='success' variant="contained">Buy</Button>
                    </Box>
                </Box>

                <Box width="48%">
                    <Typography variant="h6" color="red" align="center">Asks</Typography>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Price</TableCell>
                                <TableCell align="right">Size</TableCell>
                                <TableCell align="right">Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {asks?.map(([price, size], idx) => (
                                <TableRow key={idx}>
                                    <TableCell style={{ color: 'red' }}>{price}</TableCell>
                                    <TableCell align="right">{size}</TableCell>
                                    <TableCell align="right"></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Box display="flex" justifyContent="center" mt={2}>
                        <Button color='error' variant="contained">Sell</Button>
                    </Box>
                </Box>
            </Box>
        </div>
    )
}

export default OrderBook

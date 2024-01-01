import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { API_URL } from '@/config/config';
import axios from 'axios';

interface Url {
    _id: string;
    originalUrl: string;
    shortUrl: string;
    createdAt: string;
}

const UrlTable = () => {
    const [userUrls, setUserUrls] = useState<Url[]>([]);
    const authToken = localStorage.getItem('token');

    useEffect(() => {
        // Fetch user URLs from your backend API
        const fetchUserUrls = async () => {
            try {
                const response = await axios.get(`${API_URL}/url/userUrls`, {
                    headers: {
                        authToken: `${authToken}`
                    }
                });
                if (response) {
                    const data = await response.data;
                    setUserUrls(data);
                    console.log('User URLs:', response.data);
                } else {
                    console.error('Failed to fetch user URLs');
                }
            } catch (error) {
                console.error('Error fetching user URLs:', error);
            }
        };

        fetchUserUrls();
    }, []); // Run the effect only once on component mount

    return (
        <TableContainer component={Paper}
            sx={{
                width: '100%',
                margin: 'auto',
                minWidth: 650,
                maxWidth: 1000,
                marginTop: 5,
                marginBottom: 5,
                padding: 5,
                borderRadius: 5,
                boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)',
                border: '1px solid #eee',
                '& .MuiTableCell-root': {
                    border: '1px solid #eee',
                },
                '& .MuiTableHead-root': {
                    backgroundColor: '#eee',
                },
                '& .MuiTableRow-root': {
                    border: '1px solid #eee',
                },
            }}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Origial URL</TableCell>
                        <TableCell>Short URl</TableCell>
                        <TableCell>Ceated At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {userUrls.map((row) => (
                        <TableRow key={row._id}>
                            <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'wrap' }}>
                                {row.originalUrl}
                            </TableCell>
                            <TableCell>{row.shortUrl}</TableCell>
                            <TableCell>{row.createdAt}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default UrlTable;

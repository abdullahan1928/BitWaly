import { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { deleteUrl, getUserUrls } from './services/url.service';

interface Url {
    _id: string;
    originalUrl: string;
    shortUrl: string;
    createdAt: string;
}

const UrlTable = () => {
    const [userUrls, setUserUrls] = useState<Url[]>([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [urlToDelete, setUrlToDelete] = useState<string | null>(null);

    useEffect(() => {
        const authToken = localStorage.getItem('token');

        const fetchUserUrls = async () => {
            try {
                const urls = await getUserUrls(authToken);
                setUserUrls(urls);
            } catch (error) {
                console.error('Error fetching user URLs:', error);
            }
        };

        fetchUserUrls();
    }, []);

    const handleDelete = async () => {
        const authToken = localStorage.getItem('token');

        if (urlToDelete) {
            try {
                await deleteUrl(authToken, urlToDelete);
                setUserUrls(prevUrls => prevUrls.filter(url => url._id !== urlToDelete));
            } catch (error) {
                console.error('Error deleting URL:', error);
            }
        }
        setUrlToDelete(null);
        setDeleteDialogOpen(false);
    };

    const formatCreatedAt = (createdAt: string) => {
        const date = new Date(createdAt);
        return date.toLocaleString();
    };

    const openDeleteDialog = (urlId: string) => {
        setUrlToDelete(urlId);
        setDeleteDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setUrlToDelete(null);
        setDeleteDialogOpen(false);
    };

    return (
        <TableContainer component={Paper} className='w-full max-w-5xl mx-auto rounded-lg shadow-md border-2 border-[#e8e9eb] m-auto my-4'>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow className='bg-[#eee]'>
                        <TableCell>Original URL</TableCell>
                        <TableCell>Short URL</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {userUrls.map((row) => (
                        <TableRow key={row._id} className='border-[#eee]'>
                            <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'wrap' }}>
                                {row.originalUrl}
                            </TableCell>
                            <TableCell>{row.shortUrl}</TableCell>
                            <TableCell>{formatCreatedAt(row.createdAt)}</TableCell>
                            <TableCell>
                                <button onClick={() => openDeleteDialog(row._id)} className='text-red-500 hover:text-red-600'>
                                    <DeleteIcon />
                                </button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
                <DialogTitle>Delete URL</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this URL?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDeleteDialog}>Cancel</Button>
                    <Button onClick={handleDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </TableContainer>
    );
};

export default UrlTable;

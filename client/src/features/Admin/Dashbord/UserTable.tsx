import { useEffect, useState } from 'react';
import { fetchUsers, deleteUser } from '@/services/admin';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    CircularProgress,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import RoleIcon from '@mui/icons-material/Person';
import DateIcon from '@mui/icons-material/Event';
import LinksIcon from '@mui/icons-material/Link';
import AccessCountIcon from '@mui/icons-material/Visibility';
import { Delete } from '@mui/icons-material';

interface IUser {
    _id: string;
    email: string;
    role: string;
    createdAt: string;
    lastLogin: string;
    linkCount: number;
    totalAccessCount: number;
}

const UserTable = () => {
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const authToken = localStorage.getItem('token');

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetchUsers(authToken || '');
                setUsers(response);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDeleteUser = async (id: string) => {
        setLoading(true);

        const authToken = localStorage.getItem('token');

        try {
            await deleteUser(authToken || '', id);
            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            setLoading(false);
        }
    };

    const tableHead = [
        { icon: <EmailIcon />, label: 'id' },
        { icon: <EmailIcon />, label: 'Email' },
        { icon: <RoleIcon />, label: 'Role' },
        { icon: <DateIcon />, label: 'Created' },
        { icon: <DateIcon />, label: 'Last Login' },
        { icon: <LinksIcon />, label: 'Links' },
        { icon: <AccessCountIcon />, label: 'Visits' },
        { icon: <Delete />, label: 'Action' },
    ];

    return (
        <>
            {loading ? (
                <div className="flex justify-center items-center" >
                    <CircularProgress />
                </div >
            ) : (
                <TableContainer component={Paper} sx={{ marginTop: 2 }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead sx={{ backgroundColor: 'primary.main' }}>
                            <TableRow>
                                {tableHead.map((head, index) => (
                                    <TableCell key={index} sx={{ color: 'white' }} align="center">
                                        <span className="flex items-center">
                                            {head.icon}
                                            <span className="ml-2">{head.label}</span>
                                        </span>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user._id}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.createdAt}</TableCell>
                                    <TableCell>{user.lastLogin}</TableCell>
                                    <TableCell>{user.linkCount}</TableCell>
                                    <TableCell>{user.totalAccessCount}</TableCell>
                                    <TableCell>
                                        {user.role === 'admin' ? (
                                            <Button variant="contained" disabled>
                                                Delete
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                color="error"
                                                onClick={() => handleDeleteUser(user._id)}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </>
    );
}

export default UserTable
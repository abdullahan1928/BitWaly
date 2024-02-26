import React, { useEffect, useState } from 'react';
import { fetchUsers, deleteUser } from '@/services/admin';
import { authToken } from '@/config/authToken';
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
  Typography,
} from '@mui/material';
import AdminIcon from '@mui/icons-material/SupervisorAccount';
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

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
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
    try {
      await deleteUser(authToken || '', id);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-4">
      <Typography variant="h4" component="div" gutterBottom>
        <AdminIcon fontSize="large" /> Admin Dashboard
      </Typography>
      {loading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <EmailIcon /> Email
                </TableCell>
                <TableCell>
                  <RoleIcon /> Role
                </TableCell>
                <TableCell>
                  <DateIcon /> Created
                </TableCell>
                <TableCell>
                  <DateIcon /> Last Login
                </TableCell>
                <TableCell>
                  <LinksIcon /> Links
                </TableCell>
                <TableCell>
                  <AccessCountIcon /> Visits
                </TableCell>
                <TableCell><Delete/>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
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
    </div>
  );
};

export default AdminDashboard;

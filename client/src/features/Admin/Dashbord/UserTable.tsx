import { useEffect, useState } from 'react';
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
  TablePagination,
  TextField,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import RoleIcon from '@mui/icons-material/Person';
import DateIcon from '@mui/icons-material/Event';
import LinksIcon from '@mui/icons-material/Link';
import AccessCountIcon from '@mui/icons-material/Visibility';
import { fetchUsers, deleteUser } from '@/services/admin.service';
import { useCallback } from 'react';
import InsightsIcon from '@mui/icons-material/Insights';
import DeleteIcon from '@mui/icons-material/Delete';
import { Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface IUser {
  _id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  lastLogin: string;
  linkCount: number;
  totalAccessCount: number;
}

const rowsPerPageOptions = [10, 25, 50, 100, 500, 1000, 1500];

const UserTable = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [sortCriteria, setSortCriteria] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchLoading, setSearchLoading] = useState(false);

  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    const authToken = localStorage.getItem('token');
    try {
      setLoading(true);
      const response = await fetchUsers(authToken || '', {
        page: page,
        limit: rowsPerPage,
        search: searchQuery,
        sortField: sortCriteria,
        sortOrder,
      });
      setUsers(response.users);
      setTotalUsers(response.totalCount);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQuery, sortCriteria, sortOrder]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleChangePage = (_event: any, newPage: any) => {
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

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

  const handleSearch = async () => {
    setSearchQuery(search);
    setSearchLoading(true);
    setPage(1);
    await fetchData();
    setSearchLoading(false);
  };

  const handleSort = (criteria: any) => {
    setSortCriteria(criteria);
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    setPage(1);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSearch('');
    setPage(1);
    setSortCriteria('');
    setSortOrder('asc');
  };

  const sortedUsers = [...users];

  if (sortCriteria === 'links') {
    sortedUsers.sort((a, b) => (a.linkCount - b.linkCount) * (sortOrder === 'asc' ? 1 : -1));
  } else if (sortCriteria === 'visits') {
    sortedUsers.sort((a, b) => (a.totalAccessCount - b.totalAccessCount) * (sortOrder === 'asc' ? 1 : -1));
  }

  const filteredUsers = sortedUsers.filter((user) =>
    Object.values(user)
      .join(' ')
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const tableHead = [
    { icon: <KeyIcon />, label: 'ID', sortable: true },
    { icon: <EmailIcon />, label: 'Email', sortable: true },
    { icon: <RoleIcon />, label: 'Name', sortable: true },
    { icon: <DateIcon />, label: 'Created', sortable: true },
    { icon: <DateIcon />, label: 'Last Login', sortable: true },
    { icon: <LinksIcon />, label: 'Links', sortable: true },
    { icon: <AccessCountIcon />, label: 'Visits', sortable: true },
    { icon: <Delete />, label: 'Action' },
  ];

  return (
    <>
      <div className="flex items-center">
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          margin="normal"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && handleSearch()}
          sx={{ maxWidth: 400 }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            marginLeft: 2,
            padding: '10px 20px',
          }}>
          Search
        </Button>
        <Button
          variant="contained"
          onClick={clearFilters}
          sx={{
            marginLeft: 2,
            padding: '10px 20px',
          }}>
          Clear
        </Button>
      </div>

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              {tableHead.map((head, index) => (
                <TableCell
                  key={index}
                  sx={{ color: 'white', cursor: head.sortable ? 'pointer' : 'default' }}
                  align="center"
                  onClick={() => (head.sortable ? handleSort(head.label.toLowerCase()) : null)}
                >
                  <span className="flex items-center">
                    {head.icon}
                    <span className="ml-2">{head.label}</span>
                    {head.sortable && (
                      <span className="ml-1">
                        {sortCriteria === head.label.toLowerCase() && (
                          <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </span>
                    )}
                  </span>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUsers.length === 0 && !loading && !searchLoading && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
            {loading && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
            {filteredUsers.length > 0 && !loading && !searchLoading &&
              filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user._id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>{user.lastLogin}</TableCell>
                  <TableCell>{user.linkCount}</TableCell>
                  <TableCell>{user.totalAccessCount}</TableCell>
                  <TableCell colSpan={2}>
                    {user.role === 'admin' ? (
                      <Button variant="contained" disabled>
                        <DeleteIcon />
                      </Button>
                    ) : (
                      <>
                        <Button onClick={() => navigate(`/admin/analytics/${user._id}`)}>
                          <InsightsIcon />
                        </Button>
                        <Button
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          <DeleteIcon color="error" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={totalUsers}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default UserTable;

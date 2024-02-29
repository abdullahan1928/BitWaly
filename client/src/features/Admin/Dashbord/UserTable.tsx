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
import { Delete } from '@mui/icons-material';
import { fetchUsers, deleteUser } from '@/services/admin';
import { useCallback } from 'react';


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
  const [sortCriteria, setSortCriteria] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [totalUsers, setTotalUsers] = useState(0);


  const fetchData = useCallback(async () => {
    const authToken = localStorage.getItem('token');
    try {
      setLoading(true);
  
      // Adjust the page and limit values to match the API's expectations
      const response = await fetchUsers(authToken || '', {
        page: page,
        limit: rowsPerPage,
        search: searchQuery,
        sortField: sortCriteria,
        sortOrder,
      });
  
      // Update the state with the users and total count
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


  const handleChangePage = (_event:any, newPage:any) => {
    setPage(newPage + 1); // Adjust the page value
    fetchData(); // Call fetchData when page changes
  };
  
  const handleChangeRowsPerPage = (event:any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1); // Reset page to 1
    fetchData(); // Call fetchData when rows per page changes
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

  const handleSearch = (event:any) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleSort = (criteria:any) => {
    setSortCriteria(criteria);
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
    setPage(1);
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
      {loading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            margin="normal"
            value={searchQuery}
            onChange={handleSearch}
          />
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
                {(rowsPerPage > 0
                  ? filteredUsers.slice((page - 1) * rowsPerPage, (page - 1) * rowsPerPage + rowsPerPage)
                  : filteredUsers
                ).map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user._id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.name}</TableCell>
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
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={totalUsers} // Use the totalUsers state here
            rowsPerPage={rowsPerPage}
            page={page - 1}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </>
  );
};

export default UserTable;

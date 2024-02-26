
import UserTable from '@/features/Admin/Dashbord/UserTable';
import AdminIcon from '@mui/icons-material/SupervisorAccount';
import { Typography } from '@mui/material';

const AdminDashboard = () => {

  return (
    <div className="my-4">
      <Typography variant="h4" component="div" gutterBottom>
        <AdminIcon fontSize="large" /> Admin Dashboard
      </Typography>

      <UserTable />
    </div>
  );
};

export default AdminDashboard;

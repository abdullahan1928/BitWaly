import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import AdminDashboardLayout from "@/layouts/admin/AdminDashboardLayout";

export const AdminGuard = (): any => {
    const context = useAuth();
    const location = useLocation();

    if (context.isAuthenticated === true && context.isAdmin === true) {
        return <AdminDashboardLayout />
    } else {
        return <Navigate to='/login' state={{ from: location.pathname }} replace={true} />
    }
};

export default AdminGuard;

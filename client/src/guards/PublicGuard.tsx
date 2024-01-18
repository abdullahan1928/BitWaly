import { useAuth } from "@/hooks/useAuth";
import { Outlet, Navigate, useLocation } from "react-router-dom";

export const PublicGuard = (): any => {
    const context = useAuth();
    const location = useLocation();

    if (context.isAuthenticated === true) {
        return <Navigate to='/dashboard' state={{ from: location.pathname }} replace={true} />
    } else {
        return <Outlet />
    }
};

export default PublicGuard;

import { useAuth } from "@/hooks/useAuth";
import { Outlet, Navigate, useLocation } from "react-router-dom";

export const AuthGuard = (): any => {
    const context = useAuth();
    const location = useLocation();

    if (context.isAuthenticated === true) {
        return <Outlet />
    } else {
        return <Navigate to='/login' state={{ from: location.pathname }} replace={true} />
    }
};

export default AuthGuard;

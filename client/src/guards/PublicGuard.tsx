import { useAuth } from "@/hooks/useAuth";
import { Outlet, Navigate } from "react-router-dom";

export const PublicGuard = (): any => {
    const context = useAuth();

    if (!context.isAuthenticated) {
        return <Outlet />;
    }

    console.log(context.isAdmin);

    if (context.isAdmin) {
        console.log("Admin");
        return <Navigate to='/admin' replace={true} />;
    } else {
        console.log("Dashboard");
        return <Navigate to='/dashboard' replace={true} />;
    }
};

export default PublicGuard;

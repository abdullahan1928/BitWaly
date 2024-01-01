import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '@/context/auth.context'; // Adjust this based on your authentication context

interface PrivateRouteProps {
    children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { isAuthenticated } = useAuth(); // Adjust this based on your authentication context

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return (
        <Routes>
            {React.Children.map(children, child => {
                if (React.isValidElement(child)) {
                    return <Route element={child.props.element} />;
                }
                return null;
            })}
        </Routes>
    );
};

export default PrivateRoute;

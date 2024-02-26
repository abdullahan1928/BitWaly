import { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextProps {
    isAuthenticated: boolean;
    isAdmin: boolean;
    login: (token: string, role: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const storedToken = localStorage.getItem('token');
        return !!storedToken;
    });

    const [isAdmin, setIsAdmin] = useState(() => {
        const storedRole = localStorage.getItem('role');
        return storedRole === 'admin';
    });

    const navigate = useNavigate();

    useEffect(() => {
        const storedRole = localStorage.getItem('role');
        if (storedRole === 'admin') {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
}, [isAuthenticated]);

    const login = (token: string, role: string) => {
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        if (role === 'admin') {
            setIsAdmin(true);
            navigate('/admin');
        } else {
            setIsAdmin(false);
            navigate('/dashboard');
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsAdmin(false);
        navigate('/login'); 
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

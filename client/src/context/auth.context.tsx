import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextProps {
    isAuthenticated: boolean;
    login: (token: string) => void; // Accept token as a parameter
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check if a token is stored in local storage
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setIsAuthenticated(true);
        }
    }, []); // Run this effect only once on component mount

    const login = (token: string) => {
        setIsAuthenticated(true);
        // Store the token in local storage
        localStorage.setItem('token', token);
    };

    const logout = () => {
        setIsAuthenticated(false);
        // Remove the token from local storage
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

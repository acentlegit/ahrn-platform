import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type Role = 'HOMEOWNER' | 'TECHNICIAN' | 'ADMIN' | 'ORGANIZATION_ADMIN';

interface User {
    name: string;
    email: string;
    role: Role;
    token?: string;
}

interface AuthContextType {
    user: User | null;
    role: Role | null;
    token: string | null;
    login: (user: User, token?: string) => void;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const storedUser = localStorage.getItem('ahrn_user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState<string | null>(localStorage.getItem('ahrn_token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Just to signal that initial load is complete
        setLoading(false);
    }, []);

    const login = (newUser: User, newToken?: string) => {
        const userToStore = { ...newUser };
        if (newToken) userToStore.token = newToken;

        setUser(userToStore);
        localStorage.setItem('ahrn_user', JSON.stringify(userToStore));

        if (newToken) {
            setToken(newToken);
            localStorage.setItem('ahrn_token', newToken);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('ahrn_user');
        localStorage.removeItem('ahrn_token');
    };

    return (
        <AuthContext.Provider value={{
            user,
            role: user?.role || null,
            token,
            login,
            logout,
            isAuthenticated: !!user,
            loading
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};

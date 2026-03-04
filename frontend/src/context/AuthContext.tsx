import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface Salon {
    id: string;
    name: string;
    email: string;
    slug: string;
    plan: string;
    createdAt?: string;
}

interface AuthContextType {
    token: string | null;
    salon: Salon | null;
    login: (token: string, salon: Salon) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [salon, setSalon] = useState<Salon | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('salon_token');
        const storedSalon = localStorage.getItem('salon_data');
        if (storedToken && storedSalon) {
            const parsedSalon = JSON.parse(storedSalon);
            if (!parsedSalon.plan) parsedSalon.plan = 'start';
            setToken(storedToken);
            setSalon(parsedSalon);
        }
        setLoading(false);
    }, []);

    const login = (newToken: string, newSalon: Salon) => {
        localStorage.setItem('salon_token', newToken);
        localStorage.setItem('salon_data', JSON.stringify(newSalon));
        setToken(newToken);
        setSalon(newSalon);
    };

    const logout = () => {
        localStorage.removeItem('salon_token');
        localStorage.removeItem('salon_data');
        setToken(null);
        setSalon(null);
    };

    if (loading) return null; // Avoid rendering guarded routes before checking localStorage

    return (
        <AuthContext.Provider value={{ token, salon, login, logout, isAuthenticated: !!token }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

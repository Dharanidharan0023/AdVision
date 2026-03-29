import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const verifyToken = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await api.get('/auth/verify');
            if (res.data.valid) {
                setUser(res.data.user || { username: 'admin' });
            } else {
                localStorage.removeItem('token');
                setUser(null);
            }
        } catch (err) {
            console.error("Token verification failed:", err);
            localStorage.removeItem('token');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        verifyToken();
    }, []);

    const login = async (username, password) => {
        try {
            const res = await api.post('/auth/login', { username, password });
            localStorage.setItem('token', res.data.token);
            setUser(res.data.user || { username });
            return true;
        } catch (err) {
            console.error("Login failed:", err);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

import { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);

                try {
                    const { data } = await api.get('/api/auth/me');
                    const freshUser = { ...parsedUser, ...data };
                    setUser(freshUser);
                    localStorage.setItem('user', JSON.stringify(freshUser));
                } catch (error) {
                    console.error("Session invalid", error);
                    localStorage.removeItem('user');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);

    const googleLogin = async (credential) => {
        const { data } = await api.post('/api/auth/google', { credential });
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
    };

    const updateUser = (newUserData) => {
        setUser(currentUser => {
            const updatedUser = { ...currentUser, ...newUserData };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        });
    };

    return (
        <AuthContext.Provider value={{ user, googleLogin, logout, loading, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

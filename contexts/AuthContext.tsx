import React, { createContext } from 'react';
import { User } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface AuthContextType {
    currentUser: User | null;
    login: (user: User) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    login: () => {},
    logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = usePersistentState<User | null>('nibsoCurrentUser', null);

    const login = (user: User) => {
        setCurrentUser(user);
    };

    const logout = () => {
        setCurrentUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
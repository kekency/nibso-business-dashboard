import React, { createContext, useEffect } from 'react';
import { User } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface UsersContextType {
    users: User[];
    addUser: (user: Omit<User, 'id'>) => void;
    updateUser: (updatedUser: User) => void;
}

export const UsersContext = createContext<UsersContextType>({
    users: [],
    addUser: () => {},
    updateUser: () => {},
});

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [users, setUsers] = usePersistentState<User[]>('nibsoUsers', []);

    useEffect(() => {
        if (users.length === 0) {
            const defaultAdmin: User = {
                id: 'user_admin_default',
                name: 'Admin',
                email: 'admin@nibso.app',
                role: 'Admin',
                password: 'admin',
                passwordLastChanged: new Date().toISOString()
            };
            const defaultAdvisor: User = {
                id: 'user_advisor_default',
                name: 'Dr. Anna Jones',
                email: 'advisor@nibso.app',
                role: 'StudentAdvisor',
                password: 'password',
                passwordLastChanged: new Date().toISOString()
            };
            setUsers([defaultAdmin, defaultAdvisor]);
        }
    }, [users.length, setUsers]);

    const addUser = (user: Omit<User, 'id'>) => {
        const newUser: User = {
            ...user,
            id: `user_${new Date().getTime()}`
        };
        setUsers(prev => [...prev, newUser]);
    };

    const updateUser = (updatedUser: User) => {
        setUsers(prevUsers => {
            const userIndex = prevUsers.findIndex(u => u.id === updatedUser.id);
            if (userIndex !== -1) {
                const newUsers = [...prevUsers];
                newUsers[userIndex] = updatedUser;
                return newUsers;
            }
            return prevUsers;
        });
    };

    return (
        <UsersContext.Provider value={{ users, addUser, updateUser }}>
            {children}
        </UsersContext.Provider>
    );
};
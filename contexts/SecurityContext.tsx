import React, { createContext } from 'react';
import { SecurityEvent } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface SecurityContextType {
    securityEvents: SecurityEvent[];
    logSecurityEvent: (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => void;
}

export const SecurityContext = createContext<SecurityContextType>({
    securityEvents: [],
    logSecurityEvent: () => {},
});

const MAX_EVENTS = 50;

export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [securityEvents, setSecurityEvents] = usePersistentState<SecurityEvent[]>('nibsoSecurityEvents', []);

    const logSecurityEvent = (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => {
        const newEvent: SecurityEvent = {
            ...event,
            id: `sec_${new Date().getTime()}`,
            timestamp: new Date().toLocaleString(),
        };
        setSecurityEvents(prevEvents => [newEvent, ...prevEvents].slice(0, MAX_EVENTS));
    };

    return (
        <SecurityContext.Provider value={{ securityEvents, logSecurityEvent }}>
            {children}
        </SecurityContext.Provider>
    );
};
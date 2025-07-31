import React, { createContext } from 'react';
import { Lease } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface LeaseContextType {
    leases: Lease[];
    addLease: (lease: Omit<Lease, 'id'>) => void;
}

const initialLeases: Lease[] = [
    { id: 'lease1', propertyId: 'prop2', tenantName: 'Tech Solutions Ltd', tenantContact: '080-1234-5678', startDate: '2024-01-01', endDate: '2024-12-31', rentAmount: 5000000, paymentStatus: 'Paid' }
];

export const LeaseContext = createContext<LeaseContextType>({
    leases: [],
    addLease: () => {},
});

export const LeaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [leases, setLeases] = usePersistentState<Lease[]>('nibsoRealEstateLeases', initialLeases);

    const addLease = (lease: Omit<Lease, 'id'>) => {
        const newLease: Lease = {
            ...lease,
            id: `lease_${new Date().getTime()}`,
        };
        setLeases(prev => [newLease, ...prev]);
    };

    return (
        <LeaseContext.Provider value={{ leases, addLease }}>
            {children}
        </LeaseContext.Provider>
    );
};
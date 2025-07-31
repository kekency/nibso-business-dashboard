import React, { createContext } from 'react';
import { BulkSupply } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface BulkSupplyContextType {
    supplies: BulkSupply[];
    addSupply: (supply: Omit<BulkSupply, 'id'>) => void;
}

const initialSupplies: BulkSupply[] = [
    { id: 'bs1', date: '2024-07-25', supplierName: 'LPG Prime', quantityKg: 5000, costPerKg: 450 },
    { id: 'bs2', date: '2024-07-10', supplierName: 'GasLink Inc.', quantityKg: 4500, costPerKg: 455 },
];

export const BulkSupplyContext = createContext<BulkSupplyContextType>({
    supplies: [],
    addSupply: () => {},
});

export const BulkSupplyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [supplies, setSupplies] = usePersistentState<BulkSupply[]>('nibsoLpgSupplies', initialSupplies);

    const addSupply = (supply: Omit<BulkSupply, 'id'>) => {
        const newSupply: BulkSupply = {
            ...supply,
            id: `bs_${new Date().getTime()}`,
        };
        setSupplies(prev => [newSupply, ...prev]);
    };

    return (
        <BulkSupplyContext.Provider value={{ supplies, addSupply }}>
            {children}
        </BulkSupplyContext.Provider>
    );
};
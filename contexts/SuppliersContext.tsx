import React, { createContext } from 'react';
import { Supplier } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface SuppliersContextType {
    suppliers: Supplier[];
    addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
}

const initialSuppliers: Supplier[] = [
    { id: 'sup1', name: 'Global Foods Inc.', contactPerson: 'John Doe', phone: '080-555-0101', email: 'john.d@globalfoods.com' },
    { id: 'sup2', name: 'FarmFresh Produce', contactPerson: 'Jane Smith', phone: '080-555-0102', email: 'jane.s@farmfresh.com' },
    { id: 'sup3', name: 'Beverage Masters', contactPerson: 'Mike Ross', phone: '080-555-0103', email: 'mike.r@beveragemasters.com' },
];

export const SuppliersContext = createContext<SuppliersContextType>({
    suppliers: [],
    addSupplier: () => {},
});

export const SuppliersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [suppliers, setSuppliers] = usePersistentState<Supplier[]>('nibsoSupermarketSuppliers', initialSuppliers);

    const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
        const newSupplier: Supplier = {
            ...supplier,
            id: `sup_${new Date().getTime()}`,
        };
        setSuppliers(prev => [newSupplier, ...prev]);
    };

    return (
        <SuppliersContext.Provider value={{ suppliers, addSupplier }}>
            {children}
        </SuppliersContext.Provider>
    );
};
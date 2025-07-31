import React, { createContext } from 'react';
import { Cylinder } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface CylinderContextType {
    cylinders: Cylinder[];
    addCylinder: (cylinder: Omit<Cylinder, 'id'>) => void;
}

const initialCylinders: Cylinder[] = [
    { id: 'cyl1', size: 12.5, status: 'Full' }, { id: 'cyl2', size: 12.5, status: 'Full' },
    { id: 'cyl3', size: 12.5, status: 'Empty' }, { id: 'cyl4', size: 50, status: 'Full' },
    { id: 'cyl5', size: 3, status: 'Faulty' }, { id: 'cyl6', size: 12.5, status: 'Full' },
    { id: 'cyl7', size: 50, status: 'Empty' },
];

export const CylinderContext = createContext<CylinderContextType>({
    cylinders: [],
    addCylinder: () => {},
});

export const CylinderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cylinders, setCylinders] = usePersistentState<Cylinder[]>('nibsoLpgCylinders', initialCylinders);

    const addCylinder = (cylinder: Omit<Cylinder, 'id'>) => {
        const newCylinder: Cylinder = {
            ...cylinder,
            id: `cyl_${new Date().getTime()}`,
        };
        setCylinders(prev => [newCylinder, ...prev]);
    };

    return (
        <CylinderContext.Provider value={{ cylinders, addCylinder }}>
            {children}
        </CylinderContext.Provider>
    );
};
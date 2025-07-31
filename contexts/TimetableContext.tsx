import React, { createContext } from 'react';
import { TimetableEntry } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface TimetableContextType {
    entries: TimetableEntry[];
    addEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
    updateEntry: (updatedEntry: TimetableEntry) => void;
    deleteEntry: (entryId: string) => void;
}

const initialEntries: TimetableEntry[] = [
    { id: 'tt1', dayOfWeek: 'Monday', timeSlot: '09:00 - 10:00', courseId: 'crs1', className: 'JSS 1' },
    { id: 'tt2', dayOfWeek: 'Monday', timeSlot: '10:00 - 11:00', courseId: 'crs2', className: 'JSS 1' },
    { id: 'tt3', dayOfWeek: 'Tuesday', timeSlot: '09:00 - 10:00', courseId: 'crs3', className: 'JSS 1' },
];

export const TimetableContext = createContext<TimetableContextType>({
    entries: [],
    addEntry: () => {},
    updateEntry: () => {},
    deleteEntry: () => {},
});

export const TimetableProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [entries, setEntries] = usePersistentState<TimetableEntry[]>('nibsoTimetableEntries', initialEntries);

    const addEntry = (entry: Omit<TimetableEntry, 'id'>) => {
        const newEntry: TimetableEntry = { ...entry, id: `tt_${new Date().getTime()}` };
        setEntries(prev => [...prev, newEntry]);
    };

    const updateEntry = (updatedEntry: TimetableEntry) => {
        setEntries(prev => prev.map(e => e.id === updatedEntry.id ? updatedEntry : e));
    };

    const deleteEntry = (entryId: string) => {
        setEntries(prev => prev.filter(e => e.id !== entryId));
    };

    return (
        <TimetableContext.Provider value={{ entries, addEntry, updateEntry, deleteEntry }}>
            {children}
        </TimetableContext.Provider>
    );
};

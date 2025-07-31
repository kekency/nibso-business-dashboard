import React, { createContext } from 'react';
import { Viewing, ViewingStatus } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface ViewingContextType {
    viewings: Viewing[];
    scheduleViewing: (viewing: Omit<Viewing, 'id' | 'status'>) => void;
    updateViewingStatus: (viewingId: string, status: ViewingStatus) => void;
}

const initialViewings: Viewing[] = [
    { id: 'view1', propertyId: 'prop1', clientName: 'Mr. John Smith', clientContact: '090-1111-2222', agentId: 'user_admin_default', date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), status: 'Scheduled' },
];

export const ViewingContext = createContext<ViewingContextType>({
    viewings: [],
    scheduleViewing: () => {},
    updateViewingStatus: () => {},
});

export const ViewingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [viewings, setViewings] = usePersistentState<Viewing[]>('nibsoRealEstateViewings', initialViewings);

    const scheduleViewing = (viewing: Omit<Viewing, 'id' | 'status'>) => {
        const newViewing: Viewing = {
            ...viewing,
            id: `view_${new Date().getTime()}`,
            status: 'Scheduled',
        };
        setViewings(prev => [newViewing, ...prev]);
    };

    const updateViewingStatus = (viewingId: string, status: ViewingStatus) => {
        setViewings(prev =>
            prev.map(v => (v.id === viewingId ? { ...v, status } : v))
        );
    };

    return (
        <ViewingContext.Provider value={{ viewings, scheduleViewing, updateViewingStatus }}>
            {children}
        </ViewingContext.Provider>
    );
};
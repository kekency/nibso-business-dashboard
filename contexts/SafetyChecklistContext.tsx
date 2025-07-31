import React, { createContext } from 'react';
import { SafetyChecklist } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface SafetyChecklistContextType {
    checklists: SafetyChecklist[];
    completeChecklist: (checklistId: string) => void;
}

const initialChecklists: SafetyChecklist[] = [
    { id: 'chk1', name: 'Morning Safety Checks', frequency: 'Daily', tasks: [{id:'t1', description: 'Check for gas leaks via smell test'}, {id:'t2', description: 'Inspect dispenser hoses for cracks'}, {id:'t3', description: 'Ensure "No Smoking" signs are visible'}] },
    { id: 'chk2', name: 'Weekly Equipment Inspection', frequency: 'Weekly', tasks: [{id:'t4', description: 'Test emergency shutdown button'}, {id:'t5', description: 'Verify fire extinguisher pressure gauges'}] },
    { id: 'chk3', name: 'Monthly Maintenance Review', frequency: 'Monthly', tasks: [{id:'t6', description: 'Calibrate weighing scales'}, {id:'t7', description: 'Review security footage for anomalies'}] },
];

export const SafetyChecklistContext = createContext<SafetyChecklistContextType>({
    checklists: [],
    completeChecklist: () => {},
});

export const SafetyChecklistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [checklists, setChecklists] = usePersistentState<SafetyChecklist[]>('nibsoLpgChecklists', initialChecklists);

    const completeChecklist = (checklistId: string) => {
        setChecklists(prev =>
            prev.map(cl =>
                cl.id === checklistId ? { ...cl, lastCompleted: new Date().toISOString() } : cl
            )
        );
    };

    return (
        <SafetyChecklistContext.Provider value={{ checklists, completeChecklist }}>
            {children}
        </SafetyChecklistContext.Provider>
    );
};
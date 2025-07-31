import React, { createContext } from 'react';
import { AttendanceRecord } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface AttendanceContextType {
    attendance: AttendanceRecord[];
    markAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
}

const initialAttendance: AttendanceRecord[] = [
    { id: 'att1', studentId: 'stu1', date: '2024-09-10', status: 'Present' },
    { id: 'att2', studentId: 'stu2', date: '2024-09-10', status: 'Late' },
];

export const AttendanceContext = createContext<AttendanceContextType>({
    attendance: [],
    markAttendance: () => {},
});

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [attendance, setAttendance] = usePersistentState<AttendanceRecord[]>('nibsoEducationAttendance', initialAttendance);

    const markAttendance = (record: Omit<AttendanceRecord, 'id'>) => {
        const newRecord: AttendanceRecord = {
            ...record,
            id: `att_${new Date().getTime()}`,
        };
        setAttendance(prev => [newRecord, ...prev].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

    return (
        <AttendanceContext.Provider value={{ attendance, markAttendance }}>
            {children}
        </AttendanceContext.Provider>
    );
};

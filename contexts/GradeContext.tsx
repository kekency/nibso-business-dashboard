import React, { createContext } from 'react';
import { Grade } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface GradeContextType {
    grades: Grade[];
    addGrade: (grade: Omit<Grade, 'id'>) => void;
}

const initialGrades: Grade[] = [
    { id: 'grd1', studentId: 'stu1', courseId: 'crs1', term: 'First Term 2024/2025', score: 85 },
    { id: 'grd2', studentId: 'stu1', courseId: 'crs2', term: 'First Term 2024/2025', score: 92 },
    { id: 'grd3', studentId: 'stu2', courseId: 'crs1', term: 'First Term 2024/2025', score: 78 },
];

export const GradeContext = createContext<GradeContextType>({
    grades: [],
    addGrade: () => {},
});

export const GradeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [grades, setGrades] = usePersistentState<Grade[]>('nibsoEducationGrades', initialGrades);

    const addGrade = (grade: Omit<Grade, 'id'>) => {
        const newGrade: Grade = {
            ...grade,
            id: `grd_${new Date().getTime()}`,
        };
        setGrades(prev => [newGrade, ...prev]);
    };

    return (
        <GradeContext.Provider value={{ grades, addGrade }}>
            {children}
        </GradeContext.Provider>
    );
};

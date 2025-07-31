import React, { createContext } from 'react';
import { Student } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface StudentContextType {
    students: Student[];
    addStudent: (student: Omit<Student, 'id'>) => void;
    updateStudent: (updatedStudent: Student) => void;
    getStudentById: (id: string) => Student | undefined;
    updateStudentRiskLevel: (studentId: string, riskLevel: Student['riskLevel']) => void;
    updateStudentLastContact: (studentId: string) => void;
}

const initialStudents: Student[] = [
    { id: 'stu1', studentId: 'STU-001', firstName: 'Bade', lastName: 'Williams', dateOfBirth: '2010-02-15', gender: 'Male', className: 'JSS 1', parentName: 'Mr. Williams', parentPhone: '08011112222', parentEmail: 'williams@email.com', address: '10 Freedom Way, Lekki', advisorId: 'user_advisor_default', riskLevel: 'Low', lastContact: new Date(new Date().setDate(new Date().getDate() - 5)).toISOString() },
    { id: 'stu2', studentId: 'STU-002', firstName: 'Chioma', lastName: 'Okafor', dateOfBirth: '2011-07-22', gender: 'Female', className: 'Primary 6', parentName: 'Mrs. Okafor', parentPhone: '08033334444', parentEmail: 'okafor@email.com', address: '5 Unity Close, Ikeja', advisorId: 'user_advisor_default', riskLevel: 'Medium', lastContact: new Date(new Date().setDate(new Date().getDate() - 20)).toISOString() },
];

export const StudentContext = createContext<StudentContextType>({
    students: [],
    addStudent: () => {},
    updateStudent: () => {},
    getStudentById: () => undefined,
    updateStudentRiskLevel: () => {},
    updateStudentLastContact: () => {},
});

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [students, setStudents] = usePersistentState<Student[]>('nibsoEducationStudents', initialStudents);

    const addStudent = (student: Omit<Student, 'id'>) => {
        const newStudent: Student = {
            ...student,
            id: `stu_${new Date().getTime()}`,
            riskLevel: 'None',
        };
        setStudents(prev => [newStudent, ...prev]);
    };

    const updateStudent = (updatedStudent: Student) => {
        setStudents(prevStudents => 
            prevStudents.map(student => 
                student.id === updatedStudent.id ? updatedStudent : student
            )
        );
    };
    
    const updateStudentRiskLevel = (studentId: string, riskLevel: Student['riskLevel']) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, riskLevel } : s));
    };

    const updateStudentLastContact = (studentId: string) => {
        setStudents(prev => prev.map(s => s.id === studentId ? { ...s, lastContact: new Date().toISOString() } : s));
    };

    const getStudentById = (id: string): Student | undefined => {
        return students.find(s => s.id === id);
    };

    return (
        <StudentContext.Provider value={{ students, addStudent, updateStudent, getStudentById, updateStudentRiskLevel, updateStudentLastContact }}>
            {children}
        </StudentContext.Provider>
    );
};
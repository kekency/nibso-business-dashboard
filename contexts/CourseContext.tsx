import React, { createContext, useContext } from 'react';
import { Course, Doctor } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';
import { UsersContext } from './UsersContext';

interface CourseContextType {
    courses: Course[];
    teachers: Doctor[];
    addCourse: (course: Omit<Course, 'id'>) => void;
    getCourseById: (id: string) => Course | undefined;
}

const initialCourses: Course[] = [
    { id: 'crs1', name: 'Mathematics', code: 'MTH101', className: 'JSS 1', teacherId: 'user_admin_default' },
    { id: 'crs2', name: 'English Language', code: 'ENG101', className: 'JSS 1', teacherId: 'user_admin_default' },
    { id: 'crs3', name: 'Basic Science', code: 'SCI101', className: 'Primary 6' },
];

export const CourseContext = createContext<CourseContextType>({
    courses: [],
    teachers: [],
    addCourse: () => {},
    getCourseById: () => undefined,
});

export const CourseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [courses, setCourses] = usePersistentState<Course[]>('nibsoEducationCourses', initialCourses);
    const { users } = useContext(UsersContext);

    // Re-use Doctor type for Teachers
    const teachers: Doctor[] = users
        .filter(user => user.role === 'Teacher')
        .map(user => ({
            id: user.id,
            name: user.name,
            specialty: user.assignedClass || 'Unassigned',
        }));


    const addCourse = (course: Omit<Course, 'id'>) => {
        const newCourse: Course = {
            ...course,
            id: `crs_${new Date().getTime()}`,
        };
        setCourses(prev => [newCourse, ...prev]);
    };

    const getCourseById = (id: string) => {
        return courses.find(c => c.id === id);
    };

    return (
        <CourseContext.Provider value={{ courses, teachers, addCourse, getCourseById }}>
            {children}
        </CourseContext.Provider>
    );
};
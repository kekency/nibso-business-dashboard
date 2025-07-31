import React, { useState, useContext, useMemo } from 'react';
import { Course } from '../types';
import { CourseContext } from '../contexts/CourseContext';
import { StudentContext } from '../contexts/StudentContext';

const CoursesDashboard: React.FC = () => {
    const { courses, teachers, addCourse } = useContext(CourseContext);
    const { students } = useContext(StudentContext);

    const classNames = useMemo(() => [...new Set(students.map(s => s.className))].sort(), [students]);
    
    const [selectedClass, setSelectedClass] = useState(classNames[0] || '');
    const [newCourse, setNewCourse] = useState({ name: '', code: '', teacherId: '', className: selectedClass });

    React.useEffect(() => {
        if (!classNames.includes(selectedClass) && classNames.length > 0) {
            setSelectedClass(classNames[0]);
        }
        setNewCourse(prev => ({ ...prev, className: selectedClass || classNames[0] || '' }));
    }, [selectedClass, classNames]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewCourse({ ...newCourse, [e.target.name]: e.target.value });
    };

    const handleAddCourse = (e: React.FormEvent) => {
        e.preventDefault();
        if (newCourse.name && newCourse.code && newCourse.className) {
            addCourse(newCourse);
            setNewCourse({ name: '', code: '', teacherId: '', className: selectedClass });
        }
    };
    
    const getTeacherName = (teacherId?: string) => {
        if (!teacherId) return <span className="text-yellow-400">Unassigned</span>;
        return teachers.find(t => t.id === teacherId)?.name || 'Unknown Teacher';
    }

    const filteredCourses = useMemo(() => {
        return courses.filter(course => course.className === selectedClass);
    }, [courses, selectedClass]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Course List for:</h2>
                    <select
                        value={selectedClass}
                        onChange={e => setSelectedClass(e.target.value)}
                        className="bg-[var(--input)] text-[var(--text-primary)] p-2 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    >
                        {classNames.length === 0 && <option>No classes found</option>}
                        {classNames.map(name => <option key={name} value={name}>{name}</option>)}
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Course Name</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Course Code</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Assigned Teacher</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCourses.map((course) => (
                                <tr key={course.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-[var(--text-primary)] font-medium">{course.name}</td>
                                    <td className="p-4 text-[var(--text-muted)] font-mono">{course.code}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{getTeacherName(course.teacherId)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Add New Course</h2>
                <form onSubmit={handleAddCourse} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Class</label>
                        <select name="className" value={newCourse.className} onChange={handleInputChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required>
                            <option value="">Select Class</option>
                            {classNames.map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                    </div>
                    <input type="text" name="name" value={newCourse.name} onChange={handleInputChange} placeholder="Course Name (e.g., Mathematics)" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    <input type="text" name="code" value={newCourse.code} onChange={handleInputChange} placeholder="Course Code (e.g., MTH101)" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    <select name="teacherId" value={newCourse.teacherId} onChange={handleInputChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                        <option value="">Assign a Teacher (Optional)</option>
                        {teachers.map(teacher => (
                            <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                        ))}
                    </select>
                    <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md">Add Course</button>
                </form>
            </div>
        </div>
    );
};

export default CoursesDashboard;
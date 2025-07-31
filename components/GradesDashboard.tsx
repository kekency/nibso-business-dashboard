import React, { useState, useContext, useMemo, useEffect } from 'react';
import { Grade } from '../types';
import { GradeContext } from '../contexts/GradeContext';
import { StudentContext } from '../contexts/StudentContext';
import { CourseContext } from '../contexts/CourseContext';
import { AuthContext } from '../contexts/AuthContext';
import { AcademicCalendarContext } from '../contexts/AcademicCalendarContext';

const getScoreClass = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
};

const GradesDashboard: React.FC = () => {
    const { grades, addGrade } = useContext(GradeContext);
    const { students } = useContext(StudentContext);
    const { courses } = useContext(CourseContext);
    const { currentUser } = useContext(AuthContext);
    const { activeTerm } = useContext(AcademicCalendarContext);

    const isTeacher = currentUser?.role === 'Teacher';
    const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'Proprietor';

    const classNames = useMemo(() => [...new Set(students.map(s => s.className))].sort(), [students]);
    
    const [selectedClass, setSelectedClass] = useState(isTeacher ? currentUser?.assignedClass || '' : classNames[0] || '');
    
    useEffect(() => {
        if (!isTeacher && !classNames.includes(selectedClass) && classNames.length > 0) {
            setSelectedClass(classNames[0]);
        }
    }, [selectedClass, classNames, isTeacher]);
    
    const [newGrade, setNewGrade] = useState({ studentId: '', courseId: '', term: '', score: '' });

    useEffect(() => {
        if (activeTerm) {
            setNewGrade(prev => ({...prev, term: activeTerm.name}));
        }
    }, [activeTerm]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewGrade({ ...newGrade, [e.target.name]: e.target.value });
    };

    const handleAddGrade = (e: React.FormEvent) => {
        e.preventDefault();
        const score = parseFloat(newGrade.score);
        if (newGrade.studentId && newGrade.courseId && newGrade.term && !isNaN(score)) {
            addGrade({ ...newGrade, score });
            setNewGrade(prev => ({ ...prev, studentId: '', courseId: '', score: '' }));
        }
    };

    const getStudentName = (studentId: string) => {
        const s = students.find(s => s.id === studentId);
        return s ? `${s.firstName} ${s.lastName}` : 'Unknown';
    };
    const getCourseName = (courseId: string) => courses.find(c => c.id === courseId)?.name || 'Unknown';

    const studentsInSelectedClass = useMemo(() => {
        return students.filter(s => s.className === selectedClass);
    }, [students, selectedClass]);

    const coursesForSelectedClass = useMemo(() => {
        return courses.filter(c => c.className === selectedClass);
    }, [courses, selectedClass]);

    const displayedGrades = useMemo(() => {
        const studentIdsInClass = studentsInSelectedClass.map(s => s.id);
        return grades.filter(g => studentIdsInClass.includes(g.studentId));
    }, [grades, studentsInSelectedClass]);


    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Gradebook</h2>
                    {isAdmin && (
                        <select
                            value={selectedClass}
                            onChange={e => setSelectedClass(e.target.value)}
                            className="bg-[var(--input)] text-[var(--text-primary)] p-2 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        >
                            {classNames.map(name => <option key={name} value={name}>{name}</option>)}
                        </select>
                    )}
                    {isTeacher && <span className="text-lg font-semibold text-[var(--text-muted)]">{currentUser?.assignedClass}</span>}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Student</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Course</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Term</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedGrades.map((grade) => (
                                <tr key={grade.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-[var(--text-primary)] font-medium">{getStudentName(grade.studentId)}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{getCourseName(grade.courseId)}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{grade.term}</td>
                                    <td className={`p-4 text-right font-mono font-bold ${getScoreClass(grade.score)}`}>{grade.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Add New Grade</h2>
                <form onSubmit={handleAddGrade} className="space-y-4">
                    <select name="studentId" value={newGrade.studentId} onChange={handleInputChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required>
                        <option value="">Select Student</option>
                        {studentsInSelectedClass.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                    </select>
                    <select name="courseId" value={newGrade.courseId} onChange={handleInputChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required>
                        <option value="">Select Course</option>
                        {coursesForSelectedClass.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                     <input type="text" name="term" value={newGrade.term} onChange={handleInputChange} placeholder="Term" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    <input type="number" step="0.1" name="score" value={newGrade.score} onChange={handleInputChange} placeholder="Score" min="0" max="100" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md">Add Grade</button>
                </form>
            </div>
        </div>
    );
};

export default GradesDashboard;
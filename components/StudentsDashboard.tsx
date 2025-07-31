import React, { useState, useContext, useMemo } from 'react';
import { Student } from '../types';
import { StudentContext } from '../contexts/StudentContext';
import { AuthContext } from '../contexts/AuthContext';

const StatCard: React.FC<{ title: string; value: string | number; }> = ({ title, value }) => (
    <div className="bg-[var(--card)] backdrop-blur-sm p-4 rounded-xl shadow-lg">
        <h3 className="text-[var(--text-muted)] text-sm font-medium">{title}</h3>
        <p className="text-2xl font-bold text-[var(--text-primary)] mt-1">{value}</p>
    </div>
);

interface StudentsDashboardProps {
    viewStudent: (studentId: string) => void;
}

const StudentsDashboard: React.FC<StudentsDashboardProps> = ({ viewStudent }) => {
    const { students, addStudent } = useContext(StudentContext);
    const { currentUser } = useContext(AuthContext);

    const [searchTerm, setSearchTerm] = useState('');
    const initialFormState = { studentId: '', firstName: '', lastName: '', dateOfBirth: '', gender: 'Other', className: '', parentName: '', parentPhone: '', parentEmail: '', address: '' };
    const [newStudent, setNewStudent] = useState(initialFormState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
    };

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        addStudent(newStudent as Omit<Student, 'id'>);
        setNewStudent(initialFormState);
    };

    const isTeacher = currentUser?.role === 'Teacher';
    
    const studentsToDisplay = useMemo(() => {
        if (isTeacher) {
            if (currentUser?.assignedClass) {
                return students.filter(s => s.className === currentUser.assignedClass);
            }
            return []; // Return empty array if teacher has no class assigned
        }
        return students;
    }, [students, isTeacher, currentUser]);
    
    const filteredStudents = useMemo(() => {
        return studentsToDisplay.filter(p => 
            `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.studentId.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [studentsToDisplay, searchTerm]);

    const groupedStudents = useMemo(() => {
        return filteredStudents.reduce((acc, student) => {
            const className = student.className || 'Uncategorized';
            if (!acc[className]) {
                acc[className] = [];
            }
            acc[className].push(student);
            return acc;
        }, {} as Record<string, Student[]>);
    }, [filteredStudents]);

    const sortedClassNames = useMemo(() => Object.keys(groupedStudents).sort(), [groupedStudents]);

    return (
        <div className="space-y-8">
            {isTeacher && (
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <StatCard title="My Class" value={currentUser.assignedClass || 'N/A'} />
                    <StatCard title="Number of Students" value={filteredStudents.length} />
                 </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">Student Records</h2>
                        <input type="text" placeholder="Search by name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-[var(--input)] text-[var(--text-primary)] p-2 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                    </div>

                    {isTeacher && !currentUser?.assignedClass && (
                        <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-8 text-center text-[var(--text-muted)]">
                            You are not currently assigned to a class. Please contact an administrator.
                        </div>
                    )}
                    
                    {filteredStudents.length === 0 && searchTerm && (
                        <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-8 text-center text-[var(--text-muted)]">
                            No students match your search.
                        </div>
                    )}
                    
                    {filteredStudents.length === 0 && !searchTerm && !isTeacher && (
                         <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-8 text-center text-[var(--text-muted)]">
                            No students have been added yet.
                        </div>
                    )}

                    {sortedClassNames.map((className) => (
                        <details key={className} open className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden group">
                            <summary className="p-4 font-semibold text-[var(--text-primary)] cursor-pointer hover:bg-white/5 flex justify-between items-center transition-colors">
                                <span className="text-lg">{className}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono bg-slate-700 text-slate-200 px-2 py-1 rounded-full">{groupedStudents[className].length} Student{groupedStudents[className].length !== 1 && 's'}</span>
                                    <svg className="w-5 h-5 text-[var(--text-muted)] transition-transform duration-200 group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </summary>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-[var(--border)]/30">
                                        <tr>
                                            <th className="p-4 font-semibold text-[var(--text-muted)]">Student ID</th>
                                            <th className="p-4 font-semibold text-[var(--text-muted)]">Name</th>
                                            <th className="p-4 font-semibold text-[var(--text-muted)]">Parent's Phone</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groupedStudents[className].map((student) => (
                                            <tr key={student.id} onClick={() => viewStudent(student.id)} className="border-t border-[var(--border)] hover:bg-white/5 transition-colors cursor-pointer">
                                                <td className="p-4 text-sky-400 font-mono">{student.studentId}</td>
                                                <td className="p-4 text-[var(--text-primary)] font-medium">{student.firstName} {student.lastName}</td>
                                                <td className="p-4 text-[var(--text-muted)]">{student.parentPhone}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </details>
                    ))}
                </div>
                
                {!isTeacher && (
                    <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Register New Student</h2>
                        <form onSubmit={handleAddStudent} className="space-y-4">
                             <input type="text" name="studentId" value={newStudent.studentId} onChange={handleInputChange} placeholder="Student ID" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                            <div className="flex gap-4">
                                <input type="text" name="firstName" value={newStudent.firstName} onChange={handleInputChange} placeholder="First Name" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                                <input type="text" name="lastName" value={newStudent.lastName} onChange={handleInputChange} placeholder="Last Name" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                            </div>
                            <div className="flex gap-4">
                                <input type="date" name="dateOfBirth" title="Date of Birth" value={newStudent.dateOfBirth} onChange={handleInputChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                                <select name="gender" value={newStudent.gender} onChange={handleInputChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <input type="text" name="className" value={newStudent.className} onChange={handleInputChange} placeholder="Class (e.g., JSS 1)" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                            <input type="text" name="parentName" value={newStudent.parentName} onChange={handleInputChange} placeholder="Parent/Guardian Name" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                            <div className="flex gap-4">
                                <input type="tel" name="parentPhone" value={newStudent.parentPhone} onChange={handleInputChange} placeholder="Parent's Phone" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                                <input type="email" name="parentEmail" value={newStudent.parentEmail} onChange={handleInputChange} placeholder="Parent's Email" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                            </div>
                            <textarea name="address" value={newStudent.address} onChange={handleInputChange} placeholder="Home Address" rows={2} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"></textarea>
                            <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md">Register Student</button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentsDashboard;
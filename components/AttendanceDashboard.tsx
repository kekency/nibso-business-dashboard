import React, { useState, useContext, useMemo } from 'react';
import { AttendanceRecord } from '../types';
import { AttendanceContext } from '../contexts/AttendanceContext';
import { StudentContext } from '../contexts/StudentContext';
import { AuthContext } from '../contexts/AuthContext';

const getStatusClass = (status: AttendanceRecord['status']) => {
    switch (status) {
        case 'Present': return 'bg-green-500/20 text-green-300';
        case 'Late': return 'bg-yellow-500/20 text-yellow-300';
        case 'Absent': return 'bg-red-500/20 text-red-300';
    }
};

const AttendanceDashboard: React.FC = () => {
    const { attendance, markAttendance } = useContext(AttendanceContext);
    const { students } = useContext(StudentContext);
    const { currentUser } = useContext(AuthContext);
    
    const [newRecord, setNewRecord] = useState({ studentId: '', date: new Date().toISOString().split('T')[0], status: 'Present' as AttendanceRecord['status'] });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewRecord({ ...newRecord, [e.target.name]: e.target.value });
    };

    const handleAddRecord = (e: React.FormEvent) => {
        e.preventDefault();
        if (newRecord.studentId && newRecord.date && newRecord.status) {
            markAttendance(newRecord);
            setNewRecord(prev => ({ ...prev, studentId: '' }));
        }
    };

    const getStudentName = (studentId: string) => {
        const s = students.find(s => s.id === studentId);
        return s ? `${s.firstName} ${s.lastName}` : 'Unknown';
    };

    const isTeacher = currentUser?.role === 'Teacher';
    
    const studentsForAttendance = useMemo(() => {
        if (isTeacher) {
            if (currentUser?.assignedClass) {
                return students.filter(s => s.className === currentUser.assignedClass);
            }
            return [];
        }
        return students;
    }, [students, isTeacher, currentUser]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6"><h2 className="text-xl font-semibold text-[var(--text-primary)]">Daily Attendance Log</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Date</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Student</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendance.map((record) => (
                                <tr key={record.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-[var(--text-muted)]">{record.date}</td>
                                    <td className="p-4 text-[var(--text-primary)] font-medium">{getStudentName(record.studentId)}</td>
                                    <td className="p-4"><span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusClass(record.status)}`}>{record.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Mark Attendance</h2>
                <form onSubmit={handleAddRecord} className="space-y-4">
                    <input type="date" name="date" value={newRecord.date} onChange={handleInputChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    <select name="studentId" value={newRecord.studentId} onChange={handleInputChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required>
                        <option value="">Select Student</option>
                        {studentsForAttendance.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                    </select>
                    <select name="status" value={newRecord.status} onChange={handleInputChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                    </select>
                    <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md">Mark</button>
                </form>
            </div>
        </div>
    );
};

export default AttendanceDashboard;
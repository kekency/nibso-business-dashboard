import React, { useContext, useMemo } from 'react';
import { Student, Grade, FeePayment, AttendanceRecord } from '../types';
import { GradeContext } from '../contexts/GradeContext';
import { FeeContext } from '../contexts/FeeContext';
import { AttendanceContext } from '../contexts/AttendanceContext';
import { CourseContext } from '../contexts/CourseContext';
import { BusinessContext } from '../contexts/BusinessContext';
import { LogoutIcon } from './icons/LogoutIcon';

interface StudentReportCardProps {
    student: Student;
    onLogout: () => void;
}

const getScoreClass = (score: number) => {
    if (score >= 70) return 'text-green-500 print-text-primary';
    if (score >= 50) return 'text-yellow-500 print-text-primary';
    return 'text-red-500 print-text-primary';
};

const getFeeStatusClass = (status: FeePayment['status']) => {
    switch (status) {
        case 'Paid': return 'bg-green-500/20 text-green-300';
        case 'Partial': return 'bg-yellow-500/20 text-yellow-300';
        case 'Unpaid': return 'bg-red-500/20 text-red-300';
    }
};

const getAttendanceStatusClass = (status: AttendanceRecord['status']) => {
    switch (status) {
        case 'Present': return 'bg-green-500/20 text-green-300';
        case 'Late': return 'bg-yellow-500/20 text-yellow-300';
        case 'Absent': return 'bg-red-500/20 text-red-300';
    }
};

const StudentReportCard: React.FC<StudentReportCardProps> = ({ student, onLogout }) => {
    const { profile } = useContext(BusinessContext);
    const { grades } = useContext(GradeContext);
    const { payments } = useContext(FeeContext);
    const { attendance } = useContext(AttendanceContext);
    const { getCourseById } = useContext(CourseContext);

    const studentGrades = useMemo(() => grades.filter(g => g.studentId === student.id), [grades, student.id]);
    const studentPayments = useMemo(() => payments.filter(p => p.studentId === student.id), [payments, student.id]);
    const studentAttendance = useMemo(() => attendance.filter(a => a.studentId === student.id), [attendance, student.id]);

    const handlePrint = () => window.print();

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-8">
            <style>{`
                @media print {
                    body {
                        background-color: white !important;
                    }
                    .no-print { display: none !important; }
                    .print-container {
                        max-width: 100% !important;
                        padding: 0 !important;
                    }
                    .print-bg-card { background-color: #f9fafb !important; }
                    .print-text-primary { color: #111827 !important; }
                    .print-text-muted { color: #6b7280 !important; }
                    .print-border { border-color: #e5e7eb !important; }
                }
            `}</style>
            
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[var(--text-primary)] print-text-primary">{profile.businessName}</h1>
                    <p className="text-[var(--text-muted)] print-text-muted">Student Report Card</p>
                </div>
                <div className="flex gap-4 mt-4 sm:mt-0 no-print">
                     <button onClick={handlePrint} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Print</button>
                    <button onClick={onLogout} className="bg-red-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-500 transition-colors flex items-center gap-2">
                        <LogoutIcon />
                        Logout
                    </button>
                </div>
            </header>

             <div className="bg-[var(--card)] print-bg-card p-6 rounded-xl shadow-lg flex items-center gap-6 mb-8 border border-[var(--border)] print-border">
                <div className="w-20 h-20 bg-[var(--primary)] rounded-full flex items-center justify-center text-3xl font-bold text-white flex-shrink-0 no-print">
                    {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-[var(--text-primary)] print-text-primary">{student.firstName} {student.lastName}</h2>
                    <p className="text-sky-400 font-mono print-text-muted">{student.studentId}</p>
                    <p className="text-[var(--text-muted)] print-text-muted">Class: <span className="font-semibold text-[var(--text-primary)] print-text-primary">{student.className}</span></p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Grades */}
                <div className="bg-[var(--card)] print-bg-card rounded-xl shadow-lg overflow-hidden border border-[var(--border)] print-border">
                    <div className="p-6"><h2 className="text-xl font-semibold text-[var(--text-primary)] print-text-primary">Academic Performance</h2></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--border)]/30 print-bg-card">
                                <tr>
                                    <th className="p-4 font-semibold text-[var(--text-muted)] print-text-muted">Course</th>
                                    <th className="p-4 font-semibold text-[var(--text-muted)] print-text-muted">Term</th>
                                    <th className="p-4 font-semibold text-[var(--text-muted)] print-text-muted text-right">Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentGrades.length === 0 ? <tr><td colSpan={3} className="text-center p-8 text-[var(--text-muted)] print-text-muted">No grades recorded for this term.</td></tr> : studentGrades.map((grade) => (
                                    <tr key={grade.id} className="border-b border-[var(--border)] print-border last:border-b-0">
                                        <td className="p-4 text-[var(--text-primary)] print-text-primary font-medium">{getCourseById(grade.courseId)?.name || 'Unknown Course'}</td>
                                        <td className="p-4 text-[var(--text-muted)] print-text-muted">{grade.term}</td>
                                        <td className={`p-4 text-right font-mono font-bold ${getScoreClass(grade.score)}`}>{grade.score}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 no-print">
                    {/* Fees */}
                    <div className="bg-[var(--card)] rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6"><h2 className="text-xl font-semibold text-[var(--text-primary)]">Fee Status</h2></div>
                         <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[var(--border)]/30">
                                    <tr>
                                        <th className="p-4 font-semibold text-[var(--text-muted)]">Term</th>
                                        <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Balance</th>
                                        <th className="p-4 font-semibold text-[var(--text-muted)]">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentPayments.length === 0 ? <tr><td colSpan={3} className="text-center p-8 text-[var(--text-muted)]">No fee records.</td></tr> : studentPayments.map((p) => (
                                        <tr key={p.id} className="border-b border-[var(--border)] last:border-b-0">
                                            <td className="p-4 text-[var(--text-primary)] font-medium">{p.term}</td>
                                            <td className="p-4 text-red-400 text-right font-mono">{profile.currency}{(p.totalAmount - p.amountPaid).toLocaleString()}</td>
                                            <td className="p-4"><span className={`px-2 py-1 text-xs font-bold rounded-full ${getFeeStatusClass(p.status)}`}>{p.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                     {/* Attendance */}
                     <div className="bg-[var(--card)] rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6"><h2 className="text-xl font-semibold text-[var(--text-primary)]">Attendance Summary</h2></div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-[var(--border)]/30">
                                    <tr>
                                        <th className="p-4 font-semibold text-[var(--text-muted)]">Date</th>
                                        <th className="p-4 font-semibold text-[var(--text-muted)]">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentAttendance.length === 0 ? <tr><td colSpan={2} className="text-center p-8 text-[var(--text-muted)]">No attendance records.</td></tr> : studentAttendance.slice(0, 5).map((record) => (
                                        <tr key={record.id} className="border-b border-[var(--border)] last:border-b-0">
                                            <td className="p-4 text-[var(--text-muted)]">{record.date}</td>
                                            <td className="p-4"><span className={`px-2 py-1 text-xs font-bold rounded-full ${getAttendanceStatusClass(record.status)}`}>{record.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentReportCard;

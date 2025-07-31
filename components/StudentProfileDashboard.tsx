import React, { useContext, useMemo, useState } from 'react';
import { Grade, FeePayment, AttendanceRecord, View, User } from '../types';
import { StudentContext } from '../contexts/StudentContext';
import { GradeContext } from '../contexts/GradeContext';
import { FeeContext } from '../contexts/FeeContext';
import { AttendanceContext } from '../contexts/AttendanceContext';
import { CourseContext } from '../contexts/CourseContext';
import { BusinessContext } from '../contexts/BusinessContext';
import { SparklesIcon } from './icons/SparklesIcon';
import { generateStudentSummary } from '../services/geminiService';
import { AuthContext } from '../contexts/AuthContext';
import { UsersContext } from '../contexts/UsersContext';

interface StudentProfileDashboardProps {
    studentId: string;
    onBack: () => void;
    openModal: (view: View, data: any) => void;
}

const getScoreClass = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
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

const InfoCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-[var(--card)] backdrop-blur-sm p-6 rounded-xl shadow-lg">
        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 border-b border-[var(--border)] pb-2">{title}</h3>
        <div className="space-y-3">
            {children}
        </div>
    </div>
);

const StudentProfileDashboard: React.FC<StudentProfileDashboardProps> = ({ studentId, onBack, openModal }) => {
    const { getStudentById } = useContext(StudentContext);
    const { grades } = useContext(GradeContext);
    const { payments } = useContext(FeeContext);
    const { attendance } = useContext(AttendanceContext);
    const { getCourseById, courses } = useContext(CourseContext);
    const { profile } = useContext(BusinessContext);
    const { currentUser } = useContext(AuthContext);
    const { users } = useContext(UsersContext);

    const [summary, setSummary] = useState('');
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
    const [summaryError, setSummaryError] = useState<string | null>(null);

    const student = useMemo(() => getStudentById(studentId), [studentId, getStudentById]);

    const advisor = useMemo(() => {
        if (!student?.advisorId) return null;
        return users.find(u => u.id === student.advisorId);
    }, [student, users]);

    const studentGrades = useMemo(() => grades.filter(g => g.studentId === studentId), [grades, studentId]);
    const studentPayments = useMemo(() => payments.filter(p => p.studentId === studentId), [payments, studentId]);
    const studentAttendance = useMemo(() => attendance.filter(a => a.studentId === studentId), [attendance, studentId]);

    const handleGenerateSummary = async () => {
        if (!student) return;
        setIsGeneratingSummary(true);
        setSummaryError(null);
        setSummary('');

        const result = await generateStudentSummary(
            student,
            studentGrades,
            studentPayments,
            studentAttendance,
            courses,
            profile
        );

        if (result.startsWith('Error:') || result.startsWith('Not enough data')) {
            setSummaryError(result);
        } else {
            setSummary(result);
        }

        setIsGeneratingSummary(false);
    };

    if (!student) {
        return <div className="text-center text-[var(--text-muted)]">Student not found.</div>;
    }

    const canEdit = currentUser?.role === 'Admin' || currentUser?.role === 'Proprietor';

    const InfoRow: React.FC<{ label: string, value?: string }> = ({label, value}) => (
         <div className="grid grid-cols-2 gap-4">
            <span className="text-[var(--text-muted)] font-medium">{label}:</span>
            <span className="text-[var(--text-primary)] text-right">{value || 'N/A'}</span>
        </div>
    );

    return (
        <div className="space-y-8">
            <header className="bg-[var(--card)] backdrop-blur-sm p-6 rounded-xl shadow-lg flex items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-[var(--primary)] rounded-full flex items-center justify-center text-4xl font-bold text-white flex-shrink-0">
                        {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--text-primary)]">{student.firstName} {student.lastName}</h1>
                        <p className="text-sky-400 font-mono">{student.studentId}</p>
                        <p className="text-[var(--text-muted)]">Class: <span className="font-semibold text-[var(--text-primary)]">{student.className}</span></p>
                        {advisor && (
                            <p className="text-[var(--text-muted)] mt-1">Advisor: <span className="font-semibold text-[var(--text-primary)]">{advisor.name}</span></p>
                        )}
                    </div>
                </div>
                 <div className="flex flex-col gap-2 self-start">
                    <button onClick={onBack} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors flex items-center gap-2 justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back
                    </button>
                    {canEdit && (
                         <button onClick={() => openModal(View.EditStudent, { student })} className="bg-[var(--primary)] text-white font-bold py-2 px-4 rounded-lg hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-2 justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /></svg>
                            Edit Profile
                        </button>
                    )}
                 </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <InfoCard title="Personal Details">
                    <InfoRow label="Date of Birth" value={student.dateOfBirth} />
                    <InfoRow label="Gender" value={student.gender} />
                    <InfoRow label="Address" value={student.address} />
                </InfoCard>
                 <InfoCard title="Parent/Guardian Details">
                    <InfoRow label="Name" value={student.parentName} />
                    <InfoRow label="Phone" value={student.parentPhone} />
                    <InfoRow label="Email" value={student.parentEmail} />
                </InfoCard>
                <InfoCard title="Student Portal Login Details">
                    <InfoRow label="Student ID" value={student.studentId} />
                    <InfoRow label="Password" value="Use Date of Birth (YYYY-MM-DD)" />
                    <div className="pt-3 mt-3 border-t border-[var(--border)]">
                         <button onClick={() => openModal(View.PrintLoginSlip, { student, profile })} className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md">Print Login Slip</button>
                    </div>
                </InfoCard>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-[var(--border)] rounded-xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <SparklesIcon className="h-6 w-6 text-[var(--primary)]" />
                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">AI-Powered Performance Summary</h2>
                    </div>
                    <button
                        onClick={handleGenerateSummary}
                        disabled={isGeneratingSummary}
                        className="bg-[var(--primary)] text-white font-bold py-2 px-4 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {isGeneratingSummary ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <>
                                <SparklesIcon className="h-5 w-5" />
                                <span>Generate</span>
                            </>
                        )}
                    </button>
                </div>
                <div className="min-h-[120px] bg-[var(--background)]/80 rounded-lg p-4 flex items-center justify-center">
                    {isGeneratingSummary && <p className="text-[var(--text-muted)]">Generating summary... please wait.</p>}
                    {summaryError && <p className="text-red-400 text-center">{summaryError}</p>}
                    {summary && (
                        <div className="text-[var(--text-muted)] font-sans text-sm w-full">
                           {summary.split('\n').map((line, index) => {
                                line = line.trim();
                                if (line.startsWith('## ')) {
                                    return <h3 key={index} className="text-lg font-semibold text-[var(--text-primary)] mt-3 mb-1">{line.substring(3)}</h3>;
                                }
                                if (line.startsWith('* ') || line.startsWith('- ')) {
                                    return <p key={index} className="ml-4 flex"><span className="mr-2">•</span><span>{line.substring(2)}</span></p>;
                                }
                                if (line) {
                                     return <p key={index} className="mt-2">{line}</p>;
                                }
                                return null;
                            })}
                        </div>
                    )}
                    {!isGeneratingSummary && !summaryError && !summary && <p className="text-[var(--text-muted)] text-center">Click "Generate" to get an AI-powered summary of this student's performance.</p>}
                </div>
            </div>

            {/* Grades */}
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6"><h2 className="text-xl font-semibold text-[var(--text-primary)]">Gradebook</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Course</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Term</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Score</th>
                            </tr>
                        </thead>
                        <tbody>
                             {studentGrades.length === 0 ? <tr><td colSpan={3} className="text-center p-8 text-[var(--text-muted)]">No grades recorded.</td></tr> : studentGrades.map((grade) => (
                                <tr key={grade.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5">
                                    <td className="p-4 text-[var(--text-primary)] font-medium">{getCourseById(grade.courseId)?.name || 'Unknown Course'}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{grade.term}</td>
                                    <td className={`p-4 text-right font-mono font-bold ${getScoreClass(grade.score)}`}>{grade.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
             {/* Fees */}
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6"><h2 className="text-xl font-semibold text-[var(--text-primary)]">Fee Payment History</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Term</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Date</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Amount Paid</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Balance</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                             {studentPayments.length === 0 ? <tr><td colSpan={5} className="text-center p-8 text-[var(--text-muted)]">No fee payments recorded.</td></tr> : studentPayments.map((p) => (
                                <tr key={p.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5">
                                    <td className="p-4 text-[var(--text-primary)] font-medium">{p.term}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{p.date}</td>
                                    <td className="p-4 text-green-400 text-right font-mono">{profile.currency}{p.amountPaid.toLocaleString()}</td>
                                    <td className="p-4 text-red-400 text-right font-mono">{profile.currency}{(p.totalAmount - p.amountPaid).toLocaleString()}</td>
                                    <td className="p-4"><span className={`px-3 py-1 text-xs font-bold rounded-full ${getFeeStatusClass(p.status)}`}>{p.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Attendance */}
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6"><h2 className="text-xl font-semibold text-[var(--text-primary)]">Attendance Log</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Date</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                             {studentAttendance.length === 0 ? <tr><td colSpan={2} className="text-center p-8 text-[var(--text-muted)]">No attendance records.</td></tr> : studentAttendance.map((record) => (
                                <tr key={record.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5">
                                    <td className="p-4 text-[var(--text-muted)]">{record.date}</td>
                                    <td className="p-4"><span className={`px-3 py-1 text-xs font-bold rounded-full ${getAttendanceStatusClass(record.status)}`}>{record.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentProfileDashboard;
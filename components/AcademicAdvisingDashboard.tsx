import React, { useState, useContext, useMemo } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { generateAcademicAdvice } from '../services/geminiService';
import { BusinessContext } from '../contexts/BusinessContext';
import { StudentContext } from '../contexts/StudentContext';
import { CourseContext } from '../contexts/CourseContext';
import { GradeContext } from '../contexts/GradeContext';
import { AcademicAdvisingIcon } from './icons/AcademicAdvisingIcon';
import { AuthContext } from '../contexts/AuthContext';
import { Student } from '../types';
import { timeSince } from '../utils/timeSince';

interface AcademicAdvisingDashboardProps {
    viewStudent: (studentId: string) => void;
}

const getRiskLevelClass = (riskLevel: Student['riskLevel']) => {
    switch (riskLevel) {
        case 'High': return 'bg-red-500/20 text-red-300';
        case 'Medium': return 'bg-yellow-500/20 text-yellow-300';
        case 'Low': return 'bg-green-500/20 text-green-300';
        case 'None':
        default: return 'bg-slate-500/20 text-slate-300';
    }
};

const AcademicAdvisingDashboard: React.FC<AcademicAdvisingDashboardProps> = ({ viewStudent }) => {
    const { profile } = useContext(BusinessContext);
    const { students, updateStudentRiskLevel, updateStudentLastContact } = useContext(StudentContext);
    const { courses } = useContext(CourseContext);
    const { grades } = useContext(GradeContext);
    const { currentUser } = useContext(AuthContext);

    const [query, setQuery] = useState('');
    const [advice, setAdvice] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const isAdvisor = currentUser?.role === 'StudentAdvisor';
    
    const [riskFilter, setRiskFilter] = useState<'All' | Student['riskLevel']>('All');
    const [classFilter, setClassFilter] = useState('All');

    const classNames = useMemo(() => ['All', ...new Set(students.map(s => s.className))].sort(), [students]);

    const myCaseload = useMemo(() => {
        if (!currentUser || !isAdvisor) return [];
        let filteredStudents = students.filter(student => student.advisorId === currentUser.id);
        
        if (riskFilter !== 'All') {
            filteredStudents = filteredStudents.filter(s => (s.riskLevel || 'None') === riskFilter);
        }

        if (classFilter !== 'All') {
            filteredStudents = filteredStudents.filter(s => s.className === classFilter);
        }
        
        return filteredStudents;
    }, [currentUser, students, isAdvisor, riskFilter, classFilter]);

    const examplePrompts = [
        "Which students in JSS 1 are at risk of failing Mathematics (score below 50)?",
        "List the top 3 performing students in English Language.",
        "Suggest a study plan for Bade Williams.",
        "What is the average score for the Basic Science course?"
    ];

    const handleGenerateAdvice = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsGenerating(true);
        setError(null);
        setAdvice('');

        const result = await generateAcademicAdvice(query, students, courses, grades, profile);

        if (result.startsWith('Error:')) {
            setError(result);
        } else {
            setAdvice(result);
        }
        setIsGenerating(false);
    };
    
    const handleExampleClick = (prompt: string) => {
        setQuery(prompt);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {isAdvisor && (
                 <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 border-b border-[var(--border)]">
                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-[var(--text-primary)]">My Student Caseload</h2>
                                <p className="text-[var(--text-muted)]">Managing {myCaseload.length} of {students.filter(s => s.advisorId === currentUser?.id).length} assigned students.</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <select value={riskFilter} onChange={e => setRiskFilter(e.target.value as any)} className="bg-[var(--input)] text-[var(--text-primary)] p-2 rounded-lg border border-[var(--border)]">
                                    <option value="All">All Risk Levels</option>
                                    <option value="High">High Risk</option>
                                    <option value="Medium">Medium Risk</option>
                                    <option value="Low">Low Risk</option>
                                    <option value="None">None</option>
                                </select>
                                <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="bg-[var(--input)] text-[var(--text-primary)] p-2 rounded-lg border border-[var(--border)]">
                                    {classNames.map(name => <option key={name} value={name}>{name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--border)]/30">
                                <tr>
                                    <th className="p-4 font-semibold text-[var(--text-muted)]">Name</th>
                                    <th className="p-4 font-semibold text-[var(--text-muted)]">Class</th>
                                    <th className="p-4 font-semibold text-[var(--text-muted)]">Risk Level</th>
                                    <th className="p-4 font-semibold text-[var(--text-muted)]">Last Contact</th>
                                    <th className="p-4 font-semibold text-[var(--text-muted)] text-center">Quick Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myCaseload.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center p-8 text-[var(--text-muted)]">No students match the current filters.</td></tr>
                                ) : (
                                    myCaseload.map((student) => (
                                        <tr key={student.id} className="border-t border-[var(--border)] hover:bg-white/5 transition-colors">
                                            <td className="p-4 font-medium">
                                                <button onClick={() => viewStudent(student.id)} className="text-[var(--text-primary)] hover:underline text-left">
                                                    {student.firstName} {student.lastName}
                                                    <span className="block text-xs text-sky-400 font-mono">{student.studentId}</span>
                                                </button>
                                            </td>
                                            <td className="p-4 text-[var(--text-muted)]">{student.className}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-xs font-bold rounded-full ${getRiskLevelClass(student.riskLevel || 'None')}`}>
                                                    {student.riskLevel || 'None'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-[var(--text-muted)]">{timeSince(student.lastContact)}</td>
                                            <td className="p-4">
                                                <div className="flex justify-center items-center gap-2">
                                                    <button onClick={() => updateStudentLastContact(student.id)} className="bg-slate-600 hover:bg-slate-500 text-white text-xs font-bold py-1 px-3 rounded-md transition-colors">Log Interaction</button>
                                                    <select 
                                                        value={student.riskLevel || 'None'} 
                                                        onChange={(e) => updateStudentRiskLevel(student.id, e.target.value as Student['riskLevel'])}
                                                        className="bg-slate-600 text-white text-xs font-bold py-1 px-2 rounded-md transition-colors hover:bg-slate-500"
                                                        onClick={e => e.stopPropagation()}
                                                    >
                                                        <option value="None">Set Risk: None</option>
                                                        <option value="Low">Set Risk: Low</option>
                                                        <option value="Medium">Set Risk: Medium</option>
                                                        <option value="High">Set Risk: High</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-[var(--border)] rounded-xl shadow-2xl p-8">
                <div className="flex items-center gap-4 mb-4">
                    <AcademicAdvisingIcon />
                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">AI Academic Advisor</h2>
                </div>
                <p className="text-[var(--text-muted)] mb-6">
                    Ask questions about student performance, identify trends, and get data-driven advice. The AI has access to all student, course, and grade data.
                </p>

                <form onSubmit={handleGenerateAdvice} className="space-y-4">
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="e.g., 'Which students are struggling in Mathematics?'"
                        className="w-full h-28 bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        required
                    />
                    <button
                        type="submit"
                        disabled={isGenerating}
                        className="w-full bg-[var(--primary)] text-white font-bold py-3 px-4 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isGenerating ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            <SparklesIcon className="h-5 w-5" />
                        )}
                        <span>Get Advice</span>
                    </button>
                </form>
                
                <div className="mt-4">
                    <p className="text-xs text-[var(--text-muted)] text-center">Or try an example:</p>
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                        {examplePrompts.map(prompt => (
                             <button 
                                key={prompt} 
                                onClick={() => handleExampleClick(prompt)}
                                className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1 rounded-full transition-colors"
                             >
                                {prompt}
                             </button>
                        ))}
                    </div>
                </div>
            </div>

            {(isGenerating || error || advice) && (
                <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-8">
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Advisor's Response</h3>
                    <div className="min-h-[150px] bg-[var(--background)]/80 rounded-lg p-4 flex items-center justify-center">
                        {isGenerating && <p className="text-[var(--text-muted)]">Thinking...</p>}
                        {error && <p className="text-red-400 text-center">{error}</p>}
                        {advice && (
                            <div className="text-[var(--text-muted)] font-sans text-sm w-full space-y-2">
                                {advice.split('\n').map((line, index) => {
                                    line = line.trim();
                                    if (line.startsWith('## ')) {
                                        return <h3 key={index} className="text-lg font-semibold text-[var(--text-primary)] mt-3 mb-1">{line.substring(3)}</h3>;
                                    }
                                    if (line.startsWith('* ') || line.startsWith('- ')) {
                                        return <p key={index} className="ml-4 flex"><span className="mr-2">•</span><span>{line.substring(2)}</span></p>;
                                    }
                                    if (line) {
                                        const parts = line.split('**');
                                        return <p key={index} className="mt-2">{parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="text-[var(--text-primary)]">{part}</strong> : part)}</p>;
                                    }
                                    return null;
                                })}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AcademicAdvisingDashboard;
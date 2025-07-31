import React, { useState, useContext, useRef, useEffect } from 'react';
import { Student } from '../types';
import { StudentContext } from '../contexts/StudentContext';
import { StudentsIcon } from './icons/StudentsIcon';

interface ResultCheckerLoginProps {
    onLoginSuccess: (student: Student) => void;
    onSwitchToPortal: () => void;
}

const ResultCheckerLogin: React.FC<ResultCheckerLoginProps> = ({ onLoginSuccess, onSwitchToPortal }) => {
    const { students } = useContext(StudentContext);
    const [studentId, setStudentId] = useState('');
    const [dob, setDob] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 550); // Delay to allow for transition
        return () => clearTimeout(timer);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const student = students.find(s => s.studentId.toLowerCase() === studentId.toLowerCase().trim() && s.dateOfBirth === dob);

        if (student) {
            onLoginSuccess(student);
        } else {
            setError('Invalid Student ID or Date of Birth. Please try again.');
        }
    };

    return (
        <>
            <div className="flex justify-center mb-6">
                <div className="bg-[var(--primary)] p-4 rounded-full">
                    <StudentsIcon />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2 text-center">Result Checker</h1>
            <p className="text-[var(--text-muted)] mb-8 text-center">Enter your credentials to view your report card</p>
            
            <form onSubmit={handleLogin} className="space-y-6">
                <div>
                    <label htmlFor="student-id" className="block text-sm font-medium text-[var(--text-muted)] mb-2">Student ID</label>
                    <input
                        ref={inputRef}
                        type="text"
                        id="student-id"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        placeholder="e.g., STU-001"
                        className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--card)] transition-all duration-200"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-[var(--text-muted)] mb-2">Date of Birth</label>
                    <input
                        type="date"
                        id="dob"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--card)] transition-all duration-200"
                        required
                    />
                </div>

                {error && <p className="text-red-400 text-sm text-center">{error}</p>}

                <button
                    type="submit"
                    className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md"
                >
                    Check Result
                </button>
            </form>
            <div className="mt-6 text-center">
                <button
                    onClick={onSwitchToPortal}
                    className="text-sm text-[var(--primary)] hover:underline"
                >
                    Back to Portal
                </button>
            </div>
        </>
    );
};

export default ResultCheckerLogin;
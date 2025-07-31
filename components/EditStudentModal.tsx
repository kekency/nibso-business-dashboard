import React, { useState, useContext, useEffect, useMemo } from 'react';
import { Student, View } from '../types';
import { StudentContext } from '../contexts/StudentContext';
import { SecurityContext } from '../contexts/SecurityContext';
import { AuthContext } from '../contexts/AuthContext';
import { DASHBOARD_TITLE } from '../constants';
import { UsersContext } from '../contexts/UsersContext';

interface EditStudentModalProps {
    student: Student;
    onClose: () => void;
}

const EditStudentModal: React.FC<EditStudentModalProps> = ({ student, onClose }) => {
    const { updateStudent } = useContext(StudentContext);
    const { logSecurityEvent } = useContext(SecurityContext);
    const { currentUser } = useContext(AuthContext);
    const { users } = useContext(UsersContext);

    const [formData, setFormData] = useState<Student>(student);

    const studentAdvisors = useMemo(() => {
        return users.filter(u => u.role === 'StudentAdvisor');
    }, [users]);

    useEffect(() => {
        setFormData(student);
    }, [student]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateStudent(formData);
        if (currentUser) {
            logSecurityEvent({ severity: 'Medium', description: `Student profile for '${formData.firstName} ${formData.lastName}' updated by user '${currentUser.name}'.` });
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto" 
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">{DASHBOARD_TITLE[View.EditStudent]}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} placeholder="Student ID" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                        <input type="text" name="className" value={formData.className} onChange={handleChange} placeholder="Class (e.g., JSS 1)" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                        <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-[var(--text-muted)]">Date of Birth (Password)</label>
                            <input type="date" name="dateOfBirth" title="Date of Birth" value={formData.dateOfBirth} onChange={handleChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                        </div>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] self-end">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                     <h3 className="text-lg font-semibold text-[var(--text-primary)] border-t border-[var(--border)] pt-4 mt-4">Parent/Guardian Info</h3>
                    <input type="text" name="parentName" value={formData.parentName} onChange={handleChange} placeholder="Parent/Guardian Name" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="tel" name="parentPhone" value={formData.parentPhone} onChange={handleChange} placeholder="Parent's Phone" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                        <input type="email" name="parentEmail" value={formData.parentEmail} onChange={handleChange} placeholder="Parent's Email" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                    </div>
                    <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Home Address" rows={2} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"></textarea>
                    
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] border-t border-[var(--border)] pt-4 mt-4">Academic Details</h3>
                     <div>
                        <label className="text-xs text-[var(--text-muted)]">Assign Student Advisor</label>
                        <select 
                            name="advisorId" 
                            value={formData.advisorId || ''} 
                            onChange={handleChange} 
                            className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        >
                            <option value="">No Advisor Assigned</option>
                            {studentAdvisors.map(advisor => (
                                <option key={advisor.id} value={advisor.id}>{advisor.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end gap-4 mt-8 pt-4 border-t border-[var(--border)]">
                        <button type="button" onClick={onClose} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Cancel</button>
                        <button type="submit" className="bg-[var(--primary)] text-white font-bold py-2 px-4 rounded-lg hover:bg-[var(--primary-hover)] transition-colors">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditStudentModal;
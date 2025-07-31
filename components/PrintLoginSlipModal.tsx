import React from 'react';
import { Student, BusinessProfile } from '../types';
import { DashboardIcon } from './icons/DashboardIcon';

interface PrintLoginSlipModalProps {
    student: Student;
    profile: BusinessProfile;
    onClose: () => void;
}

const PrintLoginSlipModal: React.FC<PrintLoginSlipModalProps> = ({ student, profile, onClose }) => {

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <style>{`
                @media print {
                    body {
                        background-color: white !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .no-print { display: none !important; }
                    .printable-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }
                    .print-card {
                        box-shadow: none !important;
                        border: 2px solid #e5e7eb;
                        background-color: white !important;
                        color: black !important;
                    }
                    .print-card h2, .print-card h3, .print-card p {
                        color: black !important;
                    }
                }
            `}</style>

            <div className="printable-area">
                <div 
                    className="bg-[var(--card)] rounded-xl shadow-2xl p-8 w-full max-w-md text-center print-card" 
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex justify-center items-center gap-3 mb-2">
                        {profile.logoUrl ? (
                            <img src={profile.logoUrl} alt="Logo" className="h-10 w-10 object-contain" />
                        ) : (
                             <div className="bg-[var(--primary)] p-2 rounded-md flex-shrink-0">
                                <DashboardIcon />
                             </div>
                        )}
                        <h2 className="text-2xl font-bold text-[var(--text-primary)]">{profile.businessName}</h2>
                    </div>

                    <p className="text-[var(--text-muted)] text-sm mb-6">Student Portal Login Details</p>

                    <div className="bg-[var(--input)] rounded-lg p-6 text-left space-y-4">
                        <div>
                            <p className="text-xs text-[var(--text-muted)]">Student Name</p>
                            <p className="text-lg font-semibold text-[var(--text-primary)]">{student.firstName} {student.lastName}</p>
                        </div>
                         <div>
                            <p className="text-xs text-[var(--text-muted)]">Student ID</p>
                            <p className="text-lg font-mono font-semibold text-[var(--text-primary)]">{student.studentId}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--text-muted)]">Password (Date of Birth)</p>
                            <p className="text-lg font-mono font-semibold text-[var(--text-primary)]">{student.dateOfBirth}</p>
                        </div>
                    </div>
                    
                    <p className="text-xs text-[var(--text-muted)] mt-4">
                        Please visit our portal to check your results. Keep these details safe.
                    </p>

                    <div className="flex justify-center gap-4 mt-8 no-print">
                        <button onClick={onClose} className="bg-slate-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-500 transition-colors">Close</button>
                        <button onClick={handlePrint} className="bg-[var(--primary)] text-white font-bold py-2 px-6 rounded-lg hover:bg-[var(--primary-hover)] transition-colors">Print</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrintLoginSlipModal;

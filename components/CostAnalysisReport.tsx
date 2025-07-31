import React, { useEffect } from 'react';
import { View } from '../types';

interface CostAnalysisReportProps {
    setActiveView: (view: View) => void;
}

const devCostData = [
    { phase: 'Core Architecture & Foundation', hours: '60 - 90 hours', activities: 'Project setup (Vite, TypeScript), component library design, theming, navigation, data contexts, persistent state, build configuration.' },
    { phase: 'User Authentication & Permissions', hours: '30 - 50 hours', activities: 'Secure login/logout for Staff & Students, role-based access control (RBAC), password management, expiry notifications.' },
    { phase: 'General Business Modules', hours: '80 - 120 hours', activities: 'Point of Sale, Sales/Expenses/Inventory/Security Dashboards, Data Import, Business Settings.' },
    { phase: 'Industry-Specific Modules', hours: '100 - 150 hours', activities: 'Specialized dashboards and logic for Education, Hospital, Supermarket, LPG, and Logistics business types.' },
    { phase: 'AI Integration (Gemini API)', hours: '30 - 40 hours', activities: 'Creating `geminiService`, engineering robust prompts for all AI features, handling loading, errors, and offline states.' },
    { phase: 'Quality Assurance & Testing', hours: '40 - 60 hours', activities: 'Manual testing, cross-browser checks, responsiveness, and accessibility.' },
    { phase: 'Project Management & Deployment', hours: '20 - 30 hours', activities: 'Meetings, code reviews, and setting up deployment pipelines.' },
];

const ongoingCostData = [
    { service: 'Maintenance & Support Retainer', cost: '$500 - $2,000+ / month', notes: 'Covers bug fixes, security patches, dependency updates, and minor tweaks.' },
    { service: 'Hosting (Web App)', cost: '$20 - $100 / month', notes: 'Efficient hosting on platforms like Vercel or Netlify. Cost scales with traffic.' },
    { service: 'Google Gemini API Usage', cost: '$10 - $500+ / month', notes: 'Highly variable cost based purely on usage of AI features. Scales with user growth.' },
];

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h2 className="text-2xl font-bold text-[var(--text-primary)] print-text-primary mt-8 mb-4 border-b-2 border-[var(--primary)] pb-2">{children}</h2>
);

const SubHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <h3 className="text-xl font-semibold text-[var(--text-primary)] print-text-primary mt-6 mb-3">{children}</h3>
);

const CostAnalysisReport: React.FC<CostAnalysisReportProps> = ({ setActiveView }) => {

    useEffect(() => {
        document.title = 'Cost Analysis Report - Nibso Dashboard';
    }, []);

    const handlePrint = () => window.print();

    return (
        <div className="max-w-4xl mx-auto">
            <style>{`
                @media print {
                    body { background-color: white !important; }
                    .no-print { display: none !important; }
                    .print-container { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
                    .print-bg-card { background-color: white !important; box-shadow: none !important; border: 1px solid #ddd !important; }
                    .print-text-primary { color: #111827 !important; }
                    .print-text-muted { color: #6b7280 !important; }
                    .print-border { border-color: #e5e7eb !important; }
                    .print-table-header { background-color: #f3f4f6 !important; }
                }
            `}</style>

            <div className="no-print flex justify-between items-center mb-6">
                <button onClick={() => setActiveView(View.Reports)} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Reports
                </button>
                <button onClick={handlePrint} className="bg-[var(--primary)] text-white font-bold py-2 px-4 rounded-lg hover:bg-[var(--primary-hover)] transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                    Print or Save as PDF
                </button>
            </div>

            <div className="bg-[var(--card)] print-bg-card p-8 sm:p-12 rounded-xl shadow-lg print-container">
                <h1 className="text-3xl font-extrabold text-[var(--text-primary)] print-text-primary text-center">App Development Cost Analysis</h1>
                <p className="text-center text-[var(--text-muted)] print-text-muted mb-8">Generated: {new Date().toLocaleDateString()}</p>

                <SectionHeader>1. Initial Development Cost (One-Time)</SectionHeader>
                <p className="text-[var(--text-muted)] print-text-muted">This is the estimated cost to design, build, test, and deploy the application based on its current feature set. It is typically calculated based on person-hours multiplied by a blended hourly rate.</p>

                <SubHeader>Time Breakdown by Phase</SubHeader>
                <div className="overflow-x-auto">
                    <table className="w-full text-left table-auto">
                        <thead className="bg-[var(--border)]/30 print-table-header">
                            <tr>
                                <th className="p-3 font-semibold text-[var(--text-muted)] print-text-muted">Feature / Phase</th>
                                <th className="p-3 font-semibold text-[var(--text-muted)] print-text-muted w-36">Est. Hours</th>
                                <th className="p-3 font-semibold text-[var(--text-muted)] print-text-muted">Key Activities</th>
                            </tr>
                        </thead>
                        <tbody>
                            {devCostData.map((row, index) => (
                                <tr key={index} className="border-b border-[var(--border)] print-border last:border-b-0">
                                    <td className="p-3 text-[var(--text-primary)] print-text-primary font-medium">{row.phase}</td>
                                    <td className="p-3 text-[var(--text-primary)] print-text-primary font-mono">{row.hours}</td>
                                    <td className="p-3 text-[var(--text-muted)] print-text-muted text-sm">{row.activities}</td>
                                </tr>
                            ))}
                            <tr className="bg-[var(--border)]/30 print-table-header">
                                <td className="p-3 text-[var(--text-primary)] print-text-primary font-bold">TOTAL ESTIMATED HOURS</td>
                                <td className="p-3 text-[var(--text-primary)] print-text-primary font-bold font-mono">360 - 540 hours</td>
                                <td className="p-3"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <SubHeader>Total Estimated Initial Cost</SubHeader>
                <p className="text-[var(--text-muted)] print-text-muted mb-4">The final cost varies based on who builds the application. Below is a realistic range based on typical market rates.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[var(--background)] p-4 rounded-lg border border-[var(--border)] print-border">
                        <h4 className="font-bold text-[var(--text-primary)] print-text-primary">Freelance Developer Rate</h4>
                        <p className="text-sm text-[var(--text-muted)] print-text-muted">($75 - $150 / hour)</p>
                        <p className="text-lg font-bold text-[var(--primary)] mt-2">$27,000 - $81,000</p>
                    </div>
                     <div className="bg-[var(--background)] p-4 rounded-lg border border-[var(--border)] print-border">
                        <h4 className="font-bold text-[var(--text-primary)] print-text-primary">Small/Mid-Size Agency Rate</h4>
                        <p className="text-sm text-[var(--text-muted)] print-text-muted">($150 - $250 / hour)</p>
                        <p className="text-lg font-bold text-[var(--primary)] mt-2">$54,000 - $135,000</p>
                    </div>
                </div>
                <div className="text-center bg-[var(--primary-light)]/20 p-4 rounded-lg mt-4 border border-[var(--primary)]/30">
                    <p className="font-bold text-[var(--primary)] text-lg">Realistic Ballpark Estimate (Initial Build): $45,000 - $95,000</p>
                </div>


                <SectionHeader>2. Ongoing Operational Costs (Recurring)</SectionHeader>
                <p className="text-[var(--text-muted)] print-text-muted">A software product requires ongoing investment to keep it running, secure, and up-to-date.</p>
                
                 <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left table-auto">
                        <thead className="bg-[var(--border)]/30 print-table-header">
                            <tr>
                                <th className="p-3 font-semibold text-[var(--text-muted)] print-text-muted">Service</th>
                                <th className="p-3 font-semibold text-[var(--text-muted)] print-text-muted w-48">Est. Monthly Cost</th>
                                <th className="p-3 font-semibold text-[var(--text-muted)] print-text-muted">Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ongoingCostData.map((row, index) => (
                                <tr key={index} className="border-b border-[var(--border)] print-border last:border-b-0">
                                    <td className="p-3 text-[var(--text-primary)] print-text-primary font-medium">{row.service}</td>
                                    <td className="p-3 text-[var(--text-primary)] print-text-primary font-mono">{row.cost}</td>
                                    <td className="p-3 text-[var(--text-muted)] print-text-muted text-sm">{row.notes}</td>
                                </tr>
                            ))}
                             <tr className="bg-[var(--border)]/30 print-table-header">
                                <td className="p-3 text-[var(--text-primary)] print-text-primary font-bold">TOTAL ESTIMATED ONGOING</td>
                                <td className="p-3 text-[var(--text-primary)] print-text-primary font-bold font-mono">$530 - $2,600+ / month</td>
                                <td className="p-3"></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CostAnalysisReport;

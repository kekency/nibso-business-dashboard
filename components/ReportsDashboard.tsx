import React from 'react';
import { Report, View } from '../types';

interface ReportsDashboardProps {
    setActiveView: (view: View) => void;
}

const reportsData: Report[] = [
  { id: 'repCost', name: 'App Development Cost Analysis', date: '2024-08-01', type: 'View', view: View.CostAnalysisReport },
  { id: 'rep1', name: 'Q2 2024 Sales Summary', date: '2024-07-01', type: 'PDF' },
  { id: 'rep2', name: 'Monthly Customer Growth', date: '2024-07-28', type: 'Excel' },
  { id: 'rep3', name: 'Inventory Stock Levels', date: '2024-07-29', type: 'CSV' },
  { id: 'rep4', name: 'Q1 2024 Financials', date: '2024-04-05', type: 'PDF' },
  { id: 'rep5', name: 'Customer Feedback Analysis', date: '2024-06-15', type: 'Excel' },
];

const getTypeClass = (type: Report['type']) => {
    switch (type) {
        case 'PDF': return 'text-red-400';
        case 'Excel': return 'text-green-400';
        case 'CSV': return 'text-sky-400';
        case 'View': return 'text-purple-400';
    }
};

const ActionIcon: React.FC<{ type: Report['type'] }> = ({ type }) => {
    if (type === 'View') {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
        );
    }
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
    );
};


const ReportsDashboard: React.FC<ReportsDashboardProps> = ({ setActiveView }) => {

  const handleAction = (report: Report) => {
    if (report.type === 'View' && report.view) {
        setActiveView(report.view);
    } else {
        // Placeholder for actual download logic
        alert(`Downloading ${report.name}...`);
    }
  }

  return (
    <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
        <div className="p-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Available Reports</h2>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-[var(--border)]/30">
                    <tr>
                        <th className="p-4 font-semibold text-[var(--text-muted)]">Report Name</th>
                        <th className="p-4 font-semibold text-[var(--text-muted)]">Date Generated</th>
                        <th className="p-4 font-semibold text-[var(--text-muted)]">File Type</th>
                        <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {reportsData.map((report) => (
                        <tr key={report.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5 transition-colors">
                            <td className="p-4 text-[var(--text-primary)] font-medium">{report.name}</td>
                            <td className="p-4 text-[var(--text-muted)]">{report.date}</td>
                            <td className={`p-4 font-bold ${getTypeClass(report.type)}`}>{report.type}</td>
                            <td className="p-4 text-right">
                                <button
                                    onClick={() => handleAction(report)}
                                    className="flex items-center justify-center ml-auto bg-[var(--primary)] text-white px-4 py-2 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md disabled:bg-slate-600 disabled:cursor-not-allowed"
                                >
                                    <ActionIcon type={report.type} />
                                    {report.type === 'View' ? 'View Report' : 'Download'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default ReportsDashboard;
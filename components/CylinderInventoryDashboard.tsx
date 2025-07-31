import React, { useContext, useMemo } from 'react';
import { CylinderContext } from '../contexts/CylinderContext';
import { CylinderStatus } from '../types';

const StatusCard: React.FC<{ title: string; value: number; className?: string }> = ({ title, value, className }) => (
    <div className={`p-6 rounded-xl shadow-lg ${className}`}>
        <h3 className="text-slate-200 text-sm font-medium">{title}</h3>
        <p className="text-4xl font-bold text-white mt-2">{value}</p>
    </div>
);

const getStatusClass = (status: CylinderStatus) => {
    switch (status) {
        case 'Full': return 'bg-green-500/20 text-green-300';
        case 'Empty': return 'bg-yellow-500/20 text-yellow-300';
        case 'Faulty': return 'bg-red-500/20 text-red-300';
    }
};

const CylinderInventoryDashboard: React.FC = () => {
    const { cylinders } = useContext(CylinderContext);

    const summary = useMemo(() => {
        return cylinders.reduce((acc, cylinder) => {
            acc.total += 1;
            acc[cylinder.status] = (acc[cylinder.status] || 0) + 1;
            return acc;
        }, { total: 0, Full: 0, Empty: 0, Faulty: 0 });
    }, [cylinders]);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatusCard title="Full Cylinders" value={summary.Full} className="bg-green-600/80" />
                <StatusCard title="Empty Cylinders" value={summary.Empty} className="bg-yellow-600/80" />
                <StatusCard title="Faulty Cylinders" value={summary.Faulty} className="bg-red-600/80" />
            </div>

            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">All Cylinders ({summary.total})</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Cylinder ID</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Size (kg)</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cylinders.map((cylinder) => (
                                <tr key={cylinder.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-[var(--text-muted)] font-mono">{cylinder.id}</td>
                                    <td className="p-4 text-[var(--text-primary)] font-medium">{cylinder.size} kg</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusClass(cylinder.status)}`}>
                                            {cylinder.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default CylinderInventoryDashboard;
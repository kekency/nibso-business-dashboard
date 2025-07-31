import React, { useContext } from 'react';
import { SecurityEvent, BusinessType } from '../types';
import { SecurityContext } from '../contexts/SecurityContext';
import { BusinessContext } from '../contexts/BusinessContext';

const getSeverityClass = (severity: SecurityEvent['severity']) => {
    switch (severity) {
        case 'Critical': return 'bg-red-500 text-white';
        case 'High': return 'bg-orange-500 text-white';
        case 'Medium': return 'bg-yellow-500 text-slate-900';
        case 'Low': return 'bg-sky-500 text-white';
    }
};

const StatusIndicator: React.FC<{ label: string; online: boolean }> = ({ label, online }) => (
    <div className="flex items-center justify-between bg-[var(--card)] backdrop-blur-sm p-4 rounded-lg">
        <span className="font-medium text-[var(--text-primary)]">{label}</span>
        <div className="flex items-center">
            <span className={`mr-2 text-sm font-semibold ${online ? 'text-green-400' : 'text-red-400'}`}>
                {online ? 'Online' : 'Offline'}
            </span>
            <div className={`w-3 h-3 rounded-full ${online ? 'bg-green-400' : 'bg-red-400'}`}></div>
        </div>
    </div>
);

const SecurityDashboard: React.FC = () => {
    const { securityEvents } = useContext(SecurityContext);
    const { profile } = useContext(BusinessContext);
    
    const getSystemStatusIndicators = () => {
        const businessType = profile.businessType || BusinessType.General;
        switch (businessType) {
            case BusinessType.Hospital:
                return (
                    <>
                        <StatusIndicator label="Patient Record System" online={true} />
                        <StatusIndicator label="Appointment Scheduler" online={true} />
                        <StatusIndicator label="Pharmacy API" online={true} />
                        <StatusIndicator label="Lab Results Server" online={false} />
                    </>
                );
            case BusinessType.LPGStation:
                 return (
                    <>
                        <StatusIndicator label="Main Tank Pressure" online={true} />
                        <StatusIndicator label="Dispenser Pumps" online={true} />
                        <StatusIndicator label="Leak Detectors" online={true} />
                        <StatusIndicator label="Emergency Shutdown" online={true} />
                    </>
                );
            case BusinessType.Supermarket:
                 return (
                    <>
                        <StatusIndicator label="Checkout Scanners" online={true} />
                        <StatusIndicator label="Cold Storage Units" online={true} />
                        <StatusIndicator label="CCTV System" online={true} />
                        <StatusIndicator label="Fire Safety System" online={false} />
                    </>
                );
            case BusinessType.RealEstate:
                return (
                   <>
                       <StatusIndicator label="Online Listing Portal" online={true} />
                       <StatusIndicator label="Client Database" online={true} />
                       <StatusIndicator label="Property Access System" online={false} />
                       <StatusIndicator label="Backup Server" online={true} />
                   </>
               );
            case BusinessType.General:
            default:
                 return (
                    <>
                        <StatusIndicator label="Point of Sale System" online={true} />
                        <StatusIndicator label="Security Cameras" online={true} />
                        <StatusIndicator label="Network Connection" online={true} />
                        <StatusIndicator label="Alarm System" online={false} />
                    </>
                );
        }
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {getSystemStatusIndicators()}
            </div>
            
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Recent Security Events</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Timestamp</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Severity</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {securityEvents.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center p-8 text-[var(--text-muted)]">No security events have been logged yet.</td>
                                </tr>
                            )}
                            {securityEvents.map((event) => (
                                <tr key={event.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-[var(--text-muted)] whitespace-nowrap">{event.timestamp}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${getSeverityClass(event.severity)}`}>
                                            {event.severity}
                                        </span>
                                    </td>
                                    <td className="p-4 text-[var(--text-primary)]">{event.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SecurityDashboard;
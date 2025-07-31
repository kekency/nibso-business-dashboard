import React, { useState, useContext } from 'react';
import { AcademicCalendarContext } from '../contexts/AcademicCalendarContext';
import { CalendarIcon } from './icons/CalendarIcon';

const AcademicCalendarDashboard: React.FC = () => {
    const { sessions, addSession, addTerm, activeTermId, setActiveTermId } = useContext(AcademicCalendarContext);
    
    const [newSessionName, setNewSessionName] = useState('');
    const [newTermDetails, setNewTermDetails] = useState({ name: '', startDate: '', endDate: '' });
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

    const handleAddSession = (e: React.FormEvent) => {
        e.preventDefault();
        if (newSessionName.trim()) {
            addSession({ name: newSessionName });
            setNewSessionName('');
        }
    };
    
    const handleAddTerm = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedSessionId && newTermDetails.name && newTermDetails.startDate && newTermDetails.endDate) {
            addTerm(selectedSessionId, newTermDetails);
            setNewTermDetails({ name: '', startDate: '', endDate: '' });
            setSelectedSessionId(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                     {sessions.map(session => (
                        <div key={session.id} className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                             <div className="p-6 flex justify-between items-center bg-[var(--border)]/30">
                                <h3 className="text-xl font-semibold text-[var(--text-primary)]">{session.name}</h3>
                                <button
                                    onClick={() => setSelectedSessionId(session.id)}
                                    className="bg-slate-600 text-white font-bold text-sm py-1 px-3 rounded-lg hover:bg-slate-500 transition-colors"
                                >
                                    + Add Term
                                </button>
                             </div>
                             <div className="p-6 space-y-4">
                                {session.terms.length === 0 && <p className="text-[var(--text-muted)] text-center">No terms created for this session.</p>}
                                {session.terms.map(term => (
                                    <div key={term.id} className="flex items-center justify-between bg-[var(--input)] p-3 rounded-lg">
                                        <label htmlFor={term.id} className="flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                id={term.id}
                                                name="activeTerm"
                                                checked={activeTermId === term.id}
                                                onChange={() => setActiveTermId(term.id)}
                                                className="h-5 w-5 mr-4 text-[var(--primary)] bg-slate-600 border-slate-500 focus:ring-[var(--primary)]"
                                            />
                                            <div>
                                                <p className="font-semibold text-[var(--text-primary)]">{term.name}</p>
                                                <p className="text-xs text-[var(--text-muted)]">{term.startDate} to {term.endDate}</p>
                                            </div>
                                        </label>
                                        {activeTermId === term.id && (
                                            <span className="text-xs font-bold text-green-400 bg-green-500/20 px-2 py-1 rounded-full">ACTIVE</span>
                                        )}
                                    </div>
                                ))}
                             </div>
                        </div>
                     ))}
                </div>

                <div className="space-y-8">
                    <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2"><CalendarIcon/> New Academic Session</h2>
                        <form onSubmit={handleAddSession} className="space-y-4">
                            <input type="text" value={newSessionName} onChange={e => setNewSessionName(e.target.value)} placeholder="e.g., 2025/2026 Session" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                            <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md">Create Session</button>
                        </form>
                    </div>

                    {selectedSessionId && (
                        <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Add Term to "{sessions.find(s=>s.id === selectedSessionId)?.name}"</h2>
                            <form onSubmit={handleAddTerm} className="space-y-4">
                                <input type="text" value={newTermDetails.name} onChange={e => setNewTermDetails(prev => ({...prev, name: e.target.value}))} placeholder="Term Name (e.g., First Term)" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                                <div>
                                    <label className="text-xs text-[var(--text-muted)]">Start Date</label>
                                    <input type="date" value={newTermDetails.startDate} onChange={e => setNewTermDetails(prev => ({...prev, startDate: e.target.value}))} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                                </div>
                                <div>
                                    <label className="text-xs text-[var(--text-muted)]">End Date</label>
                                    <input type="date" value={newTermDetails.endDate} onChange={e => setNewTermDetails(prev => ({...prev, endDate: e.target.value}))} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                                </div>
                                <div className="flex gap-2">
                                    <button type="button" onClick={() => setSelectedSessionId(null)} className="w-full bg-slate-600 text-white font-bold p-3 rounded-lg hover:bg-slate-500">Cancel</button>
                                    <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)]">Add Term</button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AcademicCalendarDashboard;

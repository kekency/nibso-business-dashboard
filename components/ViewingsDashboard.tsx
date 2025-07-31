import React, { useState, useContext } from 'react';
import { Viewing, ViewingStatus } from '../types';
import { ViewingContext } from '../contexts/ViewingContext';
import { PropertyContext } from '../contexts/PropertyContext';
import { UsersContext } from '../contexts/UsersContext';

const getStatusClass = (status: ViewingStatus) => {
    switch (status) {
        case 'Scheduled': return 'bg-sky-500/20 text-sky-300';
        case 'Completed': return 'bg-green-500/20 text-green-300';
        case 'Cancelled': return 'bg-red-500/20 text-red-300';
    }
};

const ViewingsDashboard: React.FC = () => {
    const { viewings, scheduleViewing, updateViewingStatus } = useContext(ViewingContext);
    const { properties } = useContext(PropertyContext);
    const { users } = useContext(UsersContext);

    const initialFormState = { propertyId: '', clientName: '', clientContact: '', agentId: '', date: '' };
    const [newViewing, setNewViewing] = useState(initialFormState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewViewing({ ...newViewing, [e.target.name]: e.target.value });
    };

    const handleAddViewing = (e: React.FormEvent) => {
        e.preventDefault();
        const viewingData = { ...newViewing, date: new Date(newViewing.date).toISOString() };
        scheduleViewing(viewingData);
        setNewViewing(initialFormState);
    };

    const getPropertyTitle = (propertyId: string) => properties.find(p => p.id === propertyId)?.title || 'Unknown';
    const getAgentName = (agentId: string) => users.find(u => u.id === agentId)?.name || 'Unknown';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6"><h2 className="text-xl font-semibold text-[var(--text-primary)]">Scheduled Viewings</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Date & Time</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Property</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Client</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Agent</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Status</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {viewings.map((view) => (
                                <tr key={view.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5">
                                    <td className="p-4 text-[var(--text-muted)]">{new Date(view.date).toLocaleString()}</td>
                                    <td className="p-4 text-[var(--text-primary)] font-medium">{getPropertyTitle(view.propertyId)}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{view.clientName}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{getAgentName(view.agentId)}</td>
                                    <td className="p-4"><span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusClass(view.status)}`}>{view.status}</span></td>
                                    <td className="p-4 text-center space-x-2">
                                        <button onClick={() => updateViewingStatus(view.id, 'Completed')} className="text-green-400 hover:underline text-sm" disabled={view.status === 'Completed'}>Complete</button>
                                        <button onClick={() => updateViewingStatus(view.id, 'Cancelled')} className="text-red-400 hover:underline text-sm" disabled={view.status === 'Cancelled'}>Cancel</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Schedule a Viewing</h2>
                <form onSubmit={handleAddViewing} className="space-y-4">
                    <select name="propertyId" value={newViewing.propertyId} onChange={handleInputChange} className="w-full bg-[var(--input)] p-3 rounded-lg border border-[var(--border)]" required>
                        <option value="">Select Property</option>
                        {properties.filter(p=>p.status === 'Available').map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                    <input type="text" name="clientName" value={newViewing.clientName} onChange={handleInputChange} placeholder="Client Name" className="w-full bg-[var(--input)] p-3 rounded-lg border border-[var(--border)]" required />
                    <input type="text" name="clientContact" value={newViewing.clientContact} onChange={handleInputChange} placeholder="Client Contact" className="w-full bg-[var(--input)] p-3 rounded-lg border border-[var(--border)]" required />
                    <select name="agentId" value={newViewing.agentId} onChange={handleInputChange} className="w-full bg-[var(--input)] p-3 rounded-lg border border-[var(--border)]" required>
                        <option value="">Assign Agent</option>
                        {users.filter(u => u.role === 'Manager' || u.role === 'Admin').map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                    </select>
                    <input type="datetime-local" name="date" value={newViewing.date} onChange={handleInputChange} className="w-full bg-[var(--input)] p-3 rounded-lg border border-[var(--border)]" required />
                    <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)]">Schedule</button>
                </form>
            </div>
        </div>
    );
};

export default ViewingsDashboard;
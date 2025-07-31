import React, { useState, useContext } from 'react';
import { Lease } from '../types';
import { LeaseContext } from '../contexts/LeaseContext';
import { PropertyContext } from '../contexts/PropertyContext';
import { BusinessContext } from '../contexts/BusinessContext';

const getStatusClass = (status: Lease['paymentStatus']) => {
    switch (status) {
        case 'Paid': return 'bg-green-500/20 text-green-300';
        case 'Due': return 'bg-yellow-500/20 text-yellow-300';
        case 'Overdue': return 'bg-red-500/20 text-red-300';
    }
};

const LeasesDashboard: React.FC = () => {
    const { leases, addLease } = useContext(LeaseContext);
    const { properties } = useContext(PropertyContext);
    const { profile } = useContext(BusinessContext);

    const initialFormState = { propertyId: '', tenantName: '', tenantContact: '', startDate: '', endDate: '', rentAmount: '', paymentStatus: 'Due' };
    const [newLease, setNewLease] = useState(initialFormState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewLease({ ...newLease, [e.target.name]: e.target.value });
    };

    const handleAddLease = (e: React.FormEvent) => {
        e.preventDefault();
        const leaseData = {
            ...newLease,
            rentAmount: parseFloat(newLease.rentAmount),
        };
        addLease(leaseData as Omit<Lease, 'id'>);
        setNewLease(initialFormState);
    };

    const getPropertyTitle = (propertyId: string) => {
        return properties.find(p => p.id === propertyId)?.title || 'Unknown Property';
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Lease Agreements</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Property</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Tenant</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Term</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Rent</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leases.map((lease) => (
                                <tr key={lease.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5">
                                    <td className="p-4 text-[var(--text-primary)] font-medium">{getPropertyTitle(lease.propertyId)}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{lease.tenantName}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{lease.startDate} to {lease.endDate}</td>
                                    <td className="p-4 text-right font-mono text-green-400">{profile.currency}{lease.rentAmount.toLocaleString()}</td>
                                    <td className="p-4"><span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusClass(lease.paymentStatus)}`}>{lease.paymentStatus}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Create New Lease</h2>
                <form onSubmit={handleAddLease} className="space-y-4">
                    <select name="propertyId" value={newLease.propertyId} onChange={handleInputChange} className="w-full bg-[var(--input)] p-3 rounded-lg border border-[var(--border)]" required>
                        <option value="">Select Property</option>
                        {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    </select>
                    <input type="text" name="tenantName" value={newLease.tenantName} onChange={handleInputChange} placeholder="Tenant Name" className="w-full bg-[var(--input)] p-3 rounded-lg border border-[var(--border)]" required />
                    <input type="text" name="tenantContact" value={newLease.tenantContact} onChange={handleInputChange} placeholder="Tenant Contact" className="w-full bg-[var(--input)] p-3 rounded-lg border border-[var(--border)]" required />
                    <div className="flex gap-4">
                        <div><label className="text-xs text-[var(--text-muted)]">Start Date</label><input type="date" name="startDate" value={newLease.startDate} onChange={handleInputChange} className="w-full bg-[var(--input)] p-3 rounded-lg border border-[var(--border)]" required /></div>
                        <div><label className="text-xs text-[var(--text-muted)]">End Date</label><input type="date" name="endDate" value={newLease.endDate} onChange={handleInputChange} className="w-full bg-[var(--input)] p-3 rounded-lg border border-[var(--border)]" required /></div>
                    </div>
                    <input type="number" name="rentAmount" value={newLease.rentAmount} onChange={handleInputChange} placeholder="Rent Amount" className="w-full bg-[var(--input)] p-3 rounded-lg border border-[var(--border)]" required />
                    <select name="paymentStatus" value={newLease.paymentStatus} onChange={handleInputChange} className="w-full bg-[var(--input)] p-3 rounded-lg border border-[var(--border)]">
                        <option>Due</option><option>Paid</option><option>Overdue</option>
                    </select>
                    <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)]">Create Lease</button>
                </form>
            </div>
        </div>
    );
};

export default LeasesDashboard;
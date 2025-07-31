import React, { useState, useContext } from 'react';
import { LoyaltyMember } from '../types';
import { LoyaltyContext } from '../contexts/LoyaltyContext';

const LoyaltyDashboard: React.FC = () => {
    const { loyaltyMembers, addMember } = useContext(LoyaltyContext);
    const [newMember, setNewMember] = useState({ name: '', phone: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMember({ ...newMember, [e.target.name]: e.target.value });
    };

    const handleAddMember = (e: React.FormEvent) => {
        e.preventDefault();
        addMember(newMember);
        setNewMember({ name: '', phone: '' });
    };

    const filteredMembers = loyaltyMembers.filter(m =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.phone.includes(searchTerm)
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Loyalty Members</h2>
                    <input type="text" placeholder="Search by name or phone..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-[var(--input)] text-[var(--text-primary)] p-2 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Name</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Phone</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Points</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredMembers.map((member) => (
                                <tr key={member.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-[var(--text-primary)] font-medium">{member.name}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{member.phone}</td>
                                    <td className="p-4 text-yellow-400 text-right font-mono font-bold">{member.points.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Register New Member</h2>
                <form onSubmit={handleAddMember} className="space-y-4">
                    <input type="text" name="name" value={newMember.name} onChange={handleInputChange} placeholder="Full Name" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    <input type="tel" name="phone" value={newMember.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md">Register Member</button>
                </form>
            </div>
        </div>
    );
};

export default LoyaltyDashboard;
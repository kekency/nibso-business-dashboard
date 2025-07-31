import React, { useState, useContext, useMemo } from 'react';
import { FeePayment } from '../types';
import { FeeContext } from '../contexts/FeeContext';
import { StudentContext } from '../contexts/StudentContext';
import { BusinessContext } from '../contexts/BusinessContext';

const getStatusClass = (status: FeePayment['status']) => {
    switch (status) {
        case 'Paid': return 'bg-green-500/20 text-green-300';
        case 'Partial': return 'bg-yellow-500/20 text-yellow-300';
        case 'Unpaid': return 'bg-red-500/20 text-red-300';
    }
};

const FeesDashboard: React.FC = () => {
    const { payments, logPayment } = useContext(FeeContext);
    const { students } = useContext(StudentContext);
    const { profile } = useContext(BusinessContext);
    
    const [newPayment, setNewPayment] = useState({ studentId: '', amountPaid: '', totalAmount: '', term: 'First Term 2024/2025' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewPayment({ ...newPayment, [e.target.name]: e.target.value });
    };

    const handleAddPayment = (e: React.FormEvent) => {
        e.preventDefault();
        const amountPaid = parseFloat(newPayment.amountPaid);
        const totalAmount = parseFloat(newPayment.totalAmount);
        if (newPayment.studentId && newPayment.term && !isNaN(amountPaid) && !isNaN(totalAmount)) {
            let status: FeePayment['status'] = 'Unpaid';
            if (amountPaid >= totalAmount) status = 'Paid';
            else if (amountPaid > 0) status = 'Partial';

            logPayment({ 
                ...newPayment, 
                amountPaid,
                totalAmount,
                date: new Date().toISOString().split('T')[0],
                status,
            });
            setNewPayment(prev => ({ ...prev, studentId: '', amountPaid: '', totalAmount: '' }));
        }
    };

    const getStudentName = (studentId: string) => {
        const s = students.find(s => s.id === studentId);
        return s ? `${s.firstName} ${s.lastName}` : 'Unknown';
    };

    const totalRevenue = useMemo(() => payments.reduce((acc, p) => acc + p.amountPaid, 0), [payments]);
    const outstandingFees = useMemo(() => payments.reduce((acc, p) => acc + (p.totalAmount - p.amountPaid), 0), [payments]);


    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[var(--card)] backdrop-blur-sm p-6 rounded-xl shadow-lg">
                    <h3 className="text-[var(--text-muted)] text-sm font-medium">Total Revenue Collected</h3>
                    <p className="text-3xl font-bold text-green-400 mt-2">{profile.currency}{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                 <div className="bg-[var(--card)] backdrop-blur-sm p-6 rounded-xl shadow-lg">
                    <h3 className="text-[var(--text-muted)] text-sm font-medium">Total Outstanding Fees</h3>
                    <p className="text-3xl font-bold text-red-400 mt-2">{profile.currency}{outstandingFees.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6"><h2 className="text-xl font-semibold text-[var(--text-primary)]">Fee Payment Log</h2></div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[var(--border)]/30">
                                <tr>
                                    <th className="p-4 font-semibold text-[var(--text-muted)]">Student</th>
                                    <th className="p-4 font-semibold text-[var(--text-muted)]">Term</th>
                                    <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Amount Paid</th>
                                    <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Balance</th>
                                    <th className="p-4 font-semibold text-[var(--text-muted)]">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.map((p) => (
                                    <tr key={p.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-[var(--text-primary)] font-medium">{getStudentName(p.studentId)}</td>
                                        <td className="p-4 text-[var(--text-muted)]">{p.term}</td>
                                        <td className="p-4 text-green-400 text-right font-mono">{profile.currency}{p.amountPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="p-4 text-red-400 text-right font-mono">{profile.currency}{(p.totalAmount - p.amountPaid).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                        <td className="p-4"><span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusClass(p.status)}`}>{p.status}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Log New Payment</h2>
                    <form onSubmit={handleAddPayment} className="space-y-4">
                        <select name="studentId" value={newPayment.studentId} onChange={handleInputChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required>
                            <option value="">Select Student</option>
                            {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
                        </select>
                        <input type="text" name="term" value={newPayment.term} onChange={handleInputChange} placeholder="Term (e.g., First Term 2024/2025)" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                        <div className="flex gap-4">
                            <input type="number" step="0.01" name="totalAmount" value={newPayment.totalAmount} onChange={handleInputChange} placeholder="Total Due" className="w-1/2 bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                            <input type="number" step="0.01" name="amountPaid" value={newPayment.amountPaid} onChange={handleInputChange} placeholder="Amount Paid" className="w-1/2 bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                        </div>
                        <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md">Log Payment</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FeesDashboard;
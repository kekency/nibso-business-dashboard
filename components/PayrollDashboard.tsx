import React, { useState, useContext, useMemo } from 'react';
import { PayrollRecord } from '../types';
import { BusinessContext } from '../contexts/BusinessContext';
import { UsersContext } from '../contexts/UsersContext';
import { PayrollContext } from '../contexts/PayrollContext';

const getStatusClass = (status: PayrollRecord['status']) => {
    switch (status) {
        case 'Paid': return 'bg-green-500/20 text-green-300';
        case 'Partial': return 'bg-yellow-500/20 text-yellow-300';
        case 'Unpaid': return 'bg-red-500/20 text-red-300';
    }
};

const PayrollDashboard: React.FC = () => {
    const { profile } = useContext(BusinessContext);
    const { users } = useContext(UsersContext);
    const { payrollHistory, logPayment } = useContext(PayrollContext);
    
    const staff = useMemo(() => users.filter(u => u.role === 'Teacher' || u.role === 'Non-Teaching'), [users]);
    const [month, setMonth] = useState(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`);
    const [payments, setPayments] = useState<Record<string, string>>({});

    const handlePaymentChange = (userId: string, amount: string) => {
        setPayments(prev => ({...prev, [userId]: amount}));
    };

    const handlePay = (userId: string) => {
        const user = users.find(u => u.id === userId);
        const amountPaid = parseFloat(payments[userId] || '0');
        const amountDue = user?.salary || 0;
        
        if (!user || isNaN(amountPaid) || !amountDue) return;

        let status: PayrollRecord['status'] = 'Unpaid';
        if (amountPaid >= amountDue) status = 'Paid';
        else if (amountPaid > 0) status = 'Partial';
        
        const monthDate = new Date(month);
        const monthString = monthDate.toLocaleString('default', { month: 'long', year: 'numeric' });

        logPayment({
            userId,
            userName: user.name,
            month: monthString,
            amountDue,
            amountPaid,
            paymentDate: new Date().toISOString().split('T')[0],
            status,
        });
        setPayments(prev => ({...prev, [userId]: ''}));
    };
    
    return (
        <div className="space-y-8">
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Process Payroll for:</h2>
                     <input type="month" value={month} onChange={e => setMonth(e.target.value)} className="bg-[var(--input)] text-[var(--text-primary)] p-2 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"/>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Staff Name</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Role</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Salary Due</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-center">Amount to Pay</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.map((user) => (
                                <tr key={user.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-[var(--text-primary)] font-medium">{user.name}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{user.role}</td>
                                    <td className="p-4 text-right font-mono text-[var(--text-muted)]">{profile.currency}{(user.salary || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="p-4 text-center">
                                        <div className="flex justify-center items-center gap-2">
                                            <input type="number" placeholder="Enter amount" value={payments[user.id] || ''} onChange={e => handlePaymentChange(user.id, e.target.value)} className="bg-[var(--input)] text-[var(--text-primary)] p-2 rounded-lg w-36 text-right" />
                                            <button onClick={() => handlePay(user.id)} disabled={!user.salary || !payments[user.id]} className="bg-[var(--primary)] text-white font-bold px-4 py-2 rounded-lg hover:bg-[var(--primary-hover)] disabled:bg-slate-600 disabled:cursor-not-allowed">Pay</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                 <div className="p-6"><h2 className="text-xl font-semibold text-[var(--text-primary)]">Payment History</h2></div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Date</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Staff Name</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Month</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Amount Paid</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payrollHistory.map(record => (
                                 <tr key={record.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-[var(--text-muted)]">{record.paymentDate}</td>
                                    <td className="p-4 text-[var(--text-primary)] font-medium">{record.userName}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{record.month}</td>
                                    <td className="p-4 text-right font-mono text-green-400">{profile.currency}{record.amountPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                    <td className="p-4"><span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusClass(record.status)}`}>{record.status}</span></td>
                                 </tr>
                            ))}
                             {payrollHistory.length === 0 && (
                                <tr><td colSpan={5} className="text-center p-8 text-[var(--text-muted)]">No payment history found.</td></tr>
                            )}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
};

export default PayrollDashboard;
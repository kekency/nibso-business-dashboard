import React, { useState, useContext } from 'react';
import { DailySaleRecord } from '../types';
import { BusinessContext } from '../contexts/BusinessContext';
import { SalesContext } from '../contexts/SalesContext';

const DailySalesDashboard: React.FC = () => {
    const { sales, recordTransaction } = useContext(SalesContext);
    const [newSale, setNewSale] = useState({ date: new Date().toISOString().split('T')[0], revenue: '', transactions: '' });
    const { profile } = useContext(BusinessContext);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewSale(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSale = (e: React.FormEvent) => {
        e.preventDefault();
        const revenue = parseFloat(newSale.revenue);
        const transactions = parseInt(newSale.transactions, 10);
        if (newSale.date && !isNaN(revenue) && !isNaN(transactions)) {
            recordTransaction(revenue, transactions, [], newSale.date);
            setNewSale({ date: new Date().toISOString().split('T')[0], revenue: '', transactions: '' });
        }
    };
    
    const sortedSales = [...sales].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6"><h2 className="text-xl font-semibold text-[var(--text-primary)]">Daily Sales Log</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Date</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Transactions</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedSales.map((sale) => (
                                <tr key={sale.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-[var(--text-primary)] font-medium">{sale.date}</td>
                                    <td className="p-4 text-[var(--text-primary)] text-right font-mono">{sale.transactions}</td>
                                    <td className="p-4 text-[var(--primary)] text-right font-mono">{profile.currency}{sale.revenue.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Log Manual Sale</h2>
                <form onSubmit={handleAddSale} className="space-y-4">
                    <input type="date" name="date" value={newSale.date} onChange={handleInputChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    <input type="number" step="0.01" name="revenue" value={newSale.revenue} onChange={handleInputChange} placeholder="Total Revenue" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    <input type="number" name="transactions" value={newSale.transactions} onChange={handleInputChange} placeholder="Number of Transactions" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md">Log Sale</button>
                </form>
            </div>
        </div>
    );
};

export default DailySalesDashboard;
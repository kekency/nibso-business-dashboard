import React, { useState, useContext } from 'react';
import { Expense } from '../types';
import { BusinessContext } from '../contexts/BusinessContext';
import { ExpensesContext } from '../contexts/ExpensesContext';

const ExpensesDashboard: React.FC = () => {
    const { expenses, addExpense } = useContext(ExpensesContext);
    const [newExpense, setNewExpense] = useState({ date: new Date().toISOString().split('T')[0], description: '', category: '', amount: '' });
    const { profile } = useContext(BusinessContext);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewExpense(prev => ({ ...prev, [name]: value }));
    };

    const handleAddExpense = (e: React.FormEvent) => {
        e.preventDefault();
        if (newExpense.date && newExpense.description && newExpense.category && newExpense.amount) {
            const newExpenseData: Omit<Expense, 'id'> = {
                date: newExpense.date,
                description: newExpense.description,
                category: newExpense.category,
                amount: parseFloat(newExpense.amount),
            };
            addExpense(newExpenseData);
            setNewExpense({ date: new Date().toISOString().split('T')[0], description: '', category: '', amount: '' });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6"><h2 className="text-xl font-semibold text-[var(--text-primary)]">Expenses Log</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Date</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Description</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Category</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-[var(--text-muted)] whitespace-nowrap">{expense.date}</td>
                                    <td className="p-4 text-[var(--text-primary)] font-medium">{expense.description}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{expense.category}</td>
                                    <td className="p-4 text-red-400 text-right font-mono">{profile.currency}{expense.amount.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Add New Expense</h2>
                <form onSubmit={handleAddExpense} className="space-y-4">
                    <input type="text" name="description" value={newExpense.description} onChange={handleInputChange} placeholder="Expense Description" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    <div className="flex gap-4">
                        <input type="text" name="category" value={newExpense.category} onChange={handleInputChange} placeholder="Category (e.g., Rent)" className="w-1/2 bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                        <input type="number" step="0.01" name="amount" value={newExpense.amount} onChange={handleInputChange} placeholder="Amount" className="w-1/2 bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    </div>
                    <input type="date" name="date" value={newExpense.date} onChange={handleInputChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md">Add Expense</button>
                </form>
            </div>
        </div>
    );
};

export default ExpensesDashboard;
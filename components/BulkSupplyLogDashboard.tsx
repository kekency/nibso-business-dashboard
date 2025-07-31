import React, { useState, useContext } from 'react';
import { BulkSupply } from '../types';
import { BulkSupplyContext } from '../contexts/BulkSupplyContext';
import { BusinessContext } from '../contexts/BusinessContext';

const BulkSupplyLogDashboard: React.FC = () => {
    const { supplies, addSupply } = useContext(BulkSupplyContext);
    const { profile } = useContext(BusinessContext);
    const [newSupply, setNewSupply] = useState({ date: new Date().toISOString().split('T')[0], supplierName: '', quantityKg: '', costPerKg: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewSupply({ ...newSupply, [e.target.name]: e.target.value });
    };

    const handleAddSupply = (e: React.FormEvent) => {
        e.preventDefault();
        const quantityKg = parseFloat(newSupply.quantityKg);
        const costPerKg = parseFloat(newSupply.costPerKg);

        if (newSupply.date && newSupply.supplierName && !isNaN(quantityKg) && !isNaN(costPerKg)) {
            addSupply({ ...newSupply, quantityKg, costPerKg });
            setNewSupply({ date: new Date().toISOString().split('T')[0], supplierName: '', quantityKg: '', costPerKg: '' });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6"><h2 className="text-xl font-semibold text-[var(--text-primary)]">Bulk Supply History</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Date</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Supplier</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Quantity (kg)</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Cost/kg</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Total Cost</th>
                            </tr>
                        </thead>
                        <tbody>
                            {supplies.map((supply) => (
                                <tr key={supply.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-[var(--text-muted)]">{supply.date}</td>
                                    <td className="p-4 text-[var(--text-primary)] font-medium">{supply.supplierName}</td>
                                    <td className="p-4 text-[var(--text-primary)] text-right font-mono">{supply.quantityKg.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kg</td>
                                    <td className="p-4 text-[var(--text-muted)] text-right font-mono">{profile.currency}{supply.costPerKg.toFixed(2)}</td>
                                    <td className="p-4 text-green-400 text-right font-mono">{profile.currency}{(supply.quantityKg * supply.costPerKg).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Log New Supply</h2>
                <form onSubmit={handleAddSupply} className="space-y-4">
                     <input type="date" name="date" value={newSupply.date} onChange={handleInputChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                     <input type="text" name="supplierName" value={newSupply.supplierName} onChange={handleInputChange} placeholder="Supplier Name" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    <div className="flex gap-4">
                        <input type="number" step="0.01" name="quantityKg" value={newSupply.quantityKg} onChange={handleInputChange} placeholder="Quantity (kg)" className="w-1/2 bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                        <input type="number" step="0.01" name="costPerKg" value={newSupply.costPerKg} onChange={handleInputChange} placeholder="Cost / kg" className="w-1/2 bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    </div>
                    <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md">Log Supply</button>
                </form>
            </div>
        </div>
    );
};

export default BulkSupplyLogDashboard;
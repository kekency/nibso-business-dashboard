import React, { useState, useContext, useMemo } from 'react';
import { Promotion } from '../types';
import { PromotionsContext } from '../contexts/PromotionsContext';
import { InventoryContext } from '../contexts/InventoryContext';

const PromotionsDashboard: React.FC = () => {
    const { promotions, addPromotion } = useContext(PromotionsContext);
    const { inventory } = useContext(InventoryContext);

    const [newPromo, setNewPromo] = useState({ description: '', value: '', target: 'item', targetId: '', startDate: '', endDate: '' });

    const categories = useMemo(() => [...new Set(inventory.map(i => i.category))], [inventory]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewPromo(prev => ({ ...prev, [name]: value, ...(name === 'target' && { targetId: '' }) }));
    };

    const handleAddPromotion = (e: React.FormEvent) => {
        e.preventDefault();
        const { description, value, target, targetId, startDate, endDate } = newPromo;
        if (description && value && targetId && startDate && endDate) {
            addPromotion({
                description,
                type: 'percentage',
                value: parseFloat(value),
                target: target as 'item' | 'category',
                targetId,
                startDate,
                endDate,
            });
            setNewPromo({ description: '', value: '', target: 'item', targetId: '', startDate: '', endDate: '' });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6"><h2 className="text-xl font-semibold text-[var(--text-primary)]">Current & Upcoming Promotions</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Description</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Discount</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Target</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Duration</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promotions.map((promo) => (
                                <tr key={promo.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-[var(--text-primary)] font-medium">{promo.description}</td>
                                    <td className="p-4 text-green-400 font-bold">{promo.value}%</td>
                                    <td className="p-4 text-[var(--text-muted)] capitalize">{promo.target}: {promo.targetId}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{promo.startDate} to {promo.endDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Create New Promotion</h2>
                <form onSubmit={handleAddPromotion} className="space-y-4">
                    <input type="text" name="description" value={newPromo.description} onChange={handleInputChange} placeholder="Promotion Description (e.g., 10% off)" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    <input type="number" name="value" value={newPromo.value} onChange={handleInputChange} placeholder="Discount %" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    <div className="flex gap-2">
                        <select name="target" value={newPromo.target} onChange={handleInputChange} className="w-1/3 bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                            <option value="item">Item</option>
                            <option value="category">Category</option>
                        </select>
                        <select name="targetId" value={newPromo.targetId} onChange={handleInputChange} className="w-2/3 bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required>
                            <option value="">Select Target</option>
                            {newPromo.target === 'item' 
                                ? inventory.map(item => <option key={item.id} value={item.id}>{item.name}</option>) 
                                : categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>
                     <div className="flex gap-2">
                        <input type="date" name="startDate" value={newPromo.startDate} onChange={handleInputChange} className="w-1/2 bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                        <input type="date" name="endDate" value={newPromo.endDate} onChange={handleInputChange} className="w-1/2 bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    </div>
                    <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md">Create Promotion</button>
                </form>
            </div>
        </div>
    );
};

export default PromotionsDashboard;
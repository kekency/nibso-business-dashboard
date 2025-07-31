import React, { useContext, useMemo } from 'react';
import { InventoryContext } from '../contexts/InventoryContext';
import { BusinessContext } from '../contexts/BusinessContext';

const StockAlertsDashboard: React.FC = () => {
    const { inventory } = useContext(InventoryContext);
    const { profile } = useContext(BusinessContext);

    const lowStockItems = useMemo(() => {
        return inventory.filter(item => item.reorderLevel !== undefined && item.stock <= item.reorderLevel);
    }, [inventory]);

    return (
        <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
                <h2 className="text-xl font-semibold text-[var(--text-primary)]">Low Stock Alerts</h2>
                <p className="text-[var(--text-muted)]">Items that have reached or are below their reorder level.</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-[var(--border)]/30">
                        <tr>
                            <th className="p-4 font-semibold text-[var(--text-muted)]">Product Name</th>
                            <th className="p-4 font-semibold text-[var(--text-muted)]">Category</th>
                            <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Current Stock</th>
                            <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Reorder Level</th>
                            <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lowStockItems.length === 0 && (
                            <tr><td colSpan={5} className="text-center p-8 text-[var(--text-muted)]">All stock levels are currently sufficient.</td></tr>
                        )}
                        {lowStockItems.map((item) => (
                            <tr key={item.id} className="border-b border-[var(--border)] last:border-b-0 bg-red-900/20 hover:bg-red-900/40">
                                <td className="p-4 text-[var(--text-primary)] font-medium">{item.name}</td>
                                <td className="p-4 text-[var(--text-muted)]">{item.category}</td>
                                <td className="p-4 text-red-400 text-right font-mono font-bold">{item.stock}</td>
                                <td className="p-4 text-[var(--text-muted)] text-right font-mono">{item.reorderLevel}</td>
                                <td className="p-4 text-[var(--primary)] text-right font-mono">{profile.currency}{item.price.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockAlertsDashboard;
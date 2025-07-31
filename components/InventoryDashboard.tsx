import React, { useState, useContext } from 'react';
import { InventoryItem, View, BusinessType, Supplier } from '../types';
import { BusinessContext } from '../contexts/BusinessContext';
import { InventoryContext } from '../contexts/InventoryContext';
import { SuppliersContext } from '../contexts/SuppliersContext';
import { QrCodeIcon } from './icons/QrCodeIcon';

interface InventoryDashboardProps {
    openModal: (view: View, data: any) => void;
}

const InventoryDashboard: React.FC<InventoryDashboardProps> = ({ openModal }) => {
    const { inventory, addInventoryItem } = useContext(InventoryContext);
    const { profile } = useContext(BusinessContext);
    const { suppliers = [] }: { suppliers?: Supplier[] } = useContext(SuppliersContext);

    const isSupermarket = profile.businessType === BusinessType.Supermarket;

    const [newItem, setNewItem] = useState({ 
        name: '', stock: '', price: '', category: '', imageUrl: '',
        department: '', reorderLevel: '', supplierId: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (newItem.name && newItem.stock && newItem.price && newItem.category) {
            const newItemData: Omit<InventoryItem, 'id'> = {
                name: newItem.name,
                stock: parseFloat(newItem.stock),
                price: parseFloat(newItem.price),
                category: newItem.category,
                imageUrl: newItem.imageUrl,
                department: isSupermarket ? newItem.department : undefined,
                reorderLevel: isSupermarket && newItem.reorderLevel ? parseFloat(newItem.reorderLevel) : undefined,
                supplierId: isSupermarket ? newItem.supplierId : undefined,
            };
            addInventoryItem(newItemData);
            setNewItem({ name: '', stock: '', price: '', category: '', imageUrl: '', department: '', reorderLevel: '', supplierId: '' });
        }
    };
    
    const handleScanSuccess = (decodedText: string) => {
        setSearchTerm(decodedText);
    };

    const filteredInventory = inventory.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.id === searchTerm
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Current Stock</h2>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="Search or scan..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-[var(--input)] text-[var(--text-primary)] p-2 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                        <button 
                            onClick={() => openModal(View.QRCodeScanner, { onSuccess: handleScanSuccess })}
                            className="bg-[var(--input)] p-2 rounded-lg hover:bg-[var(--primary)]"
                        >
                            <QrCodeIcon />
                        </button>
                    </div>
                </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Image</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Product Name</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Category</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Stock</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Price</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInventory.map((item) => (
                                <tr key={item.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5 transition-colors">
                                    <td className="p-2">
                                        <img 
                                            src={item.imageUrl || `https://placehold.co/100x100/1e293b/9ca3af?text=N/A`} 
                                            alt={item.name} 
                                            className="h-12 w-12 rounded-md object-cover" 
                                        />
                                    </td>
                                    <td className="p-4 text-[var(--text-primary)] font-medium">{item.name}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{item.category}</td>
                                    <td className="p-4 text-[var(--text-primary)] text-right font-mono">{item.stock}</td>
                                    <td className="p-4 text-[var(--primary)] text-right font-mono">{profile.currency}{item.price.toFixed(2)}</td>
                                    <td className="p-4 text-center">
                                        <button 
                                            onClick={() => openModal(View.QRCodeDisplay, { item })}
                                            className="p-2 rounded-md hover:bg-[var(--border)]" title="Show QR Code">
                                            <QrCodeIcon />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
            
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Add New Item</h2>
                <form onSubmit={handleAddItem} className="space-y-4">
                    <input type="text" name="name" value={newItem.name} onChange={handleInputChange} placeholder="Product Name" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    <input type="text" name="category" value={newItem.category} onChange={handleInputChange} placeholder="Category" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                     {isSupermarket && (
                        <>
                        <input type="text" name="department" value={newItem.department} onChange={handleInputChange} placeholder="Department / Aisle" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                        <select name="supplierId" value={newItem.supplierId} onChange={handleInputChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                            <option value="">Select Supplier</option>
                            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        </>
                    )}
                    <input type="text" name="imageUrl" value={newItem.imageUrl} onChange={handleInputChange} placeholder="Image URL (Optional)" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                    <div className="flex gap-4">
                        <input type="number" step="0.01" name="stock" value={newItem.stock} onChange={handleInputChange} placeholder="Stock" className="w-1/2 bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                        <input type="number" step="0.01" name="price" value={newItem.price} onChange={handleInputChange} placeholder="Price" className="w-1/2 bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    </div>
                     {isSupermarket && (
                        <input type="number" step="0.01" name="reorderLevel" value={newItem.reorderLevel} onChange={handleInputChange} placeholder="Reorder Level" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                    )}
                    <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md disabled:bg-slate-600">Add to Inventory</button>
                </form>
            </div>
        </div>
    );
};

export default InventoryDashboard;
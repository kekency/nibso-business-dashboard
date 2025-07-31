import React, { useState, useContext } from 'react';
import { ReceiptItem } from '../types';
import { generateReceipt } from '../services/geminiService';
import { BusinessContext } from '../contexts/BusinessContext';

const ReceiptGenerator: React.FC = () => {
    const [items, setItems] = useState<ReceiptItem[]>([]);
    const [newItem, setNewItem] = useState({ name: '', quantity: '1', price: '' });
    const [customerName, setCustomerName] = useState('');
    const [generatedReceipt, setGeneratedReceipt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { profile } = useContext(BusinessContext);
    
    const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        const quantity = parseFloat(newItem.quantity);
        const price = parseFloat(newItem.price);

        if (newItem.name && !isNaN(quantity) && quantity > 0 && !isNaN(price) && price > 0) {
            const itemToAdd: ReceiptItem = {
                id: new Date().toISOString(),
                name: newItem.name,
                quantity,
                price
            };
            setItems(prev => [...prev, itemToAdd]);
            setNewItem({ name: '', quantity: '1', price: '' });
        }
    };

    const handleGenerateReceipt = async () => {
        if (items.length === 0) {
            setGeneratedReceipt("Please add at least one item to generate a receipt.");
            return;
        }
        setIsLoading(true);
        setGeneratedReceipt('');
        const receiptText = await generateReceipt(items, profile, customerName);
        setGeneratedReceipt(receiptText);
        setIsLoading(false);
    };

    const total = items.reduce((acc, item) => acc + item.quantity * item.price, 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Transaction Details</h2>
                    <form onSubmit={handleAddItem} className="space-y-4">
                        <input type="text" name="customerName" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Customer Name (Optional)" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" name="name" value={newItem.name} onChange={handleItemChange} placeholder="Item Name" className="md:col-span-3 bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                            <input type="number" step="0.01" name="quantity" value={newItem.quantity} onChange={handleItemChange} placeholder="Qty" className="bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                            <input type="number" step="0.01" name="price" value={newItem.price} onChange={handleItemChange} placeholder="Price per item" className="bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                             <button type="submit" className="bg-slate-600 text-white font-bold p-3 rounded-lg hover:bg-slate-500 transition-colors shadow-md">Add Item</button>
                        </div>
                    </form>
                </div>
                 <div>
                    <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">Current Items</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {items.map(item => (
                            <div key={item.id} className="flex justify-between items-center bg-[var(--input)] p-3 rounded-lg">
                                <span className="text-[var(--text-primary)]">{item.name}</span>
                                <span className="text-[var(--text-muted)]">{item.quantity} x {profile.currency}{item.price.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    {items.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[var(--border)] flex justify-between items-center">
                            <span className="text-lg font-bold text-[var(--text-primary)]">Total</span>
                            <span className="text-lg font-bold text-[var(--primary)]">{profile.currency}{total.toFixed(2)}</span>
                        </div>
                    )}
                </div>
                 <button onClick={handleGenerateReceipt} disabled={isLoading || items.length === 0} className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md disabled:bg-slate-600 disabled:cursor-not-allowed flex items-center justify-center">
                     {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                     ) : 'Generate Receipt'}
                </button>
            </div>
            
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Generated Receipt</h2>
                <pre className="bg-[var(--background)]/80 text-[var(--text-muted)] rounded-lg p-4 h-full whitespace-pre-wrap font-mono text-sm overflow-y-auto">
                    {generatedReceipt || "Your generated receipt will appear here..."}
                </pre>
            </div>
        </div>
    );
};

export default ReceiptGenerator;
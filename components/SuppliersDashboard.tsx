import React, { useState, useContext } from 'react';
import { Supplier } from '../types';
import { SuppliersContext } from '../contexts/SuppliersContext';

const SuppliersDashboard: React.FC = () => {
    const { suppliers, addSupplier } = useContext(SuppliersContext);
    const [newSupplier, setNewSupplier] = useState({ name: '', contactPerson: '', phone: '', email: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewSupplier({ ...newSupplier, [e.target.name]: e.target.value });
    };

    const handleAddSupplier = (e: React.FormEvent) => {
        e.preventDefault();
        addSupplier(newSupplier);
        setNewSupplier({ name: '', contactPerson: '', phone: '', email: '' });
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6"><h2 className="text-xl font-semibold text-[var(--text-primary)]">Suppliers List</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Supplier Name</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Contact Person</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Phone</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Email</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map((supplier) => (
                                <tr key={supplier.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-[var(--text-primary)] font-medium">{supplier.name}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{supplier.contactPerson}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{supplier.phone}</td>
                                    <td className="p-4 text-sky-400">{supplier.email}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Add New Supplier</h2>
                <form onSubmit={handleAddSupplier} className="space-y-4">
                    <input type="text" name="name" value={newSupplier.name} onChange={handleInputChange} placeholder="Supplier Name" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    <input type="text" name="contactPerson" value={newSupplier.contactPerson} onChange={handleInputChange} placeholder="Contact Person" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    <input type="tel" name="phone" value={newSupplier.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    <input type="email" name="email" value={newSupplier.email} onChange={handleInputChange} placeholder="Email Address" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md">Add Supplier</button>
                </form>
            </div>
        </div>
    );
};

export default SuppliersDashboard;
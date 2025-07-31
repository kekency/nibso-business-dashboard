import React, { useState, useContext } from 'react';
import { Property, PropertyStatus } from '../types';
import { PropertyContext } from '../contexts/PropertyContext';
import { BusinessContext } from '../contexts/BusinessContext';

const getStatusClass = (status: PropertyStatus) => {
    switch (status) {
        case 'Available': return 'bg-green-500/20 text-green-300';
        case 'Rented': return 'bg-yellow-500/20 text-yellow-300';
        case 'Sold': return 'bg-red-500/20 text-red-300';
    }
};

const PropertiesDashboard: React.FC = () => {
    const { properties, addProperty } = useContext(PropertyContext);
    const { profile } = useContext(BusinessContext);
    
    const [filterStatus, setFilterStatus] = useState<PropertyStatus | 'All'>('All');
    const initialFormState = { title: '', address: '', type: 'Apartment', status: 'Available', price: '', size: '', bedrooms: '', bathrooms: '', imageUrl: '' };
    const [newProperty, setNewProperty] = useState(initialFormState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setNewProperty({ ...newProperty, [e.target.name]: e.target.value });
    };

    const handleAddProperty = (e: React.FormEvent) => {
        e.preventDefault();
        const propertyData = {
            ...newProperty,
            price: parseFloat(newProperty.price),
            size: parseFloat(newProperty.size),
            bedrooms: newProperty.bedrooms ? parseInt(newProperty.bedrooms, 10) : undefined,
            bathrooms: newProperty.bathrooms ? parseInt(newProperty.bathrooms, 10) : undefined,
        };
        addProperty(propertyData as Omit<Property, 'id'>);
        setNewProperty(initialFormState);
    };

    const filteredProperties = properties.filter(p => filterStatus === 'All' || p.status === filterStatus);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Property Listings</h2>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="bg-[var(--input)] text-[var(--text-primary)] p-2 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                        <option value="All">All Statuses</option>
                        {(['Available', 'Rented', 'Sold'] as PropertyStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Property</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Type</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Price</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProperties.map((prop) => (
                                <tr key={prop.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5">
                                    <td className="p-4 text-[var(--text-primary)] font-medium">
                                        <div>{prop.title}</div>
                                        <div className="text-xs text-[var(--text-muted)]">{prop.address}</div>
                                    </td>
                                    <td className="p-4 text-[var(--text-muted)]">{prop.type}</td>
                                    <td className="p-4 text-right font-mono text-green-400">{profile.currency}{prop.price.toLocaleString()}</td>
                                    <td className="p-4"><span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusClass(prop.status)}`}>{prop.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Add New Property</h2>
                <form onSubmit={handleAddProperty} className="space-y-4">
                    <input type="text" name="title" value={newProperty.title} onChange={handleInputChange} placeholder="Property Title" className="w-full bg-[var(--input)] p-3 rounded-lg border border-[var(--border)]" required />
                    <input type="text" name="address" value={newProperty.address} onChange={handleInputChange} placeholder="Address" className="w-full bg-[var(--input)] p-3 rounded-lg border border-[var(--border)]" required />
                    <select name="type" value={newProperty.type} onChange={handleInputChange} className="w-full bg-[var(--input)] p-3 rounded-lg border border-[var(--border)]">
                        <option>Apartment</option><option>House</option><option>Office</option><option>Land</option>
                    </select>
                     <select name="status" value={newProperty.status} onChange={handleInputChange} className="w-full bg-[var(--input)] p-3 rounded-lg border border-[var(--border)]">
                        <option>Available</option><option>Rented</option><option>Sold</option>
                    </select>
                    <div className="flex gap-4">
                        <input type="number" name="price" value={newProperty.price} onChange={handleInputChange} placeholder="Price" className="w-1/2 bg-[var(--input)] p-3 rounded-lg border border-[var(--border)]" required />
                        <input type="number" name="size" value={newProperty.size} onChange={handleInputChange} placeholder="Size (sqm)" className="w-1/2 bg-[var(--input)] p-3 rounded-lg border border-[var(--border)]" required />
                    </div>
                    <div className="flex gap-4">
                        <input type="number" name="bedrooms" value={newProperty.bedrooms} onChange={handleInputChange} placeholder="Beds" className="w-1/2 bg-[var(--input)] p-3 rounded-lg border border-[var(--border)]" />
                        <input type="number" name="bathrooms" value={newProperty.bathrooms} onChange={handleInputChange} placeholder="Baths" className="w-1/2 bg-[var(--input)] p-3 rounded-lg border border-[var(--border)]" />
                    </div>
                    <input type="text" name="imageUrl" value={newProperty.imageUrl} onChange={handleInputChange} placeholder="Image URL (Optional)" className="w-full bg-[var(--input)] p-3 rounded-lg border border-[var(--border)]" />
                    <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)]">Add Property</button>
                </form>
            </div>
        </div>
    );
};

export default PropertiesDashboard;
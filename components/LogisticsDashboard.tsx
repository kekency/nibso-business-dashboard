import React, { useState, useContext } from 'react';
import { Shipment, ShipmentStatus } from '../types';
import { LogisticsContext } from '../contexts/LogisticsContext';
import { CrmContext } from '../contexts/CrmContext';

const getStatusClass = (status: ShipmentStatus) => {
    switch (status) {
        case 'Pending': return 'bg-yellow-500/20 text-yellow-300';
        case 'In-Transit': return 'bg-sky-500/20 text-sky-300';
        case 'Delivered': return 'bg-green-500/20 text-green-300';
        case 'Cancelled': return 'bg-red-500/20 text-red-300';
    }
};

const LogisticsDashboard: React.FC = () => {
    const { shipments, drivers, addShipment, updateShipmentStatus, addDriver } = useContext(LogisticsContext);
    const { updateRequestStatus: updateCrmRequestStatus } = useContext(CrmContext);
    const [filterStatus, setFilterStatus] = useState<ShipmentStatus | 'All'>('All');
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
    const [updateData, setUpdateData] = useState<{ status: ShipmentStatus; driverId?: string }>({ status: 'Pending' });

    const [newShipment, setNewShipment] = useState({ customerName: '', destination: '', estimatedDelivery: '' });
    const [newDriverName, setNewDriverName] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewShipment({ ...newShipment, [e.target.name]: e.target.value });
    };

    const handleAddShipment = (e: React.FormEvent) => {
        e.preventDefault();
        addShipment(newShipment);
        setNewShipment({ customerName: '', destination: '', estimatedDelivery: '' });
    };
    
    const handleAddDriver = (e: React.FormEvent) => {
        e.preventDefault();
        if (newDriverName.trim()) {
            addDriver({ name: newDriverName.trim() });
            setNewDriverName('');
        }
    };

    const openUpdateModal = (shipment: Shipment) => {
        setSelectedShipment(shipment);
        setUpdateData({ status: shipment.status, driverId: shipment.driverId });
        setIsUpdateModalOpen(true);
    };

    const handleUpdateShipment = () => {
        if (selectedShipment) {
            updateShipmentStatus(selectedShipment.id, updateData.status, updateData.driverId);
            if (updateData.status === 'Delivered' && selectedShipment.sourceRequestId) {
                updateCrmRequestStatus(selectedShipment.sourceRequestId, 'Completed');
            }
        }
        setIsUpdateModalOpen(false);
        setSelectedShipment(null);
    };

    const filteredShipments = shipments.filter(s => filterStatus === 'All' || s.status === filterStatus);

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-8">
                <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl p-6 shadow-lg">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Create New Shipment</h2>
                    <form onSubmit={handleAddShipment} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <input type="text" name="customerName" value={newShipment.customerName} onChange={handleInputChange} placeholder="Customer Name" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                        <input type="text" name="destination" value={newShipment.destination} onChange={handleInputChange} placeholder="Destination" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                        <input type="date" name="estimatedDelivery" value={newShipment.estimatedDelivery} onChange={handleInputChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                        <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md">Create Shipment</button>
                    </form>
                </div>
                
                <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                    <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
                        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 md:mb-0">Shipment Overview</h2>
                        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as ShipmentStatus | 'All')} className="bg-[var(--input)] text-[var(--text-primary)] p-2 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                            <option value="All">All Statuses</option>
                            {(['Pending', 'In-Transit', 'Delivered', 'Cancelled'] as ShipmentStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead className="bg-[var(--border)]/30">
                                <tr>
                                    <th className="p-4 font-semibold text-[var(--text-muted)]">Tracking #</th>
                                    <th className="p-4 font-semibold text-[var(--text-muted)]">Customer</th>
                                    <th className="p-4 font-semibold text-[var(--text-muted)]">Destination</th>
                                    <th className="p-4 font-semibold text-[var(--text-muted)]">Est. Delivery</th>
                                    <th className="p-4 font-semibold text-[var(--text-muted)]">Driver</th>
                                    <th className="p-4 font-semibold text-[var(--text-muted)]">Status</th>
                                    <th className="p-4 font-semibold text-[var(--text-muted)] text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredShipments.map(shipment => (
                                    <tr key={shipment.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-sky-400 font-mono">{shipment.trackingNumber}</td>
                                        <td className="p-4 text-[var(--text-primary)] font-medium">{shipment.customerName}</td>
                                        <td className="p-4 text-[var(--text-muted)]">{shipment.destination}</td>
                                        <td className="p-4 text-[var(--text-muted)]">{shipment.estimatedDelivery}</td>
                                        <td className="p-4 text-[var(--text-muted)]">{drivers.find(d => d.id === shipment.driverId)?.name || 'Unassigned'}</td>
                                        <td className="p-4"><span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusClass(shipment.status)}`}>{shipment.status}</span></td>
                                        <td className="p-4 text-center">
                                            <button onClick={() => openUpdateModal(shipment)} className="text-[var(--primary)] hover:underline text-sm font-semibold">Update</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Driver Management</h2>
                <form onSubmit={handleAddDriver} className="flex gap-4 mb-4">
                    <input type="text" value={newDriverName} onChange={e => setNewDriverName(e.target.value)} placeholder="New Driver Name" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    <button type="submit" className="bg-slate-600 text-white font-bold p-3 rounded-lg hover:bg-[var(--primary)] transition-colors shadow-md">Add</button>
                </form>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                    {drivers.map(driver => (
                        <div key={driver.id} className="bg-[var(--input)] p-3 rounded-lg text-[var(--text-primary)]">{driver.name}</div>
                    ))}
                </div>
            </div>

            {isUpdateModalOpen && selectedShipment && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-md">
                        <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Update Shipment #{selectedShipment.trackingNumber}</h2>
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Status</label>
                                <select value={updateData.status} onChange={e => setUpdateData({...updateData, status: e.target.value as ShipmentStatus})} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                                    {(['Pending', 'In-Transit', 'Delivered', 'Cancelled'] as ShipmentStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                             </div>
                             <div>
                                <label className="block text-sm font-medium text-[var(--text-muted)] mb-1">Assign Driver</label>
                                <select value={updateData.driverId || ''} onChange={e => setUpdateData({...updateData, driverId: e.target.value})} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                                    <option value="">Unassigned</option>
                                    {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 mt-8">
                            <button onClick={() => setIsUpdateModalOpen(false)} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Cancel</button>
                            <button onClick={handleUpdateShipment} className="bg-[var(--primary)] text-white font-bold py-2 px-4 rounded-lg hover:bg-[var(--primary-hover)] transition-colors">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LogisticsDashboard;
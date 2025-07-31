import React, { useState, useContext, useMemo } from 'react';
import { read, utils } from 'xlsx';
import { CrmContext } from '../contexts/CrmContext';
import { AuthContext } from '../contexts/AuthContext';
import { UsersContext } from '../contexts/UsersContext';
import { LogisticsContext } from '../contexts/LogisticsContext';
import { CustomerRequest, CustomerRequestStatus } from '../types';

const getStatusClass = (status: CustomerRequestStatus) => {
    switch (status) {
        case 'New': return 'bg-sky-500/20 text-sky-300';
        case 'Assigned': return 'bg-purple-500/20 text-purple-300';
        case 'Processing': return 'bg-yellow-500/20 text-yellow-300';
        case 'Ready for Shipment': return 'bg-orange-500/20 text-orange-300';
        case 'Shipped': return 'bg-blue-500/20 text-blue-300';
        case 'Completed': return 'bg-green-500/20 text-green-300';
    }
};

const CrmDashboard: React.FC = () => {
    const { requests, addRequest, addRequests, updateRequestStatus } = useContext(CrmContext);
    const { currentUser } = useContext(AuthContext);
    const { users } = useContext(UsersContext);
    const { addShipment } = useContext(LogisticsContext);

    const [filterStatus, setFilterStatus] = useState<CustomerRequestStatus | 'All'>('All');
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
    const [newRequest, setNewRequest] = useState({ customerId: '', customerName: '', customerContact: '', requestDetails: '' });

    const isManager = currentUser?.role === 'Admin' || currentUser?.role === 'Proprietor' || currentUser?.role === 'Manager';
    const agents = useMemo(() => users.filter(u => u.role === 'Cashier'), [users]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setMessage({ type: 'info', text: 'Processing file...' });
        try {
            const data = await file.arrayBuffer();
            const workbook = read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = utils.sheet_to_json(worksheet) as any[];

            const parsedItems = jsonData.map(row => ({
                customerId: String(row.customerId || row.customer_id || ''),
                customerName: String(row.customerName || row.customer_name || ''),
                customerContact: String(row.customerContact || row.customer_contact || ''),
                requestDetails: String(row.requestDetails || row.request_details || ''),
            })).filter(item => item.customerId && item.customerName && item.customerContact && item.requestDetails);

            if (parsedItems.length === 0) {
                throw new Error('No valid requests found. Ensure columns are named: customerId, customerName, customerContact, requestDetails.');
            }

            addRequests(parsedItems);
            setMessage({ type: 'success', text: `Successfully imported ${parsedItems.length} requests.` });
        } catch (err) {
            const error = err instanceof Error ? err.message : 'An unknown error occurred.';
            setMessage({ type: 'error', text: `Failed to import file. ${error}` });
        } finally {
            e.target.value = '';
        }
    };
    
    const handleNewRequestChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
    };

    const handleAddRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if(newRequest.customerId && newRequest.customerName && newRequest.customerContact && newRequest.requestDetails) {
            addRequest(newRequest);
            setNewRequest({ customerId: '', customerName: '', customerContact: '', requestDetails: '' });
        }
    };
    
    const displayedRequests = useMemo(() => {
        let filtered = requests;
        if (!isManager) {
            filtered = requests.filter(r => r.agentId === currentUser?.id);
        }
        if (filterStatus !== 'All') {
            filtered = filtered.filter(r => r.status === filterStatus);
        }
        return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [requests, isManager, currentUser, filterStatus]);
    
    const getAgentName = (agentId?: string) => users.find(u => u.id === agentId)?.name || 'Unassigned';
    
    const handleCreateShipment = (request: CustomerRequest) => {
        addShipment({
            customerName: request.customerName,
            destination: `Contact: ${request.customerContact}`,
            estimatedDelivery: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0],
            sourceRequestId: request.id,
        });
        updateRequestStatus(request.id, 'Shipped');
    };

    const getMessageClass = () => {
        if (!message) return '';
        switch (message.type) {
            case 'success': return 'text-green-400 bg-green-900/50';
            case 'error': return 'text-red-400 bg-red-900/50';
            case 'info': return 'text-sky-400 bg-sky-900/50';
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Customer Requests</h2>
                    <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)} className="bg-[var(--input)] text-[var(--text-primary)] p-2 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                        <option value="All">All Statuses</option>
                        {(['New', 'Assigned', 'Processing', 'Ready for Shipment', 'Shipped', 'Completed'] as CustomerRequestStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Customer</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Request</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Agent</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Status</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedRequests.map((req) => (
                                <tr key={req.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5">
                                    <td className="p-4 text-[var(--text-primary)]"><div>{req.customerName}</div><div className="text-xs text-[var(--text-muted)]">{req.customerContact}</div></td>
                                    <td className="p-4 text-[var(--text-muted)] max-w-xs truncate">{req.requestDetails}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{getAgentName(req.agentId)}</td>
                                    <td className="p-4"><span className={`px-2 py-1 text-xs font-bold rounded-full ${getStatusClass(req.status)}`}>{req.status}</span></td>
                                    <td className="p-4 text-center">
                                        {isManager && req.status === 'New' && (
                                            <select onChange={e => updateRequestStatus(req.id, 'Assigned', e.target.value)} className="bg-slate-600 text-white p-1 rounded text-sm">
                                                <option>Assign Agent</option>
                                                {agents.map(agent => <option key={agent.id} value={agent.id}>{agent.name}</option>)}
                                            </select>
                                        )}
                                        {!isManager && req.status === 'Assigned' && <button onClick={() => updateRequestStatus(req.id, 'Processing')} className="text-yellow-400 font-semibold text-sm">Start</button>}
                                        {!isManager && req.status === 'Processing' && <button onClick={() => updateRequestStatus(req.id, 'Ready for Shipment')} className="text-orange-400 font-semibold text-sm">Ready</button>}
                                        {req.status === 'Ready for Shipment' && <button onClick={() => handleCreateShipment(req)} className="text-sky-400 font-semibold text-sm">Create Shipment</button>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {isManager && (
            <div className="space-y-8">
                <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Add New Request</h2>
                    <form onSubmit={handleAddRequest} className="space-y-4">
                        <input type="text" name="customerId" value={newRequest.customerId} onChange={handleNewRequestChange} placeholder="Customer ID" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                        <input type="text" name="customerName" value={newRequest.customerName} onChange={handleNewRequestChange} placeholder="Customer Name" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                        <input type="text" name="customerContact" value={newRequest.customerContact} onChange={handleNewRequestChange} placeholder="Contact Info (Phone/Address)" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                        <textarea name="requestDetails" value={newRequest.requestDetails} onChange={handleNewRequestChange} placeholder="Request Details" rows={3} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                        <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md">Add Request</button>
                    </form>
                </div>

                <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Import Requests</h2>
                    <p className="text-[var(--text-muted)] text-sm mb-4">Bulk upload customer requests from a CSV or Excel file.</p>
                    <input type="file" accept=".xlsx, .csv" onChange={handleFileChange} className="block w-full text-sm text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary)] file:text-white hover:file:bg-[var(--primary-hover)]" />
                    {message && <div className={`mt-4 p-3 rounded-lg text-sm text-center ${getMessageClass()}`}>{message.text}</div>}
                    <div className="mt-4 pt-4 border-t border-[var(--border)]">
                        <h3 className="font-semibold text-[var(--text-primary)] mb-2">Required Columns:</h3>
                        <ul className="list-disc list-inside text-sm text-[var(--text-muted)] space-y-1">
                            <li>customerId</li>
                            <li>customerName</li>
                            <li>customerContact</li>
                            <li>requestDetails</li>
                        </ul>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
};

export default CrmDashboard;
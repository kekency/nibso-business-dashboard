import React, { useState, useContext } from 'react';
import { Patient } from '../types';
import { PatientContext } from '../contexts/PatientContext';

const PatientsDashboard: React.FC = () => {
    const { patients, addPatient } = useContext(PatientContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [newPatient, setNewPatient] = useState({ firstName: '', lastName: '', dateOfBirth: '', gender: 'Other', bloodType: '', phone: '', address: '', medicalHistorySummary: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setNewPatient({ ...newPatient, [e.target.name]: e.target.value });
    };

    const handleAddPatient = (e: React.FormEvent) => {
        e.preventDefault();
        addPatient(newPatient as Omit<Patient, 'id' | 'patientId'>);
        setNewPatient({ firstName: '', lastName: '', dateOfBirth: '', gender: 'Other', bloodType: '', phone: '', address: '', medicalHistorySummary: '' });
    };

    const filteredPatients = patients.filter(p => 
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Patient Records</h2>
                    <input type="text" placeholder="Search by name or ID..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-[var(--input)] text-[var(--text-primary)] p-2 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Patient ID</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Name</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">DOB</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Gender</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Blood Type</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient) => (
                                <tr key={patient.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-sky-400 font-mono">{patient.patientId}</td>
                                    <td className="p-4 text-[var(--text-primary)] font-medium">{patient.firstName} {patient.lastName}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{patient.dateOfBirth}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{patient.gender}</td>
                                    <td className="p-4 text-red-400 font-bold">{patient.bloodType}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{patient.phone}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Register New Patient</h2>
                <form onSubmit={handleAddPatient} className="space-y-4">
                    <div className="flex gap-4">
                        <input type="text" name="firstName" value={newPatient.firstName} onChange={handleInputChange} placeholder="First Name" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                        <input type="text" name="lastName" value={newPatient.lastName} onChange={handleInputChange} placeholder="Last Name" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    </div>
                    <div className="flex gap-4">
                        <input type="date" name="dateOfBirth" value={newPatient.dateOfBirth} onChange={handleInputChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                        <select name="gender" value={newPatient.gender} onChange={handleInputChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="flex gap-4">
                        <input type="text" name="bloodType" value={newPatient.bloodType} onChange={handleInputChange} placeholder="Blood Type (e.g., O+)" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                        <input type="tel" name="phone" value={newPatient.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                    </div>
                     <input type="text" name="address" value={newPatient.address} onChange={handleInputChange} placeholder="Address" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                     <textarea name="medicalHistorySummary" value={newPatient.medicalHistorySummary} onChange={handleInputChange} placeholder="Medical History Summary" rows={3} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"></textarea>
                    <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md">Register Patient</button>
                </form>
            </div>
        </div>
    );
};

export default PatientsDashboard;
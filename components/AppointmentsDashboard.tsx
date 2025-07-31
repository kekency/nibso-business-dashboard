import React, { useState, useContext } from 'react';
import { Appointment, AppointmentStatus } from '../types';
import { AppointmentContext } from '../contexts/AppointmentContext';
import { PatientContext } from '../contexts/PatientContext';

const getStatusClass = (status: AppointmentStatus) => {
    switch (status) {
        case 'Scheduled': return 'bg-sky-500/20 text-sky-300';
        case 'Completed': return 'bg-green-500/20 text-green-300';
        case 'Cancelled': return 'bg-red-500/20 text-red-300';
    }
};

const AppointmentsDashboard: React.FC = () => {
    const { appointments, doctors, scheduleAppointment, updateAppointmentStatus } = useContext(AppointmentContext);
    const { patients } = useContext(PatientContext);
    
    const [filterStatus, setFilterStatus] = useState<AppointmentStatus | 'All'>('All');
    const [newAppointment, setNewAppointment] = useState({ patientId: '', doctorId: '', date: '', reason: '' });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setNewAppointment({ ...newAppointment, [e.target.name]: e.target.value });
    };

    const handleAddAppointment = (e: React.FormEvent) => {
        e.preventDefault();
        scheduleAppointment({
            ...newAppointment,
            date: new Date(newAppointment.date).toISOString()
        });
        setNewAppointment({ patientId: '', doctorId: '', date: '', reason: '' });
    };
    
    const filteredAppointments = appointments.filter(a => filterStatus === 'All' || a.status === filterStatus);

    const getPatientName = (patientId: string) => {
        const patient = patients.find(p => p.id === patientId);
        return patient ? `${patient.firstName} ${patient.lastName}` : 'Unknown Patient';
    };

    const getDoctorName = (doctorId: string) => {
        return doctors.find(d => d.id === doctorId)?.name || 'Unknown Doctor';
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)]">Appointments</h2>
                     <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as AppointmentStatus | 'All')} className="bg-[var(--input)] text-[var(--text-primary)] p-2 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]">
                        <option value="All">All Statuses</option>
                        {(['Scheduled', 'Completed', 'Cancelled'] as AppointmentStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Patient</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Doctor</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Date & Time</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Reason</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Status</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.map((apt) => (
                                <tr key={apt.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-[var(--text-primary)] font-medium">{getPatientName(apt.patientId)}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{getDoctorName(apt.doctorId)}</td>
                                    <td className="p-4 text-[var(--text-muted)]">{new Date(apt.date).toLocaleString()}</td>
                                    <td className="p-4 text-[var(--text-muted)] truncate max-w-xs">{apt.reason}</td>
                                    <td className="p-4"><span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusClass(apt.status)}`}>{apt.status}</span></td>
                                    <td className="p-4 text-center space-x-2">
                                        <button onClick={() => updateAppointmentStatus(apt.id, 'Completed')} className="text-green-400 hover:underline text-sm font-semibold" disabled={apt.status==='Completed'}>Complete</button>
                                        <button onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')} className="text-red-400 hover:underline text-sm font-semibold" disabled={apt.status==='Cancelled'}>Cancel</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Schedule Appointment</h2>
                <form onSubmit={handleAddAppointment} className="space-y-4">
                     <select name="patientId" value={newAppointment.patientId} onChange={handleInputChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required>
                        <option value="">Select Patient</option>
                        {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName} ({p.patientId})</option>)}
                    </select>
                     <select name="doctorId" value={newAppointment.doctorId} onChange={handleInputChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required>
                        <option value="">Select Doctor</option>
                        {doctors.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>)}
                    </select>
                    <input type="datetime-local" name="date" value={newAppointment.date} onChange={handleInputChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                    <textarea name="reason" value={newAppointment.reason} onChange={handleInputChange} placeholder="Reason for visit" rows={3} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"></textarea>
                    <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md">Schedule</button>
                </form>
            </div>
        </div>
    );
};

export default AppointmentsDashboard;
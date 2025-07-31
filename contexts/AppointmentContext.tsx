import React, { createContext, useContext } from 'react';
import { Appointment, AppointmentStatus, Doctor } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';
import { UsersContext } from './UsersContext';

interface AppointmentContextType {
    appointments: Appointment[];
    doctors: Doctor[];
    scheduleAppointment: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
    updateAppointmentStatus: (appointmentId: string, status: AppointmentStatus) => void;
}

const initialAppointments: Appointment[] = [
    { id: 'apt1', patientId: 'pat1', doctorId: 'user_admin_default', date: '2024-08-20T10:00:00Z', reason: 'Follow-up Checkup', status: 'Scheduled' },
    { id: 'apt2', patientId: 'pat2', doctorId: 'user_admin_default', date: '2024-08-18T14:30:00Z', reason: 'Consultation for recurring headache', status: 'Completed' },
];

export const AppointmentContext = createContext<AppointmentContextType>({
    appointments: [],
    doctors: [],
    scheduleAppointment: () => {},
    updateAppointmentStatus: () => {},
});

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [appointments, setAppointments] = usePersistentState<Appointment[]>('nibsoHospitalAppointments', initialAppointments);
    const { users } = useContext(UsersContext);

    // Derive doctors from the main user list
    const doctors: Doctor[] = users
        .filter(user => user.specialty) // A user is a doctor if they have a specialty
        .map(user => ({
            id: user.id,
            name: user.name,
            specialty: user.specialty || 'General Practitioner',
        }));

    const scheduleAppointment = (appointment: Omit<Appointment, 'id' | 'status'>) => {
        const newAppointment: Appointment = {
            ...appointment,
            id: `apt_${new Date().getTime()}`,
            status: 'Scheduled',
        };
        setAppointments(prev => [newAppointment, ...prev]);
    };

    const updateAppointmentStatus = (appointmentId: string, status: AppointmentStatus) => {
        setAppointments(prev =>
            prev.map(apt => (apt.id === appointmentId ? { ...apt, status } : apt))
        );
    };

    return (
        <AppointmentContext.Provider value={{ appointments, doctors, scheduleAppointment, updateAppointmentStatus }}>
            {children}
        </AppointmentContext.Provider>
    );
};

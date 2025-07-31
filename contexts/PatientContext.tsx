import React, { createContext } from 'react';
import { Patient } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface PatientContextType {
    patients: Patient[];
    addPatient: (patient: Omit<Patient, 'id' | 'patientId'>) => void;
}

const initialPatients: Patient[] = [
    { id: 'pat1', patientId: 'PID-001', firstName: 'Aisha', lastName: 'Bello', dateOfBirth: '1985-05-20', gender: 'Female', bloodType: 'O+', phone: '08012345678', address: '15, Marina Rd, Lagos', medicalHistorySummary: 'Hypertension, managed with medication.' },
    { id: 'pat2', patientId: 'PID-002', firstName: 'Emeka', lastName: 'Nwosu', dateOfBirth: '1992-11-10', gender: 'Male', bloodType: 'A-', phone: '09087654321', address: '22, Wuse II, Abuja', medicalHistorySummary: 'No chronic conditions. Allergic to penicillin.' },
];

export const PatientContext = createContext<PatientContextType>({
    patients: [],
    addPatient: () => {},
});

export const PatientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [patients, setPatients] = usePersistentState<Patient[]>('nibsoHospitalPatients', initialPatients);

    const generatePatientId = () => {
        const nextId = patients.length + 1;
        return `PID-${String(nextId).padStart(3, '0')}`;
    };

    const addPatient = (patient: Omit<Patient, 'id' | 'patientId'>) => {
        const newPatient: Patient = {
            ...patient,
            id: `pat_${new Date().getTime()}`,
            patientId: generatePatientId(),
        };
        setPatients(prev => [newPatient, ...prev]);
    };

    return (
        <PatientContext.Provider value={{ patients, addPatient }}>
            {children}
        </PatientContext.Provider>
    );
};

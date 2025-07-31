import React, { createContext } from 'react';
import { FeePayment } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface FeeContextType {
    payments: FeePayment[];
    logPayment: (payment: Omit<FeePayment, 'id'>) => void;
}

const initialPayments: FeePayment[] = [
    { id: 'fee1', studentId: 'stu1', term: 'First Term 2024/2025', totalAmount: 150000, amountPaid: 150000, date: '2024-09-05', status: 'Paid' },
    { id: 'fee2', studentId: 'stu2', term: 'First Term 2024/2025', totalAmount: 120000, amountPaid: 60000, date: '2024-09-08', status: 'Partial' },
];

export const FeeContext = createContext<FeeContextType>({
    payments: [],
    logPayment: () => {},
});

export const FeeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [payments, setPayments] = usePersistentState<FeePayment[]>('nibsoEducationFees', initialPayments);

    const logPayment = (payment: Omit<FeePayment, 'id'>) => {
        const newPayment: FeePayment = {
            ...payment,
            id: `fee_${new Date().getTime()}`,
        };
        setPayments(prev => [newPayment, ...prev]);
    };

    return (
        <FeeContext.Provider value={{ payments, logPayment }}>
            {children}
        </FeeContext.Provider>
    );
};

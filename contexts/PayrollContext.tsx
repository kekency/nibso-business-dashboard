import React, { createContext } from 'react';
import { PayrollRecord } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface PayrollContextType {
    payrollHistory: PayrollRecord[];
    logPayment: (payment: Omit<PayrollRecord, 'id'>) => void;
}

const initialHistory: PayrollRecord[] = [];

export const PayrollContext = createContext<PayrollContextType>({
    payrollHistory: [],
    logPayment: () => {},
});

export const PayrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [payrollHistory, setPayrollHistory] = usePersistentState<PayrollRecord[]>('nibsoEducationPayroll', initialHistory);

    const logPayment = (payment: Omit<PayrollRecord, 'id'>) => {
        const newRecord: PayrollRecord = {
            ...payment,
            id: `pay_${new Date().getTime()}`,
        };
        setPayrollHistory(prev => [newRecord, ...prev].sort((a,b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime()));
    };

    return (
        <PayrollContext.Provider value={{ payrollHistory, logPayment }}>
            {children}
        </PayrollContext.Provider>
    );
};

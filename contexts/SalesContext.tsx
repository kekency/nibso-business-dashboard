import React, { createContext } from 'react';
import { DailySaleRecord, TransactionItem } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface SalesContextType {
    sales: DailySaleRecord[];
    recordTransaction: (totalAmount: number, transactionCount: number, items: TransactionItem[], dateOverride?: string) => void;
}

export const SalesContext = createContext<SalesContextType>({
    sales: [],
    recordTransaction: () => {},
});

export const SalesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sales, setSales] = usePersistentState<DailySaleRecord[]>('nibsoDailySales', []);

    const recordTransaction = (totalAmount: number, transactionCount: number, items: TransactionItem[], dateOverride?: string) => {
        const date = dateOverride || new Date().toISOString().split('T')[0];
        
        setSales(prevSales => {
            const newSales = [...prevSales];
            const existingRecordIndex = newSales.findIndex(s => s.date === date);

            if (existingRecordIndex !== -1) {
                // Update existing record
                const existingRecord = newSales[existingRecordIndex];
                existingRecord.revenue += totalAmount;
                existingRecord.transactions += transactionCount;
            } else {
                // Create new record
                const newRecord: DailySaleRecord = {
                    id: `sale_${new Date().getTime()}`,
                    date: date,
                    revenue: totalAmount,
                    transactions: transactionCount,
                };
                newSales.push(newRecord);
            }
            return newSales;
        });
    };

    return (
        <SalesContext.Provider value={{ sales, recordTransaction }}>
            {children}
        </SalesContext.Provider>
    );
};
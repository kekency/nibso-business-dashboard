import React, { createContext } from 'react';
import { Expense } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface ExpensesContextType {
    expenses: Expense[];
    addExpense: (expense: Omit<Expense, 'id'>) => void;
}

export const ExpensesContext = createContext<ExpensesContextType>({
    expenses: [],
    addExpense: () => {},
});

export const ExpensesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [expenses, setExpenses] = usePersistentState<Expense[]>('nibsoExpenses', []);

    const addExpense = (expense: Omit<Expense, 'id'>) => {
        const newExpense: Expense = {
            ...expense,
            id: `exp_${new Date().getTime()}`
        };
        setExpenses(prev => [...prev, newExpense].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    };

    return (
        <ExpensesContext.Provider value={{ expenses, addExpense }}>
            {children}
        </ExpensesContext.Provider>
    );
};
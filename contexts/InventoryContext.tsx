import React, { createContext, useContext } from 'react';
import { InventoryItem, TransactionItem } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface InventoryContextType {
    inventory: InventoryItem[];
    addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
    addBulkInventoryItems: (items: Omit<InventoryItem, 'id'>[]) => void;
    updateStock: (soldItems: TransactionItem[]) => void;
    getItemById: (id: string) => InventoryItem | undefined;
}

const initialInventory: InventoryItem[] = [
  { id: 'inv1', name: 'Pain Reliever (100ct)', stock: 88, price: 1500.00, category: 'Pharmacy', imageUrl: 'https://placehold.co/400x400/ef4444/white?text=Meds' },
  { id: 'inv2', name: 'Milk (1L)', stock: 45, price: 1200.00, category: 'Groceries', imageUrl: 'https://placehold.co/400x400/3b82f6/white?text=Milk' },
  { id: 'inv3', name: 'Unleaded Fuel (Litre)', stock: 5230, price: 750.50, category: 'Fuel', imageUrl: 'https://placehold.co/400x400/f97316/white?text=Fuel' },
  { id: 'inv4', name: 'Energy Drink (50cl)', stock: 150, price: 500.00, category: 'Beverages', imageUrl: 'https://placehold.co/400x400/8b5cf6/white?text=Drink' },
  { id: 'inv5', name: 'Bandages (Box)', stock: 112, price: 850.00, category: 'First-Aid', imageUrl: 'https://placehold.co/400x400/22c55e/white?text=First-Aid' },
  { id: 'inv6', name: 'Tomatoes (kg)', stock: 75, price: 450.00, category: 'Produce', imageUrl: 'https://placehold.co/400x400/dc2626/white?text=Produce' },
];

export const InventoryContext = createContext<InventoryContextType>({
    inventory: [],
    addInventoryItem: () => {},
    addBulkInventoryItems: () => {},
    updateStock: () => {},
    getItemById: () => undefined,
});

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [inventory, setInventory] = usePersistentState<InventoryItem[]>('nibsoInventory', initialInventory);

    const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
        const newItem: InventoryItem = {
            ...item,
            id: `inv_${new Date().getTime()}`
        };
        setInventory(prev => [newItem, ...prev]);
    };

    const addBulkInventoryItems = (items: Omit<InventoryItem, 'id'>[]) => {
        const newItems: InventoryItem[] = items.map((item, index) => ({
            ...item,
            id: `inv_${new Date().getTime()}_${index}`
        }));
        setInventory(prev => [...newItems, ...prev]);
    };

    const updateStock = (soldItems: TransactionItem[]) => {
        setInventory(prevInventory => {
            const newInventory = [...prevInventory];
            for (const soldItem of soldItems) {
                const itemIndex = newInventory.findIndex(invItem => invItem.id === soldItem.id);
                if (itemIndex !== -1) {
                    newInventory[itemIndex].stock -= soldItem.quantity;
                }
            }
            return newInventory;
        });
    };
    
    const getItemById = (id: string): InventoryItem | undefined => {
        return inventory.find(item => item.id === id);
    };

    return (
        <InventoryContext.Provider value={{ inventory, addInventoryItem, addBulkInventoryItems, updateStock, getItemById }}>
            {children}
        </InventoryContext.Provider>
    );
};
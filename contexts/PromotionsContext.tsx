import React, { createContext, useMemo } from 'react';
import { Promotion } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface PromotionsContextType {
    promotions: Promotion[];
    addPromotion: (promotion: Omit<Promotion, 'id'>) => void;
    activePromotions: Promotion[];
}

const initialPromotions: Promotion[] = [
    { id: 'promo1', description: '10% off Milk', type: 'percentage', value: 10, target: 'item', targetId: 'inv2', startDate: '2024-08-01', endDate: '2024-08-31' },
    { id: 'promo2', description: '15% off all Beverages', type: 'percentage', value: 15, target: 'category', targetId: 'Beverages', startDate: '2024-08-15', endDate: '2024-08-22' },
];

export const PromotionsContext = createContext<PromotionsContextType>({
    promotions: [],
    addPromotion: () => {},
    activePromotions: [],
});

export const PromotionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [promotions, setPromotions] = usePersistentState<Promotion[]>('nibsoSupermarketPromotions', initialPromotions);

    const addPromotion = (promotion: Omit<Promotion, 'id'>) => {
        const newPromotion: Promotion = {
            ...promotion,
            id: `promo_${new Date().getTime()}`,
        };
        setPromotions(prev => [newPromotion, ...prev]);
    };

    const activePromotions = useMemo(() => {
        const now = new Date();
        return promotions.filter(p => {
            const start = new Date(p.startDate);
            const end = new Date(p.endDate);
            end.setHours(23, 59, 59, 999); // Ensure end date is inclusive
            return now >= start && now <= end;
        });
    }, [promotions]);

    return (
        <PromotionsContext.Provider value={{ promotions, addPromotion, activePromotions }}>
            {children}
        </PromotionsContext.Provider>
    );
};
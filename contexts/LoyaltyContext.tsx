import React, { createContext } from 'react';
import { LoyaltyMember } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface LoyaltyContextType {
    loyaltyMembers: LoyaltyMember[];
    addMember: (member: Omit<LoyaltyMember, 'id' | 'points'>) => void;
    addPoints: (memberId: string, points: number) => void;
}

const initialMembers: LoyaltyMember[] = [
    { id: 'loyal1', name: 'Femi Adekunle', phone: '08022223333', points: 1250 },
    { id: 'loyal2', name: 'Ngozi Eze', phone: '08044445555', points: 480 },
];

export const LoyaltyContext = createContext<LoyaltyContextType>({
    loyaltyMembers: [],
    addMember: () => {},
    addPoints: () => {},
});

export const LoyaltyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loyaltyMembers, setLoyaltyMembers] = usePersistentState<LoyaltyMember[]>('nibsoSupermarketLoyalty', initialMembers);

    const addMember = (member: Omit<LoyaltyMember, 'id' | 'points'>) => {
        const newMember: LoyaltyMember = {
            ...member,
            id: `loyal_${new Date().getTime()}`,
            points: 0,
        };
        setLoyaltyMembers(prev => [newMember, ...prev]);
    };

    const addPoints = (memberId: string, points: number) => {
        setLoyaltyMembers(prev =>
            prev.map(member =>
                member.id === memberId ? { ...member, points: member.points + points } : member
            )
        );
    };

    return (
        <LoyaltyContext.Provider value={{ loyaltyMembers, addMember, addPoints }}>
            {children}
        </LoyaltyContext.Provider>
    );
};
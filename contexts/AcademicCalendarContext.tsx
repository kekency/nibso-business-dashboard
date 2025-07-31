import React, { createContext, useMemo, useCallback } from 'react';
import { AcademicSession, Term } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface AcademicCalendarContextType {
    sessions: AcademicSession[];
    addSession: (session: Omit<AcademicSession, 'id' | 'terms'>) => void;
    addTerm: (sessionId: string, term: Omit<Term, 'id'>) => void;
    activeTermId: string | null;
    setActiveTermId: (id: string | null) => void;
    activeTerm: Term | null;
    getTermById: (termId: string) => Term | null;
}

const initialSessions: AcademicSession[] = [
    {
        id: 'ses_1',
        name: '2024/2025 Session',
        terms: [
            { id: 'term_1', name: 'First Term', startDate: '2024-09-09', endDate: '2024-12-20' },
            { id: 'term_2', name: 'Second Term', startDate: '2025-01-06', endDate: '2025-04-11' },
            { id: 'term_3', name: 'Third Term', startDate: '2025-04-28', endDate: '2025-07-25' },
        ]
    }
];

export const AcademicCalendarContext = createContext<AcademicCalendarContextType>({
    sessions: [],
    addSession: () => {},
    addTerm: () => {},
    activeTermId: null,
    setActiveTermId: () => {},
    activeTerm: null,
    getTermById: () => null,
});

export const AcademicCalendarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sessions, setSessions] = usePersistentState<AcademicSession[]>('nibsoAcademicSessions', initialSessions);
    const [activeTermId, setActiveTermId] = usePersistentState<string | null>('nibsoActiveTermId', 'term_1');

    const addSession = (session: Omit<AcademicSession, 'id' | 'terms'>) => {
        const newSession: AcademicSession = {
            ...session,
            id: `ses_${new Date().getTime()}`,
            terms: [],
        };
        setSessions(prev => [newSession, ...prev]);
    };

    const addTerm = (sessionId: string, term: Omit<Term, 'id'>) => {
        const newTerm: Term = { ...term, id: `term_${new Date().getTime()}` };
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, terms: [...s.terms, newTerm] } : s));
    };
    
    const getTermById = useCallback((termId: string): Term | null => {
        for (const session of sessions) {
            const foundTerm = session.terms.find(t => t.id === termId);
            if (foundTerm) return foundTerm;
        }
        return null;
    }, [sessions]);

    const activeTerm = useMemo(() => {
        if (!activeTermId) return null;
        return getTermById(activeTermId);
    }, [activeTermId, getTermById]);

    return (
        <AcademicCalendarContext.Provider value={{ sessions, addSession, addTerm, activeTermId, setActiveTermId, activeTerm, getTermById }}>
            {children}
        </AcademicCalendarContext.Provider>
    );
};
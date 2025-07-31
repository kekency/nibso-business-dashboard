import React, { createContext, useContext, useCallback } from 'react';
import { CustomerRequest, CustomerRequestStatus } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';
import { SecurityContext } from './SecurityContext';
import { AuthContext } from './AuthContext';

interface CrmContextType {
    requests: CustomerRequest[];
    addRequest: (newRequest: Omit<CustomerRequest, 'id' | 'status' | 'createdAt' | 'agentId'>) => void;
    addRequests: (newRequests: Omit<CustomerRequest, 'id' | 'status' | 'createdAt' | 'agentId'>[]) => void;
    updateRequestStatus: (requestId: string, status: CustomerRequestStatus, agentId?: string) => void;
    getRequestById: (requestId: string) => CustomerRequest | undefined;
}

const initialRequests: CustomerRequest[] = [];

export const CrmContext = createContext<CrmContextType>({
    requests: [],
    addRequest: () => {},
    addRequests: () => {},
    updateRequestStatus: () => {},
    getRequestById: () => undefined,
});

export const CrmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [requests, setRequests] = usePersistentState<CustomerRequest[]>('nibsoCrmRequests', initialRequests);
    const { logSecurityEvent } = useContext(SecurityContext);
    const { currentUser } = useContext(AuthContext);

    const addRequest = (newRequest: Omit<CustomerRequest, 'id' | 'status' | 'createdAt' | 'agentId'>) => {
        const requestToAdd: CustomerRequest = {
            ...newRequest,
            id: `crm_${new Date().getTime()}`,
            status: 'New',
            createdAt: new Date().toISOString(),
        };
        setRequests(prev => [requestToAdd, ...prev]);
        logSecurityEvent({ severity: 'Low', description: `User '${currentUser?.name}' created a new CRM request for ${newRequest.customerName}.` });
    };

    const addRequests = (newRequests: Omit<CustomerRequest, 'id' | 'status' | 'createdAt' | 'agentId'>[]) => {
        const requestsToAdd: CustomerRequest[] = newRequests.map((req, index) => ({
            ...req,
            id: `crm_${new Date().getTime()}_${index}`,
            status: 'New',
            createdAt: new Date().toISOString(),
        }));
        setRequests(prev => [...requestsToAdd, ...prev]);
        logSecurityEvent({ severity: 'Low', description: `User '${currentUser?.name}' bulk imported ${requestsToAdd.length} CRM requests.` });
    };

    const updateRequestStatus = useCallback((requestId: string, status: CustomerRequestStatus, agentId?: string) => {
        setRequests(prev => prev.map(req => {
            if (req.id === requestId) {
                const updatedReq = { ...req, status };
                if (status === 'Assigned' && agentId) {
                    updatedReq.agentId = agentId;
                }
                return updatedReq;
            }
            return req;
        }));
    }, [setRequests]);

    const getRequestById = useCallback((requestId: string): CustomerRequest | undefined => {
        return requests.find(req => req.id === requestId);
    }, [requests]);

    return (
        <CrmContext.Provider value={{ requests, addRequest, addRequests, updateRequestStatus, getRequestById }}>
            {children}
        </CrmContext.Provider>
    );
};
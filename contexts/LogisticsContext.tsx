import React, { createContext } from 'react';
import { Shipment, Driver, ShipmentStatus } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface LogisticsContextType {
    shipments: Shipment[];
    drivers: Driver[];
    addShipment: (shipment: Omit<Shipment, 'id' | 'trackingNumber' | 'status'>) => void;
    updateShipmentStatus: (shipmentId: string, status: ShipmentStatus, driverId?: string) => void;
    addDriver: (driver: Omit<Driver, 'id'>) => void;
}

const initialDrivers: Driver[] = [
    { id: 'driver1', name: 'Musa Bello' },
    { id: 'driver2', name: 'Tunde Adebayo' },
    { id: 'driver3', name: 'Chinedu Okoro' },
];

const initialShipments: Shipment[] = [
    { id: 'ship1', trackingNumber: 'NB-84620', customerName: 'PharmaPlus Ltd', destination: 'Ikeja, Lagos', estimatedDelivery: '2024-08-15', status: 'In-Transit', driverId: 'driver1' },
    { id: 'ship2', trackingNumber: 'NB-91245', customerName: 'General Hospital, Abuja', destination: 'Garki, Abuja', estimatedDelivery: '2024-08-12', status: 'Delivered' },
    { id: 'ship3', trackingNumber: 'NB-33781', customerName: 'Kano Retail', destination: 'Kano City, Kano', estimatedDelivery: '2024-08-18', status: 'Pending' },
];

export const LogisticsContext = createContext<LogisticsContextType>({
    shipments: [],
    drivers: [],
    addShipment: () => {},
    updateShipmentStatus: () => {},
    addDriver: () => {},
});

export const LogisticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [shipments, setShipments] = usePersistentState<Shipment[]>('nibsoLogisticsShipments', initialShipments);
    const [drivers, setDrivers] = usePersistentState<Driver[]>('nibsoLogisticsDrivers', initialDrivers);

    const generateTrackingNumber = () => {
        const prefix = "NB-";
        const randomNumber = Math.floor(10000 + Math.random() * 90000);
        return `${prefix}${randomNumber}`;
    };

    const addShipment = (shipment: Omit<Shipment, 'id' | 'trackingNumber' | 'status'>) => {
        const newShipment: Shipment = {
            ...shipment,
            id: `ship_${new Date().getTime()}`,
            trackingNumber: generateTrackingNumber(),
            status: 'Pending',
        };
        setShipments(prev => [newShipment, ...prev]);
    };

    const updateShipmentStatus = (shipmentId: string, status: ShipmentStatus, driverId?: string) => {
        setShipments(prev =>
            prev.map(shipment =>
                shipment.id === shipmentId ? { ...shipment, status, driverId: driverId ?? shipment.driverId } : shipment
            )
        );
    };
    
    const addDriver = (driver: Omit<Driver, 'id'>) => {
        const newDriver: Driver = {
            ...driver,
            id: `driver_${new Date().getTime()}`,
        };
        setDrivers(prev => [...prev, newDriver]);
    };

    return (
        <LogisticsContext.Provider value={{ shipments, drivers, addShipment, updateShipmentStatus, addDriver }}>
            {children}
        </LogisticsContext.Provider>
    );
};
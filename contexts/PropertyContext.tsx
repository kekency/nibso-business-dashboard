import React, { createContext } from 'react';
import { Property } from '../types';
import { usePersistentState } from '../hooks/usePersistentState';

interface PropertyContextType {
    properties: Property[];
    addProperty: (property: Omit<Property, 'id'>) => void;
    updateProperty: (updatedProperty: Property) => void;
}

const initialProperties: Property[] = [
    { id: 'prop1', title: 'Luxury 3-Bedroom Apartment', address: '1004 Estate, Victoria Island', type: 'Apartment', status: 'Available', price: 2500000, size: 150, bedrooms: 3, bathrooms: 3, imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750' },
    { id: 'prop2', title: 'Spacious Office Space', address: 'Allen Avenue, Ikeja', type: 'Office', status: 'Rented', price: 5000000, size: 200, imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c' },
];

export const PropertyContext = createContext<PropertyContextType>({
    properties: [],
    addProperty: () => {},
    updateProperty: () => {},
});

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [properties, setProperties] = usePersistentState<Property[]>('nibsoRealEstateProperties', initialProperties);

    const addProperty = (property: Omit<Property, 'id'>) => {
        const newProperty: Property = {
            ...property,
            id: `prop_${new Date().getTime()}`,
        };
        setProperties(prev => [newProperty, ...prev]);
    };

    const updateProperty = (updatedProperty: Property) => {
        setProperties(prev => prev.map(p => p.id === updatedProperty.id ? updatedProperty : p));
    };

    return (
        <PropertyContext.Provider value={{ properties, addProperty, updateProperty }}>
            {children}
        </PropertyContext.Provider>
    );
};
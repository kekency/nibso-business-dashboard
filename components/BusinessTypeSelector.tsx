import React from 'react';
import { BusinessType } from '../types';
import { DashboardIcon } from './icons/DashboardIcon';
import { PointOfSaleIcon } from './icons/PointOfSaleIcon';
import { PatientIcon } from './icons/PatientIcon';
import { CylinderIcon } from './icons/CylinderIcon';
import { InventoryIcon } from './icons/InventoryIcon';
import { StudentsIcon } from './icons/StudentsIcon';
import { PropertyIcon } from './icons/PropertyIcon';

interface BusinessTypeSelectorProps {
  onSelect: (type: BusinessType) => void;
}

const businessTypes = [
  { type: BusinessType.General, label: 'General / Retail', icon: <PointOfSaleIcon /> },
  { type: BusinessType.Supermarket, label: 'Supermarket', icon: <InventoryIcon /> },
  { type: BusinessType.Education, label: 'Education', icon: <StudentsIcon /> },
  { type: BusinessType.Hospital, label: 'Hospital', icon: <PatientIcon /> },
  { type: BusinessType.LPGStation, label: 'LPG Station', icon: <CylinderIcon /> },
  { type: BusinessType.RealEstate, label: 'Real Estate', icon: <PropertyIcon /> },
];

const BusinessTypeSelector: React.FC<BusinessTypeSelectorProps> = ({ onSelect }) => {
  return (
    <div className="w-full max-w-2xl bg-[var(--card)] backdrop-blur-sm rounded-2xl shadow-2xl p-8 transition-all duration-500">
      <div className="flex justify-center mb-6">
        <div className="bg-[var(--primary)] p-4 rounded-full">
          <DashboardIcon />
        </div>
      </div>
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2 text-center">Welcome to Nibso</h1>
      <p className="text-[var(--text-muted)] mb-8 text-center">
        To get started, please select your primary business type. This will tailor the dashboard to your needs.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {businessTypes.map(({ type, label, icon }) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className="group flex flex-col items-center justify-center gap-4 bg-slate-700/50 text-white font-bold p-6 rounded-lg hover:bg-[var(--primary)] transition-colors shadow-md text-center"
          >
            <div className="w-12 h-12 flex items-center justify-center text-[var(--primary)] group-hover:text-white transition-colors">
              {icon}
            </div>
            <span>{label}</span>
          </button>
        ))}
      </div>

       <p className="text-xs text-[var(--text-muted)] mt-8 text-center">
            You can change this later in the settings menu.
        </p>
    </div>
  );
};

export default BusinessTypeSelector;
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { View } from '../types';

interface PasswordExpiryNotificationProps {
    setActiveView: (view: View) => void;
}

const PasswordExpiryNotification: React.FC<PasswordExpiryNotificationProps> = ({ setActiveView }) => {
    const { currentUser } = useContext(AuthContext);

    if (!currentUser?.passwordLastChanged) {
        return null; // Don't show for users not yet enrolled
    }

    const lastChanged = new Date(currentUser.passwordLastChanged);
    const today = new Date();
    const daysSinceChange = Math.floor((today.getTime() - lastChanged.getTime()) / (1000 * 3600 * 24));
    
    const expiryDays = 60;
    const warningDays = 10;
    const daysLeft = expiryDays - daysSinceChange;

    if (daysLeft > warningDays) {
        return null;
    }

    const isExpired = daysLeft <= 0;
    const message = isExpired
        ? `Your password has expired. Please change it immediately.`
        : `Your password will expire in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}.`;

    return (
        <div className={`p-4 rounded-lg mb-6 flex items-center justify-between ${isExpired ? 'bg-red-500/90 text-white' : 'bg-yellow-500/90 text-slate-900'}`}>
            <p className="font-semibold">{message}</p>
            <button 
                onClick={() => setActiveView(View.ChangePassword)}
                className={`px-4 py-2 rounded-md font-bold transition-colors ${isExpired ? 'bg-white text-red-600 hover:bg-red-100' : 'bg-[var(--background)] text-white hover:bg-opacity-80'}`}
            >
                Change Password
            </button>
        </div>
    );
};

export default PasswordExpiryNotification;
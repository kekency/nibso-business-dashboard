import React, { createContext, useState, useEffect } from 'react';
import { BusinessProfile, BusinessType, ThemeColors } from '../types';

interface BusinessContextType {
    profile: BusinessProfile;
    updateProfile: (newProfile: BusinessProfile) => void;
}

export const defaultTheme: ThemeColors = {
  primary: '#38bdf8', // sky-400
  background: '#0f172a', // slate-900
  card: 'rgba(30, 41, 59, 0.8)', // slate-800 with 80% opacity
  text: '#e2e8f0', // slate-200
  textMuted: '#94a3b8', // slate-400
  border: '#334155', // slate-700
  input: '#334155', // slate-700
};

const defaultProfile: BusinessProfile = {
    businessName: 'Nibso',
    businessAddress: '123 Commerce Way, Lagos, Nigeria',
    currency: '₦',
    taxRate: 7.5,
    logoUrl: '',
    theme: defaultTheme,
    businessType: BusinessType.General,
    isConfigured: false,
};

export const BusinessContext = createContext<BusinessContextType>({
    profile: defaultProfile,
    updateProfile: () => {},
});

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [profile, setProfile] = useState<BusinessProfile>(() => {
        try {
            const savedProfile = localStorage.getItem('nibsoBusinessProfile');
             if (!savedProfile) return defaultProfile;

            const parsed = JSON.parse(savedProfile);
            
            // Migration for old themeColor property
            if (parsed.themeColor && !parsed.theme) {
                parsed.theme = {
                    ...defaultTheme,
                    primary: parsed.themeColor,
                };
                delete parsed.themeColor;
            }

            // Merge with defaults to ensure all theme keys exist, even for older saved profiles
            return {
                ...defaultProfile,
                ...parsed,
                theme: {
                    ...defaultTheme,
                    ...(parsed.theme || {}),
                }
            };
        } catch (error) {
            console.error("Failed to parse business profile from localStorage", error);
            return defaultProfile;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('nibsoBusinessProfile', JSON.stringify(profile));

            // Update favicon
            const favicon = document.getElementById('favicon') as HTMLLinkElement;
            if (favicon) {
                if (profile.logoUrl && profile.logoUrl.startsWith('data:image')) {
                    favicon.href = profile.logoUrl;
                    const mimeType = profile.logoUrl.substring(profile.logoUrl.indexOf(':') + 1, profile.logoUrl.indexOf(';'));
                    favicon.type = mimeType;
                } else {
                    favicon.href = '/favicon.svg';
                    favicon.type = 'image/svg+xml';
                }
            }
        } catch (error) {
            console.error("Failed to save business profile to localStorage", error);
        }
    }, [profile]);

    const updateProfile = (newProfile: BusinessProfile) => {
        setProfile(newProfile);
    };

    return (
        <BusinessContext.Provider value={{ profile, updateProfile }}>
            {children}
        </BusinessContext.Provider>
    );
};
import React, { useContext, useState, useEffect } from 'react';
import { BusinessContext, defaultTheme } from '../contexts/BusinessContext';
import { SecurityContext } from '../contexts/SecurityContext';
import { AuthContext } from '../contexts/AuthContext';
import { BusinessProfile, BusinessType, ThemeColors } from '../types';

const SettingsDashboard: React.FC = () => {
    const { profile, updateProfile } = useContext(BusinessContext);
    const { logSecurityEvent } = useContext(SecurityContext);
    const { currentUser } = useContext(AuthContext);
    const [formData, setFormData] = useState<BusinessProfile>(profile);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        setFormData(profile);
    }, [profile]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'taxRate' ? parseFloat(value) || 0 : value;
        setFormData(prev => ({ ...prev, [name]: parsedValue }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, logoUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            theme: {
                ...prev.theme!,
                [name]: value
            }
        }));
    };

    const handleThemePreset = (color: string) => {
        setFormData(prev => ({
            ...prev,
            theme: {
                ...prev.theme!,
                primary: color
            }
        }));
    }

    const handleResetTheme = () => {
        setFormData(prev => ({...prev, theme: defaultTheme}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile(formData);
        if (currentUser) {
            logSecurityEvent({ severity: 'Medium', description: `Settings updated by user '${currentUser.name}'.` });
        }
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} >
                <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-8 mb-8">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Business Profile</h2>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label htmlFor="businessName" className="block text-sm font-medium text-[var(--text-muted)] mb-2">Business Name</label>
                                <input
                                    type="text"
                                    id="businessName"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                />
                            </div>
                             <div>
                                <label htmlFor="businessType" className="block text-sm font-medium text-[var(--text-muted)] mb-2">Business Type</label>
                                <select
                                    id="businessType"
                                    name="businessType"
                                    value={formData.businessType || BusinessType.General}
                                    onChange={handleChange}
                                    className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                >
                                    <option value={BusinessType.General}>General (Retail, etc)</option>
                                    <option value={BusinessType.Hospital}>Hospital</option>
                                    <option value={BusinessType.LPGStation}>LPG Station</option>
                                    <option value={BusinessType.Supermarket}>Supermarket</option>
                                    <option value={BusinessType.Education}>Education</option>
                                    <option value={BusinessType.RealEstate}>Real Estate</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="logoUrl" className="block text-sm font-medium text-[var(--text-muted)] mb-2">Business Logo</label>
                            <div className="flex items-center gap-4">
                                {formData.logoUrl && <img src={formData.logoUrl} alt="Logo Preview" className="h-16 w-16 object-contain rounded-md bg-[var(--input)] p-1"/>}
                                <input
                                    type="file"
                                    id="logoUrl"
                                    name="logoUrl"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-[var(--text-muted)] file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[var(--primary)] file:text-white hover:file:bg-[var(--primary-hover)]"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="businessAddress" className="block text-sm font-medium text-[var(--text-muted)] mb-2">Business Address</label>
                            <textarea
                                id="businessAddress"
                                name="businessAddress"
                                rows={3}
                                value={formData.businessAddress}
                                onChange={handleChange}
                                className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label htmlFor="currency" className="block text-sm font-medium text-[var(--text-muted)] mb-2">Currency Symbol</label>
                                <input
                                    type="text"
                                    id="currency"
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    placeholder="₦"
                                    className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                />
                            </div>
                            <div>
                                <label htmlFor="taxRate" className="block text-sm font-medium text-[var(--text-muted)] mb-2">Sales Tax Rate (%)</label>
                                <input
                                    type="number"
                                    id="taxRate"
                                    name="taxRate"
                                    step="0.01"
                                    value={formData.taxRate}
                                    onChange={handleChange}
                                    placeholder="7.5"
                                    className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-8">
                     <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Theme Customization</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
                        {(Object.keys(formData.theme || defaultTheme) as Array<keyof ThemeColors>).map((key) => (
                             <div key={key} className="flex items-center justify-between">
                                <label htmlFor={key} className="capitalize text-sm font-medium text-[var(--text-muted)]">
                                    {key.replace(/([A-Z])/g, ' $1')} Color
                                </label>
                                 <input 
                                    type="color" 
                                    id={key}
                                    name={key}
                                    value={formData.theme?.[key] || '#000000'}
                                    onChange={handleThemeChange}
                                    className="p-1 h-10 w-10 block bg-white border border-slate-600 cursor-pointer rounded-lg"
                                />
                             </div>
                        ))}
                    </div>

                     <div className="flex items-center gap-6 mt-8 pt-6 border-t border-[var(--border)]">
                        <span className="text-sm font-medium text-[var(--text-muted)]">Primary Presets:</span>
                         <div className="flex-grow flex items-center gap-2">
                             {['#38bdf8', '#f43f5e', '#22c55e', '#f97316', '#8b5cf6'].map(color => (
                                 <button
                                    key={color}
                                    type="button"
                                    onClick={() => handleThemePreset(color)}
                                    className={`w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white transition-transform ${formData.theme?.primary === color ? 'ring-2 ring-white transform scale-110' : ''}`}
                                    style={{ backgroundColor: color }}
                                    aria-label={`Set primary color to ${color}`}
                                 />
                             ))}
                        </div>
                        <button type="button" onClick={handleResetTheme} className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] underline">
                            Reset to Defaults
                        </button>
                    </div>
                </div>
                
                <div className="flex items-center justify-end pt-8">
                    {showSuccess && <span className="text-green-400 mr-4 transition-opacity duration-300">Settings saved!</span>}
                    <button type="submit" className="bg-[var(--primary)] text-white font-bold py-2 px-6 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SettingsDashboard;
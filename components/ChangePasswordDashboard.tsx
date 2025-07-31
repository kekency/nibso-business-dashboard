import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { SecurityContext } from '../contexts/SecurityContext';
import { UsersContext } from '../contexts/UsersContext';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';


const ChangePasswordDashboard: React.FC = () => {
    const { currentUser, login } = useContext(AuthContext);
    const { updateUser } = useContext(UsersContext);
    const { logSecurityEvent } = useContext(SecurityContext);
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!currentUser) {
            setError('No user is currently logged in.');
            return;
        }

        if (currentUser.password !== currentPassword) {
            setError('The current password you entered is incorrect.');
            logSecurityEvent({ severity: 'High', description: `Failed password change attempt for user '${currentUser.name}' (incorrect current password).` });
            return;
        }

        if (newPassword.length < 6) {
             setError('New password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('The new password and confirmation password do not match.');
            return;
        }
        
        if (newPassword === currentPassword) {
            setError('The new password cannot be the same as the old password.');
            return;
        }

        const updatedUser = {
            ...currentUser,
            password: newPassword,
            passwordLastChanged: new Date().toISOString(),
        };

        // Persist change to the master user list
        updateUser(updatedUser);
        // Update the current session
        login(updatedUser);
        
        logSecurityEvent({ severity: 'Medium', description: `User '${currentUser.name}' successfully changed their password.` });
        
        setSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccess(''), 3000);
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-8">
                <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-6">Change Your Password</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-[var(--text-muted)] mb-2">Current Password</label>
                        <div className="relative">
                            <input
                                type={showCurrent ? 'text' : 'password'}
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 pr-10 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                required
                            />
                             <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label={showCurrent ? "Hide password" : "Show password"}>
                                {showCurrent ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-[var(--text-muted)] mb-2">New Password</label>
                         <div className="relative">
                            <input
                                type={showNew ? 'text' : 'password'}
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 pr-10 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                required
                            />
                             <button type="button" onClick={() => setShowNew(!showNew)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label={showNew ? "Hide password" : "Show password"}>
                                {showNew ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--text-muted)] mb-2">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showConfirm ? 'text' : 'password'}
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 pr-10 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                                required
                            />
                             <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label={showConfirm ? "Hide password" : "Show password"}>
                                {showConfirm ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                    
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    {success && <p className="text-green-400 text-sm">{success}</p>}

                    <div className="pt-2">
                        <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold py-3 px-6 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md">
                            Update Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordDashboard;
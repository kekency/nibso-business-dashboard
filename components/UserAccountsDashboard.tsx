import React, { useState, useContext } from 'react';
import { User, UserRole, BusinessType } from '../types';
import { AuthContext } from '../contexts/AuthContext';
import { SecurityContext } from '../contexts/SecurityContext';
import { BusinessContext } from '../contexts/BusinessContext';
import { UsersContext } from '../contexts/UsersContext';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';

const getRoleClass = (role: UserRole) => {
    switch (role) {
        case 'Proprietor':
        case 'Admin': return 'bg-red-500 text-white';
        case 'Manager': return 'bg-yellow-500 text-slate-900';
        case 'Cashier': return 'bg-sky-500 text-white';
        case 'Attendant': return 'bg-orange-500 text-white';
        case 'Teacher': return 'bg-purple-500 text-white';
        case 'Non-Teaching': return 'bg-indigo-500 text-white';
        default: return 'bg-slate-500 text-white';
    }
};

const UserAccountsDashboard: React.FC = () => {
    const { profile } = useContext(BusinessContext);
    const { users, addUser } = useContext(UsersContext);
    const { currentUser } = useContext(AuthContext);
    const { logSecurityEvent } = useContext(SecurityContext);

    const isHospital = profile.businessType === BusinessType.Hospital;
    const isLPG = profile.businessType === BusinessType.LPGStation;
    const isEducation = profile.businessType === BusinessType.Education;
    
    const getDefaultRole = (): UserRole => {
        if (isLPG) return 'Attendant';
        if (isEducation) return 'Teacher';
        return 'Cashier';
    };

    const initialFormState = { name: '', email: '', password: '', confirmPassword: '', role: getDefaultRole(), specialty: '', assignedClass: '' };
    const [newUser, setNewUser] = useState(initialFormState);
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
        if (name === 'password' || name === 'confirmPassword') {
            setPasswordError('');
        }
    };

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordError('');

        if (newUser.password.length < 6) {
            setPasswordError('Password must be at least 6 characters long.');
            return;
        }

        if (newUser.password !== newUser.confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }

        if (newUser.name && newUser.email && newUser.role) {
            const newUserToAdd: Omit<User, 'id'> = {
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                password: newUser.password,
                passwordLastChanged: new Date().toISOString(),
                specialty: isHospital ? newUser.specialty : undefined,
                assignedClass: isEducation && newUser.role === 'Teacher' ? newUser.assignedClass : undefined,
            };
            addUser(newUserToAdd);
            logSecurityEvent({ severity: 'Medium', description: `Admin '${currentUser?.name}' created new user '${newUser.name}'.` });
            setNewUser(initialFormState);
            setShowPassword(false);
            setShowConfirmPassword(false);
        }
    };
    
    const getAvailableRoles = (): UserRole[] => {
        if (isLPG) return ['Admin', 'Manager', 'Attendant'];
        if (isEducation) return ['Admin', 'Manager', 'Teacher', 'Non-Teaching'];
        return ['Admin', 'Manager', 'Cashier'];
    };
    const availableRoles: UserRole[] = getAvailableRoles();

    const canAddUsers = currentUser?.role === 'Admin' || currentUser?.role === 'Proprietor';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6"><h2 className="text-xl font-semibold text-[var(--text-primary)]">Team Members</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Name</th>
                                {(isHospital || isEducation) && <th className="p-4 font-semibold text-[var(--text-muted)]">{isHospital ? 'Specialty' : 'Details'}</th>}
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Email</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-[var(--text-primary)] font-medium">{user.name}</td>
                                    {isHospital && <td className="p-4 text-[var(--text-muted)]">{user.specialty || 'N/A'}</td>}
                                    {isEducation && <td className="p-4 text-[var(--text-muted)]">{user.assignedClass || user.salary && `Salary: ${profile.currency}${user.salary}` || 'N/A'}</td>}
                                    <td className="p-4 text-[var(--text-muted)]">{user.email}</td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${getRoleClass(user.role)}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {canAddUsers && (
                <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6 h-fit">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Add New User</h2>
                    <form onSubmit={handleAddUser} className="space-y-4">
                        <input type="text" name="name" value={newUser.name} onChange={handleInputChange} placeholder="Full Name" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                        <input type="email" name="email" value={newUser.email} onChange={handleInputChange} placeholder="Email Address" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                        
                        <div className="relative">
                           <input type={showPassword ? 'text' : 'password'} name="password" value={newUser.password} onChange={handleInputChange} placeholder="Password" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 pr-10 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label={showPassword ? "Hide password" : "Show password"}>
                                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                        
                         <div className="relative">
                           <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={newUser.confirmPassword} onChange={handleInputChange} placeholder="Confirm Password" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 pr-10 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--text-muted)] hover:text-[var(--text-primary)]" aria-label={showConfirmPassword ? "Hide password" : "Show password"}>
                                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>

                        {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}
                        
                        <select name="role" value={newUser.role} onChange={handleInputChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required>
                            {availableRoles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                        
                        {isHospital && (
                             <input type="text" name="specialty" value={newUser.specialty} onChange={handleInputChange} placeholder="Specialty (e.g., Cardiology)" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                        )}
                        
                        {isEducation && newUser.role === 'Teacher' && (
                             <input type="text" name="assignedClass" value={newUser.assignedClass} onChange={handleInputChange} placeholder="Assigned Class (e.g., JSS 1)" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                        )}

                        <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md">Add User</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default UserAccountsDashboard;
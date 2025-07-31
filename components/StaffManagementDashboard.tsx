import React, { useState, useContext } from 'react';
import { User, UserRole } from '../types';
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
        case 'Teacher': return 'bg-purple-500 text-white';
        case 'StudentAdvisor': return 'bg-teal-500 text-white';
        case 'Non-Teaching': return 'bg-indigo-500 text-white';
        default: return 'bg-slate-500 text-white';
    }
};

const StaffManagementDashboard: React.FC = () => {
    const { profile } = useContext(BusinessContext);
    const { users, addUser, updateUser } = useContext(UsersContext);
    const { currentUser } = useContext(AuthContext);
    const { logSecurityEvent } = useContext(SecurityContext);

    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [salaryInput, setSalaryInput] = useState<string>('');
    
    const availableRoles: UserRole[] = ['Admin', 'Manager', 'Teacher', 'Non-Teaching', 'StudentAdvisor'];
    const initialFormState = { name: '', email: '', password: '', confirmPassword: '', role: 'Teacher' as UserRole, assignedClass: '', salary: '' };
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
                assignedClass: newUser.role === 'Teacher' ? newUser.assignedClass : undefined,
                salary: newUser.salary ? parseFloat(newUser.salary) : undefined,
            };
            addUser(newUserToAdd);
            logSecurityEvent({ severity: 'Medium', description: `Admin '${currentUser?.name}' created new user '${newUser.name}'.` });
            setNewUser(initialFormState);
            setShowPassword(false);
            setShowConfirmPassword(false);
        }
    };

    const handleEditSalary = (user: User) => {
        setEditingUser(user);
        setSalaryInput(user.salary?.toString() || '');
    };

    const handleSaveSalary = () => {
        if (editingUser) {
            const updatedUser = { ...editingUser, salary: parseFloat(salaryInput) || 0 };
            updateUser(updatedUser);
            logSecurityEvent({ severity: 'Medium', description: `Salary for '${editingUser.name}' updated by '${currentUser?.name}'.` });
            setEditingUser(null);
        }
    };
    
    const canAddUsers = currentUser?.role === 'Admin' || currentUser?.role === 'Proprietor';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                <div className="p-6"><h2 className="text-xl font-semibold text-[var(--text-primary)]">All Users</h2></div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-[var(--border)]/30">
                            <tr>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Name</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Role</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)]">Email</th>
                                <th className="p-4 font-semibold text-[var(--text-muted)] text-right">Salary</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-b border-[var(--border)] last:border-b-0 hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-[var(--text-primary)] font-medium">{user.name}</td>
                                    <td className="p-4"><span className={`px-3 py-1 text-xs font-bold rounded-full ${getRoleClass(user.role)}`}>{user.role}</span></td>
                                    <td className="p-4 text-[var(--text-muted)]">{user.email}</td>
                                    <td className="p-4 text-right text-[var(--text-muted)]">
                                        {editingUser?.id === user.id ? (
                                            <div className="flex justify-end items-center gap-2">
                                                <input type="number" value={salaryInput} onChange={e => setSalaryInput(e.target.value)} className="bg-slate-600 text-white p-1 rounded-lg w-28 text-right"/>
                                                <button onClick={handleSaveSalary} className="text-green-400">Save</button>
                                                <button onClick={() => setEditingUser(null)} className="text-red-400">X</button>
                                            </div>
                                        ) : (
                                            <div className="flex justify-end items-center gap-2 group">
                                                <span>{user.salary ? `${profile.currency}${user.salary.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`: 'Not Set'}</span>
                                                {canAddUsers && <button onClick={() => handleEditSalary(user)} className="opacity-0 group-hover:opacity-100 text-sky-400">Edit</button>}
                                            </div>
                                        )}
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
                            <input type={showPassword ? "text" : "password"} name="password" value={newUser.password} onChange={handleInputChange} placeholder="Initial Password" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 pr-10 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                        
                        <div className="relative">
                            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={newUser.confirmPassword} onChange={handleInputChange} placeholder="Confirm Password" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 pr-10 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                            </button>
                        </div>
                        
                        {passwordError && <p className="text-red-400 text-sm">{passwordError}</p>}

                        <select name="role" value={newUser.role} onChange={handleInputChange} className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" required>
                            {availableRoles.map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                        {newUser.role === 'Teacher' && (
                             <input type="text" name="assignedClass" value={newUser.assignedClass} onChange={handleInputChange} placeholder="Assigned Class (e.g., JSS 1)" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                        )}
                        <input type="number" name="salary" value={newUser.salary} onChange={handleInputChange} placeholder="Salary (Optional)" className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]" />
                        <button type="submit" className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md">Add User</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default StaffManagementDashboard;
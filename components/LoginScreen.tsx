import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { SecurityContext } from '../contexts/SecurityContext';
import { DashboardIcon } from './icons/DashboardIcon';
import { BusinessContext } from '../contexts/BusinessContext';
import { UsersContext } from '../contexts/UsersContext';
import ResultCheckerLogin from './ResultCheckerLogin';
import { Student, BusinessType } from '../types';
import { UserAccountsIcon } from './icons/UserAccountsIcon';
import { StudentsIcon } from './icons/StudentsIcon';
import { EyeIcon } from './icons/EyeIcon';
import { EyeSlashIcon } from './icons/EyeSlashIcon';

interface LoginScreenProps {
  onStudentLogin: (student: Student) => void;
}

type LoginView = 'portal' | 'staff' | 'student';

const LoginScreen: React.FC<LoginScreenProps> = ({ onStudentLogin }) => {
  const { users, updateUser } = useContext(UsersContext);
  const { login } = useContext(AuthContext);
  const { logSecurityEvent } = useContext(SecurityContext);
  const { profile } = useContext(BusinessContext);
  
  const isEducation = profile.businessType === BusinessType.Education;

  const [loginView, setLoginView] = useState<LoginView>(isEducation ? 'portal' : 'staff');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (loginView === 'staff') {
      requestAnimationFrame(() => {
        emailInputRef.current?.focus();
      });
    }
  }, [loginView]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const userToLogin = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

    if (userToLogin) {
      const passwordRequired = 'password' in userToLogin && userToLogin.password !== undefined;

      if (!passwordRequired || userToLogin.password === password) {
        logSecurityEvent({ severity: 'Low', description: `User '${userToLogin.name}' logged in successfully.` });

        let userToSet = userToLogin;
        if (!userToLogin.passwordLastChanged) {
          userToSet = { ...userToLogin, passwordLastChanged: new Date().toISOString() };
          updateUser(userToSet);
        }

        login(userToSet);
      } else {
        logSecurityEvent({ severity: 'High', description: `Failed login attempt for user '${userToLogin.name}'.` });
        setError('Incorrect password. Please try again.');
      }
    } else {
      logSecurityEvent({ severity: 'High', description: `Failed login attempt for unknown user '${email}'.` });
      setError('User with that email does not exist.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm bg-[var(--card)] backdrop-blur-sm rounded-2xl shadow-2xl p-8 transition-all duration-500">

        {/* PORTAL SELECTION */}
        <div style={{ display: loginView === 'portal' ? 'block' : 'none' }}>
          <div className="flex justify-center mb-6">
            <div className="bg-[var(--primary)] p-4 rounded-full">
              <DashboardIcon />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2 text-center">Welcome to</h1>
          <h2 className="text-2xl font-semibold text-[var(--text-muted)] mb-8 text-center">{profile.businessName} Portal</h2>
          <p className="text-[var(--text-muted)] mb-8 text-center">Please select your role to continue.</p>

          <div className="space-y-4">
            <button
              onClick={() => { setError(''); setLoginView('staff'); }}
              className="w-full flex items-center justify-center gap-4 bg-slate-700 text-white font-bold p-4 rounded-lg hover:bg-[var(--primary)] transition-colors shadow-md"
            >
              <UserAccountsIcon />
              <span>Staff Login</span>
            </button>
            <button
              onClick={() => { setError(''); setLoginView('student'); }}
              className="w-full flex items-center justify-center gap-4 bg-slate-700 text-white font-bold p-4 rounded-lg hover:bg-[var(--primary)] transition-colors shadow-md"
            >
              <StudentsIcon />
              <span>Student Portal</span>
            </button>
          </div>
        </div>

        {/* STAFF LOGIN */}
        <div style={{ display: loginView === 'staff' ? 'block' : 'none' }}>
          <div className="flex justify-center mb-6">
            <div className="bg-[var(--primary)] p-4 rounded-full">
              <UserAccountsIcon />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2 text-center">Staff Login</h1>
          <p className="text-[var(--text-muted)] mb-8 text-center">Log in to the {profile.businessName} dashboard</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-muted)] mb-2">Email Address</label>
              <input
                ref={emailInputRef}
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--card)] transition-all duration-200"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--text-muted)] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 pr-10 rounded-lg border border-[var(--border)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 focus:ring-offset-[var(--card)] transition-all duration-200"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-[var(--primary)] text-white font-bold p-3 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              Login
            </button>
          </form>
          {isEducation && (
            <div className="mt-6 text-center">
                <button
                onClick={() => { setError(''); setLoginView('portal'); }}
                className="text-sm text-[var(--primary)] hover:underline"
                >
                Back to portal
                </button>
            </div>
           )}
        </div>

        {/* STUDENT LOGIN */}
        <div style={{ display: loginView === 'student' ? 'block' : 'none' }}>
          <ResultCheckerLogin
            onLoginSuccess={onStudentLogin}
            onSwitchToPortal={() => { setError(''); setLoginView('portal'); }}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
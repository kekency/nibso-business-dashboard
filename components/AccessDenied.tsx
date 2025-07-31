import React from 'react';

const AccessDenied: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center bg-[var(--card)] backdrop-blur-sm rounded-2xl p-8">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Access Denied</h2>
            <p className="text-[var(--text-muted)] max-w-md">
                You do not have the necessary permissions to view this page. Please contact your administrator if you believe this is an error.
            </p>
        </div>
    );
};

export default AccessDenied;
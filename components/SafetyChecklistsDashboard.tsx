import React, { useContext } from 'react';
import { SafetyChecklistContext } from '../contexts/SafetyChecklistContext';

const SafetyChecklistsDashboard: React.FC = () => {
    const { checklists, completeChecklist } = useContext(SafetyChecklistContext);

    const timeSince = (date?: string): string => {
        if (!date) return 'Never';
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " minutes ago";
        return Math.floor(seconds) + " seconds ago";
    };
    
    return (
        <div className="space-y-8">
            {checklists.map(checklist => (
                 <div key={checklist.id} className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-xl font-semibold text-[var(--text-primary)]">{checklist.name}</h2>
                            <p className="text-[var(--text-muted)]">Frequency: {checklist.frequency} | Last completed: {timeSince(checklist.lastCompleted)}</p>
                        </div>
                        <button 
                            onClick={() => completeChecklist(checklist.id)}
                            className="bg-[var(--primary)] text-white font-bold py-2 px-4 rounded-lg hover:bg-[var(--primary-hover)] transition-colors shadow-md flex-shrink-0"
                        >
                            Complete Now
                        </button>
                    </div>
                    <div className="mt-4 border-t border-[var(--border)] pt-4">
                        <h3 className="font-semibold text-[var(--text-primary)] mb-2">Tasks:</h3>
                        <ul className="list-disc list-inside text-[var(--text-muted)] space-y-1">
                            {checklist.tasks.map(task => <li key={task.id}>{task.description}</li>)}
                        </ul>
                    </div>
                 </div>
            ))}
        </div>
    );
};

export default SafetyChecklistsDashboard;
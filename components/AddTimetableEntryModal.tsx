import React, { useState, useContext, useEffect } from 'react';
import { TimetableEntry } from '../types';
import { TimetableContext } from '../contexts/TimetableContext';
import { CourseContext } from '../contexts/CourseContext';

interface AddTimetableEntryModalProps {
    onClose: () => void;
    className: string;
    day: string;
    timeSlot: string;
    entry?: TimetableEntry;
}

const AddTimetableEntryModal: React.FC<AddTimetableEntryModalProps> = ({ onClose, className, day, timeSlot, entry }) => {
    const { addEntry, updateEntry, deleteEntry } = useContext(TimetableContext);
    const { courses } = useContext(CourseContext);

    const isEditing = !!entry;
    const [courseId, setCourseId] = useState(entry?.courseId || '');

    useEffect(() => {
        if (entry) {
            setCourseId(entry.courseId);
        }
    }, [entry]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!courseId) return;

        const entryData = {
            className,
            dayOfWeek: day as any,
            timeSlot,
            courseId,
        };

        if (isEditing && entry) {
            updateEntry({ ...entry, ...entryData });
        } else {
            addEntry(entryData);
        }
        onClose();
    };

    const handleDelete = () => {
        if (entry) {
            deleteEntry(entry.id);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-slate-800 rounded-xl shadow-2xl p-8 w-full max-w-md" 
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                    {isEditing ? 'Edit Period' : 'Add Period'}
                </h2>
                <p className="text-[var(--text-muted)] mb-6">
                    {day}, {timeSlot} for {className}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="course-select" className="block text-sm font-medium text-[var(--text-muted)] mb-1">Course</label>
                        <select
                            id="course-select"
                            value={courseId}
                            onChange={e => setCourseId(e.target.value)}
                            className="w-full bg-[var(--input)] text-[var(--text-primary)] p-3 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                            required
                        >
                            <option value="">Select a course</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>{course.name} ({course.code})</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-between items-center gap-4 pt-4 mt-4 border-t border-[var(--border)]">
                        <div>
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-[var(--primary)] text-white font-bold py-2 px-4 rounded-lg hover:bg-[var(--primary-hover)] transition-colors"
                            >
                                {isEditing ? 'Save Changes' : 'Add Period'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTimetableEntryModal;

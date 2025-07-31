import React, { useState, useContext, useMemo } from 'react';
import { View } from '../types';
import { TimetableContext } from '../contexts/TimetableContext';
import { StudentContext } from '../contexts/StudentContext';
import { CourseContext } from '../contexts/CourseContext';
import { getCourseColor } from '../utils/courseColors';

interface TimetableDashboardProps {
    openModal: (view: View, data: any) => void;
}

const timeSlots = [
  '08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
  '12:00 - 13:00',
  '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00',
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

const TimetableDashboard: React.FC<TimetableDashboardProps> = ({ openModal }) => {
    const { entries } = useContext(TimetableContext);
    const { students } = useContext(StudentContext);
    const { getCourseById } = useContext(CourseContext);

    const classNames = useMemo(() => [...new Set(students.map(s => s.className))].sort(), [students]);
    const [selectedClass, setSelectedClass] = useState(classNames[0] || '');

    const handleCellClick = (day: typeof daysOfWeek[number], timeSlot: string) => {
        const entry = entries.find(e => 
            e.className === selectedClass && 
            e.dayOfWeek === day && 
            e.timeSlot === timeSlot
        );
        openModal(View.AddTimetableEntry, { className: selectedClass, day, timeSlot, entry });
    };

    return (
        <div className="space-y-6">
            <div className="bg-[var(--card)] backdrop-blur-sm p-4 rounded-xl shadow-lg flex items-center gap-4">
                <label htmlFor="class-filter" className="font-semibold text-[var(--text-primary)]">
                    Viewing Timetable for:
                </label>
                <select 
                    id="class-filter"
                    value={selectedClass} 
                    onChange={e => setSelectedClass(e.target.value)}
                    className="bg-[var(--input)] text-[var(--text-primary)] p-2 rounded-lg border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                    {classNames.map(name => <option key={name} value={name}>{name}</option>)}
                </select>
            </div>
            
            {!selectedClass && (
                <div className="text-center p-8 bg-[var(--card)] rounded-xl">
                    <p className="text-[var(--text-muted)]">Please add students to a class to create a timetable.</p>
                </div>
            )}

            {selectedClass && (
                <div className="bg-[var(--card)] backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-[var(--border)]/30">
                                    <th className="p-2 border border-[var(--border)] text-center text-[var(--text-muted)] w-36">Time</th>
                                    {daysOfWeek.map(day => (
                                        <th key={day} className="p-2 border border-[var(--border)] text-center text-[var(--text-muted)]">{day}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {timeSlots.map(timeSlot => {
                                    if (timeSlot === '12:00 - 13:00') {
                                        return (
                                            <tr key={timeSlot}>
                                                <td className="p-2 border border-[var(--border)] text-center font-bold text-[var(--text-primary)] bg-slate-700">{timeSlot}</td>
                                                <td colSpan={5} className="p-2 border border-[var(--border)] text-center font-bold text-[var(--text-primary)] bg-slate-700">LUNCH BREAK</td>
                                            </tr>
                                        );
                                    }
                                    return (
                                        <tr key={timeSlot}>
                                            <td className="p-2 border border-[var(--border)] text-center font-mono text-[var(--text-muted)]">{timeSlot}</td>
                                            {daysOfWeek.map(day => {
                                                const entry = entries.find(e => 
                                                    e.className === selectedClass && 
                                                    e.dayOfWeek === day && 
                                                    e.timeSlot === timeSlot
                                                );
                                                const course = entry ? getCourseById(entry.courseId) : null;
                                                const color = course ? getCourseColor(course.name) : 'transparent';
                                                
                                                return (
                                                    <td key={day} className="p-0 border border-[var(--border)] h-24 relative" >
                                                        <button 
                                                            onClick={() => handleCellClick(day, timeSlot)}
                                                            className="w-full h-full text-center transition-colors hover:bg-slate-700/50 flex items-center justify-center p-2"
                                                            style={{ backgroundColor: entry ? `${color}4D` : 'transparent' }} // 33 for ~20% opacity
                                                        >
                                                            {course && (
                                                                <div className="flex flex-col items-center justify-center text-white">
                                                                    <span className="font-bold">{course.name}</span>
                                                                    <span className="text-xs opacity-80">{course.code}</span>
                                                                </div>
                                                            )}
                                                            {!entry && <span className="text-slate-600 text-3xl">+</span>}
                                                        </button>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimetableDashboard;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Task, Project } from '../../types';

interface CalendarViewProps {
    tasks: Task[];
    projects: Project[];
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, projects }) => {
    const navigate = useNavigate();
    // Simplified Calendar: Displays current month days
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const padding = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    const getItemsForDate = (day: number) => {
        const dateStr = new Date(currentYear, currentMonth, day).toISOString().split('T')[0];
        
        const dayTasks = tasks.filter(t => t.dueDate && t.dueDate.startsWith(dateStr));
        const dayProjects = projects.filter(p => p.dueDate && p.dueDate.startsWith(dateStr));
        
        return { dayTasks, dayProjects };
    };

    return (
        <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden h-full flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-800">
                    {today.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="text-xs text-slate-500">
                    Deadlines View
                </div>
            </div>
            
            <div className="grid grid-cols-7 bg-slate-200 gap-px flex-1">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="bg-slate-50 p-2 text-center text-xs font-semibold text-slate-500 uppercase">
                        {day}
                    </div>
                ))}

                {padding.map((_, i) => (
                    <div key={`pad-${i}`} className="bg-white"></div>
                ))}

                {days.map(day => {
                    const { dayTasks, dayProjects } = getItemsForDate(day);
                    const isToday = day === today.getDate();

                    return (
                        <div key={day} className={`bg-white min-h-[100px] p-2 hover:bg-slate-50 transition-colors ${isToday ? 'bg-blue-50/50' : ''}`}>
                            <div className={`text-xs font-semibold mb-1 ${isToday ? 'text-blue-600 bg-blue-100 w-6 h-6 flex items-center justify-center rounded-full' : 'text-slate-400'}`}>
                                {day}
                            </div>
                            <div className="space-y-1 overflow-y-auto max-h-[100px]">
                                {dayProjects.map(p => (
                                    <div 
                                        key={p.id}
                                        onClick={() => navigate(`/projects/${p.id}`)}
                                        className="text-[10px] bg-indigo-100 text-indigo-700 px-1 py-0.5 rounded cursor-pointer truncate"
                                    >
                                        PRJ: {p.name}
                                    </div>
                                ))}
                                {dayTasks.map(t => (
                                    <div 
                                        key={t.id}
                                        onClick={() => navigate(`/tasks/${t.id}`)}
                                        className={`text-[10px] px-1 py-0.5 rounded cursor-pointer truncate border-l-2 ${t.status === 'Done' ? 'bg-emerald-50 text-emerald-700 border-emerald-500' : 'bg-white border-slate-300 text-slate-600 shadow-sm'}`}
                                    >
                                        {t.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

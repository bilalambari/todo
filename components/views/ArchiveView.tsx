import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProjectStatus, TaskStatus } from '../../types';
import { Archive, CheckCircle, Clock, Filter as FilterIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ArchiveView: React.FC = () => {
    const { projects, tasks, members } = useStore();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'projects' | 'tasks'>('tasks');
    const [filterProject, setFilterProject] = useState<string>('');
    const [filterAssignee, setFilterAssignee] = useState<string>('');
    const [showFilters, setShowFilters] = useState(false);

    // Filter for Archived or Completed/Done items
    const archivedProjects = projects.filter(p =>
        p.status === ProjectStatus.ARCHIVED || p.status === ProjectStatus.COMPLETED
    );

    let archivedTasks = tasks.filter(t =>
        t.status === TaskStatus.ARCHIVED
    );

    // Apply filters for tasks
    if (filterProject) {
        archivedTasks = archivedTasks.filter(t => t.projectId === filterProject);
    }
    if (filterAssignee) {
        archivedTasks = archivedTasks.filter(t => t.assigneeIds?.includes(filterAssignee));
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Archive className="text-indigo-600" />
                        Archive
                    </h1>
                    <p className="text-slate-500">View completed and archived projects and tasks.</p>
                </div>

                <div className="flex gap-2 items-center">
                    {activeTab === 'tasks' && (
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors border ${showFilters ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            <FilterIcon size={18} /> Filters
                        </button>
                    )}
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'projects' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Projects ({archivedProjects.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('tasks')}
                            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === 'tasks' ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            Tasks ({archivedTasks.length})
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters Panel for Tasks */}
            {activeTab === 'tasks' && showFilters && (
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Project</label>
                            <select
                                value={filterProject}
                                onChange={(e) => setFilterProject(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="">All Projects</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Assignee</label>
                            <select
                                value={filterAssignee}
                                onChange={(e) => setFilterAssignee(e.target.value)}
                                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="">All Members</option>
                                {members.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {(filterProject || filterAssignee) && (
                        <button
                            onClick={() => {
                                setFilterProject('');
                                setFilterAssignee('');
                            }}
                            className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {activeTab === 'projects' ? (
                    <div className="divide-y divide-slate-100">
                        {archivedProjects.length === 0 ? (
                            <div className="p-12 text-center text-slate-400">
                                <Archive size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No archived projects found.</p>
                            </div>
                        ) : (
                            archivedProjects.map(project => (
                                <div key={project.id} onClick={() => navigate(`/projects/${project.id}`)} className="p-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${project.status === ProjectStatus.ARCHIVED ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-600'
                                            }`}>
                                            {project.status === ProjectStatus.ARCHIVED ? <Archive size={20} /> : <CheckCircle size={20} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
                                            <p className="text-sm text-slate-500 line-clamp-1">{project.description || "No description"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm text-slate-500">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.status === ProjectStatus.ARCHIVED ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {project.status}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {new Date(project.updatedAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {archivedTasks.length === 0 ? (
                            <div className="p-12 text-center text-slate-400">
                                <Archive size={48} className="mx-auto mb-4 opacity-20" />
                                <p>No archived tasks found{(filterProject || filterAssignee) && ' matching your filters'}.</p>
                            </div>
                        ) : (
                            archivedTasks.map(task => {
                                const taskProject = projects.find(p => p.id === task.projectId);
                                return (
                                    <div key={task.id} onClick={() => navigate(`/tasks/${task.id}`)} className="p-4 hover:bg-slate-50 cursor-pointer flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${task.status === TaskStatus.ARCHIVED ? 'bg-slate-100 text-slate-500' : 'bg-green-100 text-green-600'
                                                }`}>
                                                {task.status === TaskStatus.ARCHIVED ? <Archive size={20} /> : <CheckCircle size={20} />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{task.title}</h3>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <span className="bg-slate-100 px-1.5 py-0.5 rounded">{task.priority}</span>
                                                    {taskProject && <span className="text-indigo-600">• {taskProject.name}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 text-sm text-slate-500">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${task.status === TaskStatus.ARCHIVED ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-700'
                                                }`}>
                                                {task.status}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock size={14} />
                                                {new Date(task.updatedAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

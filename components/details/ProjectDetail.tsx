
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { GridView } from '../views/GridView';
import { ProjectModal } from '../modals/ProjectModal';
import { ConfirmModal } from '../modals/ConfirmModal';
import { ArrowLeft, PieChart, Calendar, DollarSign, User, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { PROJECT_STATUS_COLORS } from '../../constants';
import { ProjectStatus, Role } from '../../types';

export const ProjectDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { projects, tasks, members, deleteProject } = useStore();
    const { user } = useAuth();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const project = projects.find(p => p.id === id);
    const projectTasks = tasks.filter(t => t.projectId === id);
    const lead = members.find(m => m.id === project?.leadId);
    
    // Stats for Dashboard
    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter(t => t.status === 'Done').length;
    const pendingTasks = totalTasks - completedTasks;
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const team = members.filter(m => project?.memberIds?.includes(m.id));

    if (!project) return <div>Project not found</div>;

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteProject(project.id);
            navigate('/');
        } catch (error) {
            console.error("Failed to delete project", error);
            alert("Failed to delete project");
        } finally {
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 pb-20">
             <button onClick={() => navigate('/')} className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft size={18} className="mr-2" /> Back to Dashboard
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${PROJECT_STATUS_COLORS[project.status]}`}>
                                {project.status}
                            </span>
                        </div>
                        <p className="text-slate-500 max-w-2xl">{project.description}</p>
                    </div>
                    <div className="flex items-center gap-3">
                         <button onClick={() => setIsEditModalOpen(true)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                            Edit Project
                         </button>
                         {user?.role === Role.ADMIN && (
                             <button onClick={() => setIsDeleteModalOpen(true)} className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors">
                                Delete
                             </button>
                         )}
                    </div>
                </div>

                {/* --- Project Dashboard --- */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                        <div className="flex items-center gap-2 text-indigo-800 text-sm font-bold mb-2">
                            <CheckCircle size={16} /> Completed
                        </div>
                        <div className="text-2xl font-bold text-indigo-900">{completedTasks} <span className="text-sm font-normal text-indigo-600">Tasks</span></div>
                    </div>
                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                        <div className="flex items-center gap-2 text-orange-800 text-sm font-bold mb-2">
                            <Clock size={16} /> Pending
                        </div>
                        <div className="text-2xl font-bold text-orange-900">{pendingTasks} <span className="text-sm font-normal text-orange-600">Tasks</span></div>
                    </div>
                     <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 md:col-span-2">
                         <div className="flex justify-between items-center mb-2">
                             <div className="text-sm font-bold text-slate-700">Total Progress</div>
                             <div className="text-xl font-bold text-slate-900">{progress}%</div>
                         </div>
                         <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }}></div>
                         </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
                    <div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-1">
                            <Calendar size={14} /> Timeline
                        </div>
                        <div className="font-semibold text-slate-800 text-sm">
                            {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'} - {new Date(project.dueDate).toLocaleDateString()}
                        </div>
                    </div>
                     <div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-1">
                            <DollarSign size={14} /> Budget
                        </div>
                        <div className="font-semibold text-slate-800 text-sm">${project.budget.toLocaleString()}</div>
                    </div>
                     <div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-1">
                            <User size={14} /> Manager
                        </div>
                        <div className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                            {lead && <img src={lead.avatarUrl} className="w-5 h-5 rounded-full" />}
                            {lead ? lead.name : 'Unassigned'}
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-slate-400 text-xs uppercase font-bold mb-1">
                            <Users size={14} /> Team ({team.length})
                        </div>
                        <div className="flex -space-x-2">
                            {team.map(m => (
                                <img key={m.id} src={m.avatarUrl} className="w-6 h-6 rounded-full border border-white" title={m.name} />
                            ))}
                            {team.length === 0 && <span className="text-slate-500 text-sm italic">No members</span>}
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Project Tasks</h2>
                    <button onClick={() => navigate('/tasks/new')} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">+ Add Task</button>
                </div>
                <GridView type="tasks" data={projectTasks} />
            </div>

            <ProjectModal 
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                initialData={project}
            />

            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Project"
                message="Are you sure? This will delete the project and all associated tasks. This action cannot be undone."
                confirmText="Delete Project"
                isDangerous={true}
                isLoading={isDeleting}
            />
        </div>
    )
}

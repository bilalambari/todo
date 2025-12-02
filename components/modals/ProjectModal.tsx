
import React, { useState, useEffect } from 'react';
import { Project, ProjectStatus, TeamMember } from '../../types';
import { useStore } from '../../context/StoreContext';
import { X, Calendar, DollarSign, User, Users } from 'lucide-react';

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: Project;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, initialData }) => {
    const { addProject, updateProject, members } = useStore();

    const [formData, setFormData] = useState<Partial<Project>>({
        name: '',
        description: '',
        budget: 0,
        dueDate: '',
        startDate: '',
        leadId: '',
        memberIds: [],
        status: ProjectStatus.PLANNING,
    });

    useEffect(() => {
        if (initialData) {
            // Edit Mode: Hydrate form
            setFormData({
                ...initialData,
                dueDate: initialData.dueDate ? initialData.dueDate.split('T')[0] : '',
                startDate: initialData.startDate ? initialData.startDate.split('T')[0] : '',
            });
        } else {
            // Create Mode: Reset
            setFormData({
                name: '',
                description: '',
                budget: 0,
                dueDate: new Date().toISOString().split('T')[0],
                startDate: new Date().toISOString().split('T')[0],
                leadId: '',
                memberIds: [],
                status: ProjectStatus.PLANNING,
            });
        }
    }, [initialData, isOpen]);

    const handleSubmit = () => {
        if (!formData.name?.trim()) return alert('Project Name is required');

        const projectPayload: Project = {
            id: initialData ? initialData.id : Math.random().toString(36).substr(2, 9),
            name: formData.name!,
            status: formData.status as ProjectStatus,
            dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : new Date().toISOString(),
            startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
            budget: Number(formData.budget) || 0,
            description: formData.description || '',
            leadId: formData.leadId,
            memberIds: formData.memberIds || [],
            createdAt: initialData?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (initialData) {
            updateProject(projectPayload);
        } else {
            addProject(projectPayload);
        }
        onClose();
    };

    const toggleMember = (memberId: string) => {
        const current = formData.memberIds || [];
        if (current.includes(memberId)) {
            setFormData({ ...formData, memberIds: current.filter(id => id !== memberId) });
        } else {
            setFormData({ ...formData, memberIds: [...current, memberId] });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-xl font-bold text-slate-800">{initialData ? 'Edit Project' : 'Create New Project'}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Project Name <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Website Redesign"
                                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                            />
                        </div>
                    </div>

                    {/* Dates & Budget */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                                <Calendar size={14} className="text-slate-400" /> Start Date
                            </label>
                            <input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                                <Calendar size={14} className="text-slate-400" /> Due Date
                            </label>
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                                <DollarSign size={14} className="text-slate-400" /> Budget
                            </label>
                            <input
                                type="number"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>

                    {/* People */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                                <User size={14} className="text-slate-400" /> Project Manager
                            </label>
                            <select
                                value={formData.leadId}
                                onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="">Select Lead...</option>
                                {members.map(m => (
                                    <option key={m.id} value={m.id}>{m.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                                <Users size={14} className="text-slate-400" /> Team Members
                            </label>
                            <div className="border border-slate-300 rounded-lg p-2 h-32 overflow-y-auto space-y-1">
                                {members.map(m => (
                                    <div
                                        key={m.id}
                                        onClick={() => toggleMember(m.id)}
                                        className={`flex items-center gap-2 p-2 rounded cursor-pointer text-sm ${formData.memberIds?.includes(m.id) ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50'}`}
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData.memberIds?.includes(m.id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300'}`}>
                                            {formData.memberIds?.includes(m.id) && <span className="text-white text-xs">✓</span>}
                                        </div>
                                        <span className={formData.memberIds?.includes(m.id) ? 'text-indigo-700 font-medium' : 'text-slate-600'}>{m.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Status / Archive */}
                    {initialData && (
                        <div className="pt-4 border-t border-slate-100">
                            <label className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.status === ProjectStatus.ARCHIVED}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        status: e.target.checked ? ProjectStatus.ARCHIVED : (initialData.status === ProjectStatus.ARCHIVED ? ProjectStatus.ACTIVE : initialData.status)
                                    })}
                                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 border-gray-300"
                                />
                                <div>
                                    <span className="font-semibold text-slate-900 block">Archive Project</span>
                                    <span className="text-xs text-slate-500">Project will be moved to Archive and hidden from the main list.</span>
                                </div>
                            </label>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-slate-700 font-medium hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                    >
                        {initialData ? 'Save Changes' : 'Create Project'}
                    </button>
                </div>
            </div>
        </div>
    );
};

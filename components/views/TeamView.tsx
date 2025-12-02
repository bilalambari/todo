
import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { MemberModal } from '../modals/MemberModal';
import { ConfirmModal } from '../modals/ConfirmModal';
import { Role, TeamMember } from '../../types';
import { Plus, Edit2, Trash2, Mail, Shield } from 'lucide-react';

export const TeamView: React.FC = () => {
    const { members, deleteMember } = useStore();
    const { user } = useAuth();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<TeamMember | undefined>(undefined);
    
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [memberToDelete, setMemberToDelete] = useState<string | null>(null);

    const handleEdit = (member: TeamMember) => {
        setEditingMember(member);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingMember(undefined);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        setMemberToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (memberToDelete) {
            await deleteMember(memberToDelete);
            setIsDeleteModalOpen(false);
            setMemberToDelete(null);
        }
    };

    return (
        <div className="p-6 md:p-10">
            <div className="flex justify-between items-center mb-8">
               <div>
                    <h1 className="text-2xl font-bold text-slate-900">Team Members</h1>
                    <p className="text-slate-500">Manage your workspace collaborators.</p>
               </div>
               {user?.role === Role.ADMIN && (
                 <button 
                    onClick={handleAdd} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
                 >
                   <Plus size={18} /> Add Member
                 </button>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map(member => (
                    <div key={member.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center relative group hover:shadow-md transition-all">
                        {user?.role === Role.ADMIN && (
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(member)} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                    <Edit2 size={16} />
                                </button>
                                {member.id !== user.id && ( // Prevent self-delete
                                    <button onClick={() => handleDeleteClick(member.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                )}
                            </div>
                        )}
                        
                        <img src={member.avatarUrl} alt={member.name} className="w-20 h-20 rounded-full mb-4 border-4 border-slate-50" />
                        
                        <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                        
                        <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1 mb-4">
                            <Mail size={14} /> {member.email}
                        </div>
                        
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1.5 ${member.role === Role.ADMIN ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                            <Shield size={12} /> {member.role}
                        </span>
                    </div>
                ))}
            </div>

            <MemberModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                initialData={editingMember}
            />

            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Remove Member"
                message="Are you sure you want to remove this member? They will no longer be able to access the workspace."
                confirmText="Remove"
                isDangerous={true}
            />
        </div>
    )
}

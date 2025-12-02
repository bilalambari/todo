
import React, { useState, useEffect } from 'react';
import { TeamMember, Role } from '../../types';
import { useStore } from '../../context/StoreContext';
import { X, User, Mail, Shield, Lock } from 'lucide-react';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: TeamMember;
}

export const MemberModal: React.FC<MemberModalProps> = ({ isOpen, onClose, initialData }) => {
  const { addMember, updateMember } = useStore();
  
  const [formData, setFormData] = useState<Partial<TeamMember>>({
    name: '',
    email: '',
    password: '',
    role: Role.MEMBER,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: Role.MEMBER,
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = () => {
    if (!formData.name?.trim() || !formData.email?.trim()) return alert('Name and Email are required');

    const memberPayload: TeamMember = {
        id: initialData ? initialData.id : Math.random().toString(36).substr(2, 9),
        name: formData.name!,
        email: formData.email!,
        password: formData.password || initialData?.password || 'password', // Default password if empty
        role: formData.role || Role.MEMBER,
        avatarUrl: initialData?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name!)}&background=random&color=fff`
    };
    
    if (initialData) {
        updateMember(memberPayload);
    } else {
        addMember(memberPayload);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="text-xl font-bold text-slate-800">{initialData ? 'Edit Member' : 'Add New Member'}</h3>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={20} />
                </button>
            </div>
            
            <div className="p-6 space-y-6">
                {/* Name */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                        <User size={14} className="text-slate-400" /> Full Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                        <Mail size={14} className="text-slate-400" /> Email Address <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="john@taskflow.com"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                        <Lock size={14} className="text-slate-400" /> Password
                    </label>
                    <input 
                        type="text" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="Set user password"
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                        <Shield size={14} className="text-slate-400" /> Role
                    </label>
                    <select 
                        value={formData.role} 
                        onChange={(e) => setFormData({...formData, role: e.target.value as Role})}
                        className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                        {Object.values(Role).map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>
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
                    {initialData ? 'Update Member' : 'Add Member'}
                </button>
            </div>
        </div>
    </div>
  );
};

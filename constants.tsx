import React from 'react';
import { ProjectStatus, TaskStatus, Priority } from './types';

export const STATUS_COLORS: Record<TaskStatus, string> = {
  [TaskStatus.BACKLOG]: 'bg-gray-100 text-gray-700',
  [TaskStatus.TODO]: 'bg-blue-100 text-blue-700',
  [TaskStatus.DOING]: 'bg-amber-100 text-amber-700',
  [TaskStatus.REVIEW]: 'bg-purple-100 text-purple-700',
  [TaskStatus.DONE]: 'bg-emerald-100 text-emerald-700',
  [TaskStatus.ARCHIVED]: 'bg-slate-100 text-slate-500',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.LOW]: 'bg-slate-100 text-slate-600',
  [Priority.MEDIUM]: 'bg-blue-50 text-blue-600',
  [Priority.HIGH]: 'bg-orange-50 text-orange-600',
  [Priority.URGENT]: 'bg-red-100 text-red-700',
};

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  [ProjectStatus.PLANNING]: 'bg-gray-100 text-gray-600',
  [ProjectStatus.ACTIVE]: 'bg-green-100 text-green-700',
  [ProjectStatus.ON_HOLD]: 'bg-yellow-100 text-yellow-700',
  [ProjectStatus.COMPLETED]: 'bg-indigo-100 text-indigo-700',
  [ProjectStatus.ARCHIVED]: 'bg-slate-100 text-slate-500',
};

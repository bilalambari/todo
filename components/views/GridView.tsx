
import React from 'react';
import { Link } from 'react-router-dom';
import { Project, Task, ProjectStatus, TaskStatus, Priority } from '../../types';
import { useStore } from '../../context/StoreContext';
import { STATUS_COLORS, PRIORITY_COLORS, PROJECT_STATUS_COLORS } from '../../constants';

interface GridViewProps {
  type: 'tasks' | 'projects' | 'team';
  data: any[];
}

export const GridView: React.FC<GridViewProps> = ({ type, data }) => {
  const { members, projects } = useStore();

  const getMember = (id: string) => members.find(m => m.id === id);
  const getProjectName = (id: string) => projects.find(p => p.id === id)?.name || 'Unknown Project';

  if (data.length === 0) {
      return <div className="p-8 text-center text-slate-500">No items found.</div>
  }

  return (
    <div className="w-full overflow-x-auto bg-white border border-slate-200 rounded-lg shadow-sm">
      <table className="w-full text-left text-sm text-slate-600">
        <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
          <tr>
            <th className="px-6 py-4 border-b border-slate-200">Name</th>
            {type === 'tasks' && <th className="px-6 py-4 border-b border-slate-200">Project</th>}
            <th className="px-6 py-4 border-b border-slate-200">Status</th>
            {type !== 'team' && <th className="px-6 py-4 border-b border-slate-200">Due Date</th>}
            {type === 'tasks' && <th className="px-6 py-4 border-b border-slate-200">Priority</th>}
            {type === 'projects' && <th className="px-6 py-4 border-b border-slate-200">Budget</th>}
            <th className="px-6 py-4 border-b border-slate-200">
                {type === 'team' ? 'Role' : (type === 'tasks' ? 'Assignees' : 'Owner/Lead')}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-slate-50 transition-colors cursor-pointer group">
              <td className="px-6 py-4 font-medium text-slate-900">
                {type === 'tasks' ? (
                   <Link to={`/tasks/${item.id}`} className="hover:text-indigo-600 hover:underline">{item.title}</Link>
                ) : type === 'projects' ? (
                   <Link to={`/projects/${item.id}`} className="hover:text-indigo-600 hover:underline">{item.name}</Link>
                ) : (
                    <div className="flex items-center gap-3">
                        <img src={item.avatarUrl} className="w-8 h-8 rounded-full" alt="" />
                        <div>
                            <div className="font-semibold">{item.name}</div>
                            <div className="text-xs text-slate-400 font-normal">{item.email}</div>
                        </div>
                    </div>
                )}
              </td>
              {type === 'tasks' && (
                  <td className="px-6 py-4">
                      <Link to={`/projects/${item.projectId}`} className="text-indigo-600 hover:underline text-xs font-medium">
                          {getProjectName(item.projectId)}
                      </Link>
                  </td>
              )}
              <td className="px-6 py-4">
                {type !== 'team' ? (
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    type === 'tasks' 
                        ? STATUS_COLORS[item.status as TaskStatus] 
                        : PROJECT_STATUS_COLORS[item.status as ProjectStatus]
                    }`}>
                    {item.status}
                    </span>
                ) : (
                   <span className="text-slate-500">{item.email}</span> 
                )}
              </td>
              {type !== 'team' && (
                  <td className="px-6 py-4 text-slate-500">
                    {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '-'}
                  </td>
              )}
              {type === 'tasks' && (
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${PRIORITY_COLORS[item.priority as Priority]}`}>
                    {item.priority}
                  </span>
                </td>
              )}
              {type === 'projects' && (
                <td className="px-6 py-4 font-mono text-slate-600">
                  ${item.budget.toLocaleString()}
                </td>
              )}
              <td className="px-6 py-4">
                 {type === 'tasks' && (
                     <div className="flex -space-x-2">
                         {item.assigneeIds && item.assigneeIds.length > 0 ? (
                             item.assigneeIds.map((id: string) => {
                                 const m = getMember(id);
                                 return m ? <img key={id} src={m.avatarUrl} className="w-6 h-6 rounded-full border border-white" title={m.name} /> : null;
                             })
                         ) : <span className="text-slate-400 text-xs">Unassigned</span>}
                     </div>
                 )}
                 {type === 'projects' && (
                     <div className="flex items-center gap-2">
                        {item.leadId && <img src={getMember(item.leadId)?.avatarUrl} className="w-6 h-6 rounded-full" />}
                        <span className="text-xs">{getMember(item.leadId)?.name || 'Unassigned'}</span>
                     </div>
                 )}
                 {type === 'team' && <span className="capitalize bg-slate-100 px-2 py-1 rounded text-xs">{item.role}</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

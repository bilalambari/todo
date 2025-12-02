
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task, TaskStatus } from '../../types';
import { useStore } from '../../context/StoreContext';
import { STATUS_COLORS, PRIORITY_COLORS } from '../../constants';
import { MoreHorizontal, Calendar, Paperclip, CheckSquare } from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ tasks }) => {
  const { updateTask, members } = useStore();
  const navigate = useNavigate();
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Exclude ARCHIVED from Kanban board
  const columns = Object.values(TaskStatus).filter(status => status !== TaskStatus.ARCHIVED);

  const getMember = (id: string) => members.find(m => m.id === id);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (draggedTaskId) {
      const task = tasks.find((t) => t.id === draggedTaskId);
      if (task && task.status !== status) {
        updateTask({ ...task, status, updatedAt: new Date().toISOString() });
      }
      setDraggedTaskId(null);
    }
  };

  return (
    <div className="h-full overflow-x-auto overflow-y-hidden">
      <div className="flex h-full min-w-max p-6 gap-6">
        {columns.map((status) => {
          const columnTasks = tasks.filter((t) => t.status === status);

          return (
            <div
              key={status}
              className="w-80 flex flex-col h-full bg-slate-100/50 rounded-xl border border-slate-200"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status)}
            >
              {/* Column Header */}
              <div className="p-3 flex items-center justify-between border-b border-slate-100 bg-white rounded-t-xl">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${status === TaskStatus.DONE ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                  <h3 className="font-semibold text-slate-700 text-sm">{status}</h3>
                  <span className="text-xs text-slate-400 font-medium bg-slate-100 px-2 py-0.5 rounded-full">
                    {columnTasks.length}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              {/* Tasks Container */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {columnTasks.map((task) => {
                  const completedSubtasks = task.checklist.filter(st => st.completed).length;

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onClick={() => navigate(`/tasks/${task.id}`)}
                      className={`bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-all group ${draggedTaskId === task.id ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wider ${PRIORITY_COLORS[task.priority]}`}>
                          {task.priority}
                        </span>
                        {task.tags.length > 0 && (
                          <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-indigo-400" title={task.tags[0]}></span>
                          </div>
                        )}
                      </div>

                      <h4 className="text-sm font-medium text-slate-800 mb-3 leading-snug group-hover:text-indigo-600 transition-colors">
                        {task.title}
                      </h4>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-50">
                        <div className="flex items-center gap-3 text-slate-400">
                          {(task.attachments.length > 0) && (
                            <div className="flex items-center gap-1 text-xs">
                              <Paperclip size={14} />
                              <span>{task.attachments.length}</span>
                            </div>
                          )}
                          {(task.checklist.length > 0) && (
                            <div className="flex items-center gap-1 text-xs">
                              <CheckSquare size={14} />
                              <span>{completedSubtasks}/{task.checklist.length}</span>
                            </div>
                          )}
                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-xs" title={new Date(task.dueDate).toLocaleDateString()}>
                              <Calendar size={14} />
                            </div>
                          )}
                        </div>

                        <div className="flex -space-x-1.5">
                          {task.assigneeIds && task.assigneeIds.length > 0 ? (
                            task.assigneeIds.slice(0, 3).map(id => {
                              const m = getMember(id);
                              return m ? (
                                <img
                                  key={id}
                                  src={m.avatarUrl}
                                  alt={m.name}
                                  className="w-6 h-6 rounded-full border border-white shadow-sm object-cover"
                                  title={m.name}
                                />
                              ) : null;
                            })
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                              <span className="text-[10px] text-slate-400">?</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Add Button Placeholder */}
              <div className="p-2">
                <button
                  onClick={() => navigate('/tasks/new')}
                  className="w-full py-2 text-xs font-medium text-slate-500 hover:bg-slate-200 hover:text-slate-700 rounded-lg flex items-center justify-center gap-1 transition-colors dashed border border-transparent hover:border-slate-300"
                >
                  <span className="text-lg">+</span> Add Task
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

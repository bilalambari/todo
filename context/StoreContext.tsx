
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, Task, TeamMember, Notification } from '../types';
import { api } from '../services/api';

interface AppData {
  projects: Project[];
  tasks: Task[];
  members: TeamMember[];
  notifications: Notification[];
}

export type FilterOperator = 'include' | 'exclude';

export interface FilterState {
  field: string;
  value: any;
  operator?: FilterOperator;
}

interface StoreContextType extends AppData {
  addProject: (project: Project) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  addTask: (task: Task) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;

  addMember: (member: TeamMember) => Promise<void>;
  updateMember: (member: TeamMember) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;

  addNotification: (notification: Notification) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;

  refreshData: () => Promise<void>;
  isLoading: boolean;

  // UI Persistence State
  taskViewMode: 'KANBAN' | 'GRID' | 'CALENDAR';
  setTaskViewMode: (mode: 'KANBAN' | 'GRID' | 'CALENDAR') => void;
  taskFilters: FilterState[];
  setTaskFilters: (filters: FilterState[]) => void;
  taskMatchAll: boolean;
  setTaskMatchAll: (match: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>({
    projects: [],
    tasks: [],
    members: [],
    notifications: []
  });
  const [isLoading, setIsLoading] = useState(true);

  // UI State Persistence
  const [taskViewMode, setTaskViewMode] = useState<'KANBAN' | 'GRID' | 'CALENDAR'>('KANBAN');
  const [taskFilters, setTaskFilters] = useState<FilterState[]>([
    { field: 'title', value: '', operator: 'include' }
  ]);
  const [taskMatchAll, setTaskMatchAll] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Use allSettled to ensure partial data loads if one endpoint fails
      const results = await Promise.allSettled([
        api.getMembers(),
        api.getProjects(),
        api.getTasks(),
        api.getNotifications()
      ]);

      const [membersRes, projectsRes, tasksRes, notifRes] = results;

      const getValue = <T,>(result: PromiseSettledResult<T[]>, label: string): T[] => {
        if (result.status === 'fulfilled') return result.value;
        console.warn(`Failed to fetch ${label}:`, result.reason);
        return [];
      };

      setData({
        members: getValue(membersRes, 'members'),
        projects: getValue(projectsRes, 'projects'),
        tasks: getValue(tasksRes, 'tasks'),
        notifications: getValue(notifRes, 'notifications')
      });
    } catch (error) {
      console.error("Critical error fetching data", JSON.stringify(error, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = async () => {
    await fetchData();
  };

  // Projects
  const addProject = async (project: Project) => {
    try {
      setData(prev => ({ ...prev, projects: [...prev.projects, project] }));
      await api.createProject(project);
    } catch (e) {
      console.error(e);
      fetchData();
      throw e;
    }
  };

  const updateProject = async (project: Project) => {
    try {
      setData(prev => ({
        ...prev,
        projects: prev.projects.map(p => p.id === project.id ? project : p)
      }));
      await api.updateProject(project);
    } catch (e) {
      console.error(e);
      fetchData();
      throw e;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      setData(prev => ({
        ...prev,
        projects: prev.projects.filter(p => p.id !== id),
        tasks: prev.tasks.filter(t => t.projectId !== id)
      }));
      await api.deleteProject(id);
    } catch (e) {
      console.error(e);
      fetchData();
      throw e;
    }
  };

  // Tasks
  const addTask = async (task: Task) => {
    try {
      setData(prev => ({ ...prev, tasks: [...prev.tasks, task] }));
      await api.createTask(task);
    } catch (e) {
      console.error(e);
      fetchData();
      throw e;
    }
  };

  const updateTask = async (task: Task) => {
    try {
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.map(t => t.id === task.id ? task : t)
      }));
      await api.updateTask(task);
    } catch (e) {
      console.error(e);
      fetchData();
      throw e;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      setData(prev => ({
        ...prev,
        tasks: prev.tasks.filter(t => t.id !== id)
      }));
      await api.deleteTask(id);
    } catch (e) {
      console.error("Store Delete Task Error:", e);
      fetchData();
      throw e;
    }
  };

  // Members
  const addMember = async (member: TeamMember) => {
    try {
      setData(prev => ({ ...prev, members: [...prev.members, member] }));
      await api.createMember(member);
    } catch (e) {
      console.error(e);
      fetchData();
      throw e;
    }
  };

  const updateMember = async (member: TeamMember) => {
    try {
      setData(prev => ({
        ...prev,
        members: prev.members.map(m => m.id === member.id ? member : m)
      }));
      await api.updateMember(member);
    } catch (e) {
      console.error(e);
      fetchData();
      throw e;
    }
  };

  const deleteMember = async (id: string) => {
    try {
      setData(prev => ({
        ...prev,
        members: prev.members.filter(m => m.id !== id)
      }));
      await api.deleteMember(id);
    } catch (e) {
      console.error(e);
      fetchData();
      throw e;
    }
  };

  // Notifications
  const addNotification = async (notification: Notification) => {
    try {
      setData(prev => ({ ...prev, notifications: [notification, ...prev.notifications] }));
      await api.createNotification(notification);
    } catch (e) {
      console.error(e);
      fetchData();
      throw e;
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      setData(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
      }));
      await api.markNotificationRead(id);
    } catch (e) {
      console.error(e);
      fetchData();
      throw e;
    }
  };

  return (
    <StoreContext.Provider
      value={{
        ...data,
        addProject,
        updateProject,
        deleteProject,
        addTask,
        updateTask,
        deleteTask,
        addMember,
        updateMember,
        deleteMember,
        addNotification,
        markNotificationRead,
        refreshData,
        isLoading,
        taskViewMode,
        setTaskViewMode,
        taskFilters,
        setTaskFilters,
        taskMatchAll,
        setTaskMatchAll
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

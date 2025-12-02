
import { supabase } from './supabase';
import { Project, Task, TeamMember, Notification, ProjectStatus, TaskStatus, Priority, Role } from '../types';

// Helper to map DB snake_case to Frontend camelCase
const mapProjectFromDB = (p: any): Project => ({
  id: p.id,
  name: p.name,
  status: p.status as ProjectStatus,
  leadId: p.lead_id,
  memberIds: p.member_ids || [],
  startDate: p.start_date,
  dueDate: p.due_date,
  budget: Number(p.budget),
  description: p.description,
  createdAt: p.created_at,
  updatedAt: p.updated_at,
});

const mapProjectToDB = (p: Project) => ({
  id: p.id,
  name: p.name,
  status: p.status,
  lead_id: p.leadId,
  member_ids: p.memberIds,
  start_date: p.startDate,
  due_date: p.dueDate,
  budget: p.budget,
  description: p.description,
  created_at: p.createdAt,
  updated_at: p.updatedAt,
});

const mapTaskFromDB = (t: any): Task => ({
  id: t.id,
  title: t.title,
  projectId: t.project_id || '',
  status: t.status as TaskStatus,
  assigneeIds: t.assignee_ids || [],
  priority: t.priority as Priority,
  dueDate: t.due_date,
  tags: t.tags || [],
  checklist: t.checklist || [],
  attachments: t.attachments || [],
  comments: t.comments || [],
  notes: t.notes,
  pomodoroSessions: t.pomodoro_sessions || 0,
  createdAt: t.created_at,
  updatedAt: t.updated_at,
});

const mapTaskToDB = (t: Task) => ({
  id: t.id,
  title: t.title,
  project_id: t.projectId || null, // Convert empty string to null for FK compatibility
  status: t.status,
  assignee_ids: t.assigneeIds || [],
  priority: t.priority,
  due_date: t.dueDate,
  tags: t.tags || [],
  checklist: t.checklist || [],
  attachments: t.attachments || [],
  comments: t.comments || [],
  notes: t.notes,
  // pomodoro_sessions: t.pomodoroSessions || 0, // Temporarily disabled to fix PGRST204 error
  created_at: t.createdAt,
  updated_at: t.updatedAt,
});

const mapMemberFromDB = (m: any): TeamMember => ({
  id: m.id,
  name: m.name,
  email: m.email,
  password: m.password,
  role: m.role as Role,
  avatarUrl: m.avatar_url,
});

const mapMemberToDB = (m: TeamMember) => ({
  id: m.id,
  name: m.name,
  email: m.email,
  password: m.password,
  role: m.role,
  avatar_url: m.avatarUrl,
});

const mapNotifFromDB = (n: any): Notification => ({
  id: n.id,
  userId: n.user_id,
  type: n.type,
  message: n.message,
  link: n.link,
  isRead: n.is_read,
  createdAt: n.created_at,
});

const mapNotifToDB = (n: Notification) => ({
  id: n.id,
  user_id: n.userId,
  type: n.type,
  message: n.message,
  link: n.link,
  is_read: n.isRead,
  created_at: n.createdAt,
});

// --- API Methods ---

export const api = {
  // Members
  async getMembers() {
    const { data, error } = await supabase.from('team_members').select('*');
    if (error) {
        console.error("API Error: getMembers", JSON.stringify(error, null, 2));
        throw error;
    }
    return data.map(mapMemberFromDB);
  },
  async createMember(member: TeamMember) {
    const { error } = await supabase.from('team_members').insert(mapMemberToDB(member));
    if (error) {
        console.error("API Error: createMember", JSON.stringify(error, null, 2));
        throw error;
    }
    return member;
  },
  async updateMember(member: TeamMember) {
    const { error } = await supabase.from('team_members').update(mapMemberToDB(member)).eq('id', member.id);
    if (error) {
        console.error("API Error: updateMember", JSON.stringify(error, null, 2));
        throw error;
    }
    return member;
  },
  async deleteMember(id: string) {
    const { error } = await supabase.from('team_members').delete().eq('id', id);
    if (error) {
        console.error("API Error: deleteMember", JSON.stringify(error, null, 2));
        throw error;
    }
  },

  // Projects
  async getProjects() {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error("API Error: getProjects", JSON.stringify(error, null, 2));
        throw error;
    }
    return data.map(mapProjectFromDB);
  },
  async createProject(project: Project) {
    const { error } = await supabase.from('projects').insert(mapProjectToDB(project));
    if (error) {
        console.error("API Error: createProject", JSON.stringify(error, null, 2));
        throw error;
    }
    return project;
  },
  async updateProject(project: Project) {
    const { error } = await supabase.from('projects').update(mapProjectToDB(project)).eq('id', project.id);
    if (error) {
        console.error("API Error: updateProject", JSON.stringify(error, null, 2));
        throw error;
    }
    return project;
  },
  async deleteProject(id: string) {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) {
        console.error("API Error: deleteProject", JSON.stringify(error, null, 2));
        throw error;
    }
  },

  // Tasks
  async getTasks() {
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error("API Error: getTasks", JSON.stringify(error, null, 2));
        throw error;
    }
    return data.map(mapTaskFromDB);
  },
  async createTask(task: Task) {
    const { error } = await supabase.from('tasks').insert(mapTaskToDB(task));
    if (error) {
        console.error("API Error: createTask", JSON.stringify(error, null, 2));
        throw error;
    }
    return task;
  },
  async updateTask(task: Task) {
    const payload = mapTaskToDB(task);
    const { error } = await supabase.from('tasks').update(payload).eq('id', task.id);
    if (error) {
        console.error("API Error: updateTask", JSON.stringify(error, null, 2));
        throw error;
    }
    return task;
  },
  
  async updateTaskField(taskId: string, field: string, value: any) {
      const { error } = await supabase.from('tasks').update({ [field]: value }).eq('id', taskId);
      if (error) {
          console.error(`API Error: updateTaskField (${field})`, JSON.stringify(error, null, 2));
      }
  },

  async deleteTask(id: string) {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
        console.error("API Error: deleteTask", JSON.stringify(error, null, 2));
        throw error;
    }
  },

  // Storage
  async uploadFile(file: File, bucket: string = 'task-attachments'): Promise<string> {
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    
    // 1. Attempt initial upload
    let { data, error } = await supabase.storage.from(bucket).upload(fileName, file);
    
    // 2. Handle Bucket Not Found Error (404) or RLS
    if (error && ((error as any).statusCode === '404' || (error as any).message === 'Bucket not found')) {
        console.warn(`Bucket '${bucket}' not found. Attempting to auto-create...`);
        
        // 3. Attempt to create the bucket
        const { error: createError } = await supabase.storage.createBucket(bucket, {
            public: true
        });

        if (createError) {
            console.error("Failed to auto-create bucket:", createError);
            // Check for RLS error (42501) which means we can't create it via client
            // Just throw the specific error, logic is handled in the UI
            throw new Error("BUCKET_NOT_FOUND");
        } else {
            // 4. Retry upload after successful creation
            const retry = await supabase.storage.from(bucket).upload(fileName, file);
            data = retry.data;
            error = retry.error;
        }
    }

    if (error) {
        console.error("API Error: uploadFile", JSON.stringify(error, null, 2));
        throw error;
    }

    const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return publicData.publicUrl;
  },

  // Notifications
  async getNotifications() {
    const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (error) {
        console.error("API Error: getNotifications", JSON.stringify(error, null, 2));
        throw error;
    }
    return data.map(mapNotifFromDB);
  },
  async createNotification(notification: Notification) {
    const { error } = await supabase.from('notifications').insert(mapNotifToDB(notification));
    if (error) {
        console.error("API Error: createNotification", JSON.stringify(error, null, 2));
        throw error;
    }
    return notification;
  },
  async markNotificationRead(id: string) {
    const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    if (error) {
        console.error("API Error: markNotificationRead", JSON.stringify(error, null, 2));
        throw error;
    }
  }
};

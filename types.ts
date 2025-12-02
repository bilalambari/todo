
export enum ProjectStatus {
  PLANNING = 'Planning',
  ACTIVE = 'Active',
  ON_HOLD = 'On Hold',
  COMPLETED = 'Completed',
  ARCHIVED = 'Archived',
}

export enum TaskStatus {
  BACKLOG = 'Backlog',
  TODO = 'Todo',
  DOING = 'Doing',
  REVIEW = 'Review',
  DONE = 'Done',
  ARCHIVED = 'Archived',
}

export enum Priority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent',
}

export enum Role {
  ADMIN = 'Admin',
  MEMBER = 'Member',
  GUEST = 'Guest',
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  password?: string; // For auth
  role: Role;
  avatarUrl: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  taskId: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'file';
}

export interface Task {
  id: string;
  title: string;
  projectId: string;
  status: TaskStatus;
  assigneeIds: string[]; // Changed from assigneeId to array
  priority: Priority;
  dueDate: string; // ISO String
  tags: string[];
  checklist: SubTask[];
  attachments: Attachment[];
  comments: Comment[];
  notes: string;
  pomodoroSessions?: number; // Track completed focus sessions
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  leadId?: string; // Project Manager
  memberIds: string[]; // Assigned Team Members
  startDate: string; // ISO String
  dueDate: string; // ISO String
  budget: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string; // Who receives the notification
  type: 'MENTION' | 'ASSIGNED';
  message: string;
  link: string; // e.g., /tasks/t1
  isRead: boolean;
  createdAt: string;
}

export type ViewType = 'GRID' | 'KANBAN' | 'CALENDAR';
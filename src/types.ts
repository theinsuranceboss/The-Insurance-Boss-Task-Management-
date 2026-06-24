export type TaskStatus = 'PENDING' | 'IN PROGRESS' | 'IN REVIEW' | 'APPROVED' | 'SCHEDULED' | 'POSTED';

export type Priority = 'URGENT' | 'HIGH' | 'NORMAL' | 'LOW' | 'NONE';

export interface Member {
  id: string;
  name: string;
  avatar: string;
  color: string;
  status: 'active' | 'focus' | 'offline' | 'meeting' | 'lunch';
  role: string;
  badgeCount?: number;
  username?: string;
  password?: string;
  email?: string;
}

export interface SubTask {
  id: string;
  title: string;
  status: TaskStatus;
  assigneeId?: string;
  dueDate?: string;
  priority: Priority;
}

export interface CommentItem {
  id: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assigneeIds: string[];
  dueDate?: string;
  subtasks: SubTask[];
  commentCount?: number;
  phoneCount?: number;
  alertCount?: number;
  isLocked?: boolean;
  isDaily?: boolean;
  month?: string;
  week?: string;
  typeOfPost?: string;
  socialMedia?: string;
  url?: string;
  attachments?: { name: string; url: string }[];
  commentsList?: CommentItem[];
  folderName?: string;
}

export interface Agency {
  agencyName: string;
  employees: string;
  email: string;
  username: string;
  password: string;
}

export interface AgentTeam {
  id: string;
  name: string;
  description: string;
  memberIds: string[];
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  policyInterest: string;
  status: 'New' | 'Contacted' | 'Proposal Sent' | 'Closed Won' | 'Closed Lost';
  value: string;
  agentId?: string;
  notes: string;
  createdAt: string;
}

export interface CustomFieldConfig {
  label1: string;
  options1: string[];
  label2: string;
  options2: string[];
}

export type ActiveTab = 'chat' | 'tasks' | 'schedule' | 'gantt' | 'leads' | 'admin' | 'landing' | 'agents';

export interface LandingPageTexts {
  badgeText: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  footerText: string;
}

export interface ChatMessage {
  id: string;
  senderId: string; // member ID
  senderName: string;
  senderAvatar?: string;
  senderColor?: string;
  content: string;
  timestamp: string;
}

export interface Customer {
  id: string;
  company: string;
  contactName: string;
  email: string;
  status: 'Active' | 'Lead' | 'Churned';
  value: string;
  avatar: string;
}

export interface TimelineEvent {
  id: string;
  taskTitle: string;
  startDay: number; // grid column start (e.g. 1 to 7)
  duration: number; // grid columns span
  color: string;
}

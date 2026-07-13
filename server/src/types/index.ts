export type IssueStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type IssuePriority = 'low' | 'medium' | 'high' | 'critical';
export type UserRole = 'member' | 'admin';

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export interface UserWithPassword extends User {
  password_hash: string;
}

export interface Issue {
  id: number;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  reporter_id: number;
  assignee_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface AuthPayload {
  userId: number;
  role: UserRole;
}

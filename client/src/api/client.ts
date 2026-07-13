/**
 * Typed API client.
 *
 * Centralizes fetch calls, token handling, and error shaping. Keeping this in one
 * module gives the E2E/component tests a single place to intercept or mock network
 * traffic, and keeps `data-test` driven UI logic separate from transport concerns.
 */

export interface ApiUser {
  id: number;
  email: string;
  name: string;
  role: 'member' | 'admin';
  created_at: string;
}

export interface ApiIssue {
  id: number;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  reporter_id: number;
  assignee_id: number | null;
  created_at: string;
  updated_at: string;
}

const TOKEN_KEY = 'trackit_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, { ...options, headers });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  register: (email: string, password: string, name: string) =>
    request<{ user: ApiUser; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  login: (email: string, password: string) =>
    request<{ user: ApiUser; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  listIssues: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<{ issues: ApiIssue[] }>(`/issues${qs ? `?${qs}` : ''}`);
  },

  getIssue: (id: number) => request<{ issue: ApiIssue }>(`/issues/${id}`),

  createIssue: (input: {
    title: string;
    description?: string;
    priority?: string;
    assignee_id?: number | null;
  }) =>
    request<{ issue: ApiIssue }>('/issues', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  updateIssue: (id: number, input: Record<string, unknown>) =>
    request<{ issue: ApiIssue }>(`/issues/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    }),

  deleteIssue: (id: number) =>
    request<void>(`/issues/${id}`, { method: 'DELETE' }),

  listUsers: () => request<{ users: ApiUser[] }>('/users'),
};

import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { api, type ApiIssue } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';

export function IssuesPage() {
  const { logout } = useAuth();
  const [issues, setIssues] = useState<ApiIssue[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('medium');

  const load = useCallback(async () => {
    setError('');
    try {
      const params: Record<string, string> = {};
      if (statusFilter) params.status = statusFilter;
      const { issues } = await api.listIssues(params);
      setIssues(issues);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load issues');
    }
  }, [statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await api.createIssue({ title: newTitle, priority: newPriority });
      setNewTitle('');
      setNewPriority('medium');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create issue');
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.deleteIssue(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete issue');
    }
  }

  return (
    <main className="issues-page">
      <header className="issues-header">
        <h1>Issues</h1>
        <button data-test="logout" onClick={logout}>
          Log out
        </button>
      </header>

      <section aria-labelledby="create-heading" className="create-issue">
        <h2 id="create-heading">Create issue</h2>
        <form onSubmit={handleCreate} data-test="create-issue-form">
          <label htmlFor="new-title">Title</label>
          <input
            id="new-title"
            data-test="new-issue-title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
          />

          <label htmlFor="new-priority">Priority</label>
          <select
            id="new-priority"
            data-test="new-issue-priority"
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          <button type="submit" data-test="create-issue-submit">
            Add issue
          </button>
        </form>
      </section>

      <section aria-labelledby="list-heading">
        <h2 id="list-heading">All issues</h2>

        <label htmlFor="status-filter">Filter by status</label>
        <select
          id="status-filter"
          data-test="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        {error && (
          <p role="alert" data-test="issues-error" className="error">
            {error}
          </p>
        )}

        <ul data-test="issues-list" className="issues-list">
          {issues.map((issue) => (
            <li key={issue.id} data-test={`issue-${issue.id}`} className="issue-row">
              <span className="issue-title">{issue.title}</span>
              <PriorityBadge priority={issue.priority} />
              <StatusBadge status={issue.status} />
              <button
                data-test={`delete-issue-${issue.id}`}
                onClick={() => handleDelete(issue.id)}
                aria-label={`Delete issue: ${issue.title}`}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {issues.length === 0 && !error && (
          <p data-test="empty-state">No issues found.</p>
        )}
      </section>
    </main>
  );
}

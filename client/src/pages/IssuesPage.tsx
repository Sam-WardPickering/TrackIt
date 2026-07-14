import { useEffect, useState, useCallback, type FormEvent } from 'react';
import { api, type ApiIssue, type ApiUser } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { PriorityBadge } from '../components/PriorityBadge';
import { StatusBadge } from '../components/StatusBadge';
import { allowedNextStatuses, STATUS_LABELS, type IssueStatus } from '../api/statusWorkflow';

export function IssuesPage() {
  const { logout } = useAuth();
  const [issues, setIssues] = useState<ApiIssue[]>([]);
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [newAssignee, setNewAssignee] = useState('');

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

  // Load the user list once for assignee dropdowns.
  useEffect(() => {
    api
      .listUsers()
      .then(({ users }) => setUsers(users))
      .catch(() => {
        /* non-fatal: assignee dropdowns just stay empty */
      });
  }, []);

  function userName(id: number | null): string {
    if (id == null) return 'Unassigned';
    return users.find((u) => u.id === id)?.name ?? `User ${id}`;
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError('');
    setNotice('');
    try {
      await api.createIssue({
        title: newTitle,
        priority: newPriority,
        assignee_id: newAssignee ? Number(newAssignee) : null,
      });
      setNewTitle('');
      setNewPriority('medium');
      setNewAssignee('');
      setNotice('Issue created.');
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create issue');
    }
  }

  async function handleStatusChange(issue: ApiIssue, nextStatus: string) {
    setError('');
    setNotice('');
    try {
      await api.updateIssue(issue.id, { status: nextStatus });
      setNotice(`Issue #${issue.id} moved to ${STATUS_LABELS[nextStatus as IssueStatus]}.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  }

  async function handleAssigneeChange(issue: ApiIssue, value: string) {
    setError('');
    setNotice('');
    try {
      await api.updateIssue(issue.id, { assignee_id: value ? Number(value) : null });
      setNotice(`Issue #${issue.id} reassigned.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reassign');
    }
  }

  async function handleDelete(id: number) {
    setError('');
    setNotice('');
    try {
      await api.deleteIssue(id);
      setNotice(`Issue #${id} deleted.`);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete issue');
    }
  }

  return (
    <main className="issues-page">
      <header className="issues-header">
        <h1>Issues</h1>
        <button className="btn-secondary" data-test="logout" onClick={logout}>
          Log out
        </button>
      </header>

      <section aria-labelledby="create-heading" className="create-issue">
        <h2 id="create-heading">Create issue</h2>
        <form onSubmit={handleCreate} data-test="create-issue-form">
          <div className="form-row">
            <div className="field">
              <label htmlFor="new-title">Title</label>
              <input
                id="new-title"
                data-test="new-issue-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
            </div>
            <div className="field">
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
            </div>
            <div className="field">
              <label htmlFor="new-assignee">Assignee</label>
              <select
                id="new-assignee"
                data-test="new-issue-assignee"
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" data-test="create-issue-submit">
            Add issue
          </button>
        </form>
      </section>

      <section aria-labelledby="list-heading">
        <h2 id="list-heading">All issues</h2>

        <div className="filter-bar">
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
        </div>

        {notice && (
          <p role="status" data-test="issues-notice" className="notice">
            {notice}
          </p>
        )}
        {error && (
          <p role="alert" data-test="issues-error" className="error">
            {error}
          </p>
        )}

        <ul data-test="issues-list" className="issues-list">
          {issues.map((issue) => (
            <li key={issue.id} data-test={`issue-${issue.id}`} className="issue-row">
              <div className="issue-main">
                <span className="issue-title">{issue.title}</span>
                <span className="issue-meta" data-test={`issue-${issue.id}-assignee`}>
                  {userName(issue.assignee_id)}
                </span>
              </div>

              <div className="issue-badges">
                <PriorityBadge priority={issue.priority} />
                <StatusBadge status={issue.status} />
              </div>

              <div className="issue-actions">
                <select
                  aria-label={`Change status for: ${issue.title}`}
                  data-test={`status-select-${issue.id}`}
                  value=""
                  onChange={(e) => {
                    if (e.target.value) void handleStatusChange(issue, e.target.value);
                  }}
                >
                  <option value="">Change status…</option>
                  {allowedNextStatuses(issue.status).map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>

                <select
                  aria-label={`Reassign: ${issue.title}`}
                  data-test={`assignee-select-${issue.id}`}
                  value={issue.assignee_id ?? ''}
                  onChange={(e) => void handleAssigneeChange(issue, e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>

                <button
                  className="btn-danger"
                  data-test={`delete-issue-${issue.id}`}
                  onClick={() => handleDelete(issue.id)}
                  aria-label={`Delete issue: ${issue.title}`}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        {issues.length === 0 && !error && (
          <p data-test="empty-state" className="empty-state">
            No issues found.
          </p>
        )}
      </section>
    </main>
  );
}

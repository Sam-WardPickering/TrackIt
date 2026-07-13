import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(email, password, name);
      navigate('/issues');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <h1>Create your TrackIt account</h1>
      <form onSubmit={handleSubmit} data-test="register-form" noValidate>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          data-test="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          data-test="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          data-test="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p role="alert" data-test="register-error" className="error">
            {error}
          </p>
        )}

        <button type="submit" data-test="register-submit" disabled={loading}>
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>
    </main>
  );
}

import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/issues');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <h1>Sign in to TrackIt</h1>
      <form onSubmit={handleSubmit} data-test="login-form" noValidate>
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
          <p role="alert" data-test="login-error" className="error">
            {error}
          </p>
        )}

        <button type="submit" data-test="login-submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p>
        No account?{' '}
        <a href="/register" data-test="register-link">
          Register
        </a>
      </p>
    </main>
  );
}

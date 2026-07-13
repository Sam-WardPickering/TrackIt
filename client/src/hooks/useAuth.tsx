import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { api, setToken, clearToken, getToken, type ApiUser } from '../api/client';

interface AuthContextValue {
  user: ApiUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    const { user, token } = await api.login(email, password);
    setToken(token);
    setUser(user);
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const { user, token } = await api.register(email, password, name);
    setToken(token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user || !!getToken(), login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

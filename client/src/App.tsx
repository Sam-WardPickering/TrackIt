import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { IssuesPage } from './pages/IssuesPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/issues"
            element={
              <ProtectedRoute>
                <IssuesPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/issues" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

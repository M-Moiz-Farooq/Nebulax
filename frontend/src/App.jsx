import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage';
import NotesPage from './pages/NotesPage';
import UsersPage from './pages/UsersPage';
import ProjectPage from './pages/ProjectPage';

function ProtectedRoute({ children }) {
  const { token, booting } = useAuth();
  if (booting) return <div className="boot-screen" aria-busy="true" />;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function RoleRoute({ allow, children }) {
  const { user } = useAuth();
  if (!allow.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="project" element={<ProjectPage />} />
        <Route path="transactions" element={<TransactionsPage />} />
        <Route
          path="notes"
          element={
            <RoleRoute allow={['ADMIN', 'ACCOUNTANT']}>
              <NotesPage />
            </RoleRoute>
          }
        />
        <Route
          path="users"
          element={
            <RoleRoute allow={['ADMIN']}>
              <UsersPage />
            </RoleRoute>
          }
        />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

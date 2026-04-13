import { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, ROLES, setAuthUnauthorizedHandler } from '../api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

/** Syncs JWT + user profile with `localStorage` and exposes login/logout for the tree. */
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    if (token) localStorage.setItem('token', token);
    else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  useEffect(() => {
    setBooting(false);
  }, []);

  useEffect(() => {
    setAuthUnauthorizedHandler(() => {
      setToken(null);
      setUser(null);
      toast('Session expired — sign in again.', 'info');
      navigate('/login', { replace: true });
    });
    return () => setAuthUnauthorizedHandler(null);
  }, [navigate, toast]);

  const login = useCallback(async (email, password) => {
    const res = await api('/api/auth/login', { method: 'POST', body: { email, password } });
    const { token: t, user: u } = res.data;
    setToken(t);
    setUser(u);
    return u;
  }, []);

  const signup = useCallback(async (email, password) => {
    const res = await api('/api/auth/signup', { method: 'POST', body: { email, password } });
    const { token: t, user: u } = res.data;
    setToken(t);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      booting,
      login,
      signup,
      logout,
      isAdmin: user?.role === ROLES.ADMIN,
      isAccountant: user?.role === ROLES.ACCOUNTANT,
      isUser: user?.role === ROLES.USER,
      /** All roles can POST a new transaction (API records it under their account). */
      canCreateTx:
        !!user &&
        (user.role === ROLES.USER ||
          user.role === ROLES.ACCOUNTANT ||
          user.role === ROLES.ADMIN),
      /** Edit existing rows: staff any row; USER only own (API enforces). */
      canEditTx:
        !!user &&
        (user.role === ROLES.USER ||
          user.role === ROLES.ACCOUNTANT ||
          user.role === ROLES.ADMIN),
      /** Ledger management (staff): edits beyond own rows for USER */
      canManageTx: user?.role === ROLES.ADMIN || user?.role === ROLES.ACCOUNTANT,
      canDeleteTx: user?.role === ROLES.ADMIN,
      canNotes: user?.role === ROLES.ADMIN || user?.role === ROLES.ACCOUNTANT,
      canAdminUsers: user?.role === ROLES.ADMIN,
    }),
    [user, token, booting, login, signup, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth outside AuthProvider');
  return ctx;
}

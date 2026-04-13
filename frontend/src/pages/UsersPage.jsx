import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import ScrollReveal from '../components/ScrollReveal';

const roles = ['ADMIN', 'ACCOUNTANT', 'USER'];

export default function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', role: 'USER' });
  const [err, setErr] = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await api('/api/users');
      setUsers(res.data.users || []);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e) {
    e.preventDefault();
    setErr('');
    try {
      const inviteEmail = form.email;
      const inviteRole = form.role;
      await api('/api/users', { method: 'POST', body: form });
      setOpen(false);
      setForm({ email: '', password: '', role: 'USER' });
      toast(`Invited ${inviteEmail} as ${inviteRole}.`, 'success');
      load();
    } catch (er) {
      setErr(er.body?.message || er.message);
    }
  }

  return (
    <div className="stack">
      <ScrollReveal direction="down" delay={0}>
      <div className="toolbar">
        <motion.button
          type="button"
          className="btn-primary"
          onClick={() => {
            setErr('');
            setOpen(true);
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          + Invite user
        </motion.button>
        <span className="toolbar-meta">{loading ? 'Loading…' : `${users.length} users`}</span>
      </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.07}>
      <div className="table-wrap glass-surface">
        <table className="data-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <motion.tr
                key={u._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <td className="mono">{u.email}</td>
                <td>
                  <span className={`role-pill role-${u.role?.toLowerCase()}`}>{u.role}</span>
                </td>
                <td className="muted small">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      </ScrollReveal>

      <Modal open={open} title="Create user (ADMIN)" onClose={() => setOpen(false)} wide>
        <form onSubmit={create} className="stack-form">
          <p className="muted small" style={{ marginBottom: '0.75rem' }}>
            Password is hashed with bcrypt on the server; JWTs are issued only via login.
          </p>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Initial password</span>
            <input
              type="password"
              minLength={8}
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Role</span>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {roles.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          {err && <div className="form-error">{err}</div>}
          <button type="submit" className="btn-primary full">
            Create user
          </button>
        </form>
      </Modal>
    </div>
  );
}

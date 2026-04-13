import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Modal from '../components/Modal';
import ScrollReveal from '../components/ScrollReveal';
import { formatMoney } from '../utils/money';
import { toDatetimeLocalValue, datetimeLocalToApiIso, formatDateTimeDisplay } from '../utils/datetime';

const emptyForm = { amount: '', type: 'credit', description: '', date: '' };

function exportCsv(list) {
  const headers = ['date_iso', 'type', 'amount', 'description', 'owner_email'];
  const lines = list.map((r) =>
    [
      r.date ? new Date(r.date).toISOString() : '',
      r.type,
      r.amount,
      `"${String(r.description || '').replace(/"/g, '""')}"`,
      r.user?.email ?? '',
    ].join(',')
  );
  const csv = [headers.join(','), ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nebulax-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function TransactionsPage() {
  const { canCreateTx, canEditTx, canDeleteTx } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [err, setErr] = useState('');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  async function load() {
    setLoading(true);
    try {
      const res = await api('/api/transactions');
      setRows(res.data.transactions || []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (typeFilter !== 'all' && r.type !== typeFilter) return false;
      if (!q) return true;
      const blob = `${r.description} ${r.user?.email} ${r.type}`.toLowerCase();
      return blob.includes(q);
    });
  }, [rows, query, typeFilter]);

  function openCreate() {
    setForm({
      ...emptyForm,
      date: toDatetimeLocalValue(new Date()),
    });
    setErr('');
    setModal('create');
  }

  function openEdit(row) {
    setForm({
      amount: String(row.amount),
      type: row.type,
      description: row.description,
      date: row.date ? toDatetimeLocalValue(row.date) : '',
    });
    setErr('');
    setModal({ edit: row._id });
  }

  async function saveCreate(e) {
    e.preventDefault();
    setErr('');
    try {
      const dateIso = datetimeLocalToApiIso(form.date);
      const body = {
        amount: parseFloat(form.amount, 10),
        type: form.type,
        description: form.description,
        ...(dateIso ? { date: dateIso } : {}),
      };
      await api('/api/transactions', { method: 'POST', body });
      setModal(null);
      toast('Transaction saved — server validated amount & type.', 'success');
      load();
    } catch (er) {
      setErr(formatErr(er));
    }
  }

  async function saveEdit(e) {
    e.preventDefault();
    setErr('');
    try {
      const body = {};
      if (form.amount !== '') body.amount = parseFloat(form.amount, 10);
      if (form.type) body.type = form.type;
      if (form.description) body.description = form.description;
      const dateIso = datetimeLocalToApiIso(form.date);
      if (dateIso) body.date = dateIso;
      await api(`/api/transactions/${modal.edit}`, { method: 'PUT', body });
      setModal(null);
      toast('Updates synced.', 'success');
      load();
    } catch (er) {
      setErr(formatErr(er));
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this row permanently? Admins only on the API.')) return;
    try {
      await api(`/api/transactions/${id}`, { method: 'DELETE' });
      toast('Transaction removed.', 'success');
      load();
    } catch (er) {
      toast(er.message, 'error');
    }
  }

  function handleExport() {
    if (!filtered.length) {
      toast('Nothing to export with the current filters.', 'error');
      return;
    }
    exportCsv(filtered);
    toast(`Exported ${filtered.length} rows to CSV.`, 'success');
  }

  return (
    <div className="stack">
      <ScrollReveal direction="down" delay={0} className="toolbar-reveal">
      <div className="toolbar toolbar-wrap">
        <div className="toolbar-left">
          {canCreateTx && (
            <motion.button
              type="button"
              className="btn-primary"
              onClick={openCreate}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              + New row
            </motion.button>
          )}
          <label className="search-field">
            <span className="sr-only">Search</span>
            <input
              type="search"
              placeholder="Search description or owner…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          <select
            className="filter-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by type"
          >
            <option value="all">All types</option>
            <option value="credit">Credits only</option>
            <option value="debit">Debits only</option>
          </select>
        </div>
        <div className="toolbar-right">
          <button type="button" className="btn-secondary" onClick={handleExport}>
            Export CSV
          </button>
          <span className="toolbar-meta">
            {loading ? 'Syncing…' : `${filtered.length} visible · ${rows.length} total`}
          </span>
        </div>
      </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.06} className="table-reveal">
      <div className="table-wrap glass-surface">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Owner</th>
              {(canEditTx || canDeleteTx) && <th className="thin-actions" />}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((r, i) => (
                <motion.tr
                  key={r._id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.24) }}
                  layout
                >
                  <td>{formatDateTimeDisplay(r.date)}</td>
                  <td>
                    <span className={`type-badge ${r.type}`}>{r.type}</span>
                  </td>
                  <td className="mono">{formatMoney(r.amount)}</td>
                  <td className="desc">{r.description}</td>
                  <td className="muted small">{r.user?.email ?? '—'}</td>
                  {(canEditTx || canDeleteTx) && (
                    <td className="row-actions">
                      {canEditTx && (
                        <button type="button" className="link-btn" onClick={() => openEdit(r)}>
                          Edit
                        </button>
                      )}
                      {canDeleteTx && (
                        <button type="button" className="link-btn danger" onClick={() => remove(r._id)}>
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <div className="empty-state">
            {rows.length === 0
              ? 'No transactions yet — add your first row or ask an accountant to seed demo data.'
              : 'No matches for that search/filter combo.'}
          </div>
        )}
      </div>
      </ScrollReveal>

      <Modal open={modal === 'create'} title="New transaction" onClose={() => setModal(null)}>
        <form onSubmit={saveCreate} className="stack-form">
          <label className="field">
            <span>Amount</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Type</span>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
          </label>
          <label className="field">
            <span>Description</span>
            <textarea
              rows={3}
              required
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Date (optional)</span>
            <input
              type="datetime-local"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </label>
          {err && <div className="form-error">{err}</div>}
          <button type="submit" className="btn-primary full">
            Save to API
          </button>
        </form>
      </Modal>

      <Modal open={Boolean(modal?.edit)} title="Edit transaction" onClose={() => setModal(null)}>
        <form onSubmit={saveEdit} className="stack-form">
          <label className="field">
            <span>Amount</span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Type</span>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="credit">Credit</option>
              <option value="debit">Debit</option>
            </select>
          </label>
          <label className="field">
            <span>Description</span>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <label className="field">
            <span>Date</span>
            <input
              type="datetime-local"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </label>
          {err && <div className="form-error">{err}</div>}
          <button type="submit" className="btn-primary full">
            Push update
          </button>
        </form>
      </Modal>
    </div>
  );
}

function formatErr(er) {
  if (er.body?.errors?.length) return er.body.errors.map((e) => e.message).join(' ');
  return er.message;
}

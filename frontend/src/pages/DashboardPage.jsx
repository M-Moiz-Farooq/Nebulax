import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import ScrollReveal from '../components/ScrollReveal';
import { formatMoney, formatSignedMoney } from '../utils/money';

function StatCard({ label, value, hint, accent }) {
  return (
    <motion.div
      className={`stat-card glass-surface ${accent ? `stat-card--${accent}` : ''}`}
      whileHover={{ y: -5, scale: 1.01, transition: { duration: 0.22 } }}
    >
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {hint && <div className="stat-hint">{hint}</div>}
    </motion.div>
  );
}

function relTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const diff = (Date.now() - d) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString();
}

export default function DashboardPage() {
  const { canCreateTx, canNotes, canAdminUsers } = useAuth();
  const [tx, setTx] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const res = await api('/api/transactions');
        if (!cancel) setTx(res.data.transactions || []);
      } catch {
        if (!cancel) setTx([]);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, []);

  const { credits, debits, net, recent } = useMemo(() => {
    const c = tx.filter((t) => t.type === 'credit').reduce((a, t) => a + t.amount, 0);
    const d = tx.filter((t) => t.type === 'debit').reduce((a, t) => a + t.amount, 0);
    const sorted = [...tx].sort((a, b) => new Date(b.date) - new Date(a.date));
    return {
      credits: c,
      debits: d,
      net: c - d,
      recent: sorted.slice(0, 6),
    };
  }, [tx]);

  return (
    <div className="stack">
      <div className="stat-grid">
        <ScrollReveal delay={0} direction="up">
          <StatCard
            label="Rows you can see right now"
            value={loading ? '…' : tx.length}
            hint="USER: yours only · Admin/Accountant: full feed"
          />
        </ScrollReveal>
        <ScrollReveal delay={0.07} direction="up">
          <StatCard
            label="Credits summed"
            value={loading ? '…' : formatMoney(credits)}
            hint="Money in-style entries"
            accent="mint"
          />
        </ScrollReveal>
        <ScrollReveal delay={0.14} direction="up">
          <StatCard
            label="Debits summed"
            value={loading ? '…' : formatMoney(debits)}
            hint="Money out-style entries"
            accent="rose"
          />
        </ScrollReveal>
        <ScrollReveal delay={0.21} direction="up">
          <StatCard
            label="Net (credits − debits)"
            value={loading ? '…' : formatMoney(net)}
            hint="Quick directional vibe — not GAAP, just a pulse"
            accent={net >= 0 ? 'mint' : 'rose'}
          />
        </ScrollReveal>
      </div>

      <div className="dash-split">
        <ScrollReveal delay={0.05} direction="left" className="dash-split__cell">
          <motion.div
            className="panel panel-tight glass-surface"
            initial={false}
          >
          <h3 className="panel-title">Recent movement</h3>
          <p className="panel-lead muted">
            Live slice of your feed — click through to transactions for search, CSV export, and edits
            (if your role allows it).
          </p>
          <ul className="activity-list">
            {loading && <li className="muted">Pulling the latest numbers…</li>}
            {!loading && recent.length === 0 && (
              <li className="muted">Nothing here yet. Post a transaction to wake this list up.</li>
            )}
            {recent.map((r, i) => (
              <motion.li
                key={r._id}
                className="activity-item"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
              >
                <span className={`type-dot ${r.type}`} aria-hidden />
                <div className="activity-main">
                  <strong>{r.description}</strong>
                  <span className="muted small">
                    {r.user?.email} · {relTime(r.date)}
                  </span>
                </div>
                <span className={`activity-amt ${r.type}`}>
                  {formatSignedMoney(r.type === 'credit', r.amount)}
                </span>
              </motion.li>
            ))}
          </ul>
          <Link to="/transactions" className="text-link">
            Jump to full table →
          </Link>
        </motion.div>
        </ScrollReveal>

        <ScrollReveal delay={0.12} direction="right" className="dash-split__cell">
          <motion.div className="panel glass-surface" initial={false}>
          <h3 className="panel-title">Shortcuts</h3>
          <div className="quick-actions">
            {canCreateTx && (
              <Link to="/transactions" className="qa-card">
                <span className="qa-icon" aria-hidden>
                  ⚡
                </span>
                <div>
                  <strong>Work the ledger</strong>
                  <p>Add or edit your rows with server validation backing every save.</p>
                </div>
              </Link>
            )}
            {canNotes && (
              <Link to="/notes" className="qa-card">
                <span className="qa-icon" aria-hidden>
                  ✳︎
                </span>
                <div>
                  <strong>Ship credit / debit notes</strong>
                  <p>Matches the /api/notes/* routes from the design doc.</p>
                </div>
              </Link>
            )}
            {canAdminUsers && (
              <Link to="/users" className="qa-card">
                <span className="qa-icon" aria-hidden>
                  👥
                </span>
                <div>
                  <strong>Onboard your squad</strong>
                  <p>Spin roles for demos: ADMIN, ACCOUNTANT, USER.</p>
                </div>
              </Link>
            )}
            <Link to="/project" className="qa-card qa-card-ghost">
              <span className="qa-icon" aria-hidden>
                📋
              </span>
              <div>
                <strong>Open the Project hub</strong>
                <p>Interactive PRD + system design — great for vivas.</p>
              </div>
            </Link>
          </div>
        </motion.div>
        </ScrollReveal>
      </div>
    </div>
  );
}

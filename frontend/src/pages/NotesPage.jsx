import { useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api';
import { useToast } from '../context/ToastContext';
import ScrollReveal from '../components/ScrollReveal';
import { datetimeLocalToApiIso } from '../utils/datetime';

const initial = { amount: '', description: '', reference: '', date: '' };

export default function NotesPage() {
  const { toast } = useToast();
  const [credit, setCredit] = useState(initial);
  const [debit, setDebit] = useState(initial);
  const [msgC, setMsgC] = useState('');
  const [msgD, setMsgD] = useState('');
  const [loadingC, setLoadingC] = useState(false);
  const [loadingD, setLoadingD] = useState(false);

  async function submitCredit(e) {
    e.preventDefault();
    setMsgC('');
    setLoadingC(true);
    try {
      const noteDate = datetimeLocalToApiIso(credit.date);
      const body = {
        amount: parseFloat(credit.amount, 10),
        description: credit.description,
        reference: credit.reference || undefined,
        ...(noteDate ? { date: noteDate } : {}),
      };
      await api('/api/notes/credit', { method: 'POST', body });
      setCredit(initial);
      setMsgC('Credit note recorded successfully.');
      toast('Credit note posted — saved on the server.', 'success');
    } catch (er) {
      setMsgC(er.message);
    } finally {
      setLoadingC(false);
    }
  }

  async function submitDebit(e) {
    e.preventDefault();
    setMsgD('');
    setLoadingD(true);
    try {
      const noteDate = datetimeLocalToApiIso(debit.date);
      const body = {
        amount: parseFloat(debit.amount, 10),
        description: debit.description,
        reference: debit.reference || undefined,
        ...(noteDate ? { date: noteDate } : {}),
      };
      await api('/api/notes/debit', { method: 'POST', body });
      setDebit(initial);
      setMsgD('Debit note recorded successfully.');
      toast('Debit note posted.', 'success');
    } catch (er) {
      setMsgD(er.message);
    } finally {
      setLoadingD(false);
    }
  }

  return (
    <div className="notes-grid">
      <ScrollReveal direction="left" delay={0} className="notes-grid__cell">
      <motion.form
        className="note-card credit glass-surface"
        onSubmit={submitCredit}
        whileHover={{ y: -3 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      >
        <div className="note-card-head">
          <h3>Credit note</h3>
          <p>
            Goodwill refunds, pricing fixes, or anything that needs a formal “money back” paper trail.
            Hits <code>POST /api/notes/credit</code>.
          </p>
        </div>
        <label className="field">
          <span>Amount</span>
          <input
            type="number"
            step="0.01"
            min="0.01"
            required
            value={credit.amount}
            onChange={(e) => setCredit({ ...credit, amount: e.target.value })}
          />
        </label>
        <label className="field">
          <span>Description</span>
          <textarea
            rows={3}
            required
            value={credit.description}
            onChange={(e) => setCredit({ ...credit, description: e.target.value })}
          />
        </label>
        <label className="field">
          <span>Reference (optional)</span>
          <input
            value={credit.reference}
            onChange={(e) => setCredit({ ...credit, reference: e.target.value })}
            placeholder="CN-2026-001"
          />
        </label>
        <label className="field">
          <span>Date (optional)</span>
          <input
            type="datetime-local"
            value={credit.date}
            onChange={(e) => setCredit({ ...credit, date: e.target.value })}
          />
        </label>
        {msgC && <div className={msgC.includes('success') ? 'form-success' : 'form-error'}>{msgC}</div>}
        <motion.button type="submit" className="btn-primary full" disabled={loadingC} whileTap={{ scale: 0.98 }}>
          {loadingC ? 'Submitting…' : 'Submit credit note'}
        </motion.button>
      </motion.form>
      </ScrollReveal>

      <ScrollReveal direction="right" delay={0.08} className="notes-grid__cell">
      <motion.form
        className="note-card debit glass-surface"
        onSubmit={submitDebit}
        whileHover={{ y: -3 }}
        transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      >
        <div className="note-card-head">
          <h3>Debit note</h3>
          <p>
            Extra charges, penalties, or catch-up billing. Same validation as credits — just a different
            story for reviewers. Hits <code>POST /api/notes/debit</code>.
          </p>
        </div>
        <label className="field">
          <span>Amount</span>
          <input
            type="number"
            step="0.01"
            min="0.01"
            required
            value={debit.amount}
            onChange={(e) => setDebit({ ...debit, amount: e.target.value })}
          />
        </label>
        <label className="field">
          <span>Description</span>
          <textarea
            rows={3}
            required
            value={debit.description}
            onChange={(e) => setDebit({ ...debit, description: e.target.value })}
          />
        </label>
        <label className="field">
          <span>Reference (optional)</span>
          <input
            value={debit.reference}
            onChange={(e) => setDebit({ ...debit, reference: e.target.value })}
            placeholder="DN-2026-001"
          />
        </label>
        <label className="field">
          <span>Date (optional)</span>
          <input
            type="datetime-local"
            value={debit.date}
            onChange={(e) => setDebit({ ...debit, date: e.target.value })}
          />
        </label>
        {msgD && <div className={msgD.includes('success') ? 'form-success' : 'form-error'}>{msgD}</div>}
        <motion.button type="submit" className="btn-primary full accent-warm" disabled={loadingD} whileTap={{ scale: 0.98 }}>
          {loadingD ? 'Submitting…' : 'Submit debit note'}
        </motion.button>
      </motion.form>
      </ScrollReveal>
    </div>
  );
}

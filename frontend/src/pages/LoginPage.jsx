import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { TEAM } from '../content/nebulaxProject';

const intro = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.08 },
  },
};

const introItem = {
  hidden: { opacity: 0, y: 22, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function LoginPage() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      if (mode === 'login') await login(email, password);
      else await signup(email, password);
    } catch (er) {
      const msg = er.body?.errors?.map((x) => x.message).join(' ') || er.message;
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="bg-grid" aria-hidden />
      <div className="bg-glow bg-glow-1" />
      <div className="bg-glow bg-glow-2" />

      <motion.div
        className="auth-card auth-card-wide glass-auth"
        initial={{ opacity: 0, y: 36, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.div className="auth-inner" variants={intro} initial="hidden" animate="show">
        <motion.div className="auth-top" variants={introItem}>
          <div className="auth-brand">
            <span className="brand-mark large" aria-hidden>
              ✦
            </span>
            <div>
              <p className="auth-module">{TEAM.module}</p>
              <h1 className="auth-title">{TEAM.name}</h1>
              <p className="auth-sub">{TEAM.title}</p>
            </div>
          </div>
          <div className="auth-team-mini glass-inset">
            <span className="auth-team-label">Crew</span>
            <ul>
              <li>
                <strong>Lead</strong> · {TEAM.lead}
              </li>
              {TEAM.members.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>
        </motion.div>

        <motion.p className="auth-pitch" variants={introItem}>
          Sign in to the workspace we’re submitting for IT6006 — JWT auth on the wire, bcrypt on disk,
          and UI that respects the same ADMIN · ACCOUNTANT · USER rules as the API.
        </motion.p>

        <motion.div className="auth-tabs" variants={introItem}>
          <button
            type="button"
            className={mode === 'login' ? 'active' : ''}
            onClick={() => setMode('login')}
          >
            Log in
          </button>
          <button
            type="button"
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => setMode('signup')}
          >
            Create student account
          </button>
        </motion.div>

        <motion.form onSubmit={submit} className="auth-form" variants={introItem}>
          <label className="field">
            <span>Campus / work email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              placeholder="moiz.crew@university.edu"
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
              minLength={8}
              placeholder="At least 8 characters + a letter"
            />
          </label>
          {err && <div className="form-error shake">{err}</div>}
          <motion.button
            type="submit"
            className="btn-primary full"
            disabled={loading}
            whileTap={{ scale: 0.98 }}
          >
            {loading
              ? 'Talking to the API…'
              : mode === 'login'
                ? 'Open my dashboard'
                : 'Register & grab a USER badge'}
          </motion.button>
        </motion.form>

        <motion.p className="auth-hint" variants={introItem}>
          Self-serve signups land as <strong>USER</strong> (read-first). If you need accountant or admin
          powers, ping someone who already has <strong>People &amp; access</strong> unlocked.
        </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
}

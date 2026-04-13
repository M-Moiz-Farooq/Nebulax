import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ApiHealthPill from './ApiHealthPill';
import MainParallax from './MainParallax';
import { TEAM } from '../content/nebulaxProject';

const pageIntro = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const pageIntroItem = {
  hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const nav = [
  { to: '/', label: 'Home', end: true, roles: ['ADMIN', 'ACCOUNTANT', 'USER'], hint: 'Snapshot & shortcuts' },
  { to: '/project', label: 'Project hub', roles: ['ADMIN', 'ACCOUNTANT', 'USER'], hint: 'IT6006 docs & design' },
  { to: '/transactions', label: 'Transactions', roles: ['ADMIN', 'ACCOUNTANT', 'USER'], hint: 'Ledger entries' },
  { to: '/notes', label: 'Notes', roles: ['ADMIN', 'ACCOUNTANT'], hint: 'Credit / debit notes' },
  { to: '/users', label: 'People & access', roles: ['ADMIN'], hint: 'Invite + RBAC' },
];

const PAGE_COPY = {
  '/': {
    title: 'Hey — here’s your finance desk',
    sub: {
      ADMIN: 'You’re on the admin profile: full visibility, user invites, and the power to roll back rows when policy allows.',
      ACCOUNTANT: 'You’re cleared to post and tidy up transactions, plus issue the formal notes your auditors expect.',
      USER: 'You’re in view-only mode for the rows tied to your account — perfect for tracking without touching the books.',
    },
  },
  '/project': {
    title: 'Project hub',
    sub: {
      ADMIN: 'Everything reviewers asked for in one interactive walkthrough — requirements, design layers, security posture, endpoints.',
      ACCOUNTANT: 'Skim the same architecture your API enforces: roles, validation rules, and how notes fit into the story.',
      USER: 'Explore how NEBULAX scoped permissions — helpful context even if your day-to-day is read-only.',
    },
  },
  '/transactions': {
    title: 'Transactions',
    sub: {
      ADMIN: 'Search, filter, export, edit, or delete. Bad inputs never leave the browser without validation first.',
      ACCOUNTANT: 'Add accurate credits/debits, tweak details, and hand auditors a neat CSV when they ask.',
      USER: 'Add your own credit/debit rows, export CSV, search, and edit your own entries — staff can edit any row.',
    },
  },
  '/notes': {
    title: 'Credit & debit notes',
    sub: {
      ADMIN: 'Issue corrective documents with references — mirrors the POST /api/notes/credit|debit contracts.',
      ACCOUNTANT: 'Issue corrective documents with references — mirrors the POST /api/notes/credit|debit contracts.',
      USER: '',
    },
  },
  '/users': {
    title: 'People & access',
    sub: {
      ADMIN: 'Spin up teammates, assign ADMIN / ACCOUNTANT / USER, and keep JWT-backed RBAC honest.',
      ACCOUNTANT: '',
      USER: '',
    },
  },
};

function pageKey(path) {
  if (path === '/' || path === '') return '/';
  if (path.startsWith('/project')) return '/project';
  if (path.startsWith('/transactions')) return '/transactions';
  if (path.startsWith('/notes')) return '/notes';
  if (path.startsWith('/users')) return '/users';
  return '/';
}

export default function Layout() {
  const { user, logout, canAdminUsers, canNotes } = useAuth();
  const loc = useLocation();
  const items = nav.filter((n) => n.roles.includes(user?.role));

  const key = pageKey(loc.pathname);
  const meta = PAGE_COPY[key] || PAGE_COPY['/'];
  const sub =
    meta.sub[user?.role] ||
    (canAdminUsers ? meta.sub.ADMIN : canNotes ? meta.sub.ACCOUNTANT : meta.sub.USER);

  return (
    <div className="app-shell">
      <div className="bg-grid" aria-hidden />
      <div className="bg-glow bg-glow-1" aria-hidden />
      <div className="bg-glow bg-glow-2" aria-hidden />

      <aside className="sidebar glass-sidebar">
        <div className="sidebar-top">
          <div className="brand">
            <span className="brand-mark" aria-hidden>
              ✦
            </span>
            <div>
              <div className="brand-name">{TEAM.name}</div>
              <div className="brand-tag">
                {TEAM.module} · Secure finance
              </div>
            </div>
          </div>

          <ApiHealthPill />
        </div>

        <nav className="side-nav side-nav-scroll" aria-label="Primary">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}
              title={item.hint}
            >
              <span className="side-link-label">{item.label}</span>
              <span className="side-link-hint">{item.hint}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="user-chip">
            <div className="user-avatar">{user?.email?.[0]?.toUpperCase() ?? '?'}</div>
            <div className="user-meta">
              <div className="user-email">{user?.email}</div>
              <span className={`role-pill role-${user?.role?.toLowerCase()}`}>{user?.role}</span>
            </div>
          </div>
          <button type="button" className="btn-ghost full" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="main-area">
        <MainParallax />
        <motion.header
          className="top-bar"
          key={`hdr-${loc.pathname}`}
          variants={pageIntro}
          initial="hidden"
          animate="show"
        >
          <motion.h1 variants={pageIntroItem} className="page-title">
            {meta.title}
          </motion.h1>
          {sub && (
            <motion.p
              variants={pageIntroItem}
              className="page-sub"
              key={`${loc.pathname}-${user?.role}`}
            >
              {sub}
            </motion.p>
          )}
        </motion.header>

        <motion.div
          key={loc.pathname}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
          className="page-body"
        >
          <Outlet />
        </motion.div>

        <footer className="app-footer">
          <div>
            <strong>{TEAM.name}</strong> · {TEAM.module} · {TEAM.title}
          </div>
          <div className="footer-team">
            Lead {TEAM.lead} · {TEAM.members.join(' · ')}
          </div>
        </footer>
      </main>
    </div>
  );
}

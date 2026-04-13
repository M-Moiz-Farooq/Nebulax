import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrollReveal from '../components/ScrollReveal';
import {
  TEAM,
  overview,
  problemStatement,
  solutionStatement,
  businessRequirements,
  functionalRequirements,
  nonFunctionalRequirements,
  userStories,
  securityPolicies,
  architecture,
  rbacRules,
  urlDesign,
  validationDesign,
} from '../content/nebulaxProject';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'requirements', label: 'Requirements' },
  { id: 'design', label: 'System design' },
  { id: 'security', label: 'Security' },
  { id: 'apis', label: 'API map' },
  { id: 'team', label: 'Team' },
];

function TabPanel({ id, active, children }) {
  return (
    <AnimatePresence mode="wait">
      {active === id && (
        <motion.div
          key={id}
          role="tabpanel"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28 }}
          className="tab-panel"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ProjectPage() {
  const [tab, setTab] = useState('overview');
  const [openStory, setOpenStory] = useState(-1);

  return (
    <div className="project-hub">
      <ScrollReveal direction="up" delay={0} className="project-hero-wrap">
      <div className="project-hero glass-surface">
        <div className="project-badge">{TEAM.module}</div>
        <h2 className="project-hero-title">{TEAM.title}</h2>
        <p className="project-hero-lead">
          Living documentation for our coursework build — tap a tab to explore what we promised in
          the requirements doc and how the system design backs it up.
        </p>
      </div>
      </ScrollReveal>

      <ScrollReveal direction="down" delay={0.06} className="tab-bar-wrap">
      <div className="tab-bar" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {tab === t.id && <motion.span layoutId="tab-glow" className="tab-glow" />}
          </button>
        ))}
      </div>
      </ScrollReveal>

      <div className="tab-panels">
        <TabPanel id="overview" active={tab}>
          <div className="two-col">
            <div className="prose-card accent-left">
              <h3>{overview.headline}</h3>
              <p>{overview.body}</p>
              <ul className="check-list">
                {overview.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </div>
            <div className="prose-card">
              <h4>{problemStatement.title}</h4>
              <p className="muted">{problemStatement.text}</p>
              <h4>{solutionStatement.title}</h4>
              <p className="muted">{solutionStatement.text}</p>
            </div>
          </div>
        </TabPanel>

        <TabPanel id="requirements" active={tab}>
          <div className="req-grid">
            <div className="prose-card">
              <h3>Business requirements</h3>
              <ul className="chip-list">
                {businessRequirements.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="prose-card">
              <h3>Functional requirements</h3>
              <ul className="check-list">
                {functionalRequirements.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="prose-card wide">
              <h3>Non-functional requirements</h3>
              <div className="nfr-cards">
                {nonFunctionalRequirements.map((n) => (
                  <div key={n.label} className="nfr-card">
                    <strong>{n.label}</strong>
                    <p>{n.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="prose-card stories-card">
            <h3>User stories — tap to expand</h3>
            <div className="story-acc">
              {userStories.map((s, i) => (
                <button
                  key={s.text}
                  type="button"
                  className={`story-row ${openStory === i ? 'open' : ''}`}
                  onClick={() => setOpenStory(openStory === i ? -1 : i)}
                >
                  <span className="story-role">{s.role}</span>
                  <span className="story-text">{s.text}</span>
                  <span className="story-chevron" aria-hidden>
                    {openStory === i ? '−' : '+'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </TabPanel>

        <TabPanel id="design" active={tab}>
          <div className="prose-card">
            <h3>Layered architecture</h3>
            <p className="muted">
              Express keeps concerns separated so we can grow: swap storage, tighten policies, or add
              services without rewriting everything.
            </p>
            <div className="layer-strip">
              {architecture.layers.map((L, i) => (
                <motion.div
                  key={L.name}
                  className="layer-tile"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <span className="layer-step">{i + 1}</span>
                  <strong>{L.name}</strong>
                  <p>{L.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="prose-card">
            <h3>Authentication &amp; authorisation</h3>
            <p className="muted">
              Login mint a JWT; every protected route runs auth + role guards so the UI and API stay in
              sync.
            </p>
            <ul className="rbac-list">
              {rbacRules.map((r) => (
                <li key={r.role}>
                  <span className={`role-pill role-${r.role.toLowerCase()}`}>{r.role}</span>
                  <span>{r.access}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="prose-card">
            <h3>Validation design</h3>
            <ul className="check-list">
              {validationDesign.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
        </TabPanel>

        <TabPanel id="security" active={tab}>
          <div className="prose-card">
            <h3>Privacy &amp; security policy checklist</h3>
            <p className="muted">
              These are the promises we document for markers — and the behaviours verified in code
              review.
            </p>
            <ul className="security-grid">
              {securityPolicies.map((s) => (
                <li key={s} className="security-item">
                  <span className="security-check" aria-hidden />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </TabPanel>

        <TabPanel id="apis" active={tab}>
          <div className="api-map">
            {urlDesign.map((g) => (
              <div key={g.group} className="prose-card api-group">
                <h3>{g.group}</h3>
                <ul>
                  {g.items.map((u) => (
                    <li key={u}>
                      <code>{u}</code>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </TabPanel>

        <TabPanel id="team" active={tab}>
          <div className="team-card prose-card">
            <div className="team-logo" aria-hidden>
              ✦
            </div>
            <h3>{TEAM.name}</h3>
            <p className="team-lead">
              Team lead — <strong>{TEAM.lead}</strong>
            </p>
            <ul className="team-members">
              {TEAM.members.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
            <p className="muted small">
              This hub mirrors our IT6006 Requirements &amp; System Design documents for easy demos
              during review.
            </p>
          </div>
        </TabPanel>
      </div>
    </div>
  );
}

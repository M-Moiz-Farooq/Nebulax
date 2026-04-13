/**
 * IT6006 — NEBULAX project copy (Requirements + System Design) for in-app Project Hub.
 */

export const TEAM = {
  name: 'NEBULAX',
  module: 'IT6006',
  title: 'Secure Finance Management Web Application',
  lead: 'Muhammad Moiz Farooq',
  members: ['Muskan Panwar', 'Piyush Tatwani', 'Simranjeet Singh Somal'],
};

export const overview = {
  headline: 'Why we built this',
  body: `Small and medium businesses still juggle spreadsheets, ad-hoc tools, and manual approvals. That means messy records, weak access control, and a higher chance that someone changes numbers they shouldn't. NEBULAX ships a clear, role-aware finance workspace — backed by a secure API — so teams can trust their ledger.`,
  bullets: [
    'Authenticated access with JWT sessions',
    'Role-based permissions (Admin / Accountant / User)',
    'Validated transactions + formal credit & debit notes',
    'Modular backend (Django + SQLite or Node + MongoDB)',
  ],
};

export const problemStatement = {
  title: 'Problem',
  text: `SMBs often rely on manual processes or unstructured digital tools for money movement. The result: inconsistent data, unclear ownership, and a larger surface area for unauthorized edits to financial records.`,
};

export const solutionStatement = {
  title: 'Solution',
  text: `A secure web experience on top of a hardened REST API (e.g. Django + SQLite or Express + MongoDB): login, audited actions, server-side validation, and RBAC so each person only sees what their job requires.`,
};

export const businessRequirements = [
  'Secure platform for managing financial transactions',
  'Only authorized users reach sensitive financial views',
  'Accurate, validated records with clear credit vs debit semantics',
  'Operational roles enforced end-to-end',
  'Less admin drag than purely manual processes',
];

export const functionalRequirements = [
  'Register and sign in with secure flows',
  'JWT authentication for protected areas',
  'Authorized roles create and maintain transactions',
  'Credit and debit note workflows',
  'Transaction history available by role',
  'Administrators manage user accounts',
  'RBAC enforced on both API and UI',
];

export const nonFunctionalRequirements = [
  { label: 'Security', detail: 'bcrypt password hashing, JWT, sanitization & rate limits on the API' },
  { label: 'Performance', detail: 'API targets sub-2s responses for normal loads' },
  { label: 'Scalability', detail: 'Layered routes → controllers → middleware → models' },
  { label: 'Reliability', detail: 'Consistent validation errors; no silent failures on bad input' },
  { label: 'Usability', detail: 'Predictable REST URLs and a guided UI for each role' },
];

export const userStories = [
  { role: 'Everyone', text: 'Sign in knowing credentials are handled with modern auth practices.' },
  { role: 'Administrator', text: 'Invite teammates and assign roles so access stays intentional.' },
  { role: 'Accountant', text: 'Post and adjust transactions so the books stay current.' },
  { role: 'User', text: 'Review history relevant to my role without risky edit powers.' },
];

export const securityPolicies = [
  'Passwords stored with bcrypt hashing',
  'JWT for authenticated API access',
  'RBAC middleware aligns with ADMIN / ACCOUNTANT / USER',
  'express-validator ensures shapes & bounds server-side',
  'Sensitive fields (e.g. password hashes) stay off API surfaces',
  'Helmet tightens HTTP headers',
  'Rate limiting resists brute-force style abuse',
];

export const architecture = {
  layers: [
    { name: 'Routes', desc: 'Stable REST map: auth, users, transactions, notes' },
    { name: 'Controllers', desc: 'Business flows: who can add, edit, or delete' },
    { name: 'Middleware', desc: 'Auth, RBAC, validation, security & errors' },
    { name: 'Models', desc: 'Database models: users, transactions, notes' },
  ],
};

export const rbacRules = [
  { role: 'ADMIN', access: 'Full platform: users, transactions, deletes, notes' },
  { role: 'ACCOUNTANT', access: 'Create/update transactions + issue credit or debit notes' },
  { role: 'USER', access: 'Read-focused experience; scoped transaction visibility' },
];

export const urlDesign = [
  { group: 'Auth', items: ['POST /api/auth/signup', 'POST /api/auth/login'] },
  { group: 'Users', items: ['GET /api/users', 'POST /api/users'] },
  {
    group: 'Transactions',
    items: ['GET /api/transactions', 'POST /api/transactions', 'PUT /api/transactions/:id', 'DELETE /api/transactions/:id'],
  },
  { group: 'Notes', items: ['POST /api/notes/credit', 'POST /api/notes/debit'] },
];

export const validationDesign = [
  'Required fields are enforced',
  'Email shape must be valid',
  'Password meets minimum strength rules',
  'Transaction amounts must be > 0',
];

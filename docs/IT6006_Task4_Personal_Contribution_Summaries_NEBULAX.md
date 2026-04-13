# IT6006 — Task 4: Personal Contribution Summaries (NEBULAX)

**Superseded by per-student drafts:** see `docs/task4/` for **full detailed** summaries (one file per member, contract IDs, rubric mapping).

**Team:** NEBULAX — Secure Finance Management Web Application  
**Repository:** https://github.com/M-Moiz-Farooq/Nebulax  

The sections below are a shorter combined copy. Prefer `docs/task4/IT6006_Task4_Personal_Contribution_<Name>_<ID>.md` for submission prep.

---

## 1. Muhammad Moiz Farooq — Team lead / full-stack integration (React + Django API)

### Team role

Team leader and primary **full-stack developer**: **backend** implementation on **Django** (REST-style JSON API, JWT, RBAC) and **front-end integration** (React client, API layer, auth/session behaviour, proxy configuration for development). Responsible for aligning API contracts with the UI and SDD, and for integration fixes that span both layers.

### Tasks completed

- Designed and maintained the **Django** service structure (`django_backend/`), including JWT utilities compatible with the React client, user/transaction/note flows, and role checks consistent with functional requirements.
- Implemented and maintained the **central API client** (`frontend/src/api.js`): Bearer token handling, avoidance of stale tokens on login/signup, and **401 / session-expiry** behaviour wired to the auth context.
- Coordinated **Vite** development proxy settings so `/api` targets the assessment backend (`HOW_TO_START_NEBULAX.md`).
- Led **technical decisions** with the team (assessment stack, route shapes, security defaults) and supported **code review** and merge strategy on GitHub.

### Contribution to decisions

- Advocated for a **single clear assessment path** (Django + SQLite for local marking) while keeping documentation honest about optional stacks.
- Drove alignment between **SDD URL design** and actual routes in `django_backend`, reducing ambiguity for frontend and documentation owners.
- Prioritised **security-by-default** (JWT configuration, server-side role enforcement) in group discussions before adding new UI features.

### Implementation commentary — JWT signing aligned with the React client

The backend issues JWTs whose **payload shape** matches what the SPA expects (`sub`, `role`, `iat`, `exp`), so login and protected calls stay consistent end-to-end. The signing helper centralises expiry rules from settings (e.g. `JWT_EXPIRES_IN`):

```24:36:django_backend/core/jwt_utils.py
def sign_token(user_id, role):
    secret = settings.JWT_SECRET
    if not secret or len(secret) < 32:
        raise ValueError("JWT_SECRET must be set and at least 32 characters")
    now = datetime.now(timezone.utc)
    exp = now + _expires_delta()
    payload = {
        "sub": str(user_id),
        "role": role,
        "iat": now,
        "exp": exp,
    }
    return jwt.encode(payload, secret, algorithm="HS256")
```

On the client, the same token is attached only when appropriate—**not** on raw login/signup calls—so 401 handling remains reliable:

```6:38:frontend/src/api.js
/** Login/signup must not send a stale Bearer token (would confuse 401 handling). */
function isAuthLoginOrSignup(path) {
  return /\/api\/auth\/(login|signup)\/?$/.test(path);
}
// ...
  const token = getToken();
  const sendBearer = !!(token && !isAuthLoginOrSignup(path));
  if (sendBearer) {
    headers.Authorization = `Bearer ${token}`;
  }
```

This pairing is one example of **authentication** implemented consistently across **URL usage** (auth vs protected resources) and **authorisation** (role carried in the token and enforced server-side).

### Evidence of contribution

- **Pull request:** [Insert title and number — e.g. merged PR on `Nebulax` for API/auth integration.]  
- **Team discussion:** [Insert Teams thread screenshot or summary with date — e.g. decision on Django as assessment API, or review of JWT behaviour.]

---

## 2. Muskan Panwar — UI development (layout, design system, screens)

### Team role

**Lead UI developer** for the React application: overall **layout** (shell, navigation, page structure), **visual design system** (spacing, typography, tables, cards, modals), and **role-aware presentation** so Admin, Accountant, and User experiences are distinct and demo-ready.

### Tasks completed

- Built and refined the main **app shell** and **navigation** model, including role-filtered nav items and page framing suitable for screenshots and assessment demonstration.
- Applied consistent **styling** across dashboards, transaction flows, notes, and admin areas (large share of work in `frontend/src/index.css` and structural components).
- Collaborated on **UX states** (loading, empty, errors) so the interface remains understandable during live demo.
- Supported the **Project hub** and marketing-style sections where the brief required visible linkage to requirements and design.

### Contribution to decisions

- Influenced **information hierarchy** (what appears first on dashboard, how dense tables should be for finance data).
- Participated in trade-offs between **visual polish** and **delivery timeline**, agreeing on a “demo-ready first” scope for the final sprint.
- Aligned UI wording with **Piyush** (copy/consistency) and **Moiz** (what the API can supply per role).

### Implementation commentary — Role-aware navigation and layout structure

The layout defines **which routes appear** for which roles, so the UI reinforces **authorisation** without relying on the client alone (the API still enforces access). The nav configuration ties paths to allowed roles:

```26:31:frontend/src/components/Layout.jsx
const nav = [
  { to: '/', label: 'Home', end: true, roles: ['ADMIN', 'ACCOUNTANT', 'USER'], hint: 'Snapshot & shortcuts' },
  { to: '/project', label: 'Project hub', roles: ['ADMIN', 'ACCOUNTANT', 'USER'], hint: 'IT6006 docs & design' },
  { to: '/transactions', label: 'Transactions', roles: ['ADMIN', 'ACCOUNTANT', 'USER'], hint: 'Ledger entries' },
  { to: '/notes', label: 'Notes', roles: ['ADMIN', 'ACCOUNTANT'], hint: 'Credit / debit notes' },
  { to: '/users', label: 'People & access', roles: ['ADMIN'], hint: 'Invite + RBAC' },
];
```

This is a **user/group permission** story at the UI layer: users only see administrative tools when their role permits, matching the “implementation of authentication, authorisation” criterion when combined with server-side checks.

### Evidence of contribution

- **Pull request:** [Insert PR for layout / CSS / major UI feature.]  
- **Team discussion:** [Insert Teams evidence — e.g. UI review before demo, or agreement on nav structure.]

---

## 3. Piyush Tatwani — Documentation, delivery assurance, minor UI fixes

### Team role

**Documentation and delivery assurance**, with **minor front-end fixes**: keeping written artefacts (PRD/SDD alignment, in-app project content, run instructions) consistent with the implemented system; performing **pre-submission checks** (build, run path, smoke tests); and picking up **small UI** adjustments (formatting helpers, incremental polish) that do not require full-stack ownership.

### Tasks completed

- Maintained alignment between **official documents** and the product (terminology, endpoints listed in SDD, feature list in PRD) in collaboration with Moiz and Muskan.
- Supported **in-app documentation** (e.g. project hub content) so assessors can trace requirements to behaviour.
- Owned **delivery assurance** tasks: verifying `HOW_TO_START_NEBULAX.md` steps, checking that the **Django + Vite** path works for teammates, and logging defects early.
- Implemented or refined **minor UI-facing utilities** such as consistent **currency display** and related presentation logic shared across pages.

### Contribution to decisions

- Pushed for **clear submission packaging** (what goes to Canvas, naming, who submits group vs individual artefacts).
- Raised **risk items** early (e.g. environment mismatches, proxy port, missing seed steps) so the team could fix them before the deadline.
- Participated in discussions on **privacy and security wording** in requirements documents, ensuring claims match actual behaviour.

### Implementation commentary — Currency formatting for trustworthy presentation

Financial software must display amounts **predictably**. Centralised formatting avoids each page reimplementing rounding and currency symbols, which reduces demo-time bugs and supports consistency with documentation. Example from the shared money helper:

```1:22:frontend/src/utils/money.js
const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Display amounts in USD (UI only; stored values are plain numbers). */
export function formatMoney(amount) {
  const n = Number(amount);
  if (Number.isNaN(n)) return usd.format(0);
  return usd.format(n);
}

/** e.g. +$1,234.56 or −$1,234.56 */
export function formatSignedMoney(isCredit, amount) {
  const n = Number(amount);
  if (Number.isNaN(n)) return usd.format(0);
  const formatted = usd.format(Math.abs(n));
  const sign = isCredit ? '+' : '−';
  return `${sign}${formatted}`;
}
```

This illustrates a **small but critical** UI responsibility: **data integrity** is preserved on the server, while the **presentation layer** gives auditors and users a clear, uniform view—supporting both **functional** and **non-functional** requirements for usability and trust.

### Evidence of contribution

- **Pull request:** [Insert PR for docs alignment, `money.js`/utils, or project hub text.]  
- **Team discussion:** [Insert Teams evidence — e.g. submission checklist thread or doc review.]

---

## 4. Simranjeet Singh Somal — Database layer (models, migrations, seed, integrity)

### Team role

**Database owner** for the Django assessment stack: **data model** design for users and finance entities, **migrations**, **SQLite** local development setup, **seed/admin** workflows, and **integrity** considerations (roles, constraints, consistency with API responses).

### Tasks completed

- Defined and maintained **models** for users (email-based identity, role field) and finance-related entities, aligned with the domain described in the PRD.
- Worked with migrations so a **fresh clone** can run `migrate` and reach a consistent schema for team demos.
- Supported **`seed_admin`** (environment-driven admin creation) so the first login path is repeatable without committing secrets.
- Advised on **data integrity** (e.g. role enums, sensible defaults) where the API and UI depend on stable field meanings.

### Contribution to decisions

- Contributed to discussions on **role storage** and **identifier strategy** (email as `USERNAME_FIELD`) for simplicity and audit clarity.
- Helped the team understand **SQLite** limitations and **local vs production** expectations for the assessment.
- Coordinated with **Moiz** when API changes required schema or migration updates.

### Implementation commentary — User model and role storage

RBAC in the application depends on a **single, explicit role** stored in the database and returned through auth flows. The custom user model keeps roles constrained and indexable:

```36:44:django_backend/core/models.py
class User(AbstractBaseUser):
    email = models.EmailField(unique=True, db_index=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLES.USER)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: list = []
```

This supports **authorisation** downstream: JWT payloads and API checks reference the same role values as the database, which preserves **data integrity** across sessions and is easy to justify in the SDD.

### Evidence of contribution

- **Pull request:** [Insert PR touching `models.py`, migrations, or `seed_admin`.]  
- **Team discussion:** [Insert Teams evidence — e.g. schema decision or migration coordination.]

---

## Notes for submission

1. Replace bracketed **[Insert …]** placeholders with **your real** PR links and Teams screenshots (Task 4 requires this evidence).
2. If the course template asks for a **specific word count or format**, paste each section into the **official IT6006 template** and adjust headings to match.
3. Keep screenshots **legible** (crop to the PR title, reviewers, and dates if necessary).

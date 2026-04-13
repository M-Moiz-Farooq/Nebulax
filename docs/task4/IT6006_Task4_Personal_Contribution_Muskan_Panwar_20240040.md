# IT6006 — Task 4: Personal Contribution Summary

| Field | Detail |
|-------|--------|
| **Course** | IT6006 — Development of an Enterprise Web Application |
| **Assessment** | Project (Task 4 — Reflective journal / personal contribution) |
| **Student** | Muskan Panwar |
| **Student ID** | 20240040 |
| **Team** | NEBULAX |
| **Team role (contract)** | Requirements analysis, user stories, interface planning, validation rules, document formatting, and testing support (`IT6006_Team_Contract_NEBULAX.md`, §5). **Implementation focus:** lead UI/UX for the React (Vite) client (see progress report §4.2). |

**Repository:** https://github.com/M-Moiz-Farooq/Nebulax  

---

## 1. How my role matches the team contract and project outcomes

The contract positions me at the intersection of **requirements → interface planning → validation thinking**, which matches how I approached the UI: screens must reflect **functional requirements** (who can do what) and **non-functional** expectations (usable forms, readable tables, credible enterprise presentation for screenshots and demo).

The updated progress report records my lead responsibility for the **entire React UI**: navigation, pages, tables/forms, modals, and role-specific views, plus collaboration to ensure the UI matches **RBAC** and documented requirements.

Staged contract roles also show me as **facilitator/guardian** in Stage 1 and **QA/review lead** support in Stage 2—consistent with keeping UI work reviewable (PRs) and aligned with validation discussions.

---

## 2. Tasks I completed (delivery-aligned)

**Interface planning & UI build**

- Designed and implemented the **application shell** and **navigation model** so routes match the product’s role model (Admin / Accountant / User), including hiding or surfacing features per role at the UI layer (always paired with server enforcement).
- Built major screens: **login/sign-up**, **dashboard**, **transactions**, **notes**, **user administration** (admin), and the in-app **project hub** content area, with cohesive styling concentrated in `frontend/src/index.css` and structural components.
- Implemented **UX states** needed for enterprise credibility: loading, empty lists, and visible error/feedback patterns to support demonstration and marking screenshots.

**Requirements & validation (contract §5)**

- Contributed to **user stories** and **validation rules** discussions (email/password expectations, transaction fields), translating requirements into UI constraints and messages.
- Supported **document formatting** and coursework narrative consistency by ensuring on-screen terminology matches PRD/SDD language where applicable.

**Testing support (contract)**

- Supported manual walkthroughs and screenshot capture scenarios (role-based paths), as reflected in the team’s QA workflow in the progress report.

---

## 3. My contribution to team decisions

- **Role-aware UX:** I pushed for clarity in the UI when roles differ (e.g. what an ordinary user sees vs admin tools), so the demo tells a coherent story without confusing markers.
- **Demo readiness vs scope:** I participated in prioritising “presentation-quality” polish for critical flows (login → dashboard → primary CRUD) consistent with milestone planning in the contract §9 table.
- **Collaboration with integration:** Where API shapes affected layout (tables, totals), I coordinated with the team leader/integration owner to avoid UI assumptions that contradict the SDD.

---

## 4. Implementation commentary — Role-gated navigation (UI authorisation story)

**Rubric link:** Supports **Task 3 — URL / route behaviour** at the user-experience level and **Task 3 — Authorisation** as visibly reflected in what each role can access in the client (complementing server-side enforcement).

The layout component defines navigation entries with explicit **allowed roles**. This makes RBAC understandable during demo: users do not see admin-only destinations unless their role permits.

```26:31:frontend/src/components/Layout.jsx
const nav = [
  { to: '/', label: 'Home', end: true, roles: ['ADMIN', 'ACCOUNTANT', 'USER'], hint: 'Snapshot & shortcuts' },
  { to: '/project', label: 'Project hub', roles: ['ADMIN', 'ACCOUNTANT', 'USER'], hint: 'IT6006 docs & design' },
  { to: '/transactions', label: 'Transactions', roles: ['ADMIN', 'ACCOUNTANT', 'USER'], hint: 'Ledger entries' },
  { to: '/notes', label: 'Notes', roles: ['ADMIN', 'ACCOUNTANT'], hint: 'Credit / debit notes' },
  { to: '/users', label: 'People & access', roles: ['ADMIN'], hint: 'Invite + RBAC' },
];
```

This is a concrete implementation choice: it encodes **permission groups** (roles) into **navigation affordances**, which is a standard enterprise UX pattern for authorisation transparency. It must be paired with API-side checks (owned by backend/integration work) to satisfy security properly—our team treated both sides as mandatory.

---

## 5. Evidence of contribution

**GitHub — NEBULAX repository**  
The project repository is **https://github.com/M-Moiz-Farooq/Nebulax**. My UI work is reflected in **commits**, **pull requests**, **issues**, and **reviews** on that repository, meeting the assessment expectation of visible contribution in GitHub.

**Team communication**  
Per **IT6006_Team_Contract_NEBULAX.md**, the team used **Microsoft Teams** for coordination; integration and scope alignment are also visible through **GitHub** activity.

---

## 6. Declaration alignment

This summary is consistent with the NEBULAX **team contract** and the **updated progress/contribution report** for Muskan Panwar.

**Student:** Muskan Panwar (20240040)

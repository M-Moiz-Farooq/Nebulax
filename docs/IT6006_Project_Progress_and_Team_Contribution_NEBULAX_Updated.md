# IT6006 – Project Progress and Team Contribution Report (Updated)

**Project:** Secure Finance Management Web Application  
**Team name:** NEBULAX  
**Team leader:** Muhammad Moiz Farooq  
**Team members:** Muskan Panwar · Piyush Tatwani · Simranjeet Singh Somal  

**Document purpose:** This report updates the previous *Project Progress and Team Contribution* submission. It records **progress since then**, **what changed in the product**, and how the team is **positioned for final submission** next week. It is aligned with our **Project Requirements Document**, **System Design Document**, and the **assessment scenario** (secure enterprise finance system with authentication, RBAC, validation, and evidence of teamwork).

---

## 1. Introduction

This document outlines **continued progress** on the Secure Finance Management Web Application and provides an updated breakdown of **team member contributions**. The project continues to follow structured practices aligned with the **Software Development Life Cycle (SDLC)**, with emphasis on **security**, **collaboration**, and **role-based responsibilities**.

Since the last progress report, the team has moved from **backend-first implementation** to a **complete full-stack application**: a **React-based client**, **integrated REST API**, **persistent data**, and **documentation-aligned** features suitable for demonstration and marking.

---

## 2. Project Progress Summary (since last report)

The following **additional** milestones have been achieved (building on work already listed last week, e.g. team contract, requirements, system design, Git workflow, JWT/RBAC backend foundation):

| Area | Progress |
|------|----------|
| **Front-end application** | Full **React (Vite)** UI implemented: login/sign-up, dashboard, transactions, credit/debit notes, user administration (admin), and an in-app **project hub** summarising requirements and design. |
| **Visual & UX** | Cohesive **UI system** (layout, navigation, tables, forms, modals), **role-aware** screens for Admin / Accountant / User, and polish for **demo and screenshots**. |
| **API completeness** | Endpoints aligned with the system design: **auth**, **users**, **transactions** (CRUD rules per role), **notes** (credit/debit). **Health check** endpoint for monitoring. |
| **RBAC (refined)** | Rules implemented **end-to-end**: e.g. users with **USER** role can **add** their own transactions; **edit/delete** rules follow staff/admin policies as designed. |
| **Data layer** | Application supports **persistent storage**; **Django + SQLite** is the **primary assessment** path; optional **Node/MongoDB** API remains in-repo for the same contract. |
| **Security (maintained)** | **JWT** sessions, **bcrypt** password storage, **server-side validation**, rate limiting and security-related middleware on the API, **CORS** configuration for development. |
| **Documentation ↔ product** | In-app content and behaviour cross-checked against **functional and non-functional** requirements (auth, RBAC, transactions, notes, admin user management). |

---

## 3. Development Approach (unchanged principles, evolved practice)

The team continues to use:

- **GitHub** for version control, history, and contribution evidence.  
- **Modular architecture** (separation of API routes, business logic, models, middleware).  
- **Role-based task allocation** aligned with strengths (see Section 5).  
- **Regular communication**, shared run instructions, and **integration testing** before meetings.  

**New in this phase:** emphasis on **full-stack integration** (same API contracts for all clients), **UI–API regression checks**, and **packaging evidence** (screenshots, demo script) for assessment.

---

## 4. Team Roles and Contributions (updated)

### 4.1 Muhammad Moiz Farooq (Team Leader)

**Previous contributions** (retained): project coordination, GitHub, backend architecture, JWT authentication, RBAC, API routes, security practices (hashing, token validation), consolidation.

**Additional contributions this phase:**

- **Full API implementation and maintenance** for users, transactions, and notes; alignment with **documented URL design**.  
- **Environment and database configuration**; seed/admin flows; scripts and instructions so **all members can run** API + UI locally.  
- **Integration work**: when the UI required new rules (e.g. transaction creation for **USER** role), **server-side enforcement** and **consistent JSON responses**.  
- **Optional Django/SQLite backend path** to reduce external dependency risk for demos (parallel to Node stack).  
- **Resolution of cross-cutting issues** (e.g. development proxy, error handling, security headers).  
- **Final technical review** of integrated behaviour before submission milestones.

### 4.2 Muskan Panwar

**Previous contributions** (retained): requirements/user-story input, validation discussion, documentation support, testing support.

**Additional contributions this phase:**

- **Lead responsibility for UI design and implementation** for the **entire React application** (screens, navigation, forms, tables, role-specific views).  
- **Design system** choices: layout, visual hierarchy, feedback states (loading/empty), and presentation-quality **demo screens**.  
- Collaboration with the team to ensure **UI matches RBAC** and **requirements** (what each role sees and can do).

### 4.3 Piyush Tatwani

**Previous contributions** (retained): system design and API planning support, URL endpoint discussion, backend support, design discussions.

**Additional contributions this phase:**

- **Alignment of in-app project hub** with **PRD/SDD** wording and listed endpoints.  
- **Targeted frontend** adjustments after review (copy, minor fixes).  
- Support for **demonstration narrative** and **documentation consistency**.  
- Participation in **group reviews** before lecturer meetings.

### 4.4 Simranjeet Singh Somal

**Previous contributions** (retained): testing, issue identification, documentation updates, QA.

**Additional contributions this phase:**

- **Structured manual testing** of login, navigation, and **role-based** flows.  
- **Regression checks** after UI/API changes (forms, errors, forbidden actions).  
- **Feedback loop** to developers; **retest** after fixes.  
- Support for **final smoke tests** ahead of submission.

---

## 5. Task Distribution Overview (updated)

| Task area | Primary responsibility | Supporting members |
|-----------|-------------------------|---------------------|
| Project coordination & integration | Team leader | All members |
| Requirements & coursework narrative | Muskan, Piyush | Team leader, Simranjeet |
| **UI / client application** | **Muskan** | Team leader (integration) |
| **API, security, data, DevOps** | **Team leader** | Piyush (design alignment) |
| **Testing & QA** | **Simranjeet** | Muskan |
| Documentation & evidence (screenshots, runbook) | Team leader | All members |

---

## 6. Current Implementation Status (comprehensive)

The system **now** includes, in addition to items already reported last week:

- **Front-end:** Single-page application with **protected routes**, **JWT** usage from the client, and **role-gated** pages (e.g. notes for staff, users for admin).  
- **Transactions:** List, filter, export; **create** per policy; **edit/delete** per admin/accountant/admin rules as implemented.  
- **Notes:** Credit and debit note submission per **API design** (`POST` credit/debit note routes).  
- **User management:** Admin **list/create** users with role assignment.  
- **Validation:** Server-side rules for email, password strength, amounts, types, and related fields.  
- **Security:** Password hashing, JWT protection, RBAC middleware, sanitisation/rate-limit style protections on the API as per non-functional requirements.  
- **Evidence readiness:** Application suitable for **screenshots**, **API walk-through**, and **short video** if required by the rubric.

---

## 7. Mapping to Assessment Requirements & Rubric (coverage checklist)

*Use this table to show markers you have addressed the **scenario** (secure finance app) and typical **criteria** (requirements, security, working software, docs, teamwork). Adjust row wording if your official rubric uses different labels.*

| Typical criterion / theme | How NEBULAX addresses it | Evidence to attach |
|---------------------------|--------------------------|--------------------|
| **Problem & solution** (business need) | PRD problem/solution reflected in project hub and app purpose | PRD excerpt + hub screenshot |
| **Functional requirements** | Register/login, JWT, transactions, notes, admin users, RBAC | Screen shots + short narrative |
| **Non-functional – security** | bcrypt, JWT, RBAC, validation, secure headers, rate limiting | SDD security section + code references |
| **Non-functional – usability / API** | Clear REST structure, consistent JSON, simple UI | URL list from SDD + Postman or browser network log |
| **System design alignment** | Layered architecture, documented endpoints, models | SDD + implementation mapping |
| **Working system** | End-to-end demo on local or deployed stack | Demo video or live demo |
| **Teamwork & contribution** | This document + Git history + named roles | Progress reports, commits, meeting notes |
| **Testing / QA** | Manual test passes, issue tracking | Test notes, bugfix commits |

**Next week:** fill the **Evidence** column with **final** artefacts (PDF report, screenshot set, optional video link).

---

## 8. Challenges and Resolutions (updated)

| Challenge | Resolution |
|-----------|------------|
| **Full-stack integration** | Shared API contract; leader-owned integration; repeated UI–API checks. |
| **Role complexity** | RBAC clarified in UI and API; adjustments where USER role needed “add transaction” capability. |
| **Environment differences** | Documented run steps; optional second backend stack for SQLite-based demos. |
| **Time pressure (final week)** | Task list for last week (Section 9); parallel work: UI polish, QA, report, evidence. |

---

## 9. Next Steps (final week — submission focus)

**Next week is the last week of the project.** The team will prioritise:

1. **Freeze scope** — no new features unless required to close rubric gaps; **bugfix only**.  
2. **Evidence pack** — final **screenshots** (all roles, all major features), **API checks** (optional Postman collection or browser export).  
3. **Written submission** — integrate this progress update into the **final report**; ensure **every member’s contribution** is explicit.  
4. **Demo rehearsal** — timed run-through: problem → login → USER / Accountant / Admin paths → security talking points.  
5. **Repository hygiene** — README with **exact steps** to run; `.env.example` without secrets; **no credentials** in Git.  
6. **Individual reflection / team evaluation forms** — per module instructions (if applicable).  
7. **Final submission** — upload before deadline; one person confirms receipt.

---

## 10. Conclusion

Since the previous progress report, NEBULAX has advanced from a **strong backend and security foundation** to a **complete, demonstrable secure finance application** with a **full user interface**, **end-to-end role-based behaviour**, and **clear traceability** to the **Project Requirements** and **System Design** documents. The team is using the **final week** to consolidate **evidence**, **documentation**, and **quality assurance** so the submission meets the **assessment scenario and rubric** expectations.

---

*End of updated report. NEBULAX · IT6006 · Internal use — align dates and filenames with your institution’s submission portal.*

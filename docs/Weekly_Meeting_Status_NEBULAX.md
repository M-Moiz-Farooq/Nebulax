# IT6006 — NEBULAX · Weekly meeting notes (this week)

**Module:** IT6006 — Secure Finance Management Web Application  
**Team:** NEBULAX  
**Meeting week:** [insert date range]  
**Prepared for:** Course / supervisor check-in

---

## 1. Attendance & agenda (2 min)

- Quick round: progress, blockers, demo readiness.
- Align on submission checklist (report, screenshots, video if required).

---

## 2. Last week (brief recap)

*(Align with last week’s minutes: roles, scope, and who owned which stream.)*

- Requirements and system design narrative agreed; backend/API direction set.
- Work split agreed: UI ownership, shared integration tasks, and core API ownership.

---

## 3. This week — main deliverables

### UI — **Muskan Panwar** (lead this week)

- **Designed and implemented** the end-to-end **React (Vite) user interface** for the finance workspace: navigation, dashboard, transactions, notes, users (admin), login, and project hub content.
- Applied a **consistent visual system** (glass-style surfaces, motion/scroll treatment, typography) and ensured the UI matches the **role-based** experience (Admin / Accountant / User) described in our requirements and system design documents.
- **Outcome:** The app is **demo-ready from the browser** with a clear path for screenshots and walk-throughs for assessment.

### Supporting development — **Simranjeet Singh Somal** & **Piyush Tatwani**

- **Simranjeet:** smaller **coding/support tasks** — e.g. wiring or verifying parts of the UI against the API, fixing edge cases in forms or navigation, and helping with **manual test passes** (login flows, role checks).
- **Piyush:** focused **targeted coding tasks** — e.g. content/copy checks on the project hub, light **frontend fixes** after review, and assisting with **consistency** across pages (labels, empty states, accessibility basics).

*(Adjust bullet examples above to match what you actually did this week — keep them small and honest.)*

### Core engineering — **Muhammad Moiz Farooq** (team lead — **majority of code-heavy work**)

- **Backend/API:** implementation and integration of the **REST API** (authentication, JWT, role rules, transactions, notes, user management) and alignment with the **documented endpoints** (PRD / system design).
- **Database & environment:** connection setup, seed/admin user flow, and keeping **dev run instructions** stable so the whole team can run **frontend + API** locally.
- **Integration & RBAC:** enforcing **server-side** permissions (e.g. who can create/edit/delete transactions, notes, users) and matching behaviour on the **UI**.
- **Heavy lifting:** most of the **architecture wiring**, **security-sensitive** paths, and **end-to-end fixes** when UI and API needed to stay in sync.

---

## 4. Demo script suggestion (5 min)

1. **Login** — show JWT-backed session (student vs admin paths).
2. **USER** — add a transaction; show scoped list; mention edit rules for staff.
3. **Accountant / Admin** — notes and/or user management as per role.
4. **Project hub** — tie UI back to **requirements + design** documents.

---

## 5. Next week / risks

| Item                         | Owner   | Status / note     |
|-----------------------------|---------|-------------------|
| Final report / screenshots  | Team    | [ ]               |
| Demo video (if required)    | Team    | [ ]               |
| Any blocker (tools, access) | [name]  | None / describe   |

---

## 6. Action items (fill in live)

- [ ] Everyone: confirm your **named contributions** for the final submission PDF.
- [ ] Muskan: **UI asset list** (pages to screenshot) shared in group chat.
- [ ] Moiz: **runbook** one-pager — how to start API + UI for markers.
- [ ] Simranjeet & Piyush: **smoke-test** checklist signed off before deadline.

---

*NEBULAX · IT6006 — internal weekly status (template). Edit names/dates/tasks to match your actual week.*

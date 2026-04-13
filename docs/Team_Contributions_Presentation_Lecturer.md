# IT6006 — NEBULAX  
## Team contributions & work breakdown (for lecturer presentation)

**Module:** IT6006 — Secure Finance Management Web Application  
**Team name:** NEBULAX  

| Role on team | Name |
|--------------|------|
| Team lead | Muhammad Moiz Farooq |
| Team members | Muskan Panwar · Piyush Tatwani · Simranjeet Singh Somal |

**Note:** *Next week is the final week of this project. Section 5 lists what remains for submission.*

---

## 1. Project summary (what we built)

We delivered a **secure, role-based finance web application**:

- **Front end:** React (Vite) — login, dashboard, transactions, credit/debit notes, user administration (admin), and an in-app **project hub** aligned with our requirements and system design documents.  
- **Back end:** REST API with **JWT authentication**, **bcrypt** password handling, **role-based access** (Admin, Accountant, User), validation, and security-oriented middleware.  
- **Data:** Persistent storage with documented models (users, transactions, notes) and API routes matching our design specification.

---

## 2. What each person did — this week (and overall)

Below: **who**, **what area**, **concrete steps / tasks**, and **outcome**.

---

### Muskan Panwar — User interface (UI) design & implementation

**Focus:** End-user experience, visual design, and building the interactive UI the marker sees in the browser.

**Steps / work items:**

1. Structured the **page layout** (navigation, main content area, responsive behaviour).  
2. **Designed and implemented** core screens: **login**, **dashboard**, **transactions**, **notes**, **users** (admin), and **project hub** (coursework narrative).  
3. Applied a **consistent design language** (colours, spacing, cards/tables, feedback such as loading and empty states).  
4. Implemented **UI-level role behaviour** (what each role can see and access in the menu and on each page), matching the **Admin / Accountant / User** rules from our documents.  
5. Polished the interface for **demonstration** (readable tables, forms, and navigation suitable for screenshots and live demo).

**Outcome:** A **cohesive, demo-ready front end** that reflects our requirements and system design and supports the team’s assessment materials.

---

### Simranjeet Singh Somal — Supporting development & quality checks

**Focus:** Supporting the integration between UI and API, and catching issues before submission.

**Steps / work items:**

1. **Manual testing** of user flows (sign up, log in, navigation, role-specific screens).  
2. **Verification** that UI actions match API behaviour (e.g. errors, success paths, forbidden actions for limited roles).  
3. **Edge-case checks** on forms (validation messages, required fields, basic usability).  
4. **Feedback** to the team on bugs or confusing labels; **retesting** after fixes.  
5. Assisted with **consistency** across pages (terminology, button labels) where needed.

**Outcome:** Higher **confidence in stability** before demo and submission; fewer last-minute surprises in the live walk-through.

---

### Piyush Tatwani — Supporting development & documentation alignment

**Focus:** Aligning what appears on screen with coursework wording; small fixes and review support.

**Steps / work items:**

1. Reviewed **in-app project hub** and related copy so it stays aligned with the **Project Requirements Document** and **System Design Document**.  
2. **Small front-end adjustments** after team review (text, minor layout or clarity fixes).  
3. Helped **cross-check** that stated API routes and features in the hub match what the application actually does.  
4. Supported **preparation of demonstration talking points** (what to say per screen).  
5. Participated in **group review** before lecturer meetings and submission milestones.

**Outcome:** Clearer **alignment between documentation and the live app**, and stronger presentation narrative.

---

### Muhammad Moiz Farooq — Team lead; back end, integration & majority of implementation

**Focus:** API architecture, security-sensitive logic, database configuration, and keeping the full stack runnable for everyone.

**Steps / work items:**

1. Implemented and maintained the **REST API** (authentication, users, transactions, notes) per our **URL and RBAC design**.  
2. Implemented **JWT** issuance/verification, **password hashing**, and **role checks** on protected routes.  
3. Configured **database connectivity** (including environment variables) and **seed / admin user** flows for a working demo.  
4. Ensured **server-side validation** and consistent **JSON responses** for the React client.  
5. Handled **integration** when the UI needed new behaviour (e.g. permissions for creating transactions per role).  
6. Provided **run instructions** so team members can start **API + front end** locally for testing and recording.  
7. Where applicable, added **alternative or supplementary back-end setup** (e.g. SQLite/Django path) to reduce dependency issues for the group.  
8. Addressed **end-to-end issues** (CORS, proxy in development, error handling) so the app works as one system.

**Outcome:** A **working, defensible back end** integrated with the UI, suitable for technical questions in viva or marking.

---

## 3. Division of effort (honest summary)

| Area | Primary ownership | Support |
|------|-------------------|---------|
| UI design & implementation | Muskan | Whole team feedback |
| API, security, database, integration | Moiz | — |
| Testing & QA support | Simranjeet | Team |
| Copy, small UI fixes, doc alignment | Piyush | Team |
| Requirements / design docs (external PDFs) | Whole team | Moiz & Piyush (technical alignment) |

---

## 4. How this maps to module outcomes (short)

- **Security:** Authentication, authorisation, validation, safe password storage.  
- **Functionality:** Transactions, notes, user management as per specification.  
- **Documentation:** PRD + system design reflected in the app and project hub.  
- **Teamwork:** Clear roles; integration and review before submission.

---

## 5. Next week — final week (submission checklist)

*Next week is the **last week**. The following should be closed as a team:*

| Task | Suggested owner | Done |
|------|-----------------|------|
| Final **written report** (if required) with screenshots | Team | ☐ |
| **Demo** rehearsal (live: login → roles → key features) | All | ☐ |
| **Video** recording (if required by brief) | All | ☐ |
| Confirm **everyone’s named contributions** in the PDF | Team lead | ☐ |
| Zip/repo **clean**, **README/run steps** for marker | Moiz + 1 reviewer | ☐ |
| Last **bug sweep** and **smoke test** | Simranjeet + Piyush | ☐ |
| Final **UI pass** (typos, broken links) | Muskan | ☐ |

---

## 6. Closing line for the lecturer (optional verbal close)

*“This week we consolidated a working full-stack application with a complete UI, a secured API, and documentation alignment. Next week we focus purely on final polish, evidence packaging, and submission. We’re happy to demonstrate the system or answer technical questions.”*

---

*Document version: for internal presentation and lecturer update. Adjust dates and tick-boxes before submission.*

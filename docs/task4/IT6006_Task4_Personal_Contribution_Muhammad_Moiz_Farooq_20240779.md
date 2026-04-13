# IT6006 — Task 4: Personal Contribution Summary

| Field | Detail |
|-------|--------|
| **Course** | IT6006 — Development of an Enterprise Web Application |
| **Assessment** | Project (60% weighting; Task 4 — Reflective journal / personal contribution) |
| **Student** | Muhammad Moiz Farooq |
| **Student ID** | 20240779 |
| **Team** | NEBULAX |
| **Team role (contract)** | Team Leader / Coordinator; primary ownership of GitHub, authentication & authorisation implementation, final integration, and submission coordination (`IT6006_Team_Contract_NEBULAX.md`, §5). |

**Repository (evidence of teamwork):** https://github.com/M-Moiz-Farooq/Nebulax  

---

## 1. How my role matches the team contract

The NEBULAX team contract assigns me **overall coordination**, **GitHub repository setup**, **authentication and authorisation implementation**, **final integration**, and responsibility for ensuring the **final submission** pathway is complete. Staged roles in the contract also place me as **facilitator** in Stage 3 and **recorder/documentation** support in Stage 3, which matches how I consolidated run instructions and technical alignment documents (for example `HOW_TO_START_NEBULAX.md` for the **Django + SQLite** assessment path).

Across the project lifecycle (contract §9 milestones 1, 3–4, 6), my work maps to **milestone 1** (GitHub and tooling), **milestones 3–4** (URLs, authentication, authorisation, validation build), and **milestone 6** (final review and submission readiness).

---

## 2. Tasks I completed (aligned with the delivered product)

**Backend (Django — assessment stack)**

- Implemented and maintained the **Django** service under `django_backend/`, including JWT utilities compatible with the React client (`django_backend/core/jwt_utils.py`), and views/routes aligned with our **System Design Document** (auth, users, transactions, notes, health).
- Enforced **RBAC** on the server so “what the UI shows” is not the only security layer—**authorisation** is validated against the same role model documented in the SDD.
- Supported **environment configuration** and **seed admin** workflows (loading configuration consistent with `backend/.env` as referenced in Django settings) so all members can run the API locally for demos and marking.

**Frontend integration (React + Vite)**

- Owned the **central API client** (`frontend/src/api.js`): Bearer token attachment rules, ensuring login/signup do not send stale tokens, and wiring **401** behaviour to session handling in the auth layer.
- Coordinated **development proxy** settings so `/api` targets the Django port used for assessment (`frontend/vite.config.js`, documented in `HOW_TO_START_NEBULAX.md`).

**Process / SDLC (organisational practices)**

- Maintained **GitHub workflow** expectations from the contract: issues/PRs/reviews as visible collaboration evidence.
- Led **integration troubleshooting** (CORS/proxy, JSON response consistency, cross-role behaviour) described in the updated progress report.

---

## 3. My contribution to team decisions

- **Assessment runtime choice:** The team needed a reliable demo path; I drove agreement to treat **Django + SQLite** as the primary assessment backend while keeping documentation transparent about optional stacks, so markers can run the system without unnecessary external dependencies.
- **Security defaults:** I advocated for **server-side enforcement** of RBAC and consistent JWT handling before accepting UI-only shortcuts, aligning with learning outcomes on **security through the SDLC** and **integrity** of finance data.
- **Integration-first sequencing:** When UI requirements changed (for example role-specific transaction rules), I prioritised **API correctness first**, then UI confirmation—reducing rework and keeping the SDD truthful.

---

## 4. Implementation commentary — Authentication token design + client usage (one feature)

**Why this feature matters for the rubric:** It directly supports **Task 3 — Authentication & Authorisation** (JWT role claims, protected behaviour) and **privacy/confidentiality** (session handling) under the security-related criteria.

**Backend — signing tokens with explicit expiry and role**

The API issues JWTs using a payload shape the SPA can consume consistently (`sub`, `role`, `iat`, `exp`), with secret strength enforced at signing time:

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

**Frontend — avoiding incorrect Bearer usage on auth endpoints**

The client must not attach an old token to login/signup calls; otherwise the server may see inconsistent auth state and the UI may mis-handle 401 flows. The API client encodes that rule explicitly:

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

This is an example of **defence-in-depth**: authentication mechanics are correct at the protocol level, while authorisation remains enforced in Django views for each protected URL pattern described in our SDD.

---

## 5. Evidence of contribution (Task 4 requirement)

**Pull request evidence**

- [ ] Insert: screenshot or link of a merged PR you authored (recommended: JWT/API integration, Django views, or `api.js` changes).  
- Suggested search: GitHub → **Pull requests** → filter **author:@me** (or your username).

**Team discussion evidence**

- [ ] Insert: Teams screenshot showing a technical decision thread you participated in (e.g. Django assessment path, RBAC rule, or proxy configuration). Redact unrelated messages if needed.

---

## 6. Mapping to the rubric (self-check)

| Theme | How this summary demonstrates it |
|-------|-----------------------------------|
| **Task 4 — Reflective journal & personal contribution** | Reflects role, tasks, decisions, one implementation with code, and PR/Teams evidence placeholders. |
| **LO2 — AuthN/AuthZ** | JWT issuance + correct client token attachment; references server-side RBAC alignment with SDD. |
| **LO3 — Secure web apps / frameworks** | Django + React integration, practical security constraints (`JWT_SECRET` length). |
| **LO4 — Organisational SDLC practices** | Contract-aligned leadership, GitHub workflow, integration ownership, submission readiness. |

---

## 7. Declaration alignment

This summary describes work performed as part of the NEBULAX team effort and is consistent with our **team contract** and **project documentation** (PRD/SDD/progress report). Evidence attachments are genuine outputs from GitHub and Teams.

**Student:** Muhammad Moiz Farooq (20240779)  
**Date:** _______________

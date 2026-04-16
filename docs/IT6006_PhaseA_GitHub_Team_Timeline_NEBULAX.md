# Phase A — GitHub & team (one-month timeline)

**Project:** NEBULAX (IT6006)  
**Canonical repo (HTTPS):** https://github.com/M-Moiz-Farooq/Nebulax  
**Submission due:** Apr 17 (23:59) — use this file as a **dated checklist**; record **real** completion dates and attach **real** GitHub screenshots (issues, PRs, reviews) that match your account activity.

---

## A1 — Confirm the canonical repo

| Target week | Action | Done (✓) | Notes / date completed |
|-------------|--------|----------|-------------------------|
| **Mar 18–24** | Team agrees **one** repo URL for Canvas | ☐ | Same link in PRD/SDD if required |
| **Mar 18–24** | Owner verifies repo is **public** (or lecturer can access **private** + collaborators) | ☐ | |
| **Mar 18–24** | Copy HTTPS URL into shared doc / Teams | ☐ | `https://github.com/M-Moiz-Farooq/Nebulax` |

---

## A2 — Add collaborators

| Target week | Action | Done (✓) | Who |
|-------------|--------|----------|-----|
| **Mar 18–24** | Owner: **Settings → Collaborators → Invite** each teammate by GitHub username | ☐ | Owner |
| **Mar 18–24** | Role: **Write** (default); **Maintain** only if someone manages branches/protection | ☐ | Owner |
| **Mar 25–31** | Each member: **accept invite**, confirm access to **Code**, **Issues**, **Pull requests** | ☐ | All |
| **Mar 25–31** | Each member: `git clone` (or add `remote`) and `git pull origin main` successfully | ☐ | All |

---

## A3 — Make team activity visible (issues, commits, PRs, reviews)

| Target week | Action | Done (✓) | Owner |
|-------------|--------|----------|-------|
| **Mar 18–24** | Create **labels** (optional): `auth`, `transactions`, `docs`, `task4`, `bug` | ☐ | Owner / TL |
| **Mar 25–31** | Open **Issues** for major areas (examples): Auth & JWT; Transactions & RBAC; Notes; Admin users; Docs / PRD alignment | ☐ | Team |
| **Mar 25–31** | **Assign** each issue to a **different** primary assignee where possible | ☐ | Team |
| **Apr 1–7** | Prefer **small PRs** (feature or doc chunk); avoid one giant “everything” merge | ☐ | All devs |
| **Apr 1–7** | Each meaningful PR: add **description**, link **issue** (`Closes #n`), request **review** | ☐ | Author |
| **Apr 1–7** | Reviewer: **Approve** or **comment** before merge (screenshot for Task 4) | ☐ | Reviewer |
| **Apr 8–17** | **Insights → Contributors:** multiple authors on `main` where possible | ☐ | Owner checks |

**Suggested issue titles (edit to match your backlog):**

1. `[Auth] Login / signup / JWT handling`  
2. `[RBAC] Route protection by role (ADMIN / ACCOUNTANT / USER)`  
3. `[Transactions] CRUD + validation`  
4. `[Notes] Credit/debit notes`  
5. `[Docs] PRD/SDD vs Django API routes`  
6. `[Task 4] Personal contribution evidence (screenshots)`  

### Repo automation (after you merge & push)

These files are in the repo so GitHub can guide the team:

| Path | Purpose |
|------|---------|
| `.github/ISSUE_TEMPLATE/` | **New issue** → pick **Auth & JWT**, **RBAC**, **Transactions**, **Notes**, **Docs**, or **Task 4** — each has checklists. |
| `.github/pull_request_template.md` | New PRs get a **description + “Closes #”** + reviewer checklist. |

**What you do on GitHub:** push `main`, then run `scripts/create-github-issues-nebulax.ps1` once (`gh auth login` first) to open team issues, or create issues manually; open **PRs** that reference `Closes #n`.

---

## A4 — Roles for submission

| Role | Person (fill in) | Responsibility |
|------|------------------|----------------|
| **Repo owner / “face of team”** | | Primary contact; repo settings; merges if needed |
| **Group submitter (one only)** | | Uploads **Team Contract**, **PRD**, **SDD**, **GitHub link** (per Canvas checklist) |
| **Everyone else** | | **Do not** duplicate those three docs on Canvas **unless** lecturer says each zip must include copies — confirm in class |

**Agreement (sign off in Teams or here):**

- [ ] We have one **canonical** repo URL for Canvas.  
- [ ] All members are **collaborators** with accepted invites.  
- [ ] We have **Issues** + **PRs** + at least some **reviews** before Apr 17.  
- [ ] We know who submits **group docs** vs **individual** Task 4 + evaluation forms.

---

## Weekly snapshot (for your own records — use real dates)

Use one row per week; paste **link to a PR** or **issue** you completed that week.

| Week starting | Focus | Evidence link (PR or issue) |
|---------------|--------|------------------------------|
| Mar 18 | Repo + collaborators | |
| Mar 25 | Issues assigned + first PRs | |
| Apr 1 | Reviews + steady merges | |
| Apr 8 | Final PRs + doc fixes | |
| Apr 15 | Freeze; final checks | |

---

*This timeline spans approximately **one month** before submission. Confirm the week ranges match your course schedule if your trimester dates differ.*

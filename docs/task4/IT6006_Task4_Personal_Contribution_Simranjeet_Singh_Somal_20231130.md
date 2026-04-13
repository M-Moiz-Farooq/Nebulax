# IT6006 — Task 4: Personal Contribution Summary

| Field | Detail |
|-------|--------|
| **Course** | IT6006 — Development of an Enterprise Web Application |
| **Assessment** | Project (Task 4 — Reflective journal / personal contribution) |
| **Student** | Simranjeet Singh Somal |
| **Student ID** | 20231130 |
| **Team** | NEBULAX |
| **Team role (contract)** | Testing coordination, bug tracking, evidence collection, screenshots, code review support, documentation updates, and final QA checks (`IT6006_Team_Contract_NEBULAX.md`, §5). **Implementation emphasis:** Django **database layer** — models, migrations, SQLite alignment, seed/admin data path (consistent with progress report and agreed split of work). |

**Repository:** https://github.com/M-Moiz-Farooq/Nebulax  

**Note on responsibilities overlap (contract clarity):** The team contract assigns **data model planning** to Piyush Tatwani at the design stage; my contribution focuses on **implementing and maintaining** the concrete **ORM schema**, **migrations**, and **local SQLite** workflow in Django so the application’s persistence matches the SDD and supports reliable demos.

---

## 1. How my role matches the team contract and project outcomes

The contract defines my primary lane as **QA-oriented**: structured testing, bug tracking, evidence, screenshots, and supporting final checks before submission. The updated progress report expands this into **manual testing** across login/navigation, **role-based flows**, **regression** after changes, and feeding issues back to developers—then **retesting** fixes.

Alongside QA, I contributed to the **database implementation** required by the Django assessment path: ensuring models reflect finance domain needs (users/roles, transactions, notes), that migrations apply cleanly on a fresh environment, and that **seed/admin** steps produce a repeatable first-login experience without committing secrets.

Staged contract roles also place me as **facilitator/guardian** in Stage 2 and **QA/review lead** in Stage 3—consistent with late-project quality gates.

---

## 2. Tasks I completed

**QA / testing / evidence (contract §5)**

- Executed structured **manual test passes** for authentication, navigation, and **RBAC-sensitive** actions (what USER vs staff vs admin should experience).
- Logged defects and regressions in the team workflow (GitHub issues / chat), and verified fixes after merges—supporting the “issues, commits, PRs, reviews” evidence requirement.
- Supported **screenshot and demo evidence** collection for submission packages and progress reporting.

**Database layer (Django + SQLite)**

- Worked on the **Django models** and related **migrations** so persisted data matches the designed entities and supports API queries used by RBAC features.
- Supported **`seed_admin`** usage patterns so admin bootstrap is environment-driven (see `django_backend/core/management/commands/seed_admin.py` and project runbook), aligning with the contract expectation that secrets are not embedded in the repository.

**Documentation updates**

- Contributed QA findings back into documentation and team notes where behaviour changed (expected error messages, forbidden actions), keeping written materials aligned with reality.

---

## 3. My contribution to decisions

- **Release readiness:** I advocated for a **freeze** on risky late changes unless they fix correctness/security issues, matching the final-week plan in the progress report.
- **Data integrity expectations:** I raised questions when UI/API behaviour implied constraints that should be reflected at the model layer (roles, required fields), supporting integrity and reducing “silent failures.”
- **Demo reliability:** Pushed for verifying **migrate → seed → run** steps on a second machine to match marking risk reduction goals.

---

## 4. Implementation commentary — User model and role storage (persistence for RBAC)

**Rubric link:** Supports **Task 3 — Authentication/Authorisation** at the persistence layer: roles must be stored consistently and retrieved for JWT issuance and server checks. Also supports **data integrity** themes important in finance systems.

The custom user model stores a constrained **role** field and uses **email** as the primary identifier, matching the application’s enterprise login assumptions:

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

This is more than “schema work”: it underpins **authorisation** end-to-end—without a stable role representation in the database, JWT role claims and UI role views cannot remain trustworthy. My testing work specifically validated that role expectations in the PRD/SDD matched what persisted users could do through the API.

---

## 5. Evidence of contribution

**GitHub — NEBULAX repository**  
The project repository is **https://github.com/M-Moiz-Farooq/Nebulax**. QA feedback, database-related changes, testing-related fixes, and reviews appear in **commits**, **pull requests**, **issues**, and **review** activity on that repository.

**Team communication**  
Per **IT6006_Team_Contract_NEBULAX.md**, the team used **Microsoft Teams** for coordination; defect reports and retest outcomes were handled in the team workflow and reflected in **GitHub** where fixes landed.

---

## 6. Declaration alignment

This summary is consistent with the NEBULAX **team contract** and the **updated progress report** for Simranjeet Singh Somal.

**Student:** Simranjeet Singh Somal (20231130)

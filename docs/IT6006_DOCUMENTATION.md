# IT6006 — Enterprise Finance API (Academic Documentation)

**Primary implementation (assessment):** **Django + SQLite** — see `HOW_TO_START_NEBULAX.md`, `IT6006_PRD_NEBULAX.md`, and `IT6006_SDD_NEBULAX.md`.  
**Optional:** **Node.js + Express + MongoDB** under `backend/` — same `/api/...` contract for flexibility.

## 1. Problem Statement

Small and mid-sized organisations need a **controlled, auditable way** to record financial movements (credits, debits, adjustments) and to expose that data through an API consumed by internal tools or future web clients. The system must ensure that **only authorised staff** can change the ledger, while other stakeholders may have **read-only** visibility. Without strong authentication, authorisation, validation, and transport-level hardening, such an API is vulnerable to **credential theft, privilege abuse, data tampering, and injection attacks** — all unacceptable in a finance context, even for a classroom prototype.

## 2. Solution Statement

The **assessment** implementation is a **Django** service with **SQLite** persistence, exposing the same JSON API contract the React client expects. **JWT** carries proof of identity after **bcrypt**-hashed password verification. **View-layer decorators and checks** enforce **ADMIN**, **ACCOUNTANT**, and **USER** capabilities. **Server-side validation** runs in Django view functions; **CORS** and **SecurityMiddleware** support a secure dev setup. Errors return **structured JSON** with appropriate HTTP status codes. **`seed_admin`** enables first-time admin creation from environment variables.

The repository also includes a **modular Node.js + Express** backend with **MongoDB (Mongoose)** for teams who want that path: **express-validator**, **helmet**, **rate limiting**, and **mongo sanitization** apply there; behaviour is aligned at the **API contract** level, but **course submission** uses **Django** unless otherwise directed.

---

## 3. Functional Requirements

| ID | Requirement |
|----|-------------|
| FR-1 | Users can **sign up** (default role USER) and **log in** to receive a JWT. |
| FR-2 | **ADMIN** can list and create users with a chosen role. |
| FR-3 | **ADMIN** and **ACCOUNTANT** can **create** and **update** any transaction; **USER** can **list** and **create** own transactions and **update** **own** rows only. |
| FR-4 | **ADMIN** can **delete** transactions. |
| FR-5 | **ADMIN** and **ACCOUNTANT** can create **credit** and **debit** notes via dedicated endpoints. |
| FR-6 | Transactions include **amount (> 0)**, **type** (credit/debit), **description**, **date**, and **creator reference**. |
| FR-7 | API returns **structured JSON** for success and failure. |

---

## 4. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | **Security**: passwords stored hashed; JWT expiry; RBAC; input validation and sanitization. |
| NFR-2 | **Maintainability**: layered structure (Django: URLconf → views → ORM models; Express: routes → controllers → models → middleware). |
| NFR-3 | **Reliability**: explicit DB connection failure handling; configuration via environment variables. |
| NFR-4 | **Observability (academic)**: health endpoint; consistent error codes in JSON. |
| NFR-5 | **Operational hygiene**: `.env.example` documents required secrets without committing real values. |

---

## 5. Security & Privacy Policies (Summary)

### 5.1 Password hashing

Plain-text passwords are **never** stored. **bcrypt** applies an adaptive work factor (salt rounds) so offline cracking of a leaked database is expensive. On the optional Express stack, the password field may be excluded from default queries (`select: false`); Django uses the custom user model without returning hashes in JSON responses.

### 5.2 JWT authentication

After successful login, the server issues a **signed JWT** containing the user id and role. The client sends `Authorization: Bearer <token>`. The server verifies the **signature** and **expiry** on each protected request. Tokens are **short-lived** (configurable via `JWT_EXPIRES_IN`) to limit the window of abuse if stolen.

### 5.3 Role-based access control (RBAC)

**ADMIN**: full access including user administration and transaction deletion.  
**ACCOUNTANT**: create/update transactions and issue notes (no delete).  
**USER**: listing scoped to **own** transactions; may **create** and **update** own rows; cannot **delete** or access staff-only features (e.g. notes, user admin).

### 5.4 Input validation

**Django path:** validation is enforced in **view functions** (JSON parsing, field checks, enums, ownership rules for USER updates). Invalid input yields **4xx** responses with structured messages suitable for the UI.  
**Express path (optional):** **express-validator** enforces email format, password length, positive amounts, enums, and MongoDB id formats; invalid input may yield **422** with field-level messages.

### 5.5 Secure API practices

**Django path:** **SecurityMiddleware**, **CORS** allow-list for the Vite dev origin, secrets via environment variables, JWT verification on protected routes.  
**Express path (optional):** **helmet**, **rate limiting**, **express-mongo-sanitize**, **JSON body size limit**.  
**Both:** **Generic login failure messages** where implemented to limit **account enumeration**; **secrets** in **`.env`**, not in source control.

---

## 6. System Design

### 6.1 Authentication design

1. Client posts credentials to `POST /api/auth/login`.  
2. Server loads user (including password hash), compares with **bcrypt.compare**.  
3. On success, server signs JWT with **HMAC** using `JWT_SECRET`.  
4. Client attaches JWT to subsequent requests.  
5. **Django:** protected views verify JWT and load the user from the **ORM**. **Express:** `authenticate` middleware verifies JWT and attaches `req.user`.

```mermaid
sequenceDiagram
  participant C as Client
  participant A as API
  participant D as SQLite via Django ORM
  C->>A: POST /api/auth/login
  A->>D: find user by email
  D-->>A: user + password hash
  A->>A: bcrypt.compare
  A-->>C: JWT + user profile
  C->>A: GET /api/transactions + Bearer JWT
  A->>A: verify JWT + load user
  A->>D: query transactions
  A-->>C: JSON data
```

### 6.2 Authorisation design

Authentication establishes **who** the caller is. Authorisation decides **what** they may do. **Django:** JWT decorator plus explicit **role** and **ownership** checks in view logic. **Express (optional):** `authenticate` then **`allowRoles(...)`** middleware on routes. Policy must remain **server-side** for both stacks.

### 6.3 URL design (RESTful + secure)

| Method | Path | Purpose | Auth / Role |
|--------|------|---------|-------------|
| POST | `/api/auth/signup` | Register | Public |
| POST | `/api/auth/login` | Login | Public |
| GET | `/api/users` | List users | ADMIN |
| POST | `/api/users` | Create user | ADMIN |
| GET | `/api/transactions` | List transactions | JWT (USER: own rows only) |
| POST | `/api/transactions` | Create | ADMIN, ACCOUNTANT, USER |
| PUT | `/api/transactions/<id>` | Update | ADMIN, ACCOUNTANT; USER (**own** row only); `<id>` = integer PK (Django) |
| DELETE | `/api/transactions/<id>` | Delete | ADMIN |
| POST | `/api/notes/credit` | Credit note | ADMIN, ACCOUNTANT |
| POST | `/api/notes/debit` | Debit note | ADMIN, ACCOUNTANT |
| GET | `/api/health` | Liveness | Public |

Resources are **noun-based**; actions use **HTTP verbs**. Sensitive operations (delete, user admin) are **narrowly scoped** to ADMIN.

---

## 7. Setup (Minimal)

**Assessment (Django + SQLite):** follow `HOW_TO_START_NEBULAX.md` — `django_backend/` venv, `migrate`, `seed_admin`, `runserver` on port **8000**, Vite proxy to **8000**.

**Optional (Express + MongoDB):** install [MongoDB](https://www.mongodb.com/) or Atlas; `cd backend && npm install`; copy `backend/.env.example` to `backend/.env` (`MONGODB_URI`, `JWT_SECRET`, optional seed); `npm run dev` (default **5000**); align `frontend/vite.config.js` proxy to **5000** if using this stack only.

---

*End of academic documentation.*

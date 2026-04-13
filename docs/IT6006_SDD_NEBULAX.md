# IT6006 – System Design Document

**Unit:** IT6006  
**Project Title:** Secure Finance Management Web Application  

**Team Name:** NEBULAX  

**Team Leader:** Muhammad Moiz Farooq  

**Team Members:**  
Muskan Panwar  
Piyush Tatwani  
Simranjeet Singh Somal  

---

## 1. System overview

The system is a **secure enterprise web application**. The **client** is a **React (Vite)** single-page application. The **primary server** for assessment is **Django** exposing a **JSON REST API** with data persisted in **SQLite** via the **Django ORM**. Authentication uses **JWT**; passwords are stored using **bcrypt** hashes on the custom user model.

An **optional** **Node.js + Express + MongoDB** stack exists under `backend/` with parallel route shapes; **submission and demo** follow **Django** as described in `HOW_TO_START_NEBULAX.md`.

---

## 2. System architecture (Django assessment path)

The Django app follows a **layered** structure:

- **URLconf** (`finance_api/urls.py`): maps paths under `/api/...` to view functions.  
- **Views** (`core/views.py`): implement JSON request/response handling, **JWT** verification decorators, **role checks**, and business rules for users, transactions, and notes.  
- **JWT helpers** (`core/jwt_utils.py`): sign and verify tokens compatible with the React client (`sub`, `role`, `iat`, `exp`).  
- **Models** (`core/models.py`): **Django ORM** models for **User**, **Transaction**, and **Note**; migrations under `core/migrations/`.  
- **Middleware:** `SecurityMiddleware`, sessions (where used), **CORS** middleware for the Vite dev server.

The **client** handles **routing**, **protected routes** (JWT present), and **role routes** (UI hides disallowed navigation; server still enforces). This separation supports **maintainability** and **clear responsibility** per layer.

---

## 3. Authentication design

- Endpoints: **`POST /api/auth/signup`**, **`POST /api/auth/login`**.  
- Successful login returns a **JWT** and a **user profile** (including **role**).  
- The client stores the token and sends **`Authorization: Bearer <token>`** on subsequent requests.  
- The server verifies the JWT **signature** and **expiry** in view decorators and loads the current user where required.  
- Passwords are verified with **bcrypt** against stored hashes; hashes are not returned to clients.

---

## 4. Authorisation design

**Role-based access control (RBAC)** is applied after authentication.

| Role | Capabilities (summary) |
|------|-------------------------|
| **ADMIN** | User listing/creation; full transaction operations including **delete** where implemented; credit/debit notes. |
| **ACCOUNTANT** | Create/update transactions; credit/debit notes; no user-administration routes; delete only as allowed by API (typically admin-only). |
| **USER** | List **own** transactions; **create** rows attributed to self; **update** **own** rows; no delete; no notes; no user admin. |

Enforcement is **server-side** in view logic (JWT + role + ownership checks), not only in the UI.

---

## 5. URL design (Django implementation)

Paths match `django_backend/finance_api/urls.py`. Transaction detail uses a **numeric primary key** in the URL.

**Authentication**  
- `POST /api/auth/signup` — register (default **USER** where applicable).  
- `POST /api/auth/login` — obtain JWT.

**Users (administration)**  
- `GET /api/users` — list users (**ADMIN**).  
- `POST /api/users` — create user with role (**ADMIN**).

**Transactions**  
- `GET /api/transactions` — list (**USER**: own rows; staff: broader visibility per implementation).  
- `POST /api/transactions` — create (**ADMIN**, **ACCOUNTANT**, **USER**).  
- `PUT /api/transactions/<id>` — update (**ADMIN**, **ACCOUNTANT**; **USER** only for **own** transaction). Here `<id>` is the **integer primary key** of the transaction row.  
- `DELETE /api/transactions/<id>` — delete (**ADMIN** only).

**Notes**  
- `POST /api/notes/credit` — credit note (**ADMIN**, **ACCOUNTANT**).  
- `POST /api/notes/debit` — debit note (**ADMIN**, **ACCOUNTANT**).

**Health**  
- `GET /api/health` — liveness check.

**Front-end routes (SPA)** include **`/login`**, **`/`** (dashboard), **`/project`**, **`/transactions`**, **`/notes`** (staff), **`/users`** (admin), consistent with the functional areas above.

---

## 6. Data design (Django ORM / SQLite)

**User**  
- **Email** (unique), **password hash**, **role**, `is_active`, timestamps — `AUTH_USER_MODEL = core.User`.

**Transaction**  
- **Amount**, **type** (credit | debit), **description**, **date/time**, **foreign key** to user, timestamps.

**Note**  
- Credit/debit note records with **amount**, **description**, **references**, **note type**, user link, and timestamps as defined in the implementation.

---

## 7. Validation design

Validation is **server-side** in Django views:

- JSON bodies are parsed explicitly; malformed JSON yields **4xx** responses.  
- **Signup / login:** email shape, password minimum length, duplicate email handling.  
- **Transactions:** required fields, positive amounts, allowed **type** enumerations, date handling, and **ownership** checks when **USER** updates a row.  
- **Path parameters:** transaction **id** must exist and be accessible under RBAC rules.  
- Failures return **4xx** with structured JSON suitable for the client.

*(The optional Express stack uses **express-validator** and related middleware; behaviour is aligned at the API contract level.)*

---

## 8. Security considerations

- **JWT** verification on protected endpoints; rejection of expired or invalid tokens.  
- **bcrypt** for password storage.  
- **RBAC** and **ownership** checks in view code for **USER**-scoped updates.  
- **Input validation** on write operations.  
- **CORS** allow-list for development UIs in Django settings.  
- **Django** `SecurityMiddleware` for baseline HTTP hardening.  
- Secrets loaded from **environment variables** (shared `.env` pattern documented for local runs); **`.env`** not committed.  
- **Generic** login failure messages where implemented to limit **account enumeration**.

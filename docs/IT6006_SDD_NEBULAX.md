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

## 1. System Overview

The system is a **secure enterprise web application**. The **client** is a **React (Vite)** single-page application. The **server** is a **Node.js + Express** application exposing a **REST API** with data persisted in **MongoDB** using **Mongoose**. Authentication uses **JWT**; passwords are stored using **bcrypt** hashes.

---

## 2. System Architecture

The API follows a **layered** structure:

- **Routes:** Define HTTP paths and attach middleware (e.g. `authenticate`, `allowRoles`, validation chains).  
- **Controllers:** Implement use cases (e.g. list/create/update transactions).  
- **Middleware:** JWT verification, role checks, **express-validator**, error handling, **Helmet**, **rate limiting**, **mongo sanitization**, body size limits.  
- **Models:** **Mongoose** schemas for **User**, **Transaction**, and **Note** (and related fields as implemented).

The **client** handles **routing**, **protected routes** (JWT present), and **role routes** (redirect if role not allowed). This separation supports **maintainability** and **clear responsibility** per layer.

---

## 3. Authentication Design

- Endpoints: **`POST /api/auth/signup`**, **`POST /api/auth/login`**.  
- Successful login returns a **JWT** and a **user profile** (including **role**).  
- The client stores the token and sends **`Authorization: Bearer <token>`** on subsequent requests.  
- The server verifies the JWT **signature** and **expiry** and loads the current user where required.  
- Passwords are verified with **bcrypt.compare** against stored hashes; hashes are not returned to clients.

---

## 4. Authorisation Design

**Role-based access control (RBAC)** is applied after authentication.

| Role | Capabilities (summary) |
|------|-------------------------|
| **ADMIN** | User listing/creation; full transaction operations including **delete** where implemented; credit/debit notes. |
| **ACCOUNTANT** | Create/update transactions; credit/debit notes; no user-administration routes; delete only as allowed by API (typically admin-only). |
| **USER** | List **own** transactions; **create** rows attributed to self; **update** **own** rows; no delete; no notes; no user admin. |

Enforcement is **server-side** on each protected route (middleware and/or controller checks), not only in the UI.

---

## 5. URL Design

**Authentication**  
- `POST /api/auth/signup` — register (default **USER** where applicable).  
- `POST /api/auth/login` — obtain JWT.

**Users (administration)**  
- `GET /api/users` — list users (**ADMIN**).  
- `POST /api/users` — create user with role (**ADMIN**).

**Transactions**  
- `GET /api/transactions` — list (**USER**: own rows; staff: broader visibility per implementation).  
- `POST /api/transactions` — create (**ADMIN**, **ACCOUNTANT**, **USER**).  
- `PUT /api/transactions/:id` — update (**ADMIN**, **ACCOUNTANT**; **USER** only for **own** transaction).  
- `DELETE /api/transactions/:id` — delete (**ADMIN** only).

**Notes**  
- `POST /api/notes/credit` — credit note (**ADMIN**, **ACCOUNTANT**).  
- `POST /api/notes/debit` — debit note (**ADMIN**, **ACCOUNTANT**).

**Health**  
- `GET /api/health` — liveness check.

**Front-end routes (SPA)** include **`/login`**, **`/`** (dashboard), **`/project`**, **`/transactions`**, **`/notes`** (staff), **`/users`** (admin), consistent with the functional areas above.

---

## 6. Data Design

**User**  
- Identifiers, **email** (unique), **password hash**, **role**, timestamps as in schema.

**Transaction**  
- **Amount** (positive), **type** (credit | debit), **description**, **date/time**, reference to **creating user**, timestamps.

**Note**  
- Credit/debit note records with **amount**, **description**, **references**, and **timestamps** as defined in the implementation.

---

## 7. Validation Design

**express-validator** (and related checks) enforces, among others:

- Required fields for signup, login, and transaction operations.  
- Valid **email** format and **password** minimum length.  
- **Transaction amount** strictly greater than zero; **type** in allowed enumerations.  
- Valid **MongoDB identifier** format for path parameters where applicable.  
- Failures return **4xx** responses with structured error information suitable for the client.

---

## 8. Security Considerations

- **JWT** verification on protected endpoints; rejection of expired or invalid tokens.  
- **bcrypt** for password storage.  
- **RBAC** via middleware (e.g. `allowRoles`) and ownership checks where **USER** may only modify own resources.  
- **Input validation** and **NoSQL sanitization** to reduce injection-style attacks.  
- **Helmet** (or equivalent) for security-related HTTP headers on Express.  
- **Rate limiting**, especially on **auth** routes.  
- **JSON body size limits** to reduce abuse.  
- **Generic** login failure messages where implemented to limit **account enumeration**.  
- Secrets and connection strings loaded from **environment variables** (`.env` not committed); **`.env.example`** lists required variables only.

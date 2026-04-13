# IT6006 – Project Requirements Document

**Unit:** IT6006  
**Project Title:** Secure Finance Management Web Application  

**Team Name:** NEBULAX  

**Team Leader:** Muhammad Moiz Farooq  

**Team Members:**  
Muskan Panwar  
Piyush Tatwani  
Simranjeet Singh Somal  

---

## 1. Project Overview

This project designs and implements a **secure enterprise web application** for managing **financial transactions** (credit and debit ledger entries). The **assessment and demonstration** implementation consists of a **React (Vite)** single-page client and a **Django** service exposing the same **JSON REST** contract under `/api/...`, with data persisted in **SQLite** for local development and marking. Security is enforced using **JWT authentication**, **bcrypt** password hashing, **role-based access control (RBAC)**, **server-side validation** on each write operation, **CORS** restrictions for the dev UI, and secrets loaded from environment variables.

The repository also contains an **optional** **Node.js + Express + MongoDB** API under `backend/` that implements **equivalent route shapes** for team flexibility; **course submission and lecturer review** use the **Django + SQLite** path documented in `HOW_TO_START_NEBULAX.md`.

---

## 2. Problem Statement

Small and medium-sized organisations often depend on **manual processes** or **informal spreadsheets** to record money-in and money-out movements. That leads to **inconsistent records**, **weak access control**, and increased risk of **unauthorised access** or **tampering** with financial data. A dedicated, **authenticated**, **role-aware** system with validated inputs is required to support accountability and safer operations.

---

## 3. Solution Statement

The proposed solution is a **web-based finance management system**. Users interact through a **browser UI**; the **primary** server exposes a **JSON REST API** (Django) protected by **JWT**. **RBAC** defines what **Administrators**, **Accountants**, and **standard Users** may do. **Server-side validation** ensures only acceptable data is stored. For IT6006 submission, the implementation stack is **React (Vite)**, **Django**, and **SQLite**, aligned with the module’s enterprise web development scenario.

---

## 4. Business Requirements

- Provide a **controlled platform** for recording and reviewing **credit** and **debit** transactions.  
- Ensure **only authenticated, authorised** users can access or change sensitive data.  
- Maintain **accurate, validated** transaction records with clear **ownership** (creator reference).  
- Support **RBAC** with **Administrator**, **Accountant**, and **User** roles.  
- Improve **efficiency and traceability** compared to unstructured manual methods.  
- Demonstrate **security-conscious** development suitable for an organisational context (tokens, hashing, roles, validation, hardened HTTP behaviour on the API).

---

## 5. Functional Requirements

- The system shall allow users to **register** and **log in** securely.  
- The system shall authenticate API requests using **JWT** (`Authorization: Bearer <token>`).  
- The system shall support **three roles**: **ADMIN**, **ACCOUNTANT**, and **USER**, with different permissions.  
- The system shall allow **authorised** users to **create** ledger **transactions** (credit/debit) with validated amount, type, description, and date/time.  
- **USER** shall **list** transactions **scoped to their own account**, **create** new rows for themselves, and **update** their **own** rows; **USER** shall **not** delete transactions or use staff-only features (e.g. formal notes, user administration).  
- **ACCOUNTANT** and **ADMIN** shall **create** and **update** transactions according to API rules; **ADMIN** shall **delete** transactions where implemented.  
- **ADMIN** and **ACCOUNTANT** shall create **credit** and **debit notes** via dedicated endpoints.  
- **ADMIN** shall **list** and **create** user accounts and assign roles.  
- The web client shall provide **routing** to **login**, **dashboard**, **transactions**, **project hub**, and **role-gated** areas (**notes**, **user administration**) as implemented.  
- The API shall return **structured JSON** for success and failure with appropriate **HTTP status codes**.

---

## 6. Non-Functional Requirements

- **Security:** Passwords stored with **bcrypt**; JWT configuration; RBAC; server-side validation; **Django** `SecurityMiddleware`; **CORS** allow-list for the Vite dev origin; secrets via environment variables.  
- **Performance:** API responses suitable for interactive use (e.g. typical calls completing within **~2 seconds** under normal development conditions).  
- **Maintainability:** Layered Django structure (**URLconf** → view functions → ORM models → JWT helpers).  
- **Reliability:** Invalid input rejected consistently; health endpoint for basic monitoring.  
- **Operational hygiene:** Secrets supplied via **environment variables**; `.env.example` / documented variables without real secrets; SQLite database file for local runs (not committed with production data).

---

## 7. User Stories

- As a **user**, I want to **log in securely** so that my session and data access are protected.  
- As a **user**, I want to **add and review my own** transactions so I can track activity relevant to me.  
- As a **user**, I want to **update my own** transactions when allowed so my records stay accurate without unnecessary staff involvement.  
- As an **accountant**, I want to **create and update** transactions so operational records remain current.  
- As an **accountant**, I want to **issue credit and debit notes** so formal adjustments are recorded.  
- As an **administrator**, I want to **manage users and roles** so access matches policy.  
- As an **administrator**, I want to **remove** inappropriate ledger rows when required so data integrity is preserved.

---

## 8. Privacy and security policies

### 8.1 Scope and data we handle

NEBULAX processes **personal and financial data** needed to run the application:

- **Identity:** email address (login identifier), password **never** stored in plain text.  
- **Role:** ADMIN / ACCOUNTANT / USER — determines authorised actions.  
- **Financial records:** transaction and note content entered by users (amounts, descriptions, dates, references) and links to the creating user for accountability.

Data is processed **only** for the purposes of **authentication**, **authorisation**, **ledger operations**, and **audit-style traceability** described in the functional requirements.

### 8.2 Access control and roles

Access follows **least privilege**: standard users see and change only what their role allows; staff and admin features are **blocked server-side** if the JWT role does not permit the operation. The UI may hide controls, but **enforcement** is on the API.

### 8.3 Retention and storage

For the **submitted coursework** build, data is stored in a **local SQLite** file during development. The team treats this as **development data**, not a production retention policy. In a real deployment, retention periods, backups, and deletion procedures would be defined by the organisation; the design supports **identifiable rows** and **timestamps** for future policy.

### 8.4 Security measures (technical)

- Passwords are **never** stored in plain text; **bcrypt** hashing is used.  
- **JWT** is used for authenticated API access; token lifetime is **configurable**; tokens are **validated** on protected operations.  
- **RBAC** restricts features by role (e.g. user administration and notes limited to appropriate roles).  
- **Server-side validation** ensures amounts, types, emails, and other inputs meet rules before persistence.  
- **CORS** is restricted to known dev UI origins in settings.  
- Sensitive configuration (**JWT secret**, database path, Django secret) is kept in **environment variables**, not committed to source control.  
- API responses do not expose **password hashes**; error messages avoid unnecessary **internal detail** suitable for client exposure.

### 8.5 Optional stack (repository only)

The optional **Express + MongoDB** implementation follows the same **security intent** (JWT, bcrypt, RBAC, validation) but uses different middleware names; it is **not** the primary submission path unless explicitly agreed with the lecturer.

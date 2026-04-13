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

This project designs and implements a **secure enterprise web application** for managing **financial transactions** (credit and debit ledger entries). The solution consists of a **React (Vite)** single-page client and a **Node.js + Express** REST API backed by **MongoDB** (via **Mongoose**). Security is enforced using **JWT authentication**, **bcrypt** password hashing, **role-based access control (RBAC)**, **server-side validation** (e.g. **express-validator**), and supporting middleware (e.g. security headers, rate limiting, and NoSQL injection mitigations on the API).

---

## 2. Problem Statement

Small and medium-sized organisations often depend on **manual processes** or **informal spreadsheets** to record money-in and money-out movements. That leads to **inconsistent records**, **weak access control**, and increased risk of **unauthorised access** or **tampering** with financial data. A dedicated, **authenticated**, **role-aware** system with validated inputs is required to support accountability and safer operations.

---

## 3. Solution Statement

The proposed solution is a **web-based finance management system**. Users interact through a **browser UI**; the server exposes a **JSON REST API** protected by **JWT**. **RBAC** defines what **Administrators**, **Accountants**, and **standard Users** may do. **Server-side validation** ensures only acceptable data is stored. The implementation stack is **Node.js**, **Express**, and **MongoDB**, aligned with the module’s enterprise web development scenario.

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

- **Security:** Passwords stored with **bcrypt**; JWT configuration; RBAC; server-side validation; sanitisation and rate limiting where implemented; security-related HTTP headers (e.g. via Helmet on Express).  
- **Performance:** API responses suitable for interactive use (e.g. typical calls completing within **~2 seconds** under normal development conditions).  
- **Maintainability:** Layered API structure (routes → controllers → middleware → models).  
- **Reliability:** Invalid input rejected consistently; health endpoint for basic monitoring.  
- **Operational hygiene:** Secrets supplied via **environment variables**; `.env.example` documents required variables without real secrets.

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

## 8. Privacy and Security Policies

- Passwords are **never** stored in plain text; **bcrypt** hashing is used.  
- **JWT** is used for authenticated API access; token lifetime is **configurable**; tokens are **validated** on protected operations.  
- **RBAC** restricts features by role (e.g. user administration and notes limited to appropriate roles).  
- **Server-side validation** ensures amounts, types, emails, and other inputs meet rules before persistence.  
- **Sanitisation** and **rate limiting** (including on authentication routes) reduce common abuse patterns.  
- **Security-related HTTP headers** are applied on the Express API where configured.  
- Sensitive configuration (**JWT secret**, database connection strings) is kept in **environment variables**, not committed to source control.  
- API responses do not expose **password hashes**; error messages avoid unnecessary **internal detail** suitable for client exposure.

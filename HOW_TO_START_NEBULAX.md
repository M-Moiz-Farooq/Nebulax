# NEBULAX — IT6006 Secure Finance

Enterprise web app: **React (Vite)** frontend + **Django REST API** (SQLite for local dev). JWT auth, RBAC (ADMIN / ACCOUNTANT / USER).

**Assessment / marking:** use the **Django** backend below. The Node/Express + MongoDB folder is an optional parallel implementation only.

## Prerequisites

- **Python** 3.10+ (for Django)
- **Node.js** 18+ (for the Vite frontend)

## 1. API (Django — use this for assessment)

```bash
cd django_backend
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
.\.venv\Scripts\python manage.py migrate
.\.venv\Scripts\python manage.py seed_admin
.\.venv\Scripts\python manage.py runserver 8000
```

The API listens on **http://127.0.0.1:8000**. The Vite dev server is set to **proxy `/api` → port 8000** (see `frontend/vite.config.js`).

Adjust `seed_admin` / environment if your project documents custom admin credentials.

## 2. Frontend (Vite)

In a **second** terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** — requests to `/api` go to Django on **8000**.

## 3. First login

Sign in with the seeded admin account from `seed_admin`, or use **Sign up** (new users get the USER role), per your team’s `.env` / settings.

---

### Optional: Node.js + Express + MongoDB

If you use `backend/` (Express on **5000**) instead of Django, set `frontend/vite.config.js` proxy target to **`http://localhost:5000`**, then:

```bash
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env` (`MONGODB_URI`, `JWT_SECRET`, optional seed admin). Then `npm run dev`.

---

## Project layout

| Path | Role |
|------|------|
| `frontend/` | React UI |
| `django_backend/` | **Django API (assessment)** — SQLite locally |
| `backend/` | Optional Express + MongoDB API (same route shapes) |
| `docs/` | PRD, SDD, team contract (markdown) |

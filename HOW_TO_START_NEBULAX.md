# NEBULAX — IT6006 Secure Finance

Enterprise web app: **React (Vite)** frontend + **Node.js + Express + MongoDB** API. JWT auth, RBAC (ADMIN / ACCOUNTANT / USER).

## Prerequisites

- **Node.js** 18+
- **MongoDB** running locally (`mongodb://127.0.0.1:27017/...`) or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) URI

## 1. API (Express)

```bash
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env` and set at least:

- `MONGODB_URI` — your MongoDB connection string  
- `JWT_SECRET` — at least 32 characters  
- Optional: `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` for first admin user (see `package.json` scripts)

Start the server (default **http://localhost:5000**):

```bash
npm run dev
```

Or `npm start` without file watching.

## 2. Frontend (Vite)

In a **second** terminal:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** — the dev server **proxies** `/api` to the Express app on port **5000**.

## 3. First login

If you used seed admin values in `.env`, sign in with that email/password on the login page. Otherwise register via **Sign up** (new users get the USER role).

---

### Optional: Django + SQLite backend

If you run the alternative API under `django_backend/` on port **8000**, change `frontend/vite.config.js` proxy target from `5000` to `8000`, then:

```bash
cd django_backend
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
.\.venv\Scripts\python manage.py migrate
.\.venv\Scripts\python manage.py seed_admin
.\.venv\Scripts\python manage.py runserver 8000
```

---

## Project layout

| Path | Role |
|------|------|
| `frontend/` | React UI |
| `backend/` | Express REST API |
| `django_backend/` | Optional Django API (same route shapes) |
| `docs/` | PRD, SDD, team contract (markdown) |

IT6006 — Django + SQLite backend (replaces Node.js + MongoDB)
==============================================================

What this is
------------
Same REST API routes as the old Express app (/api/auth/*, /api/users, /api/transactions, …).
Data is stored in SQLite file: django_backend/db.sqlite3 (no MongoDB).

Config
------
Secrets are read from ../backend/.env (shared with the old Node project):
  JWT_SECRET   (min 32 chars — same as before)
  SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD  (for seed_admin command)

You do NOT need MONGODB_URI for Django.

First-time setup (Windows)
----------------------------
  cd django_backend
  python -m venv .venv
  .\.venv\Scripts\pip install -r requirements.txt
  .\.venv\Scripts\python manage.py migrate
  .\.venv\Scripts\python manage.py seed_admin

Run API
-------
  .\.venv\Scripts\python manage.py runserver 8000

Frontend (Vite) proxies /api to port 8000 — from the frontend folder:
  npm run dev
Open http://localhost:5173

Switching back to Node + Mongo
------------------------------
In frontend/vite.config.js change the proxy target from port 8000 to 5000 and run the Node backend instead.

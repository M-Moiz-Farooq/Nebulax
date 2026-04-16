# NEBULAX — IT6006 Secure Finance

Enterprise web app: **React (Vite)** frontend + **Django REST API** (SQLite for local dev). JWT auth, RBAC (ADMIN / ACCOUNTANT / USER).

**Assessment / marking:** use **only** the **Django** steps in §2 and §3. Do **not** run the optional Node (`backend/`) server for coursework unless your lecturer explicitly asks for it — it requires MongoDB Atlas and different setup.

---

## 1. Prerequisites

- **Python** 3.10+ (for Django)
- **Node.js** 18+ (for the Vite frontend)

---

## 2. Go to the repository root (required)

All paths below assume your shell’s **current directory** is the **NEBULAX repo root**: the folder that contains **`django_backend`**, **`frontend`**, and **`docs`** side by side.

- If you cloned or unzipped into nested folders, you may need an extra `cd`. For example, after opening `...\Downloads\IT6006`, run **`cd IT6006`** once so you see `django_backend` when you list files.
- **Check:** run `dir` (Windows) or `ls` (macOS/Linux). You should see `django_backend` and `frontend` in the listing. If `cd django_backend` fails, you are **not** in the repo root.

**Example absolute path (Windows):**

`C:\Users\<you>\Downloads\IT6006\IT6006`

(Your username and parent folder names may differ; the important part is the **inner** folder that contains both `django_backend` and `frontend`.)

---

## 3. API — Django (use this for assessment)

### Windows (PowerShell)

Run these **in order** from the **repository root**:

```powershell
cd django_backend
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
.\.venv\Scripts\python manage.py migrate
.\.venv\Scripts\python manage.py seed_admin
.\.venv\Scripts\python manage.py runserver 8000
```

Leave this window running. The API is at **http://127.0.0.1:8000**.

### macOS or Linux

From the **repository root**:

```bash
cd django_backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_admin
python manage.py runserver 8000
```

The Vite dev server proxies **`/api`** to **port 8000** (see `frontend/vite.config.js`). Keep Django on **8000** for assessment.

If your team documented custom admin credentials or env vars, follow those after copying any `.env.example` in `django_backend/`.

---

## 4. Frontend — Vite (second terminal)

Open a **new** terminal, **repository root** again, then:

### Windows (PowerShell)

```powershell
cd frontend
npm install
npm run dev
```

### macOS or Linux

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173**. Log in or sign up; API calls go to Django on **8000**.

---

## 5. First login

Use the account created by **`seed_admin`**, or **Sign up** (new users typically get the USER role), per your team’s environment and docs.

---

## 6. Optional — Node.js + Express + MongoDB (`backend/`)

**Not** required for IT6006 submission when using Django. Only use this if you are experimenting with the parallel Express stack.

- You need a working **MongoDB** connection (`MONGODB_URI` or Atlas user + password in `backend/.env`; copy from `backend/.env.example`).
- Default API port is **5000**. To use it with the same frontend, set `frontend/vite.config.js` proxy target for `/api` to **`http://localhost:5000`**, then:

```bash
cd backend
npm install
npm run dev
```

Do **not** confuse this folder with **`django_backend`** — they are different servers.

---

## 7. Project layout

| Path | Role |
|------|------|
| `frontend/` | React UI |
| `django_backend/` | **Django API (assessment)** — SQLite locally |
| `backend/` | Optional Express + MongoDB (same route shapes; needs DB config) |
| `docs/` | PRD, SDD, team contract (markdown) |

# PG Accommodation Platform — Local Setup Guide

This guide is written so you can run frontend and backend together with
zero guesswork. Follow it top to bottom, in order — most "it doesn't work"
moments come from skipping a step or running things out of order.

## 0. Prerequisites

- Node.js 18+ installed (`node -v` to check)
- A free Postgres database — [neon.tech](https://neon.tech) is the easiest:
  sign up, create a project, copy the connection string it gives you.
- VS Code (or any editor) with **two terminals open** — you'll run backend
  and frontend at the same time, in separate terminals.

## 1. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:
- `DATABASE_URL` — paste your Neon connection string here
- `JWT_SECRET` — any long random string (e.g. mash your keyboard for 40 characters)
- Leave `PORT=5000` and `CLIENT_URL=http://localhost:5173` as-is — these must
  match the frontend's port exactly, or the browser will block requests
  with a CORS error.

Push the schema to your database and seed demo data:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
```

Start the backend:

```bash
npm run dev
```

You should see `Server running on http://localhost:5000`. **Verify it
works** by opening `http://localhost:5000/api/health` in your browser —
you should see `{"status":"ok","message":"PG Platform API is running"}`.
If you don't see this, stop here and fix it before touching the frontend.

## 2. Frontend setup

Open a **second terminal** (keep the backend running in the first one):

```bash
cd frontend
npm install
cp .env.example .env
```

The default `.env` already points at `http://localhost:5000/api`, which
matches the backend you just started. No changes needed unless you changed
the backend's `PORT`.

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173`. You should see the landing page.

## 3. Confirm the connection actually works

Go to `/login` and sign in with a seeded demo account:

| Role   | Email                  | Password    |
|--------|-------------------------|-------------|
| Tenant | tenant@pgplatform.com   | password123 |
| Owner  | owner@pgplatform.com    | password123 |
| Admin  | admin@pgplatform.com    | password123 |

If login succeeds and redirects you, frontend and backend are talking
correctly. If it fails, see Troubleshooting below.

## How the connection works (so you're never confused by it)

- The frontend reads `VITE_API_URL` from `frontend/.env` and uses it as the
  base URL for **every** API call (see `frontend/src/services/api.js`).
  There is no hardcoded URL anywhere else in the frontend code.
- The backend only accepts cross-origin requests from whatever URL is set
  as `CLIENT_URL` in `backend/.env` (see the `cors()` line in `backend/src/app.js`).
- These two values must point at each other: backend's `CLIENT_URL` =
  the URL the frontend runs on; frontend's `VITE_API_URL` = the URL the
  backend runs on (+ `/api`).
- **Both servers must be running at the same time** in separate terminals.
  Closing one means the other can't reach it.

## Troubleshooting

**"Network Error" / requests fail with no response**
→ Backend isn't running, or is running on a different port than
`VITE_API_URL` expects. Check the backend terminal is still alive and
re-check `http://localhost:5000/api/health`.

**CORS error in browser console**
→ `CLIENT_URL` in `backend/.env` doesn't match the URL the frontend is
actually running on. Restart the backend after changing `.env` — it only
reads env vars on startup.

**"Invalid `prisma.user.findUnique()` invocation" / DB errors**
→ `DATABASE_URL` is wrong, or you skipped `npx prisma migrate dev`.
Re-check the connection string from Neon, and make sure it ends with
`?sslmode=require`.

**Changed `.env` but nothing changed**
→ Both Vite and Node only read `.env` on startup. Stop the dev server
(Ctrl+C) and run `npm run dev` again.

**Port 5173 or 5000 already in use**
→ Something else is using that port. Stop it, or change `PORT` in
backend `.env` (and update `VITE_API_URL` to match) / change the port in
`frontend/vite.config.js` (and update `CLIENT_URL` to match).

## Project structure

```
pg-platform/
├── backend/     → Express API, Prisma schema, runs on :5000
└── frontend/    → React app (Vite), runs on :5173
```

Run both with `npm run dev` from their respective folders, in separate
terminals, in that order (backend first, so the frontend always has
something to talk to).
# PG-Accommodation-Management-API

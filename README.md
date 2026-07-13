# TrackIt — Issue Tracker

A small but production-shaped issue tracker, built as a **testing playground**. The
application code is intentionally structured to expose clean, realistic testing
surfaces across every layer: unit, component, API, E2E, security, and accessibility.

> **Note:** This repo contains the *application under test*. The test suites are
> written separately (that's the exercise). Throughout the code you'll find
> comments marked `TESTING SEAM` that flag where and why a given piece is designed
> to be tested.

## Stack

**Backend** (`/server`)
- Node + Express + TypeScript
- SQLite (`better-sqlite3`) with parameterized queries
- JWT auth (`jsonwebtoken`) + bcrypt password hashing
- Zod for request validation

**Frontend** (`/client`)
- React + TypeScript + Vite
- React Router
- `data-test` attributes throughout for stable test selectors

## Getting started

```bash
# Backend
cd server
npm install
npm run seed     # creates trackit.db with known users + issues
npm run dev      # http://localhost:4000

# Frontend (separate terminal)
cd client
npm install
npm run dev      # http://localhost:5173 (proxies /api to :4000)
```

### Seeded credentials (dev only)

| Role   | Email                | Password     |
| ------ | -------------------- | ------------ |
| Admin  | admin@trackit.test   | Password123  |
| Member | member@trackit.test  | Password123  |

## API overview

| Method | Path                      | Auth      | Notes                                  |
| ------ | ------------------------- | --------- | -------------------------------------- |
| POST   | `/api/auth/register`      | –         | Create account, returns JWT            |
| POST   | `/api/auth/login`         | –         | Returns JWT                            |
| GET    | `/api/issues`             | Bearer    | Supports `?status=&priority=&assignee_id=` |
| GET    | `/api/issues/:id`         | Bearer    |                                        |
| POST   | `/api/issues`             | Bearer    | Validated by Zod                       |
| PATCH  | `/api/issues/:id`         | Bearer    | Enforces permissions + status workflow |
| DELETE | `/api/issues/:id`         | Bearer    | Reporter or admin only                 |
| GET    | `/api/users`             | Bearer    | For assignee selection                 |
| GET    | `/api/users/admin/stats` | Bearer+Admin | RBAC target                         |

## Where to point your tests

See [`docs/TESTING-GUIDE.md`](docs/TESTING-GUIDE.md) for a full breakdown of every
testing seam, organized by test type. High level:

- **Unit** — `server/src/logic/*` (status workflow, permissions, priority sort, auth
  utils) and `server/src/validation/schemas.ts`; client `components/*Badge.tsx`.
- **API** — all `/api/*` routes, especially validation errors, auth, and the status
  workflow (`422` on illegal transitions).
- **Security** — SQL injection against auth + filters (queries are parameterized),
  JWT tampering, missing/malformed tokens, RBAC on the admin endpoint, and
  ownership checks on edit/delete.
- **E2E** — login → create → filter → delete flow in the React UI.
- **Accessibility** — the three pages (`/login`, `/register`, `/issues`) use labels,
  landmarks, and `role="alert"` for errors; scan them with axe-core.

## CI

`.github/workflows/ci.yml` runs typecheck and build for both packages. Extend it
with your unit/API/E2E jobs as you build them out.

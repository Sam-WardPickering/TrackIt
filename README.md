# TrackIt — Issue Tracker

A full-stack issue tracker built as a **QA portfolio project**. The app is intentionally
structured to expose realistic testing surfaces across every layer of the test pyramid.
The test suites exercise unit, component, API, security, and CI — with E2E and
accessibility tests planned next.

    ┌─────────────────────────────────────┐
    │           E2E (planned)             │  ← Playwright browser tests
    ├─────────────────────────────────────┤
    │         API tests (23)              │  ← Playwright API testing
    ├─────────────────────────────────────┤
    │      Security tests (15)            │  ← SQL injection, JWT tampering
    ├─────────────────────────────────────┤
    │        Unit tests (94)              │  ← Vitest + React Testing Library
    └─────────────────────────────────────┘


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

**Infrastructure**
- Docker containers for the server and client (Alpine-based), run together with Docker Compose
- GitHub Actions CI — 4 parallel jobs

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

### Run with Docker

```bash
cd server
docker build -t trackit-server .
docker run -p 4000:4000 trackit-server
```

### Run with Docker Compose

```bash
docker compose up --build    # server on :4000, client on :5173
docker compose down          # stop and remove containers
```

### Seeded credentials (dev only)

| Role   | Email                | Password     |
| ------ | -------------------- | ------------ |
| Admin  | admin@trackit.test   | Password123  |
| Member | member@trackit.test  | Password123  |

## Running the tests

```bash
# Unit tests (Vitest)
npm run test:unit

# API tests (Playwright)
npm run test:api        # server must be running on :4000
```

## Test suite breakdown

### Unit tests — 94 tests (Vitest)

| File | Tests | What it covers |
| ---- | ----- | -------------- |
| `statusTransitions.test.ts` | 20 | FSM: valid/invalid transitions, same-status rejection, `getAllowedTransitions` |
| `permissions.test.ts` | 8 | `canEditIssue` / `canDeleteIssue` — admin, reporter, assignee, stranger |
| `prioritySort.test.ts` | 7 | Priority weight ordering, tie-break by `updated_at`, immutability |
| `auth.test.ts` | 8 | bcrypt hash/verify, JWT sign/verify, tampered token rejection |
| `schemas.test.ts` | 43 | Zod validation: register, login, createIssue, updateIssue — boundary values |
| `PriorityBadge.test.tsx` | 4 | Renders correct label per priority level |
| `StatusBadge.test.tsx` | 4 | Renders correct label per status |

Component tests use `happy-dom` via per-file directive. Unit tests run with Vitest + `@vitejs/plugin-react`.

### API tests — 23 tests (Playwright)

| File | Tests | What it covers |
| ---- | ----- | -------------- |
| `login.api.spec.ts` | 5 | Valid login, wrong email/password, missing fields, invalid format |
| `register.api.spec.ts` | 5 | Happy path (unique email via `Date.now()`), duplicate, validation |
| `issues.api.spec.ts` | 11 | CRUD, status filter, priority filter, legal/illegal transitions, no-auth 401 |
| `users.api.spec.ts` | 2 | Admin stats endpoint: admin 200, member 403 (RBAC) |

Also includes ownership enforcement: member cannot delete admin's issue (403), with verification the issue still exists after the failed delete.

Uses a shared auth fixture (`tests/fixtures/auth.fixture.ts`) that logs in as admin and provides the token.

### Security tests — 15 tests (Playwright)

| File | Tests | What it covers |
| ---- | ----- | -------------- |
| `sql-injection.api.spec.ts` | 12 | Login email (4 payloads), login password (4), issue status filter (4) |
| `jwt-tampering.api.spec.ts` | 3 | Tampered token, empty Bearer, missing Bearer prefix |

SQL injection payloads: `' OR '1'='1`, `'; DROP TABLE users; --`, `admin'--`, `' UNION SELECT * FROM users--`. All queries use parameterized statements, so these return auth errors — not data leaks.

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
| GET    | `/api/users`              | Bearer    | For assignee selection                 |
| GET    | `/api/users/admin/stats`  | Bearer+Admin | RBAC target                         |

## CI

GitHub Actions runs **4 parallel jobs** on every push and PR:

1. **Server** — typecheck + build
2. **Client** — typecheck + build
3. **Unit tests** — Vitest against server logic and React components
4. **API tests** — builds the Docker image, starts the container, runs Playwright API tests against it

## Testing guide

See [`docs/TESTING-GUIDE.md`](docs/TESTING-GUIDE.md) for a detailed breakdown of every
testing seam in the codebase, organized by test type.

## What's next

- E2E tests with Page Object Model (Playwright browser tests)
- Accessibility scans with axe-core
- ZAP baseline security scan in CI
- k6 performance smoke test
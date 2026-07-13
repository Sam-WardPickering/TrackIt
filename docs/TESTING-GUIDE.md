# TrackIt Testing Guide

This document maps the application's deliberate **testing seams** to the kind of
test that should cover them. It's both a spec for your suite and a record of the
design decisions that make each layer testable.

Every seam referenced here is also flagged inline in the source with a
`TESTING SEAM` comment.

---

## 1. Unit tests (Vitest)

Pure, deterministic logic with no I/O. Fast, exhaustive, table-driven where possible.

### `server/src/logic/statusTransitions.ts`
The issue status workflow. A finite state machine with documented legal moves.
- Cover every legal transition (should return `true`).
- Cover representative illegal transitions (e.g. `open → resolved`).
- Cover the same-status case (`open → open` is `false`).
- Cover reopen paths (`closed → open`).
- `getAllowedTransitions` returns the correct set per status.

### `server/src/logic/permissions.ts`
Authorization predicates.
- `canEditIssue`: admin (any), reporter, assignee → true; unrelated member → false.
- `canDeleteIssue`: admin and reporter → true; assignee and unrelated member → false.
- This is the pure counterpart to the API-level security tests in §4.

### `server/src/logic/prioritySort.ts`
- Orders critical → low.
- Tie-break: more recently `updated_at` first.
- Does **not** mutate its input (returns a new array).
- Output is a permutation of input (no items lost or duplicated).

### `server/src/logic/auth.ts`
- `hashPassword` never returns the plaintext; `verifyPassword` round-trips.
- `signToken`/`verifyToken` round-trip the payload.
- `verifyToken` throws on a tampered token.

### `server/src/validation/schemas.ts`
- Valid inputs parse successfully.
- Each constraint fails independently (bad email, short password, empty title…).
- Boundary values (min/max lengths).
- Defaults applied (`createIssueSchema` → `priority: 'medium'`, `description: ''`).
- `updateIssueSchema` rejects an empty object.

### Client: `client/src/components/PriorityBadge.tsx`, `StatusBadge.tsx`
React Testing Library.
- Renders the correct human label for each value.
- Applies the expected `data-test` attribute and class.

---

## 2. Component / integration tests (Vitest + React Testing Library)

- `LoginPage` / `RegisterPage`: submitting calls the auth hook; error text renders
  in the `role="alert"` element; the submit button disables while loading.
- `IssuesPage`: renders a list from a mocked `api`, applies the status filter,
  and calls `deleteIssue` when the row's delete button is clicked.
- Mock the `api` client module so these run without a backend.

---

## 3. API tests (Playwright `request`)

Run against the live Express server (seeded, or with an in-memory DB via
`DATABASE_PATH=':memory:'`).

- **Auth**: register (201 + token), duplicate email (409), login success/failure
  (401), validation errors (400 with structured `details`).
- **Issues CRUD**: create (201), list + filters, get (404 for missing), patch,
  delete (204).
- **Status workflow**: PATCH with an illegal transition returns **422**; a legal
  one succeeds. (Mirrors the unit tests in §1, but through the HTTP layer.)
- **Validation**: assert the consistent `{ error: 'Validation failed', details: [...] }`
  shape across endpoints.

---

## 4. Security tests

- **SQL injection**: fire payloads (`' OR '1'='1`, etc.) at the login `email`
  field and the issue list filters (`?status=`, `?assignee_id=`). Because all
  queries are parameterized, these must be treated as literal values — expect a
  clean 401 / empty result, never a 500 or leaked data.
- **JWT tampering**: take a valid token, mutate a character, and expect 401 on a
  protected route. Also test the `none`-algorithm / unsigned token case.
- **Missing / malformed auth header**: expect 401.
- **RBAC**: a member's token calling `GET /api/users/admin/stats` → 403; an admin
  token → 200.
- **Ownership enforcement**: user A creates an issue; user B (non-admin, non-assignee)
  attempts PATCH/DELETE → 403. Confirms the HTTP layer actually enforces
  `permissions.ts`.
- **Password storage**: after register, the stored `password_hash` is never the
  plaintext (verify via the login round-trip, or a direct DB read in a dedicated test).

---

## 5. E2E tests (Playwright, browser)

Seed the DB first for a deterministic baseline.
- Log in with seeded credentials → land on `/issues`.
- Create an issue via the form → it appears in the list.
- Apply the status filter → list narrows.
- Delete an issue → it disappears.
- Protected route: visiting `/issues` unauthenticated redirects to `/login`.

---

## 6. Accessibility tests (axe-core + Playwright)

Scan `/login`, `/register`, and `/issues`.
- Pages use a single `<main>` landmark and an `<h1>`.
- Every input has an associated `<label>`.
- Error messages use `role="alert"`.
- The delete buttons carry descriptive `aria-label`s.
- Follow the same critical/serious-only blocking policy used elsewhere in your
  portfolio, logging moderate/minor findings.

---

## 7. Performance (k6, optional)

The `GET /api/issues` and `POST /api/auth/login` endpoints are natural k6 targets
for a smoke + load test, mirroring your Toolshop k6 work.

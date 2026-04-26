# Phase 2: Desktop Local Mode MVP (Weeks 9-12)

This phase delivers Trackr’s **desktop application in local-only mode**: a single user can install the app, work on projects and tickets fully offline using embedded SQLite, and back up or restore data via import/export—without requiring a running server.

Connected desktop mode (same API as web) is **out of scope** for Phase 2; parity with server-backed workflows is planned for later (see roadmap Phase 4).

## Phase 2 Objectives

1. Ship a usable **Tauri** desktop shell that shares UI patterns with the web app (`packages/ui` / Svelte where applicable).
2. Implement **local-only mode** onboarding (no server URL required for the happy path).
3. Align **SQLite** persistence with the shared domain model (Prisma dual-target approach from Phase 0) and a reliable **migration runner** for local databases.
4. Support **core offline workflows**: projects, tickets, comments, and board consistent with Phase 1 semantics where they apply to a single-user local store.
5. Provide **import/export** (for example JSON) for backup and restore of local data.

## Prerequisites (from Phase 1)

- Core domain entities and behaviors are implemented and tested on the server (`Tenant`, `Organization`, `Project`, `Board`, `Ticket`, `TicketComment`, audit events as needed).
- Web MVP validates workflows that the desktop local mode should mirror for offline use.
- Shared types and API contracts exist in `packages/types` and `packages/api-client`; local mode may reuse domain types and validation (Zod) without calling HTTP for local-only flows.
- Prisma schema supports both PostgreSQL (server) and SQLite (desktop) per Phase 0 decisions.

## 1) Desktop Application Work

### 1.1 Shell and local mode onboarding

- Tauri app boots into **local mode** by default (or explicit “Start offline” path).
- Clear copy for: data location, that data is local to this machine, and how to back up.
- OS-appropriate storage path for the SQLite database (see [`docs/technical-requirements.md`](../technical-requirements.md) deployment notes).

Acceptance criteria:

- A user can launch the app and reach a working local workspace without configuring a server.

### 1.2 Shared UI integration

- Reuse shared layout/nav conventions from the web shell where practical (Lucide icons, left nav sections, top bar patterns).
- Routes or views for local projects, tickets, board, and settings sufficient for Phase 2 scope (placeholders acceptable only where explicitly deferred).

Acceptance criteria:

- Desktop UI feels consistent with web patterns documented in Phase 0/1.

## 2) Local Persistence (SQLite)

### 2.1 Schema and migrations

- Apply the shared Prisma schema to SQLite for local mode; run migrations on app startup or upgrade path as defined.
- Handle first-run initialization vs existing database file.

Acceptance criteria:

- Fresh install and upgrade from an older local DB version both work without manual SQL steps for normal users.

### 2.2 Local services / repositories

- Implement a local data access layer (repositories or services) that mirrors server domain rules where applicable:
  - project CRUD
  - ticket CRUD and status/column transitions
  - comments
  - board view by project
- Single-user assumptions: no multi-tenant auth in local-only mode (OS boundary per technical requirements).

Acceptance criteria:

- CRUD operations persist across app restarts.

## 3) Offline Workflows (Parity Target)

Match Phase 1 **behavioral** expectations where they make sense offline:

- Create and edit projects; associate tickets with projects; move tickets between projects (stable ticket `id`).
- Ticket list with basic filters; ticket detail; Kanban board by status.
- Comments on tickets when the local model includes them.

Explicit deferrals for Phase 2:

- Server-only features (OAuth sessions, org-wide permissions, access-request workflows involving other users) are not required in local-only mode; keep the model simple (single user / implicit admin).

Acceptance criteria:

- A user can complete a credible day-one flow: create project → create tickets → comment → move columns → restart app → data still there.

## 4) Backup: Import / Export

- Export local database content to a portable format (JSON is the documented MVP direction in [`docs/mvp-scope.md`](../mvp-scope.md)).
- Import restores or merges according to a defined, documented strategy (replace-all vs merge—pick one for Phase 2 and document it).

Acceptance criteria:

- User can export, wipe local data, import, and recover their work for smoke-tested scenarios.

## 5) Testing and Verification

### 5.1 Automated tests

- Unit tests for local domain/repository logic where non-trivial.
- Optional: lightweight integration tests against a temp SQLite file.

### 5.2 Desktop / E2E

- Add or extend automated checks appropriate for Tauri (project conventions may use WebDriver or Tauri’s test hooks—follow repo standards once chosen).

Acceptance criteria:

- CI can run the agreed desktop or local-layer test suite without manual steps.

## Phase 2 Exit Criteria (Definition of Done)

- Desktop app runs in **local-only mode** with SQLite persistence and migrations.
- **Projects, tickets, comments, and board** work offline end-to-end for a single user.
- **Import/export** backup path exists and is documented for operators.
- Quality gates remain green (lint/test/build per package; desktop build script succeeds).

---

## Next phase preview: Phase 3 (Deployment and Operational Readiness)

Phase 3 focuses on **shipping and operating** the server stack—not on new core product features. Per [`docs/roadmap.md`](../roadmap.md), key themes include:

1. **Container artifacts** — Official Docker image for `apps/server` and a `docker-compose` stack (PostgreSQL, optional reverse proxy example).
2. **Operator documentation** — Environment variables, `.env.example`, and setup paths for self-hosted server + web.
3. **Observability baseline** — Structured logging, `/health`, and basic metrics hooks (aligned with [`docs/technical-requirements.md`](../technical-requirements.md) §9).
4. **Stability pass** — Usability and reliability review ahead of broader release criteria.

Connected desktop mode, richer attachments/linking, and deeper web enhancements are tracked as **Phase 4+** items in the roadmap rather than Phase 3.

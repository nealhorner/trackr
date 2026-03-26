# Phase 0: Setup and Foundations (Weeks 1-2)

This document lists the concrete decisions and scaffolding work required before implementing core product features (Phase 1).

## Phase 0 Objectives

1. Make the project runnable locally with a predictable developer workflow.
2. Establish the technical contracts (auth/access, API shape, identity model, navigation shell) so downstream code doesn’t churn.
3. Ensure CI provides fast feedback (lint/test/build) per package/app.

## Phase 0 Implementation To-Do (Track Progress)

This checklist is for scaffolding-only Phase 0 work (i.e., get the repo/build/CI/app shells running) without implementing full product domain logic.

### Monorepo Scaffolding

- [x] Create monorepo workspace structure (`apps/server`, `apps/web`, `apps/desktop`, `packages/*`)
- [~] Configure `pnpm` workspace + `Turborepo` pipeline (build/test/lint/dev task graph)
- [x] Ensure each app has independent scripts (`dev`, `build`, `test`, `lint`) and can run without other apps
- [x] Scaffold shared packages as minimal compile targets (at least `packages/types` and `packages/api-client`)

### Quality Gates (CI)

- [x] Add `pre-commit` hooks for fast local quality checks (format + lint + lightweight typecheck)
- [x] Configure GitHub Actions workflows:
  - [x] `pull_request` runs lint + format ("Lent")
  - [x] `pull_request` runs tests/builds targeting `main`
- [x] Set up Vitest unit tests with coverage reporting (and ensure coverage artifacts are produced/available in CI)
- [x] Add Playwright E2E smoke test wiring so CI can run a minimal smoke suite for the UI shell

### API Contract and Server Skeleton

- [x] Scaffold `apps/server` using **Hono.js** with `/health`
- [x] Create `/api/v1` routing structure and placeholder endpoints (consistent “not implemented” responses)
- [ ] Add standardized error/response helpers used by all server routes

### Database and Migrations Skeleton

- [~] Add Prisma ORM + Prisma migrations setup with a shared Prisma schema targeting:
  - [x] PostgreSQL (server mode)
  - [ ] SQLite (desktop local mode)
- [ ] Implement a migration runner workflow for local dev and CI (shared approach documented)
- [ ] Ensure Prisma client generation works for both database targets

### Auth and Access Control Foundations (Scaffolding Stubs)

- [ ] Add provider-agnostic auth abstraction (`AuthProvider` adapter interface + core `AuthService` skeleton)
- [ ] Implement verified-email enforcement logic path (gate unverified identities in server-connected mode)
- [ ] Add authorization evaluation skeleton (additive-only) + canonical permission key list in application code
- [ ] Add limited-view DTO shaping/endpoint stubs to ensure restricted data won’t leak in later implementation

### UI Shell and Navigation Shell Spec

- [x] Scaffold `apps/web` (SvelteKit) with the shared UI shell:
  - [x] Top navbar (context title + tabs + upper-right global search placeholder)
  - [x] Left collapsible global nav with tenant name and section order
- [x] Add routes/pages for nav sections (Home, Your Work, Organizations, Projects, Analytics, Settings, Favorites) with placeholders
- [ ] Add minimal router/context scaffolding so the UI header and tabs can update by active context later

### Documentation and Contribution Basics

- [ ] Ensure Phase 0 docs capture the exact developer commands (lint/test/build, Prisma migrate, e2e smoke)
- [ ] Ensure docs link to all Phase 0 decisions (Hono, Vitest+coverage, Turborepo, Playwright, Prisma+Zod)

## 1) Monorepo Scaffolding

### 1.1 Workspace layout

- Adopt the monorepo structure:
  - `apps/server`
  - `apps/web` (SvelteKit)
  - `apps/desktop` (Tauri)
  - `packages/types` (shared contracts)
  - `packages/api-client` (typed client)
  - `packages/ui` (shared UI primitives, if practical)
  - `packages/config` (shared tooling config)

Acceptance criteria:

- Each app can be built and run independently from its own directory/package script.
- Shared packages compile without importing app runtime modules.

### 1.2 Tooling baseline

- Decide and document:
  - package manager (recommended: `pnpm`)
  - workspace runner (recommended: `Turborepo`)
  - lint/format setup (`eslint`, `prettier`)
  - TypeScript base configuration and path conventions
  - test runner (recommended: `Vitest`) with coverage reporting

Acceptance criteria:

- `lint`, `test`, and `build` can run from the repo root and/or per app.

## 2) Quality Gates (CI)

### 2.1 CI matrix

- CI should run:
  - lint for changed packages/apps
  - unit tests (using Vitest)
  - code coverage reporting from Vitest (for example, upload HTML or publish coverage artifacts)
  - build verification for each app

Acceptance criteria:

- CI can produce per-app logs (web vs server vs desktop) to keep debugging fast.

### 2.2 Pre-commit hooks

- Set up `pre-commit` hooks to run fast local quality checks before commits.
- Recommended hook set:
  - formatting check/fix (for example, `prettier`)
  - lint on changed files (for example, `eslint`)
  - TypeScript/type-check or lightweight compilation (as appropriate for speed)

Acceptance criteria:

- A new developer can run hooks locally and get the same outcome as CI.

### 2.3 GitHub Actions: lint/format and PR-to-main testing

- Add/standardize GitHub Actions workflows so that:
  - “lint format” steps (lint + formatting) run on `pull_request`
  - unit tests and builds run on `pull_request` targeting `main`
- Configure branch protection for `main`:
  - PR merges to `main` are blocked until required status checks pass
  - (optional) require “up to date” with the base branch

Acceptance criteria:

- Every PR into `main` is tested by CI, and no merge can bypass required checks.

### 2.4 Playwright for end-to-end testing

- Use Playwright as the end-to-end (E2E) test framework for web and app flows.
- Ensure the Phase 0 scaffold includes:
  - a minimal Playwright configuration and test runner conventions
  - E2E “smoke” tests that cover the critical happy path(s) early
  - CI wiring so E2E smoke tests can run on PRs targeting `main`

Acceptance criteria:

- A developer can run the Playwright smoke suite locally against a started web/server instance.

## 3) API Contract and Server Skeleton

### 3.1 REST API conventions

Define API conventions in a doc and then scaffold the server routing structure:

- Base path: `/api/v1`
- Resource naming patterns (`/projects`, `/tickets`, etc.)
- Standard response shape for success/error:
  - error codes
  - human-readable message
  - correlation/request id (optional)
- Pagination conventions on list endpoints

Acceptance criteria:

- API versioning is established in code and reflected in docs.

### 3.2 Typed contracts

- Decide how shared API types are produced:
  - recommended: generate or share TypeScript DTOs in `packages/types`
  - ensure `packages/api-client` uses those types

Acceptance criteria:

- web and desktop compile against the same request/response types as the server.

## 4) Database and Migrations Skeleton

### 4.1 Persistence choices

- Server mode storage: PostgreSQL
- Local-only desktop storage: SQLite

Decision in Phase 0:

- Use Prisma ORM + Prisma migrations for schema evolution in both:
  - PostgreSQL (server mode)
  - SQLite (desktop local mode)
- Configure a shared Prisma schema that can run against both databases, and ensure the migration workflow is documented for local dev and CI.

Acceptance criteria:

- Prisma migrations work consistently for both database targets in local dev and CI.

### 4.2 Initial schema targets

The schema must represent the core entity hierarchy and permission model:

- `tenant`, `organization`, `project`, `board`
- `user`, `project_member`
- `ticket`, `ticket_comment`, `ticket_link` (if included), `audit_event`
- `team` and team grants/assignments

Acceptance criteria:

- Referential integrity constraints exist for:
  - project belongs to organization
  - board is 1:1 with project
  - ticket belongs to project

## 5) Auth and Access Control Foundations

Phase 0 must lock in the rules so Phase 1 features don’t require rewrites.

### 5.1 Mode-based authentication

- Local-only desktop mode:
  - gated by OS authentication boundary (no server login required)
- Server-connected mode (web + desktop connected):
  - OAuth/SSO login
  - email/password login enabled for self-hosted environments when tenant admin allows it

### 5.2 Verified email policy

- Verified email is required for server-connected mode.
- For OAuth/SSO providers, rely on the provider’s `email_verified` signal.

### 5.3 Tenant admin configuration

- Tenant admin can disable email/password login.
- If disabled after users exist:
  - users must sign in with a different enabled method that returns the same verified email
  - identities must merge automatically (see next sections)

### 5.4 Identity linking + merge rules

- Accounts should be linked/merged automatically when the verified email matches.
- Account linking/merge must never occur across tenants.

Acceptance criteria:

- Auth service has a provider-agnostic abstraction (`AuthProvider` adapters + core `AuthService`).
- Merge/link behavior is deterministic and auditable.

### 5.5 Additive-only permissions + limited creator ticket views

- Effective permissions are additive-only (union of grants).
- If a user creates a ticket but lacks project content access:
  - they see limited fields (ticket id/title/description/state, and their own attachments)
  - discussion and other users’ attachments remain hidden unless explicitly granted
  - “Request full permissions” triggers a notification to project admins
  - authorized viewers see a warning indicator

### 5.5.1 Permission keys as free strings (Phase 0 decision)

- Store permission keys as free-form `TEXT` values in permission grant tables (no `permission_catalog` in Phase 0).
- Maintain the canonical allowed permission key list in application code.
- Validate permission keys on write (grant/assign operations).
- Treat unknown permission keys as “not granted” during permission evaluation.

Acceptance criteria:

- A single authorization evaluation path exists that enforces “limited view” consistently.

## 6) UI Shell and Navigation Shell Spec

Phase 0 includes establishing the “layout contract” for all pages so the apps feel consistent.

### 6.1 Top navbar

- Global search bar in the upper-right.
- Contextual title (section/org/project/ticket).
- Context-sensitive tabs to the right of the title.

### 6.2 Left global navigation

- Tenant name at top.
- Collapsible sections in order:
  1. Home
  2. Your Work
  3. Organizations (collapsible)
  4. Projects (collapsible)
  5. Analytics
  6. Settings
  7. Favorites

Acceptance criteria:

- All app routes use a single shared layout/shell component.

## 7) Documentation and Contribution Basics

Phase 0 should leave you with enough docs that a new contributor can run the project.

- `docs/` should cover:
  - monorepo structure
  - build/run commands per app
  - auth/access decisions (link to existing auth/access sections)
  - UI shell/navigation spec (link to existing nav requirements)

Acceptance criteria:

- A “new dev onboarding” path exists in docs that works end-to-end.

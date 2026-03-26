# Phase 0: Setup and Foundations (Weeks 1-2)

This document lists the concrete decisions and scaffolding work required before implementing core product features (Phase 1).

## Phase 0 Objectives

1. Make the project runnable locally with a predictable developer workflow.
2. Establish the technical contracts (auth/access, API shape, identity model, navigation shell) so downstream code doesn’t churn.
3. Ensure CI provides fast feedback (lint/test/build) per package/app.

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
  - workspace runner (recommended: `turbo` or equivalent)
  - lint/format setup (`eslint`, `prettier`)
  - TypeScript base configuration and path conventions

Acceptance criteria:
- `lint`, `test`, and `build` can run from the repo root and/or per app.

## 2) Quality Gates (CI)

### 2.1 CI matrix

- CI should run:
  - lint for changed packages/apps
  - unit tests
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

Decision needed in Phase 0:
- choose the migration approach/tooling that works for both DBs (or clearly separate them).

Acceptance criteria:
- A single “migration runner” concept exists for local dev and CI.

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


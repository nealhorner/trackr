# Phase 1: Core Backend + Web MVP (Weeks 3-8)

This phase delivers the first “end-to-end” Trackr experience in **server mode**:
users can authenticate, create projects, create tickets, comment, view a Kanban board, and navigate ticket details in the web UI.

## Phase 1 Objectives

1. Implement the server API backbone for core entities and workflows.
2. Ship a functional SvelteKit web experience for projects/tickets/comments/board.
3. Enforce authorization consistently (including limited-view and access-request flows for restricted resources).
4. Provide CI-friendly tests and seed data so PRs are verifiable.

## Prerequisites (from Phase 0)

- Monorepo scaffolding exists (`apps/server`, `apps/web`, `packages/types`, `packages/api-client`, etc.).
- API conventions and typed contracts are defined.
- Database schema/migrations approach is established.
- Auth/access foundations are defined (additive-only permissions, verified email policy, provider-agnostic auth abstraction).
- UI shell/navigation contract is established.

## 1) Backend (Server) Work

### 1.1 Auth & Identity

- OAuth/SSO login flows in server-connected mode (as defined in Phase 0).
- Email verification gating based on provider `email_verified`.
- Tenant-scoped account linking/merging (no cross-tenant merges).
- Sessions/tokens issuance and refresh handling.

Acceptance criteria:
- A user can sign in (web/desktop connected mode).
- Invalid/unverified identities are rejected.
- Linked identities resolve to a single canonical internal user per tenant.

### 1.2 Core Entities

Implement CRUD and relationships:

- `Tenant` (singleton behavior if still single-tenant in v1)
- `Organization`
- `Project` (belongs to one organization; each project has a 1:1 board)
- `Board`
- `Ticket` (belongs to one project; supports moving tickets between projects preserving ticket `id`)
- `TicketComment`

Acceptance criteria:
- Creating a project creates its board record.
- Tickets always reference a project.
- Ticket moves update `project_id` and record an audit event.

### 1.3 Authorization Enforcement (API-level)

Implement additive-only authorization evaluation and hierarchical visibility defaults:

- Users can view metadata only when they have metadata visibility grants.
- Users can create tickets when they have project metadata visibility (per project/organization defaults).
- If a user is limited-view only:
  - they must be able to see only the allowed subset of ticket fields and their own uploads
  - they must not see comments/discussion or other users’ attachments
- Deep-link access request workflow:
  - if a user lacks full permissions, the requester sees request-only UX (handled via API DTO/endpoint shape)
  - admins receive context-aware options (ticket-level and/or project-level access) or can deny

Acceptance criteria:
- All ticket/project read endpoints return permission-appropriate DTOs.
- Unauthorized “full content” data is never returned by the API.
- Access requests and admin decisions are auditable.

### 1.4 REST API Endpoints (v1)

Implement core routes (exact naming can follow your API conventions):

- Auth routes (login/logout/session exchange, linking endpoints as needed)
- Organizations:
  - list organizations (metadata)
- Projects:
  - list projects (metadata)
  - project detail (metadata)
  - project CRUD
- Tickets:
  - create ticket
  - ticket list (metadata + optional limited view)
  - ticket detail (limited vs full based on permissions)
  - update ticket (enforce edit permissions)
  - move ticket between projects (with audit event)
- Comments:
  - list/create comments for tickets (permission enforced)
- Board:
  - board view by project with status columns
  - board column transitions that enforce column/workflow responsibilities (as defined in Phase 0/column policy rules)

Acceptance criteria:
- REST endpoints exist for all Phase 1 UI flows.
- Pagination works for list endpoints.
- Error responses follow the standardized shape from Phase 0.

### 1.5 Seeds & Test Data

- Provide seed data scripts (or fixtures) for local development and CI.
- Ensure tests can run deterministically.

Acceptance criteria:
- CI test runs produce consistent results without requiring manual setup.

## 2) Frontend (Web) Work

### 2.1 Auth UI Integration

- Web sign-in UI supports the enabled providers and email verification requirements.
- Token/session handling and redirect behavior.

Acceptance criteria:
- Users can sign in and reach Home/Your Work.

### 2.2 Projects UI

- Project list and project detail pages (metadata-first where needed).
- Project creation UI (MVP-level).
- Project membership UI can be limited to MVP needs (if included, enforce admin permissions).

Acceptance criteria:
- Users can create projects they are authorized to manage.
- Users can view project metadata when granted metadata visibility.

### 2.3 Ticket UI

- Ticket creation from a project (per permissive create defaults).
- Ticket list with basic filters.
- Ticket detail page with:
  - limited-view rendering rules when needed
  - full-view rendering when authorized
- Ticket move between projects (UI should trigger move endpoint + reflect updates).
- Access request UI:
  - requester sees request-only screen
  - admins manage request approvals with ticket/project-level option set

Acceptance criteria:
- Users can create tickets even if they cannot read full project content.
- Limited-view ticket pages never show restricted fields or discussion.

### 2.4 Comments

- Ticket comments list and add-comment workflow (only when permitted).

Acceptance criteria:
- Unauthorized users cannot view or create comments.

### 2.5 Board UI (Kanban)

- Render board for a selected project grouped by status columns.
- Allow ticket transitions according to permissions (global project + optional column rules as defined).

Acceptance criteria:
- Board interactions work for authorized users.
- Drag/drop or transition actions are blocked/enforced for unauthorized users.

## 3) Data Fetching & State Management

- Use TanStack Query patterns consistently:
  - stable query keys
  - cache invalidation on mutations
- Ensure permission-based DTO changes are handled without stale data leaks.

Acceptance criteria:
- Switching permission tiers does not reveal stale restricted data in the UI.

## 4) Testing and Verification

### 4.1 Unit + integration

- Unit tests for domain logic and authorization decisions.
- Integration tests for API endpoints and permission-guarded endpoints.

### 4.2 End-to-end (Playwright) smoke coverage

- Add Playwright E2E smoke tests for the Phase 1 “happy path”:
  - sign in
  - create project
  - create ticket
  - view ticket detail
  - add comment (if included in the happy path)
  - view board

Acceptance criteria:
- E2E tests can run in CI with deterministic data.

## Phase 1 Exit Criteria (Definition of Done)

- A user can complete core flows in server mode via the web UI:
  - auth
  - create project
  - create ticket
  - view ticket detail
  - comment (when permitted)
  - view board
- Authorization works for full and limited-view:
  - limited-view never leaks restricted content
  - access request UX behaves as specified
- CI runs lint/tests/build and the Playwright smoke suite (or a minimal subset) successfully.


# Technical Requirements

## 1. System Architecture

Trackr has three deliverables:

1. **Server**
   - API layer
   - business logic
   - persistence
2. **Web UI**
   - browser client consuming server API
3. **Desktop App**
   - dual mode:
     - connected mode (uses server API)
     - local-only mode (uses embedded SQLite)

Repository architecture follows a monorepo pattern with independently buildable and releasable applications.

## 1.1 Monorepo Structure

Recommended top-level structure:

- `apps/server` - backend API service
- `apps/web` - SvelteKit web application
- `apps/desktop` - Tauri desktop application
- `packages/types` - shared TypeScript types/contracts
- `packages/api-client` - shared typed API client
- `packages/ui` - shared Svelte UI primitives/components
- `packages/config` - shared tooling configuration

Monorepo requirements:

- Each app must have its own build, test, and run scripts.
- Web and desktop builds must be runnable independently.
- Server, web, and desktop releases must be publishable independently.
- Shared packages must avoid app-specific runtime coupling.

## 2. Recommended High-Level Stack (Decision)

- **Backend**: TypeScript (Node.js) with **Hono.js**
- **Web UI**: SvelteKit + TypeScript
- **Frontend Data Fetching/Caching**: TanStack Query for Svelte
- **Desktop**: Tauri + shared Svelte UI package
- **Databases**:
  - Server mode: PostgreSQL
  - Local mode: SQLite
- **ORM/Data Layer**: Prisma ORM + Prisma migrations supporting PostgreSQL(server mode) + SQLite(desktop local mode)

### 2.1 Phase 0 technology references

Concrete tooling choices for scaffolding are documented in [`docs/phases/phase-0-foundations.md`](phases/phase-0-foundations.md). Quick links:

- [Hono](https://hono.dev/)
- [Vitest](https://vitest.dev/) (coverage via `@vitest/coverage-v8`)
- [Turborepo](https://turbo.build/repo/docs)
- [Playwright](https://playwright.dev/)
- [Prisma](https://www.prisma.io/docs)
- [Zod](https://zod.dev/)

## 3. Core Components

### 3.1 Server API

- REST API first (GraphQL optional later)
- Modules:
  - auth
  - users
  - projects
  - tickets
  - comments
  - attachments
  - search/filtering
- API versioning strategy from day one (`/api/v1`)

### 3.2 Web Application

- Auth flows (login/logout/session)
- Project switcher and navigation
- Ticket list + filters
- Ticket detail page + comments + history
- Board view
- Settings (project/user)
- Data loading/mutations via TanStack Query with consistent query keys and cache invalidation patterns

UI shell requirements:

- Top navbar:
  - left: context title (active section/organization/project/ticket)
  - center-right: context-sensitive tabs
  - upper-right: global search input
- Iconography:
  - all icons used in the web/desktop UI must come from `lucide` (Lucide icon set).
- Left global navigation:
  - collapsible pane with tenant name at top
  - ordered sections:
    1. Home
    2. Your Work
    3. Organizations (collapsible)
    4. Projects (collapsible)
    5. Analytics
    6. Settings
    7. Favorites

### 3.3 Desktop Application

- Mode selection on startup:
  - connect to server URL
  - local-only mode
- Local mode persistence:
  - SQLite database file
  - local migrations
- Connected mode:
  - same user workflows as web where feasible

## 4. Data Model (Core Entities)

- Hierarchy and tenancy model:
  - Single-tenant operation in current releases
  - Keep `tenant_id` on tenant-scoped entities for future multi-tenant expansion
  - One tenant -> many organizations
  - One organization -> many projects
  - One project -> one board
  - One project -> many tickets

- `User`
- `Tenant`
- `Organization`
- `Project`
- `ProjectMember`
- `Board`
- `Ticket`
- `TicketComment`
- `TicketLink`
- `Attachment`
- `SavedFilter`
- `AuditEvent`

Identity and mutability rules:

- All core entities use immutable numeric primary keys (`id`).
- Human-readable names/titles are mutable.
- Internal references and links must be based on immutable IDs, not mutable names.

Minimum `Ticket` fields:

- id, tenant_id, project_id
- title, description_markdown
- status, type, priority
- reporter_id, assignee_id
- labels (array/table)
- created_at, updated_at, due_date
- moved_at (nullable)

Project and board constraints:

- `projects.organization_id` required (project belongs to one organization)
- `boards.project_id` unique (enforces one board per project)

Ticket move behavior:

- Tickets may move between projects by updating `tickets.project_id`.
- `tickets.id` remains unchanged when moved.
- Ticket title/name remains unchanged unless explicitly edited.
- Move operations must create an audit event recording source project, destination project, actor, and timestamp.

## 5. API and Sync Behavior

- Server mode:
  - Stateless API with auth token/session.
  - Pagination on all list endpoints.
  - Filter query support for status/type/assignee/labels/date range.
- Desktop local mode:
  - Direct local data access via repository/service layer.
  - Same domain model as server to reduce divergence.

## 6. Security Requirements

- Password hashing with modern algorithm (Argon2 or bcrypt with strong params).
- Session/token expiration and refresh handling.
- Project-level access control enforced server-side.
- Input validation with Zod and output sanitization.
- Audit trail for critical actions (status changes, permission changes).

## 6.0 Authentication and Account Linking

- Mode-based authentication:
  - Local-only desktop mode is gated by the OS authentication boundary; no server identity is required.
  - Server-connected mode (web and desktop connected) uses OAuth/SSO for identity, and may use email/password for self-hosted environments when enabled by the tenant admin.
- Verified email gate (server-connected mode only):
  - Users must have a verified email address to access the application.
- OAuth/SSO verification:
  - The server must rely on the provider's verified email signal (for example, `email_verified`).
  - If the provider indicates the email is not verified, login and account linking must be blocked.
- Email/password enablement:
  - Tenant admins can disable email/password login.
  - If disabled after users exist, users must authenticate using another enabled method that returns the same verified email address.
- Automatic identity linking and merging:
  - When an OAuth/SSO login returns a verified email that matches an existing account identity within the same tenant, the system must automatically link identities and merge accounts as needed.
  - **Account merging/linking must never occur across tenants** (tenant mismatch blocks merge/link).
- Provider-agnostic internal abstraction:
  - Implement an `AuthProvider` adapter per IdP that normalizes identity claims into a common internal identity shape (provider, subject id, normalized email, verified flag).
  - Implement a provider-independent `AuthService` that enforces verified-email policy and performs tenant-scoped linking/merge rules.
- Auditability:
  - Linking and merging must create audit events recording which providers were involved and which internal user identities were linked/merged.

## 6.1 Authorization Model

- Authorization is additive-only:
  - No subtractive deny rules in permission evaluation.
  - Effective permission set is the union of direct user grants, team grants, and inherited grants.
- Permission keys are stored as free-form strings in the database (no `permission_catalog` validation table yet).
- Permission writes (for example, “grant permission” actions in admin UI/API) must validate permission keys against an application-side canonical list.
- Permission evaluation must be defensive: unknown permission keys are treated as “not granted”.
- Hierarchical visibility defaults:
  - Tenant-level membership can grant organization metadata visibility without organization content access.
  - Organization-level membership can grant project metadata visibility without project content access.
- Project permission layers:
  - Global project permissions apply across the project.
  - Optional board-column permissions can further define responsibilities (for example, workflow-step actions such as triage or QA).

## 6.2 Ticket Creation and Limited Creator Access

- Default ticket intake behavior:
  - Users with project metadata visibility may create tickets by default.
  - Organization members are granted ticket-create capability in organization projects by default, unless project owners restrict it.
- Creator-limited ticket view:
  - If ticket creator lacks project-content access, they still see:
    - ticket ID
    - title
    - description
    - state/status
    - attachments uploaded by that creator
  - They do not see:
    - comments/discussion
    - attachments uploaded by other users
    - other non-permitted details
- Access request flow:
  - Limited-view ticket includes a `Request full permissions` action.
  - Action creates a request notification for project admins.
  - Admin decisions:
    - grant ticket-only access
    - grant project-level access
    - deny request
  - Decision outcomes must be auditable.
- Viewer warning indicator:
  - Tickets must show a warning label to authorized viewers when the ticket creator currently has limited access.

## 6.3 Deep-Link Access Request UX

Deep linking must enforce authorization at the UI boundary to avoid accidental data exposure.

- Requester experience (user is deep-linked but lacks full permissions):
  - Show an access-request screen only (no restricted content).
  - Provide a single primary action to request access (for example, `Request access`).
- Admin experience (admin receives the request):
  - The request payload must include the requested scope/context.
  - Admin UI must present grant options based on context:
    - Ticket requests: allow approval of ticket-level access and/or project-level access, or deny.
    - Project requests: allow approval of project-level access, or deny.
- Auditing:
  - Admin grant/deny decisions must be recorded as auditable events.

## 7. Deployment Requirements

### 7.1 Docker

- Provide official Docker image for server.
- Provide `docker-compose.yml` including:
  - trackr-server
  - postgres
  - optional reverse proxy example
- Environment variables documented in `.env.example`.

### 7.2 Desktop Distribution

- Build installers for macOS, Windows, Linux.
- Store local data in OS-appropriate app data directory.
- Provide backup/export and restore/import workflow.

### 7.3 Independent Build and Release

- `apps/web` must produce deployable web artifacts without requiring a desktop build.
- `apps/desktop` must produce desktop installers without requiring a web deployment build.
- `apps/server` must produce Docker image artifacts independently of web/desktop releases.
- CI/CD must support app-level pipelines and selective builds in monorepo workflows.

## 8. Quality Requirements

- Unit tests for domain logic.
- Integration tests for API endpoints.
- End-to-end smoke tests for critical flows using Playwright.
- Playwright E2E tests must run against the built/started app in CI (and locally) with deterministic test data/setup.
- Migration tests for schema evolution.
- CI pipeline:
  - lint
  - test
  - build

## 9. Observability (Server Mode)

- Structured logging
- Health endpoint (`/health`)
- Basic metrics hooks (request latency, error rates)
- Optional OpenTelemetry support post-MVP

## 10. Compatibility and Performance Targets

- Support latest two major versions of modern browsers.
- API p95 response time under 300ms for common list/detail queries in moderate datasets.
- Initial startup under 3 seconds for desktop local mode on common developer hardware.

## 11. Implementation Principles

- Keep domain logic framework-agnostic where possible.
- Prefer shared types/contracts across server/web/desktop.
- Design for incremental feature flags and modular rollout.
- Avoid hard coupling to cloud-only services.

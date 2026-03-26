# MVP Scope

## 1. MVP Objective

Deliver a usable, self-hosted Jira alternative with essential project and ticket management, plus a desktop-only local mode with SQLite.

## 2. In-Scope Features

### 2.0 Repository and Delivery Model

- Monorepo structure with separate `apps/server`, `apps/web`, and `apps/desktop`.
- Shared packages for common types and client logic.
- Independent build commands for server, web, and desktop artifacts.

### 2.1 Server + Web

- User authentication (email/username + password)
- Project CRUD
- Project membership and roles
- Additive-only permission model (no subtractive deny rules)
- Ticket CRUD with core fields
- Permissive ticket creation defaults for organization users
- Limited creator ticket view when creator lacks project-content access
- "Request full permissions" flow to project admins
- Ticket comments
- Ticket list with basic filters
- Basic Kanban board by status
- Top navbar with contextual title, context-sensitive tabs, and global search on the upper-right
- Collapsible left global navigation pane with tenant name and ordered sections (Home, Your Work, Organizations, Projects, Analytics, Settings, Favorites)
- Docker deployment path

### 2.2 Desktop

- Desktop app shell with shared UI
- Local-only mode backed by SQLite
- Project and ticket CRUD in local mode
- Local comments and board view
- JSON import/export backup for local mode
- Optional connected mode support (nice-to-have in MVP, required in v1)

## 3. Out of Scope for MVP

- Advanced workflow customization
- Time tracking and estimation analytics
- Automation rules engine
- SSO/OAuth providers
- External integrations (Slack, GitHub, etc.)
- Fine-grained enterprise permission policies
- Native mobile applications

## 4. MVP Acceptance Criteria

- A team can self-host server mode with Docker and create/manage projects and tickets.
- A single user can run desktop local mode without server and retain data across restarts.
- Core ticket lifecycle works: create -> assign -> comment -> move status -> close.
- Basic search/filter flow is functional for day-to-day project usage.

## 5. Suggested MVP Milestones

1. Foundation: repo, CI, shared types, design system starter
2. Backend core: auth, projects, tickets, comments, migrations
3. Web core: auth UI, project pages, tickets list/detail/board
4. Desktop local: app shell, SQLite schema, local repositories
5. Deployment hardening: Docker docs, backup/restore, smoke tests

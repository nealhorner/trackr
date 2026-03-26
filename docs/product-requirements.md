# Product Requirements Document (PRD)

## 1. Product Overview

Trackr is an open source, free-to-use, self-hosted project and ticket management platform designed as an alternative to Jira.

It supports two primary usage models:

- **Server mode**: Organizations self-host Trackr Server and use web and desktop clients.
- **Desktop local mode**: Individual users run desktop only with local SQLite persistence.

## 2. Goals

- Provide a practical Jira alternative with core project and issue tracking features.
- Offer simple self-hosting through Docker.
- Support offline-first personal usage through desktop + SQLite.
- Maintain open source transparency and community contribution friendliness.

## 3. Target Users

- **Small engineering teams** needing self-hosted issue tracking.
- **Startups** wanting a low-cost project tool.
- **Solo developers** needing local-only ticket management.
- **Privacy-sensitive organizations** that prefer on-prem control.

## 4. Core User Stories

### 4.1 Project Management

- As a user, I can create and manage projects.
- As a project admin, I can invite users and assign roles.
- As a user, I can define project workflows and statuses.

### 4.2 Ticket Management

- As a user, I can create, edit, assign, and close tickets.
- As a user, I can set ticket type, priority, labels, and due date.
- As a user, I can comment on tickets and view activity history.
- As a user, I can search and filter tickets by multiple fields.

### 4.3 Views and Planning

- As a user, I can view ticket lists with saved filters.
- As a user, I can use a Kanban-style board grouped by status.
- As a user, I can plan work in milestones/sprints.

### 4.4 Deployment and Data

- As an admin, I can run server mode through Docker quickly.
- As a desktop user, I can store all data locally in SQLite.
- As a desktop user, I can choose whether to connect to server or stay local-only.

## 5. Functional Requirements

### 5.1 Accounts and Authentication

- FR-1: Server mode must support user accounts and login.
- FR-2: Role-based permissions at project level (admin/member/viewer).
- FR-3: Desktop local mode may support single local identity without server auth.
- FR-3a: Access control is additive-only; effective permissions are the union of direct grants, team grants, and inherited scope grants.
- FR-3b: In server-connected mode (web and desktop connected), a user must have a **verified email** to access the application.
- FR-3c: For OAuth/SSO providers in server-connected mode, the server must rely on the provider's `email_verified` flag; linking and access are blocked when `email_verified` is false.
- FR-3d: For self-hosted server environments, the server must support email/password login.
- FR-3e: Tenant admins may disable email/password login. If disabled after users exist, users must authenticate using another enabled method that returns the **same verified email address** as their existing account.
- FR-3f: When a user authenticates via OAuth/SSO and the returned **verified email** matches an existing account identity within the same tenant, the system must automatically link identities and **merge accounts** as needed.
- FR-3g: Account merging/linking must never occur across tenants (even if verified emails match).
- FR-3h: Authentication must use a provider-agnostic internal abstraction so that account linking/merge logic is not coupled to any one auth provider.
- FR-3i: Account linking/merging based on verified email must never occur across tenants.

### 5.2 Projects

- FR-4: Create, read, update, archive projects.
- FR-5: Configure project key, name, description, and default workflow.
- FR-6: Assign project members and roles.
- FR-6a: Each project belongs to exactly one organization.
- FR-6b: Each project has exactly one board (1:1 project-board relationship).

### 5.3 Tickets

- FR-7: CRUD for tickets.
- FR-8: Ticket fields: title, description (markdown), status, type, priority, assignee, reporter, labels, due date.
- FR-9: Link tickets (blocks, relates to, duplicates).
- FR-10: Comments and activity timeline.
- FR-11: Attachments (server mode first; local mode optional in MVP).
- FR-11a: Tickets must always belong to a project.
- FR-11b: Tickets can be moved between projects while preserving immutable identity and stable references.
- FR-11c: Users with project metadata visibility can create tickets by default, even when project content visibility is restricted.
- FR-11d: By default, organization users can create tickets in projects within their organization unless project settings are explicitly made more restrictive.
- FR-11e: Ticket creators without project-content permissions must still see a limited ticket view containing ticket ID, title, description, status/state, and attachments they uploaded.
- FR-11f: Ticket creators without project-content permissions must not see discussion/comments, attachments uploaded by others, or other non-permitted ticket details.
- FR-11g: Limited-view tickets must include a "Request full permissions" action that notifies project admins.
- FR-11h: Project admins can approve ticket-only access, approve project-level access, or deny the access request.
- FR-11i: Tickets where creators have limited access must display a warning indicator to authorized viewers.
- FR-11j: When a user is deep-linked to a resource but lacks full permissions, the UI must show only an access-request screen (no restricted content).
- FR-11k: The access-request workflow must encode the requested scope/context so the admin UI can present the correct grant options.
- FR-11l: Admins receiving an access request must see grant options appropriate to the request context:
  - for ticket requests: options to approve ticket-level access and/or project-level access, or deny
  - for project requests: options to approve project-level access or deny

### 5.4 Boards and Lists

- FR-12: Kanban board by status columns.
- FR-13: Sort/filter/search ticket list.
- FR-14: Saved views (per user).
- FR-14a: Project permissions can be configured globally and optionally refined at board-column level.

### 5.5 Desktop Local Mode

- FR-15: Run without server and persist in SQLite database file.
- FR-16: Import/export local data (JSON backup) for portability.
- FR-17: Seamless startup in local mode with minimal setup.

### 5.6 Integrations (Post-MVP)

- FR-18: Optional webhook events for ticket updates.
- FR-19: Optional Git provider linking (GitHub/GitLab) later.

### 5.7 Navigation and UI Layout

- FR-20: The top navigation bar must include a global search bar in the upper-right area.
- FR-21: The top navigation title must reflect current active context (section, organization, project, or ticket).
- FR-22: Contextual tabs must appear to the right of the title and change based on active context.
- FR-23: The left side of the application must include a collapsible global navigation pane.
- FR-24: The global navigation pane must display tenant name at the top.
- FR-25: Global navigation sections must appear in this order:
  1. Home
  2. Your Work
  3. Organizations (collapsible)
  4. Projects (collapsible)
  5. Analytics
  6. Settings
  7. Favorites

## 6. Non-Functional Requirements

- NFR-1: Open source license approved by OSI.
- NFR-2: Server deployable via Docker and docker-compose.
- NFR-3: Data reliability with migrations and backup strategy.
- NFR-4: Responsive UI for common desktop/laptop screens.
- NFR-5: Reasonable performance for small-to-medium teams (for example, 100k tickets per instance target over time).
- NFR-6: Monorepo development model with shared packages for server/web/desktop consistency.
- NFR-7: Web and desktop applications must be independently buildable, distributable, and installable.
- NFR-8: Keep `tenant_id` on tenant-scoped entities for future multi-tenant support, while operating as single-tenant in current product versions.
- NFR-9: Core entities must use immutable numeric IDs; display names/titles remain mutable.

## 7. Success Metrics

- Time to first self-hosted deployment under 15 minutes.
- Time to first local desktop project under 5 minutes.
- Weekly active usage per deployed instance.
- Ticket creation-to-completion throughput trends.

## 8. Constraints and Assumptions

- Initial scope prioritizes essential Jira-like workflows over advanced enterprise capabilities.
- Real-time collaboration can start with polling or basic refresh in MVP.
- Mobile apps are out of initial scope.

## 9. Open Questions

- Should desktop and web share one UI codebase (for example, web tech + wrapper)?
- Should local-mode file format support encrypted-at-rest by default?
- Which auth providers should be prioritized beyond local username/password?

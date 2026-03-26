# Trackr

Trackr is an open source, self-hosted alternative to Jira for ticket and project management.

This repository contains product and technical planning documents for a platform with:

- A backend server (multi-user, self-hosted)
- A web UI (browser client for server mode)
- A desktop application (can connect to server or run fully offline with local SQLite)

## Technology Direction

- Language: TypeScript
- Web framework: SvelteKit
- Frontend server-state management: TanStack Query

## Repository Architecture

- Monorepo with independently releasable applications:
  - `apps/server`
  - `apps/web`
  - `apps/desktop`
- Shared packages for common types, API client logic, and reusable UI.

## Documentation

- [`docs/product-requirements.md`](docs/product-requirements.md)
- [`docs/technical-requirements.md`](docs/technical-requirements.md)
- [`docs/mvp-scope.md`](docs/mvp-scope.md)
- [`docs/roadmap.md`](docs/roadmap.md)
- [`docs/non-goals.md`](docs/non-goals.md)

## Core Deployment Modes

1. **Self-hosted server mode**
   - Run Trackr Server via Docker
   - Access with web UI and/or desktop app
   - Shared multi-user projects and tickets

2. **Desktop-only local mode**
   - Run only the desktop app
   - Persist all data in local SQLite
   - Single-user, offline-capable workflow

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
- Phase 0 scaffolding checklist and stack links: [`docs/phases/phase-0-foundations.md`](docs/phases/phase-0-foundations.md)

## Core Deployment Modes

1. **Self-hosted server mode**
   - Run Trackr Server via Docker
   - Access with web UI and/or desktop app
   - Shared multi-user projects and tickets

2. **Desktop-only local mode**
   - Run only the desktop app
   - Persist all data in local SQLite
   - Single-user, offline-capable workflow

## Local development

This monorepo uses **npm workspaces** and **Turborepo**. Install and run commands from the **repository root** unless noted.

### Prerequisites

- **Node.js** 22 or newer (LTS recommended)
- **npm** (the repo pins a version via `packageManager` in `package.json`; use `corepack enable` if you rely on Corepack)

### First-time setup

From the repo root:

```bash
npm install
```

To match CI exactly after cloning (requires a lockfile):

```bash
npm ci
```

### Build and run the API server (`apps/server`)

The server runs compiled JavaScript from `dist/`. Build once, then start:

```bash
npm run build -w @trackr/server
npm run dev -w @trackr/server
```

By default it listens on **port 3000**. Override with `PORT`:

```bash
PORT=4000 npm run dev -w @trackr/server
```

Useful URLs while it is running:

- `http://localhost:3000/health` — JSON health check
- `http://localhost:3000/` — temporary HTML UI-shell placeholder (Phase 0 scaffolding)

### Run all workspace tasks from the root

| Command         | What it does                                                         |
| --------------- | -------------------------------------------------------------------- |
| `npm run build` | `turbo build` — builds every package/app that defines a build script |
| `npm run test`  | `turbo test` — runs tests (Vitest) in packages that have tests       |
| `npm run lint`  | `turbo lint` — lint tasks per package (some are still placeholders)  |
| `npm run dev`   | `turbo dev` — runs each app’s `dev` script in parallel               |

### Database and Prisma (`packages/prisma`)

Prisma 7 uses separate schema files for **PostgreSQL** (server) and **SQLite** (desktop/local). Generated clients live under `packages/prisma/generated/` (gitignored; CI runs generate).

From the repo root after `npm install`:

| Command                                    | What it does                                                                                              |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| `npm run build -w @trackr/prisma`          | `prisma generate` for **both** Postgres and SQLite clients                                                |
| `npm run migrate:dev -w @trackr/prisma`    | Create/apply Postgres migrations in dev (`DATABASE_URL` must point at Postgres; uses `prisma.config.ts`)  |
| `npm run migrate:deploy -w @trackr/prisma` | Apply Postgres migrations (CI/production-style)                                                           |
| `npm run db:push:sqlite -w @trackr/prisma` | SQLite `db push` for local desktop iteration (uses `file:./.local/trackr.sqlite` under `packages/prisma`) |

Full workflow notes: [`docs/phases/phase-0-foundations.md`](docs/phases/phase-0-foundations.md) (database section and stack decision links).

### Web app (`apps/web`) and desktop (`apps/desktop`)

**Web:** SvelteKit is wired in `apps/web`. Dev and production build:

```bash
npm run dev -w @trackr/web
npm run build -w @trackr/web
```

The shared layout uses route-derived **title** and **tabs** (see `apps/web/src/lib/shell.ts` and `+layout.svelte`).

**Desktop:** Phase 0 may still use placeholder scripts for Tauri; follow `apps/desktop` when desktop packaging is enabled.

### End-to-end tests (Playwright)

Server E2E tests live under `apps/server/e2e/`. Install browser binaries once (Playwright downloads them on first use):

```bash
npx playwright install chromium
```

Then run E2E from the repo root or only for the server:

```bash
npm run e2e
# or
npm run e2e -w @trackr/server
```

When you run E2E from `apps/server`, Playwright starts the server via `webServer` using `npm run dev`, which runs **compiled** output (`node dist/index.js`). **Build the server first** if `apps/server/dist` is missing:

```bash
npm run build -w @trackr/server
npm run e2e -w @trackr/server
```

### Formatting

```bash
npm run format        # write fixes
npm run check-format  # check only (also used by the pre-commit hook)
```

### Notes

- **PostgreSQL / Prisma**: the HTTP server runs without a database for basic `/health` and stub APIs; for DB-backed work, set `DATABASE_URL` and run `npm run build -w @trackr/prisma` plus migrations as in the Prisma table above.
- **pnpm**: documentation elsewhere may mention `pnpm`; this repo is currently set up with **npm workspaces**. If you switch to pnpm, add `pnpm-workspace.yaml` and align tooling accordingly.

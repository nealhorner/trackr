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

If you want to contribute code or documentation, see the [contribution guide](CONTRIBUTING.md) for setup, quality checks, and how CI validates pull requests.

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

### Server env quick reference (self-hosted)

- **`POSTGRES_DATABASE_URL`** — Postgres connection string for `apps/server` and Prisma Postgres migrations (see [Database and Prisma](#database-and-prisma-packagesprisma) below).
- **`BETTER_AUTH_SECRET`** — at least 32 characters in production; used by Better Auth for session signing.
- **`BETTER_AUTH_URL`** — public base URL of the API (e.g. `https://trackr.example.com`) so auth cookies and OAuth redirects match your deployment.
- **`BETTER_AUTH_TRUSTED_ORIGINS`** — comma-separated web origins allowed to use cookies (e.g. your Svelte dev server and Tauri: `http://localhost:5173,https://tauri.localhost`).
- **`TRACKR_CONFIG_PATH`** — optional path to a JSON file that pre-fills first-time setup (tenant name, auth toggles). Does not replace secrets in production.
- **`TRACKR_SETUP_SECRET`** — if set, `POST /api/v1/setup/complete` requires header `X-Trackr-Setup-Token` with the same value.
- **OAuth (optional):** `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`, `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`, `APPLE_CLIENT_ID` / `APPLE_CLIENT_SECRET`, `OKTA_CLIENT_ID` / `OKTA_CLIENT_SECRET` / `OKTA_ISSUER`.

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
- `http://localhost:3000/` — legacy HTML shell smoke page; primary UI is SvelteKit (`apps/web`)

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

| Command                                    | What it does                                                                                                                                                                      |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run build -w @trackr/prisma`          | `prisma generate` for **both** Postgres and SQLite clients                                                                                                                        |
| `npm run migrate:dev -w @trackr/prisma`    | Create/apply Postgres migrations in dev (`POSTGRES_DATABASE_URL` must point at Postgres; uses `prisma.config.ts`)                                                                 |
| `npm run migrate:deploy -w @trackr/prisma` | Apply Postgres migrations (CI/production-style)                                                                                                                                   |
| `npm run db:push:sqlite -w @trackr/prisma` | SQLite `db push` for local desktop iteration (uses `file:./.local/trackr.sqlite` under `packages/prisma`)                                                                         |
| `npm run seed -w @trackr/prisma`           | Seed dev tenant, org, project, board columns, and users (`admin@example.com`, `dev@example.com`) — requires Postgres reachable via `POSTGRES_DATABASE_URL` and migrations applied |

Full workflow notes: [`docs/phases/phase-0-foundations.md`](docs/phases/phase-0-foundations.md) (database section and stack decision links).

**Phase 1 server + web:** the API persists to **PostgreSQL** via Prisma 7’s **driver adapter** (`@prisma/adapter-pg` + `pg` in `apps/server`). Set `POSTGRES_DATABASE_URL` if your Postgres is not the default in `prisma.config.ts`. After migrations, run **`npm run seed -w @trackr/prisma`** once. Start the API on port **3000**, then the web app (Vite dev server proxies **`/api`** to the API so session cookies stay same-site):

```bash
npm run build -w @trackr/server && npm run dev -w @trackr/server
# other terminal:
npm run dev -w @trackr/web
```

Open **`http://localhost:5173/login`** and sign in with **`admin@example.com`** (dev login is allowed when `NODE_ENV` is not `production` or `ALLOW_DEV_AUTH=true`). Integration tests against a real DB: `RUN_INTEGRATION=true npm run test -w @trackr/server`.

### Web app (`apps/web`) and desktop (`apps/desktop`)

**Web:** SvelteKit is wired in `apps/web`. Dev and production build:

```bash
npm run dev -w @trackr/web
npm run build -w @trackr/web
```

The shared layout uses route-derived **title** and **tabs** (see `apps/web/src/lib/shell.ts` and `+layout.svelte`). Authenticated routes redirect to `/login` when there is no session.

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

When you run E2E from `apps/server`, Playwright starts **API + web** via the root script **`npm run dev:e2e`** (API first, then Vite on port 5173). **Build the server first** if `apps/server/dist` is missing:

```bash
npm run build -w @trackr/server
POSTGRES_DATABASE_URL="postgresql://USER:PASSWORD@127.0.0.1:5432/trackr" npm run e2e -w @trackr/server
```

**Onboarding E2E** (`apps/server/e2e/onboarding.spec.ts`) runs a **full setup → login → welcome** flow against the Svelte app. A **global setup** step runs `prisma migrate reset --force --skip-seed` so the instance starts unconfigured — use a dev database you can wipe. Ensure ports **3000** and **5173** are free. To attach to dev servers you already started instead: `REUSE_E2E_SERVERS=1 npm run e2e -w @trackr/server`.

The legacy **HTML shell smoke** test (`ui-shell-smoke.spec.ts`) still hits **port 3000** only.

### Formatting

```bash
npm run format        # write fixes
npm run check-format  # check only (also used by the pre-commit hook)
```

### GitHub Actions CI

CI uses an ephemeral Postgres container. Add a **repository secret** so credentials are not stored in the workflow file:

1. In the GitHub repo: **Settings → Secrets and variables → Actions → New repository secret**.
2. Name: **`CI_POSTGRES_PASSWORD`**
3. Value: any strong random string used **only for CI** (the workflow builds  
   `POSTGRES_DATABASE_URL=postgresql://postgres:<secret>@localhost:5432/trackr_test` and sets the same value on the Postgres service).

Use a password that does **not** contain URL-reserved characters (`@`, `:`, `/`, `#`, `?`) unless you adjust the workflow to percent-encode them. Pull requests from **forks** do not receive repo secrets by default; this workflow falls back to a local CI-only password so the Postgres service still starts on fork PR runs.

### Notes

- **PostgreSQL / Prisma**: Phase 1 APIs require Postgres; run **`npm run migrate:deploy -w @trackr/prisma`** (or `migrate:dev` in development) and **`npm run seed -w @trackr/prisma`** before exercising auth and projects/tickets. Generate clients with `npm run build -w @trackr/prisma`.
- **pnpm**: documentation elsewhere may mention `pnpm`; this repo is currently set up with **npm workspaces**. If you switch to pnpm, add `pnpm-workspace.yaml` and align tooling accordingly.

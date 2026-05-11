# Contributing to Trackr

Thanks for your interest in Trackr. This guide covers how to work in the monorepo, what we expect before you open a pull request, and how CI validates changes.

For environment variables, database setup, and day-to-day dev commands, start with the [README](README.md) — especially **Local development**, **Database and Prisma**, and **End-to-end tests**.

## Prerequisites

- **Node.js** 22 or newer (LTS recommended)
- **npm** — the repo pins a version in the root `package.json` (`packageManager`); use [Corepack](https://nodejs.org/api/corepack.html) if you want npm to match automatically
- **PostgreSQL** — required for server development, integration tests, and most E2E flows
- **Desktop / Tauri** — Rust stable toolchain and platform libraries when you work on `apps/desktop` (see CI’s `desktop-build` job for Linux packages)

## Getting started

From the repository root:

```bash
npm install
```

Match CI more closely (clean install from the lockfile):

```bash
npm ci
```

Generate Prisma clients before running server or tests that touch the database:

```bash
npm run build -w @trackr/prisma
```

Apply migrations and seed a dev database when you need auth and sample data (see README for `POSTGRES_DATABASE_URL`):

```bash
npm run migrate:dev -w @trackr/prisma   # or migrate:deploy in CI-like environments
npm run seed -w @trackr/prisma
```

Use workspace-scoped scripts when you only need one app, for example:

```bash
npm run dev -w @trackr/server
npm run dev -w @trackr/web
```

## Quality checks (run locally)

Run these from the **repo root** before opening a PR:

| Command                | Purpose                                                |
| ---------------------- | ------------------------------------------------------ |
| `npm run format`       | Apply Prettier                                         |
| `npm run check-format` | Verify formatting (also enforced via Husky pre-commit) |
| `npm run lint`         | Turborepo lint across packages                         |
| `npm run test`         | Unit / Vitest tasks                                    |
| `npm run build`        | Production builds (see CI note for desktop on Linux)   |

**Integration tests** for the server need a real Postgres database and:

```bash
RUN_INTEGRATION=true npm run test -w @trackr/server
```

**E2E (Playwright):** install Chromium once (`npx playwright install chromium`), build the server if `dist/` is missing, then use the README’s E2E section. Onboarding E2E resets the database — use a disposable dev DB. Root shortcuts: `npm run e2e`, `npm run dev:e2e`, `npm run dev:e2e-desktop`.

## Pull requests

- **Target branch:** `main`
- **Describe the change** in the PR: what problem it solves and any trade-offs
- **Keep scope focused** — unrelated refactors make review harder
- **Update tests** when behavior changes; add coverage when it prevents regressions

CI (`.github/workflows/ci.yml`) runs on pushes and PRs to `main`: `npm ci`, Prisma generate, migrate + seed, lint, tests with `RUN_INTEGRATION=true`, Turbo build (desktop excluded on the generic Linux job), then E2E (desktop excluded on that job). A separate job builds the desktop app with Rust and Tauri dependencies.

Maintainers: configure the **`CI_POSTGRES_PASSWORD`** repository secret as described in the README so the Postgres service uses a strong password. Fork PRs use a documented fallback in the workflow.

## Issues and discussion

- **Bugs and features:** [GitHub Issues](https://github.com/nealhorner/trackr/issues)
- **Repository:** [github.com/nealhorner/trackr](https://github.com/nealhorner/trackr)

## License

Trackr is distributed under the terms in [LICENSE](LICENSE). Read that file before redistributing or relying on permission to modify the software; contribution and use may be limited by those terms.

# Phase 3: Deployment and Operational Readiness (Weeks 13-14)

This phase makes Trackr **deployable, observable, and documented** for operators and end users. The goal is not new core product features, but **release-quality packaging**: container images, compose stacks, environment configuration, baseline server observability, and a focused **stability and usability pass** across server, web, and desktop local mode.

Connected desktop mode and major product enhancements remain **out of scope** for Phase 3 (see roadmap Phase 4).

## Phase 3 Objectives

1. Publish an **official server Docker image** and a **docker-compose** reference stack (PostgreSQL; optional reverse-proxy example).
2. Document **environment variables** and first-run setup (`.env.example`, operator-focused docs).
3. Provide **operator-facing documentation** for self-hosted server + web deployment and for desktop users (install, data location, backup pointers).
4. Establish **baseline server observability**: structured logging, `/health`, and hooks for basic metrics (latency, error rates) per [`docs/technical-requirements.md`](../technical-requirements.md) §9.
5. Run a **usability and stability pass** on critical paths and fix issues that block credible self-hosting or daily use.

## Prerequisites (from Phases 1–2)

- **Phase 1**: Server API and web MVP are feature-complete for core workflows; migrations and seeds support repeatable environments.
- **Phase 2**: Desktop local mode exists with SQLite, import/export backup, and offline workflows (documentation can reference desktop install and backup without re-implementing features).
- CI already runs lint, test, and build across the monorepo; Phase 3 extends packaging and ops docs without relaxing quality gates.

## 1) Container Artifacts and Compose

### 1.1 Docker image (`apps/server`)

- Dockerfile builds a minimal, reproducible server image from the monorepo (document build context and tags).
- Image runs migrations or documents the expected startup order (migrate then serve).
- Published artifact strategy: registry target and versioning convention (for example semver or `main` SHA tags—document the choice).

Acceptance criteria:

- An operator can pull/build the image and run it with documented env vars and a Postgres URL.

### 1.2 `docker-compose` reference

- `docker-compose.yml` (or equivalent) includes:
  - Trackr server
  - PostgreSQL
  - Optional reverse-proxy example (commented or secondary file is acceptable if documented)
- Volumes/networks named clearly; secrets via env files, not baked into images.

Acceptance criteria:

- `docker compose up` (or documented equivalent) yields a working stack for evaluation and small-team use.

### 1.3 Environment configuration

- Root or server-scoped **`.env.example`** listing required and optional variables with short descriptions.
- Document database URL, session/auth-related secrets, CORS or public URL settings if applicable, and log level.

Acceptance criteria:

- A new operator can configure the stack without reading application source code.

## 2) Documentation (Operators and Users)

### 2.1 Server + web self-hosting

- Prerequisites (Docker, optional reverse proxy, TLS considerations at a high level).
- Steps: clone or use published image, configure env, run migrations, start services, first admin/bootstrap if applicable.
- Upgrade notes: how to pull a new image and apply migrations safely.

Acceptance criteria:

- Docs in `docs/` (or README pointers) give an end-to-end “bring up Trackr” path.

### 2.2 Desktop users

- Where installers or build artifacts live (or will live) and how to run local mode.
- Data directory location and backup/export references (aligned with Phase 2).

Acceptance criteria:

- Desktop users have a short, accurate path to install and protect their data.

### 2.3 Contribution and community onboarding (lightweight)

- Ensure Phase 0/1 dev workflows remain linked; add or refresh “how to report issues” / contribution expectations if the repo exposes them.

Acceptance criteria:

- Release criteria in [`docs/roadmap.md`](../roadmap.md) (“community onboarding docs”) have a concrete home.

## 3) Observability (Server Mode)

### 3.1 Structured logging

- Consistent log format (level, timestamp, message; request/correlation id where available).
- Document how operators should tail logs in Docker.

Acceptance criteria:

- Support incidents can be triaged from logs without custom tooling.

### 3.2 Health and readiness

- **`/health`** (or documented liveness) returns a clear status for orchestrators.
- Optional: readiness distinction if the app distinguishes “up” vs “ready to serve traffic” (document either way).

Acceptance criteria:

- Load balancers and compose healthchecks can use the endpoint.

### 3.3 Baseline metrics hooks

- Hooks or middleware for request latency and error rate counts (export format can be minimal in Phase 3; OpenTelemetry remains optional post-MVP per technical requirements).

Acceptance criteria:

- Metrics story is “good enough” for Phase 3; full APM is not required.

## 4) Usability and Stability Pass

- Exercise critical flows on a compose-deployed stack: auth (as applicable), project/ticket/board, and representative admin paths.
- File and fix **release-blocking** defects (crashes, data loss risk, broken deploy path).
- Optional: short checklist or smoke script for operators post-deploy.

Acceptance criteria:

- Stakeholders agree the product is shippable for self-hosted early adopters at the agreed scope.

## 5) CI/CD and Release Mechanics (Incremental)

- Ensure pipelines can **build and optionally publish** the server image without requiring unrelated app builds (align with [`docs/technical-requirements.md`](../technical-requirements.md) §7.3).
- Document tagging and “what runs on PR vs main” if not already centralized.

Acceptance criteria:

- Release process is repeatable; no single-machine-only deploy knowledge.

## Phase 3 Exit Criteria (Definition of Done)

- Official **Docker** path exists with **compose** reference and **`.env.example`**.
- **Operator and user docs** cover server/web setup and desktop backup/install at a minimum.
- Server exposes **structured logging**, **`/health`**, and **baseline metrics hooks** as defined above.
- **Stability pass** completed; critical issues for self-hosting are resolved or explicitly deferred with rationale.
- **Independent build/release** story for server vs web vs desktop remains intact in CI/docs.

---

## Next phase preview: Phase 4 (v1 Enhancements)

Phase 4 returns focus to **product depth** and polish. Per [`docs/roadmap.md`](../roadmap.md), typical themes include:

1. **Connected desktop mode** — parity with web against the server API.
2. **Board UX** — richer interactions, saved views.
3. **Attachments and ticket linking** — fuller ticket model and workflows.
4. **Performance and data lifecycle** — tuning, retention/archival considerations as needed.
5. **Extensibility** — initial plugin or integration hooks.

Treat Phase 4 as the umbrella for post-MVP enhancements; individual items may ship incrementally behind priorities.

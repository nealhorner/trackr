# Product and Engineering Roadmap

## Phase 0: Setup and Foundations (Weeks 1-2)

- Define all “foundation” decisions and document the implementation plan.
- Create monorepo layout and establish the baseline developer workflow.
- Set up quality gates (lint/test/build) and CI so feature work is safe.
- Establish the initial architecture scaffolding for API, DB, auth/access, and UI shell.

Deliverables/checklist for Phase 0 are in: [`docs/phases/phase-0-foundations.md`](phases/phase-0-foundations.md).

## Phase 1: Core Backend + Web MVP (Weeks 3-8)

- Implement auth and project/ticket domain models
- Build REST API endpoints for core workflows
- Create web UI for projects, tickets, comments, board
- Add migrations, seed data, and API integration tests

## Phase 2: Desktop Local Mode MVP (Weeks 9-12)

- Implement desktop shell and local mode onboarding
- Implement SQLite schema and migration runner
- Support project/ticket/comment workflows fully offline
- Implement local import/export backup

## Phase 3: Deployment and Operational Readiness (Weeks 13-14)

- Publish Docker image and docker-compose setup
- Write setup docs for server and desktop users
- Add health checks, logs, and baseline metrics
- Conduct usability and stability pass

## Phase 4: v1 Enhancements (Post-MVP)

- Connected desktop mode parity with web
- Better board interactions and saved views
- Attachments and richer ticket linking
- Performance tuning and data lifecycle tooling
- Initial plugin/integration hooks

## Release Criteria for v1

- Stable server deployments and upgrade path
- Robust desktop local mode with data safety
- Core workflows validated by real teams
- Community onboarding docs and contribution process

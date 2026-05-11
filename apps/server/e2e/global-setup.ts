import { execSync } from "node:child_process";
import path from "node:path";

/**
 * Fresh Postgres schema for onboarding tests (no tenant / setupComplete).
 * Uses the same `POSTGRES_DATABASE_URL` as `packages/prisma/prisma.config.ts`.
 */
export default async function globalSetup(): Promise<void> {
  const dbUrl =
    process.env.POSTGRES_DATABASE_URL ?? process.env.DATABASE_URL ?? "";
  if (!dbUrl) {
    console.warn(
      "[playwright global-setup] POSTGRES_DATABASE_URL not set — skipping prisma migrate reset. Onboarding e2e needs an empty DB.",
    );
    return;
  }

  /** Playwright runs from `apps/server`; monorepo root is two levels up. */
  const repoRoot = path.resolve(process.cwd(), "..", "..");
  const prismaDir = path.join(repoRoot, "packages", "prisma");

  execSync(
    "npx prisma migrate reset --force --skip-seed --config prisma.config.ts",
    {
      cwd: prismaDir,
      stdio: "inherit",
      env: {
        ...process.env,
        POSTGRES_DATABASE_URL: dbUrl,
      },
    },
  );
}

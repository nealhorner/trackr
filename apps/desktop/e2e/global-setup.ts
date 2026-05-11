import { execSync } from "node:child_process";
import path from "node:path";

/**
 * Same Postgres reset as `apps/server/e2e` so desktop remote tests see a fresh instance.
 * When running `turbo e2e`, use root `npm run e2e` (concurrency=1) so this does not race
 * another package's migrate reset.
 */
export default async function globalSetup(): Promise<void> {
  const dbUrl =
    process.env.POSTGRES_DATABASE_URL ?? process.env.DATABASE_URL ?? "";
  if (!dbUrl) {
    console.warn(
      "[desktop playwright global-setup] POSTGRES_DATABASE_URL not set — skipping prisma migrate reset.",
    );
    return;
  }

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

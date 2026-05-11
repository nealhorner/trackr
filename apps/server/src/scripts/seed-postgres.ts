/**
 * Postgres seed for CI and local dev. If the instance is not configured, creates
 * the first tenant and admin (same as first-time /api/v1/setup/complete) using
 * `SEED_*` env or sensible defaults.
 */
import { runFirstTimeSetup } from "../lib/initial-setup";
import { prisma } from "../lib/db";

async function main() {
  const hasSetup = await prisma.tenant.findFirst({
    where: { NOT: { setupCompleteAt: null } },
  });
  if (hasSetup) {
    // eslint-disable-next-line no-console
    console.log("Seed: instance already has setup; skipping first-time setup.");
    return;
  }

  const tenantName = process.env.SEED_TENANT_NAME ?? "Default";
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "TrackrDev!local1";

  await runFirstTimeSetup({
    tenantName,
    adminEmail,
    adminPassword,
    adminDisplayName: "Admin",
    authSettings: {
      password: true,
      google: false,
      apple: false,
      github: false,
      okta: false,
    },
  });

  // optional second app user without auth (for future tests)
  const tenant = await prisma.tenant.findFirstOrThrow({
    where: { name: tenantName },
  });
  const existingDev = await prisma.appUser.findFirst({
    where: { tenantId: tenant.id, email: "dev@example.com" },
  });
  if (!existingDev) {
    await prisma.appUser.create({
      data: {
        tenantId: tenant.id,
        email: "dev@example.com",
        emailVerifiedAt: new Date(),
        isTenantAdmin: false,
      },
    });
  }

  // eslint-disable-next-line no-console
  console.log(
    `Seed OK: tenant=${tenantName}, admin=${adminEmail} (set SEED_* to override)`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    void prisma.$disconnect();
    process.exit(1);
  });

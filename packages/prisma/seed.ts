import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client-postgres/index.js";

const connectionString =
  process.env.POSTGRES_DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/trackr";

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const DEFAULT_TENANT = "Default";
const ORG_NAME = "Acme";
const PROJECT_NAME = "Main";

async function main() {
  let tenant = await prisma.tenant.findFirst({
    where: { name: DEFAULT_TENANT },
  });
  if (!tenant) {
    tenant = await prisma.tenant.create({ data: { name: DEFAULT_TENANT } });
  }

  const ensureAppUser = async (email: string, opts?: { isTenantAdmin?: boolean }) => {
    const existing = await prisma.appUser.findFirst({
      where: { tenantId: tenant!.id, email },
    });
    if (existing) return existing;
    return prisma.appUser.create({
      data: {
        tenantId: tenant!.id,
        email,
        emailVerifiedAt: new Date(),
        isTenantAdmin: opts?.isTenantAdmin ?? false,
      },
    });
  };

  const user1 = await ensureAppUser("admin@example.com", { isTenantAdmin: true });
  await ensureAppUser("dev@example.com");

  let org = await prisma.organization.findFirst({
    where: { tenantId: tenant.id, name: ORG_NAME },
  });
  if (!org) {
    org = await prisma.organization.create({
      data: { tenantId: tenant.id, name: ORG_NAME },
    });
  }

  let project = await prisma.project.findFirst({
    where: { organizationId: org.id, name: PROJECT_NAME },
  });
  if (!project) {
    project = await prisma.project.create({
      data: { organizationId: org.id, name: PROJECT_NAME },
    });
  }

  const board =
    (await prisma.board.findUnique({ where: { projectId: project.id } })) ??
    (await prisma.board.create({ data: { projectId: project.id } }));

  const columns = [
    { key: "todo", name: "To do", position: 0 },
    { key: "in_progress", name: "In progress", position: 1 },
    { key: "done", name: "Done", position: 2 },
  ];

  for (const col of columns) {
    const existing = await prisma.boardColumn.findFirst({
      where: { boardId: board.id, key: col.key },
    });
    if (existing) {
      await prisma.boardColumn.update({
        where: { id: existing.id },
        data: { name: col.name, position: col.position },
      });
    } else {
      await prisma.boardColumn.create({
        data: {
          boardId: board.id,
          key: col.key,
          name: col.name,
          position: col.position,
        },
      });
    }
  }

  const member = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: { projectId: project.id, userId: user1.id },
    },
  });
  if (!member) {
    await prisma.projectMember.create({
      data: {
        projectId: project.id,
        userId: user1.id,
        role: "admin",
      },
    });
  }

  const todoCol = await prisma.boardColumn.findFirstOrThrow({
    where: { boardId: board.id, key: "todo" },
  });

  const existingTicket = await prisma.ticket.findFirst({
    where: { projectId: project.id },
  });
  if (!existingTicket) {
    await prisma.ticket.create({
      data: {
        projectId: project.id,
        title: "Welcome ticket",
        descriptionMarkdown: "Seed ticket — delete or edit.",
        status: "todo",
        reporterId: user1.id,
        boardColumnId: todoCol.id,
      },
    });
  }

  // eslint-disable-next-line no-console
  console.log(
    `Seed OK: tenant=${tenant.id}, org=${org.id}, project=${project.id}, board=${board.id}`,
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

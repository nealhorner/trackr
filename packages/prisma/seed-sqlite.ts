import { PrismaClient } from "./generated/client-sqlite/index.js";

const prisma = new PrismaClient();

const DEFAULT_TENANT = "Local";
const ORG_NAME = "Personal";
const PROJECT_NAME = "Inbox";

async function main() {
  let tenant = await prisma.tenant.findFirst({
    where: { name: DEFAULT_TENANT },
  });
  if (!tenant) {
    tenant = await prisma.tenant.create({ data: { name: DEFAULT_TENANT } });
  }

  const user =
    (await prisma.user.findFirst({
      where: { tenantId: tenant.id, email: "local@example.com" },
    })) ??
    (await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: "local@example.com",
        emailVerifiedAt: new Date(),
      },
    }));

  const org =
    (await prisma.organization.findFirst({
      where: { tenantId: tenant.id, name: ORG_NAME },
    })) ??
    (await prisma.organization.create({
      data: { tenantId: tenant.id, name: ORG_NAME },
    }));

  const project =
    (await prisma.project.findFirst({
      where: { organizationId: org.id, name: PROJECT_NAME },
    })) ??
    (await prisma.project.create({
      data: { organizationId: org.id, name: PROJECT_NAME },
    }));

  const board =
    (await prisma.board.findUnique({ where: { projectId: project.id } })) ??
    (await prisma.board.create({ data: { projectId: project.id } }));

  const cols = [
    { key: "todo", name: "To do", position: 0 },
    { key: "in_progress", name: "In progress", position: 1 },
    { key: "done", name: "Done", position: 2 },
  ];
  for (const col of cols) {
    const existing = await prisma.boardColumn.findFirst({
      where: { boardId: board.id, key: col.key },
    });
    if (existing) continue;
    await prisma.boardColumn.create({
      data: {
        boardId: board.id,
        key: col.key,
        name: col.name,
        position: col.position,
      },
    });
  }

  const member = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId: project.id, userId: user.id } },
  });
  if (!member) {
    await prisma.projectMember.create({
      data: { projectId: project.id, userId: user.id, role: "admin" },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    void prisma.$disconnect();
    process.exit(1);
  });

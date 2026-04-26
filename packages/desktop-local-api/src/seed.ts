import { prisma } from "./db";

export async function ensureLocalSeedData() {
  let tenant = await prisma.tenant.findFirst({ where: { name: "Local" } });
  if (!tenant) tenant = await prisma.tenant.create({ data: { name: "Local" } });

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
      where: { tenantId: tenant.id, name: "Personal" },
    })) ??
    (await prisma.organization.create({
      data: { tenantId: tenant.id, name: "Personal" },
    }));

  const project =
    (await prisma.project.findFirst({
      where: { organizationId: org.id, name: "Inbox" },
    })) ??
    (await prisma.project.create({
      data: { organizationId: org.id, name: "Inbox" },
    }));

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
    if (!existing) {
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
    where: { projectId_userId: { projectId: project.id, userId: user.id } },
  });
  if (!member) {
    await prisma.projectMember.create({
      data: { projectId: project.id, userId: user.id, role: "admin" },
    });
  }
}

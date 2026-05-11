import { auth } from "./betterAuth";
import { prisma } from "./db";

export type FirstTimeSetupInput = {
  tenantName: string;
  adminEmail: string;
  adminPassword: string;
  adminDisplayName?: string;
  authSettings: {
    password: boolean;
    google: boolean;
    apple: boolean;
    github: boolean;
    okta: boolean;
  };
};

/**
 * Creates the first tenant, Better Auth user, and default org/project. Caller must
 * ensure the instance is still unconfigured.
 */
export async function runFirstTimeSetup(
  input: FirstTimeSetupInput,
): Promise<void> {
  const d = input;
  const authSettings = d.authSettings;

  const tenant = await prisma.tenant.create({
    data: {
      name: d.tenantName,
      authSettings: authSettings as object,
    },
  });

  try {
    const sign = await auth.api.signUpEmail({
      body: {
        name: d.adminDisplayName ?? d.adminEmail.split("@")[0]!,
        email: d.adminEmail,
        password: d.adminPassword,
      },
    });

    if (sign && typeof sign === "object" && "error" in sign && sign.error) {
      await prisma.tenant.delete({ where: { id: tenant.id } });
      throw new Error("signUpEmail failed");
    }
  } catch (e) {
    await prisma.tenant.delete({ where: { id: tenant.id } });
    throw e;
  }

  const ba = await prisma.user.findUnique({ where: { email: d.adminEmail } });
  if (!ba) {
    await prisma.tenant.delete({ where: { id: tenant.id } });
    throw new Error("Auth user missing after sign up");
  }

  const admin = await prisma.appUser.create({
    data: {
      tenantId: tenant.id,
      email: d.adminEmail,
      emailVerifiedAt: new Date(),
      isTenantAdmin: true,
      authUserId: ba.id,
    },
  });

  const org = await prisma.organization.create({
    data: { tenantId: tenant.id, name: "Main" },
  });
  const project = await prisma.project.create({
    data: { organizationId: org.id, name: "Default project" },
  });
  const board = await prisma.board.create({ data: { projectId: project.id } });
  const columns = [
    { key: "todo", name: "To do", position: 0 },
    { key: "in_progress", name: "In progress", position: 1 },
    { key: "done", name: "Done", position: 2 },
  ];
  for (const col of columns) {
    await prisma.boardColumn.create({
      data: { boardId: board.id, ...col },
    });
  }
  await prisma.projectMember.create({
    data: { projectId: project.id, userId: admin.id, role: "admin" },
  });
  const todo = await prisma.boardColumn.findFirstOrThrow({
    where: { boardId: board.id, key: "todo" },
  });
  await prisma.ticket.create({
    data: {
      projectId: project.id,
      title: "Welcome ticket",
      descriptionMarkdown: "Get started with Trackr.",
      status: "todo",
      reporterId: admin.id,
      boardColumnId: todo.id,
    },
  });
  await prisma.tenant.update({
    where: { id: tenant.id },
    data: { setupCompleteAt: new Date() },
  });
}

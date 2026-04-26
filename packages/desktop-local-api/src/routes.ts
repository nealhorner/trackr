import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "./db";
import { jsonError, jsonOk } from "./api";

const createProjectSchema = z.object({
  organizationId: z.number().int().positive(),
  name: z.string().min(1).max(200),
});

const createTicketSchema = z.object({
  projectId: z.number().int().positive(),
  title: z.string().min(1).max(500),
  descriptionMarkdown: z.string().nullable().optional(),
  status: z.string().min(1).optional(),
});

const createCommentSchema = z.object({
  body: z.string().min(1).max(50_000),
});

export const v1 = new Hono();

v1.get("/projects", async (c) => {
  const projects = await prisma.project.findMany({
    include: { organization: true },
    orderBy: { name: "asc" },
  });
  return jsonOk(c, {
    projects: projects.map((p) => ({
      id: p.id,
      name: p.name,
      organizationId: p.organizationId,
      organization: { id: p.organization.id, name: p.organization.name },
      createdAt: p.createdAt.toISOString(),
    })),
  });
});

v1.post("/projects", async (c) => {
  const body = await c.req.json();
  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(c, "validation_error", parsed.error.message, 400);
  }
  const project = await prisma.$transaction(async (tx) => {
    const p = await tx.project.create({ data: parsed.data });
    const board = await tx.board.create({ data: { projectId: p.id } });
    for (const col of [
      { key: "todo", name: "To do", position: 0 },
      { key: "in_progress", name: "In progress", position: 1 },
      { key: "done", name: "Done", position: 2 },
    ]) {
      await tx.boardColumn.create({
        data: {
          boardId: board.id,
          key: col.key,
          name: col.name,
          position: col.position,
        },
      });
    }
    return p;
  });
  return jsonOk(c, { project }, 201);
});

v1.get("/projects/:id", async (c) => {
  const projectId = Number(c.req.param("id"));
  const project = await prisma.project.findUnique({ where: { id: projectId } });
  if (!project) return jsonError(c, "not_found", "Project not found", 404);
  return jsonOk(c, {
    project: {
      id: project.id,
      name: project.name,
      organizationId: project.organizationId,
      createdAt: project.createdAt.toISOString(),
    },
  });
});

v1.get("/projects/:id/tickets", async (c) => {
  const projectId = Number(c.req.param("id"));
  const tickets = await prisma.ticket.findMany({
    where: { projectId },
    include: {
      reporter: { select: { id: true, email: true } },
      assignee: { select: { id: true, email: true } },
      statusColumn: { select: { id: true, key: true, name: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
  return jsonOk(c, {
    tickets: tickets.map((t) => ({
      id: t.id,
      projectId: t.projectId,
      title: t.title,
      descriptionMarkdown: t.descriptionMarkdown,
      status: t.status,
      reporter: t.reporter,
      assignee: t.assignee,
      statusColumn: t.statusColumn,
      boardColumnId: t.boardColumnId,
      updatedAt: t.updatedAt.toISOString(),
    })),
  });
});

v1.post("/tickets", async (c) => {
  const body = await c.req.json();
  const parsed = createTicketSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(c, "validation_error", parsed.error.message, 400);
  }
  const project = await prisma.project.findUnique({
    where: { id: parsed.data.projectId },
    include: {
      board: { include: { columns: { orderBy: { position: "asc" } } } },
    },
  });
  if (!project?.board)
    return jsonError(c, "not_found", "Project not found", 404);
  const status = parsed.data.status ?? "todo";
  const col =
    project.board.columns.find((x) => x.key === status) ??
    project.board.columns[0];
  const firstUser = await prisma.user.findFirst({ orderBy: { id: "asc" } });
  if (!firstUser)
    return jsonError(c, "validation_error", "No local user found", 400);
  const ticket = await prisma.ticket.create({
    data: {
      projectId: parsed.data.projectId,
      title: parsed.data.title,
      descriptionMarkdown: parsed.data.descriptionMarkdown ?? null,
      status,
      boardColumnId: col?.id ?? null,
      reporterId: firstUser.id,
    },
  });
  return jsonOk(c, { ticket }, 201);
});

v1.get("/projects/:id/board", async (c) => {
  const projectId = Number(c.req.param("id"));
  const board = await prisma.board.findUnique({
    where: { projectId },
    include: { columns: { orderBy: { position: "asc" } } },
  });
  if (!board) return jsonError(c, "not_found", "Board not found", 404);
  const tickets = await prisma.ticket.findMany({
    where: { projectId },
    orderBy: { updatedAt: "desc" },
  });
  return jsonOk(c, {
    board: {
      id: board.id,
      projectId: board.projectId,
      columns: board.columns,
    },
    tickets: tickets.map((t) => ({
      id: t.id,
      title: t.title,
      boardColumnId: t.boardColumnId,
      status: t.status,
    })),
  });
});

v1.get("/tickets/:id", async (c) => {
  const id = Number(c.req.param("id"));
  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      reporter: { select: { id: true, email: true } },
      assignee: { select: { id: true, email: true } },
      statusColumn: { select: { id: true, key: true, name: true } },
    },
  });
  if (!ticket) return jsonError(c, "not_found", "Ticket not found", 404);
  return jsonOk(c, {
    ticket: {
      id: ticket.id,
      projectId: ticket.projectId,
      title: ticket.title,
      descriptionMarkdown: ticket.descriptionMarkdown,
      status: ticket.status,
      reporter: ticket.reporter,
      assignee: ticket.assignee,
      statusColumn: ticket.statusColumn,
      boardColumnId: ticket.boardColumnId,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
    },
  });
});

v1.get("/tickets/:id/comments", async (c) => {
  const id = Number(c.req.param("id"));
  const comments = await prisma.ticketComment.findMany({
    where: { ticketId: id },
    include: { author: { select: { id: true, email: true } } },
    orderBy: { createdAt: "asc" },
  });
  return jsonOk(c, {
    comments: comments.map((cm) => ({
      id: cm.id,
      body: cm.body,
      createdAt: cm.createdAt.toISOString(),
      author: cm.author,
    })),
  });
});

v1.post("/tickets/:id/comments", async (c) => {
  const ticketId = Number(c.req.param("id"));
  const body = await c.req.json();
  const parsed = createCommentSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(c, "validation_error", parsed.error.message, 400);
  }
  const firstUser = await prisma.user.findFirst({ orderBy: { id: "asc" } });
  if (!firstUser)
    return jsonError(c, "validation_error", "No local user found", 400);
  const comment = await prisma.ticketComment.create({
    data: { ticketId, body: parsed.data.body, authorId: firstUser.id },
  });
  return jsonOk(c, { comment }, 201);
});

v1.get("/local/export", async (c) => {
  const [
    tenants,
    users,
    organizations,
    projects,
    boards,
    columns,
    members,
    tickets,
    comments,
  ] = await Promise.all([
    prisma.tenant.findMany(),
    prisma.user.findMany(),
    prisma.organization.findMany(),
    prisma.project.findMany(),
    prisma.board.findMany(),
    prisma.boardColumn.findMany(),
    prisma.projectMember.findMany(),
    prisma.ticket.findMany(),
    prisma.ticketComment.findMany(),
  ]);

  return jsonOk(c, {
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      tenants,
      users,
      organizations,
      projects,
      boards,
      columns,
      members,
      tickets,
      comments,
    },
  });
});

v1.post("/local/import", async (c) => {
  const payload = (await c.req.json()) as {
    data?: {
      tenants: Array<{ id: number; name: string; createdAt: string }>;
      users: Array<{
        id: number;
        tenantId: number;
        email: string;
        createdAt: string;
        emailVerifiedAt: string | null;
      }>;
      organizations: Array<{
        id: number;
        tenantId: number;
        name: string;
        createdAt: string;
      }>;
      projects: Array<{
        id: number;
        organizationId: number;
        name: string;
        createdAt: string;
      }>;
      boards: Array<{ id: number; projectId: number; createdAt: string }>;
      columns: Array<{
        id: number;
        boardId: number;
        key: string;
        name: string;
        position: number;
      }>;
      members: Array<{
        id: number;
        projectId: number;
        userId: number;
        role: string;
        createdAt: string;
      }>;
      tickets: Array<{
        id: number;
        projectId: number;
        title: string;
        descriptionMarkdown: string | null;
        status: string;
        reporterId: number;
        assigneeId: number | null;
        boardColumnId: number | null;
        createdAt: string;
        updatedAt: string;
      }>;
      comments: Array<{
        id: number;
        ticketId: number;
        authorId: number;
        body: string;
        createdAt: string;
      }>;
    };
  };
  if (!payload.data)
    return jsonError(c, "validation_error", "Invalid import payload", 400);
  const data = payload.data;

  await prisma.$transaction(async (tx) => {
    await tx.ticketComment.deleteMany();
    await tx.ticket.deleteMany();
    await tx.projectMember.deleteMany();
    await tx.boardColumn.deleteMany();
    await tx.board.deleteMany();
    await tx.project.deleteMany();
    await tx.organization.deleteMany();
    await tx.user.deleteMany();
    await tx.tenant.deleteMany();

    for (const tenant of data.tenants) {
      await tx.tenant.create({
        data: { ...tenant, createdAt: new Date(tenant.createdAt) },
      });
    }
    for (const user of data.users) {
      await tx.user.create({
        data: {
          ...user,
          createdAt: new Date(user.createdAt),
          emailVerifiedAt: user.emailVerifiedAt
            ? new Date(user.emailVerifiedAt)
            : null,
        },
      });
    }
    for (const row of data.organizations) {
      await tx.organization.create({
        data: { ...row, createdAt: new Date(row.createdAt) },
      });
    }
    for (const row of data.projects) {
      await tx.project.create({
        data: { ...row, createdAt: new Date(row.createdAt) },
      });
    }
    for (const row of data.boards) {
      await tx.board.create({
        data: { ...row, createdAt: new Date(row.createdAt) },
      });
    }
    for (const row of data.columns) {
      await tx.boardColumn.create({ data: row });
    }
    for (const row of data.members) {
      await tx.projectMember.create({
        data: { ...row, createdAt: new Date(row.createdAt) },
      });
    }
    for (const row of data.tickets) {
      await tx.ticket.create({
        data: {
          ...row,
          createdAt: new Date(row.createdAt),
          updatedAt: new Date(row.updatedAt),
        },
      });
    }
    for (const row of data.comments) {
      await tx.ticketComment.create({
        data: { ...row, createdAt: new Date(row.createdAt) },
      });
    }
  });

  return jsonOk(c, { ok: true });
});

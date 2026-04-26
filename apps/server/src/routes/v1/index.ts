import { Hono } from "hono";
import { z } from "zod";

import { getRequestId, jsonError, jsonOk } from "../../lib/api";
import { getProjectForUser, requireProjectMember } from "../../lib/authz";
import { prisma } from "../../lib/db";
import { loadSession, requireAuth } from "../../middleware/session";
import { authRoutes } from "./auth";

function pagination(limitRaw: string | undefined, pageRaw: string | undefined) {
  const limit = Math.min(100, Math.max(1, Number(limitRaw ?? 50) || 50));
  const page = Math.max(1, Number(pageRaw ?? 1) || 1);
  const skip = (page - 1) * limit;
  return { limit, page, skip };
}

const createProjectSchema = z.object({
  organizationId: z.number().int().positive(),
  name: z.string().min(1).max(200),
});

const createTicketSchema = z.object({
  projectId: z.number().int().positive(),
  title: z.string().min(1).max(500),
  descriptionMarkdown: z.string().nullable().optional(),
  status: z.string().min(1).optional(),
  type: z.string().nullable().optional(),
  priority: z.string().nullable().optional(),
});

const patchTicketSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  descriptionMarkdown: z.string().nullable().optional(),
  status: z.string().min(1).optional(),
  type: z.string().nullable().optional(),
  priority: z.string().nullable().optional(),
  assigneeId: z.number().int().positive().nullable().optional(),
  boardColumnId: z.number().int().positive().nullable().optional(),
});

const moveTicketSchema = z.object({
  projectId: z.number().int().positive(),
});

const createCommentSchema = z.object({
  body: z.string().min(1).max(50_000),
});

export const v1 = new Hono();

v1.use("*", loadSession);
v1.route("/auth", authRoutes);

v1.get("/me", requireAuth, (c) => {
  const u = c.get("authUser")!;
  return jsonOk(c, {
    user: {
      id: u.id,
      email: u.email,
      tenantId: u.tenantId,
    },
  });
});

v1.get("/organizations", requireAuth, async (c) => {
  const u = c.get("authUser")!;
  const organizations = await prisma.organization.findMany({
    where: {
      tenantId: u.tenantId,
      projects: {
        some: {
          projectMembers: { some: { userId: u.id } },
        },
      },
    },
    orderBy: { name: "asc" },
  });
  return jsonOk(c, {
    organizations: organizations.map((o) => ({
      id: o.id,
      name: o.name,
      createdAt: o.createdAt.toISOString(),
    })),
  });
});

v1.get("/projects", requireAuth, async (c) => {
  const u = c.get("authUser")!;
  const projects = await prisma.project.findMany({
    where: {
      organization: { tenantId: u.tenantId },
      projectMembers: { some: { userId: u.id } },
    },
    include: { organization: { select: { id: true, name: true } } },
    orderBy: { name: "asc" },
  });
  return jsonOk(c, {
    projects: projects.map((p) => ({
      id: p.id,
      name: p.name,
      createdAt: p.createdAt.toISOString(),
      organizationId: p.organizationId,
      organization: p.organization,
    })),
  });
});

v1.post("/projects", requireAuth, async (c) => {
  const u = c.get("authUser")!;
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return jsonError(
      c,
      "validation_error",
      "Invalid JSON body",
      400,
      getRequestId(c),
    );
  }
  const parsed = createProjectSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(
      c,
      "validation_error",
      parsed.error.message,
      400,
      getRequestId(c),
    );
  }

  const org = await prisma.organization.findFirst({
    where: {
      id: parsed.data.organizationId,
      tenantId: u.tenantId,
    },
  });
  if (!org) {
    return jsonError(
      c,
      "not_found",
      "Organization not found",
      404,
      getRequestId(c),
    );
  }

  const project = await prisma.$transaction(async (tx) => {
    const p = await tx.project.create({
      data: {
        organizationId: org.id,
        name: parsed.data.name,
      },
    });
    const board = await tx.board.create({
      data: { projectId: p.id },
    });
    const cols = [
      { key: "todo", name: "To do", position: 0 },
      { key: "in_progress", name: "In progress", position: 1 },
      { key: "done", name: "Done", position: 2 },
    ];
    for (const col of cols) {
      await tx.boardColumn.create({
        data: {
          boardId: board.id,
          key: col.key,
          name: col.name,
          position: col.position,
        },
      });
    }
    await tx.projectMember.create({
      data: {
        projectId: p.id,
        userId: u.id,
        role: "admin",
      },
    });
    return p;
  });

  return jsonOk(
    c,
    {
      project: {
        id: project.id,
        name: project.name,
        organizationId: project.organizationId,
        createdAt: project.createdAt.toISOString(),
      },
    },
    201,
  );
});

v1.get("/projects/:id/tickets", requireAuth, async (c) => {
  const u = c.get("authUser")!;
  const projectId = Number(c.req.param("id"));
  if (!Number.isFinite(projectId)) {
    return jsonError(
      c,
      "validation_error",
      "Invalid project id",
      400,
      getRequestId(c),
    );
  }
  await getProjectForUser(u.id, u.tenantId, projectId);
  const { limit, page, skip } = pagination(c.req.query("limit"), c.req.query("page"));

  const [items, total] = await Promise.all([
    prisma.ticket.findMany({
      where: { projectId },
      orderBy: { updatedAt: "desc" },
      take: limit,
      skip,
      include: {
        reporter: { select: { id: true, email: true } },
        assignee: { select: { id: true, email: true } },
        statusColumn: { select: { id: true, key: true, name: true } },
      },
    }),
    prisma.ticket.count({ where: { projectId } }),
  ]);

  return jsonOk(c, {
    tickets: items.map((t) => ({
      id: t.id,
      projectId: t.projectId,
      title: t.title,
      descriptionMarkdown: t.descriptionMarkdown,
      status: t.status,
      type: t.type,
      priority: t.priority,
      dueDate: t.dueDate?.toISOString() ?? null,
      reporter: t.reporter,
      assignee: t.assignee,
      statusColumn: t.statusColumn,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    })),
    pagination: { limit, total, page },
  });
});

v1.get("/projects/:id/board", requireAuth, async (c) => {
  const u = c.get("authUser")!;
  const projectId = Number(c.req.param("id"));
  if (!Number.isFinite(projectId)) {
    return jsonError(
      c,
      "validation_error",
      "Invalid project id",
      400,
      getRequestId(c),
    );
  }
  await getProjectForUser(u.id, u.tenantId, projectId);

  const board = await prisma.board.findUnique({
    where: { projectId },
    include: {
      columns: { orderBy: { position: "asc" } },
    },
  });
  if (!board) {
    return jsonError(c, "not_found", "Board not found", 404, getRequestId(c));
  }

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
    board: {
      id: board.id,
      projectId: board.projectId,
      columns: board.columns.map((col) => ({
        id: col.id,
        key: col.key,
        name: col.name,
        position: col.position,
      })),
    },
    tickets: tickets.map((t) => ({
      id: t.id,
      title: t.title,
      status: t.status,
      boardColumnId: t.boardColumnId,
      reporter: t.reporter,
      assignee: t.assignee,
      statusColumn: t.statusColumn,
      updatedAt: t.updatedAt.toISOString(),
    })),
  });
});

v1.get("/projects/:id", requireAuth, async (c) => {
  const u = c.get("authUser")!;
  const projectId = Number(c.req.param("id"));
  if (!Number.isFinite(projectId)) {
    return jsonError(
      c,
      "validation_error",
      "Invalid project id",
      400,
      getRequestId(c),
    );
  }
  const project = await getProjectForUser(u.id, u.tenantId, projectId);
  return jsonOk(c, {
    project: {
      id: project.id,
      name: project.name,
      organizationId: project.organizationId,
      createdAt: project.createdAt.toISOString(),
    },
  });
});

v1.post("/tickets", requireAuth, async (c) => {
  const u = c.get("authUser")!;
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return jsonError(
      c,
      "validation_error",
      "Invalid JSON body",
      400,
      getRequestId(c),
    );
  }
  const parsed = createTicketSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(
      c,
      "validation_error",
      parsed.error.message,
      400,
      getRequestId(c),
    );
  }

  await requireProjectMember(u.id, parsed.data.projectId);
  const project = await prisma.project.findFirst({
    where: {
      id: parsed.data.projectId,
      organization: { tenantId: u.tenantId },
    },
    include: {
      board: { include: { columns: { orderBy: { position: "asc" } } } },
    },
  });
  if (!project?.board) {
    return jsonError(c, "not_found", "Project not found", 404, getRequestId(c));
  }

  const status = parsed.data.status ?? "todo";
  const col =
    project.board.columns.find((x) => x.key === status) ??
    project.board.columns[0];

  const ticket = await prisma.ticket.create({
    data: {
      projectId: parsed.data.projectId,
      title: parsed.data.title,
      descriptionMarkdown: parsed.data.descriptionMarkdown ?? null,
      status,
      type: parsed.data.type ?? null,
      priority: parsed.data.priority ?? null,
      reporterId: u.id,
      boardColumnId: col?.id ?? null,
    },
  });

  return jsonOk(
    c,
    {
      ticket: {
        id: ticket.id,
        projectId: ticket.projectId,
        title: ticket.title,
        status: ticket.status,
        createdAt: ticket.createdAt.toISOString(),
      },
    },
    201,
  );
});

v1.get("/tickets/:id", requireAuth, async (c) => {
  const u = c.get("authUser")!;
  const id = Number(c.req.param("id"));
  if (!Number.isFinite(id)) {
    return jsonError(
      c,
      "validation_error",
      "Invalid ticket id",
      400,
      getRequestId(c),
    );
  }

  const ticket = await prisma.ticket.findFirst({
    where: { id, project: { organization: { tenantId: u.tenantId } } },
    include: {
      project: true,
      reporter: { select: { id: true, email: true } },
      assignee: { select: { id: true, email: true } },
      statusColumn: { select: { id: true, key: true, name: true } },
    },
  });
  if (!ticket) {
    return jsonError(c, "not_found", "Ticket not found", 404, getRequestId(c));
  }
  await requireProjectMember(u.id, ticket.projectId);

  return jsonOk(c, {
    ticket: {
      id: ticket.id,
      projectId: ticket.projectId,
      title: ticket.title,
      descriptionMarkdown: ticket.descriptionMarkdown,
      status: ticket.status,
      type: ticket.type,
      priority: ticket.priority,
      dueDate: ticket.dueDate?.toISOString() ?? null,
      reporter: ticket.reporter,
      assignee: ticket.assignee,
      statusColumn: ticket.statusColumn,
      boardColumnId: ticket.boardColumnId,
      createdAt: ticket.createdAt.toISOString(),
      updatedAt: ticket.updatedAt.toISOString(),
    },
  });
});

v1.patch("/tickets/:id", requireAuth, async (c) => {
  const u = c.get("authUser")!;
  const id = Number(c.req.param("id"));
  if (!Number.isFinite(id)) {
    return jsonError(
      c,
      "validation_error",
      "Invalid ticket id",
      400,
      getRequestId(c),
    );
  }

  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return jsonError(
      c,
      "validation_error",
      "Invalid JSON body",
      400,
      getRequestId(c),
    );
  }
  const parsed = patchTicketSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(
      c,
      "validation_error",
      parsed.error.message,
      400,
      getRequestId(c),
    );
  }

  const existing = await prisma.ticket.findFirst({
    where: { id, project: { organization: { tenantId: u.tenantId } } },
  });
  if (!existing) {
    return jsonError(c, "not_found", "Ticket not found", 404, getRequestId(c));
  }
  await requireProjectMember(u.id, existing.projectId);

  const d = parsed.data;
  const data: {
    title?: string;
    descriptionMarkdown?: string | null;
    status?: string;
    type?: string | null;
    priority?: string | null;
    assigneeId?: number | null;
    boardColumnId?: number | null;
  } = {};
  if (d.title !== undefined) data.title = d.title;
  if (d.descriptionMarkdown !== undefined)
    data.descriptionMarkdown = d.descriptionMarkdown;
  if (d.status !== undefined) data.status = d.status;
  if (d.type !== undefined) data.type = d.type;
  if (d.priority !== undefined) data.priority = d.priority;
  if (d.assigneeId !== undefined) data.assigneeId = d.assigneeId;
  if (d.boardColumnId !== undefined) data.boardColumnId = d.boardColumnId;

  if (Object.keys(data).length === 0) {
    return jsonError(
      c,
      "validation_error",
      "No fields to update",
      400,
      getRequestId(c),
    );
  }

  const ticket = await prisma.ticket.update({
    where: { id },
    data,
  });

  return jsonOk(c, {
    ticket: {
      id: ticket.id,
      projectId: ticket.projectId,
      title: ticket.title,
      status: ticket.status,
      updatedAt: ticket.updatedAt.toISOString(),
    },
  });
});

v1.post("/tickets/:id/move", requireAuth, async (c) => {
  const u = c.get("authUser")!;
  const id = Number(c.req.param("id"));
  if (!Number.isFinite(id)) {
    return jsonError(
      c,
      "validation_error",
      "Invalid ticket id",
      400,
      getRequestId(c),
    );
  }

  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return jsonError(
      c,
      "validation_error",
      "Invalid JSON body",
      400,
      getRequestId(c),
    );
  }
  const parsed = moveTicketSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(
      c,
      "validation_error",
      parsed.error.message,
      400,
      getRequestId(c),
    );
  }

  const ticket = await prisma.ticket.findFirst({
    where: { id, project: { organization: { tenantId: u.tenantId } } },
  });
  if (!ticket) {
    return jsonError(c, "not_found", "Ticket not found", 404, getRequestId(c));
  }

  await requireProjectMember(u.id, ticket.projectId);
  await requireProjectMember(u.id, parsed.data.projectId);

  const targetProject = await prisma.project.findFirst({
    where: {
      id: parsed.data.projectId,
      organization: { tenantId: u.tenantId },
    },
    include: {
      board: { include: { columns: { orderBy: { position: "asc" } } } },
    },
  });
  if (!targetProject?.board) {
    return jsonError(
      c,
      "not_found",
      "Target project not found",
      404,
      getRequestId(c),
    );
  }

  const firstCol = targetProject.board.columns[0];
  const updated = await prisma.$transaction(async (tx) => {
    const t = await tx.ticket.update({
      where: { id },
      data: {
        projectId: parsed.data.projectId,
        boardColumnId: firstCol?.id ?? null,
        movedAt: new Date(),
      },
    });
    await tx.auditEvent.create({
      data: {
        tenantId: u.tenantId,
        actorId: u.id,
        eventType: "ticket_moved",
        metadata: {
          ticketId: id,
          fromProjectId: ticket.projectId,
          toProjectId: parsed.data.projectId,
        },
      },
    });
    return t;
  });

  return jsonOk(c, {
    ticket: {
      id: updated.id,
      projectId: updated.projectId,
      movedAt: updated.movedAt?.toISOString() ?? null,
    },
  });
});

v1.get("/tickets/:id/comments", requireAuth, async (c) => {
  const u = c.get("authUser")!;
  const ticketId = Number(c.req.param("id"));
  if (!Number.isFinite(ticketId)) {
    return jsonError(
      c,
      "validation_error",
      "Invalid ticket id",
      400,
      getRequestId(c),
    );
  }

  const ticket = await prisma.ticket.findFirst({
    where: {
      id: ticketId,
      project: { organization: { tenantId: u.tenantId } },
    },
  });
  if (!ticket) {
    return jsonError(c, "not_found", "Ticket not found", 404, getRequestId(c));
  }
  await requireProjectMember(u.id, ticket.projectId);

  const comments = await prisma.ticketComment.findMany({
    where: { ticketId },
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

v1.post("/tickets/:id/comments", requireAuth, async (c) => {
  const u = c.get("authUser")!;
  const ticketId = Number(c.req.param("id"));
  if (!Number.isFinite(ticketId)) {
    return jsonError(
      c,
      "validation_error",
      "Invalid ticket id",
      400,
      getRequestId(c),
    );
  }

  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return jsonError(
      c,
      "validation_error",
      "Invalid JSON body",
      400,
      getRequestId(c),
    );
  }
  const parsed = createCommentSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(
      c,
      "validation_error",
      parsed.error.message,
      400,
      getRequestId(c),
    );
  }

  const ticket = await prisma.ticket.findFirst({
    where: {
      id: ticketId,
      project: { organization: { tenantId: u.tenantId } },
    },
  });
  if (!ticket) {
    return jsonError(c, "not_found", "Ticket not found", 404, getRequestId(c));
  }
  await requireProjectMember(u.id, ticket.projectId);

  const comment = await prisma.ticketComment.create({
    data: {
      ticketId,
      authorId: u.id,
      body: parsed.data.body,
    },
  });

  return jsonOk(
    c,
    {
      comment: {
        id: comment.id,
        body: comment.body,
        createdAt: comment.createdAt.toISOString(),
        authorId: comment.authorId,
      },
    },
    201,
  );
});

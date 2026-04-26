-- CreateTable
CREATE TABLE "Tenant" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerifiedAt" DATETIME,
    CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Organization_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organizationId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Project_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Board" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" INTEGER NOT NULL,
    CONSTRAINT "Board_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BoardColumn" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "boardId" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    CONSTRAINT "BoardColumn_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "Board" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectMember" (
    "projectId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("projectId", "userId"),
    CONSTRAINT "ProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjectMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Team" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    CONSTRAINT "Team_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "teamId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("teamId", "userId"),
    CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrganizationTeamPermission" (
    "organizationId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "permissionKey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("organizationId", "teamId", "permissionKey"),
    CONSTRAINT "OrganizationTeamPermission_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "OrganizationTeamPermission_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProjectTeamPermission" (
    "projectId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "permissionKey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("projectId", "teamId", "permissionKey"),
    CONSTRAINT "ProjectTeamPermission_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProjectTeamPermission_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TicketTeamPermission" (
    "ticketId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "permissionKey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("ticketId", "teamId", "permissionKey"),
    CONSTRAINT "TicketTeamPermission_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TicketTeamPermission_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BoardColumnTeamPermission" (
    "boardColumnId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "permissionKey" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("boardColumnId", "teamId", "permissionKey"),
    CONSTRAINT "BoardColumnTeamPermission_boardColumnId_fkey" FOREIGN KEY ("boardColumnId") REFERENCES "BoardColumn" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BoardColumnTeamPermission_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "projectId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "descriptionMarkdown" TEXT,
    "status" TEXT NOT NULL,
    "type" TEXT,
    "priority" TEXT,
    "dueDate" DATETIME,
    "reporterId" INTEGER NOT NULL,
    "assigneeId" INTEGER,
    "boardColumnId" INTEGER,
    "movedAt" DATETIME,
    CONSTRAINT "Ticket_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Ticket_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ticket_boardColumnId_fkey" FOREIGN KEY ("boardColumnId") REFERENCES "BoardColumn" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TicketComment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticketId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "body" TEXT NOT NULL,
    CONSTRAINT "TicketComment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TicketComment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ticketId" INTEGER NOT NULL,
    "uploadedBy" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    CONSTRAINT "Attachment_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Attachment_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SavedFilter" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "query" JSONB NOT NULL,
    CONSTRAINT "SavedFilter_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "TicketLink" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromTicketId" INTEGER NOT NULL,
    "toTicketId" INTEGER NOT NULL,
    "linkType" TEXT NOT NULL,
    CONSTRAINT "TicketLink_fromTicketId_fkey" FOREIGN KEY ("fromTicketId") REFERENCES "Ticket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TicketLink_toTicketId_fkey" FOREIGN KEY ("toTicketId") REFERENCES "Ticket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tenantId" INTEGER NOT NULL,
    "actorId" INTEGER,
    "eventType" TEXT NOT NULL,
    "metadata" JSONB,
    CONSTRAINT "AuditEvent_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AuditEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "Board_projectId_key" ON "Board"("projectId");


import { prisma } from "./db";
import { ApiError } from "./api";

export async function requireProjectMember(
  userId: number,
  projectId: number,
): Promise<void> {
  const m = await prisma.projectMember.findUnique({
    where: {
      projectId_userId: { projectId, userId },
    },
  });
  if (!m) {
    throw new ApiError(
      "forbidden",
      403,
      "Not a member of this project",
      undefined,
    );
  }
}

export async function getProjectForUser(
  userId: number,
  tenantId: number,
  projectId: number,
) {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      organization: { tenantId },
    },
    include: { organization: true },
  });
  if (!project) {
    throw new ApiError("not_found", 404, "Project not found", undefined);
  }
  await requireProjectMember(userId, projectId);
  return project;
}

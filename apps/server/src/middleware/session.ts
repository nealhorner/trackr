import { createMiddleware } from "hono/factory";

import { ApiError, getRequestId } from "../lib/api";
import { auth } from "../lib/betterAuth";
import { prisma } from "../lib/db";

/** Legacy name kept for imports; Better Auth uses its own cookie names. */
export const SESSION_COOKIE = "trackr_session";

export const loadSession = createMiddleware(async (c, next) => {
  const s = await auth.api.getSession({ headers: c.req.raw.headers });
  if (!s?.user?.id) {
    c.set("authUser", null);
    return next();
  }

  const appUser = await prisma.appUser.findFirst({
    where: { authUserId: s.user.id },
  });

  if (!appUser) {
    c.set("authUser", null);
    return next();
  }

  c.set("authUser", {
    id: appUser.id,
    tenantId: appUser.tenantId,
    email: appUser.email,
    isTenantAdmin: appUser.isTenantAdmin,
  });
  await next();
});

export const requireAuth = createMiddleware(async (c, next) => {
  const user = c.get("authUser");
  if (!user) {
    throw new ApiError(
      "unauthorized",
      401,
      "Authentication required",
      getRequestId(c),
    );
  }
  await next();
});

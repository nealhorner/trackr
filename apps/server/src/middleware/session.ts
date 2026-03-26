import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";

import { ApiError, getRequestId } from "../lib/api";
import { prisma } from "../lib/db";
import { hashSessionToken } from "../lib/session-crypto";

export const SESSION_COOKIE = "trackr_session";

function extractBearer(c: { req: { header: (n: string) => string | undefined } }) {
  const h = c.req.header("Authorization");
  if (!h?.startsWith("Bearer ")) return undefined;
  return h.slice(7).trim();
}

export const loadSession = createMiddleware(async (c, next) => {
  const raw =
    extractBearer(c) ?? getCookie(c, SESSION_COOKIE) ?? undefined;
  if (!raw) {
    c.set("authUser", null);
    return next();
  }

  const tokenHash = hashSessionToken(raw);
  const session = await prisma.session.findFirst({
    where: {
      tokenHash,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });

  if (!session) {
    c.set("authUser", null);
    return next();
  }

  c.set("authUser", {
    id: session.user.id,
    tenantId: session.user.tenantId,
    email: session.user.email,
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

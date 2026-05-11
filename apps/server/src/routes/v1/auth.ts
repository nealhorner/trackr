import { Hono } from "hono";
import { z } from "zod";

import { isDevAuthAllowed } from "../../env";
import { getRequestId, jsonError } from "../../lib/api";
import { auth } from "../../lib/betterAuth";
import { prisma } from "../../lib/db";
import { isTrustedDesktopRequest } from "../../lib/platform";

const devLoginSchema = z
  .object({
    email: z.string().email().optional(),
    userId: z.number().int().positive().optional(),
    tenantId: z.number().int().positive().optional(),
    password: z.string().min(1).optional(),
  })
  .refine((d) => d.email != null || d.userId != null, {
    message: "Provide email or userId",
  });

export const authRoutes = new Hono();

/**
 * @deprecated Prefer Better Auth's `POST /api/auth/sign-in/email`. Remains for
 * tests when `NODE_ENV=development` or `ALLOW_DEV_AUTH=true`.
 */
authRoutes.post("/dev-login", async (c) => {
  if (!isDevAuthAllowed()) {
    return jsonError(
      c,
      "forbidden",
      "Dev login is disabled",
      403,
      getRequestId(c),
    );
  }
  // This endpoint bypasses normal login UX; allow it only from trusted desktop
  // clients when remote mode is enabled.
  if (
    process.env.NODE_ENV === "production" &&
    !isTrustedDesktopRequest(c.req.raw)
  ) {
    return jsonError(
      c,
      "forbidden",
      "Dev login requires a trusted desktop client in production mode",
      403,
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
  const parsed = devLoginSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(
      c,
      "validation_error",
      parsed.error.flatten().formErrors.join("; ") || "Invalid body",
      400,
      getRequestId(c),
    );
  }
  if (!parsed.data.tenantId) {
    return jsonError(
      c,
      "validation_error",
      "tenantId is required for dev login",
      400,
      getRequestId(c),
    );
  }

  const appUser = parsed.data.email
    ? await prisma.appUser.findFirst({
        where: {
          email: parsed.data.email,
          tenantId: parsed.data.tenantId!,
        },
      })
    : await prisma.appUser.findFirst({
        where: {
          id: parsed.data.userId!,
          tenantId: parsed.data.tenantId!,
        },
      });
  if (!appUser) {
    return jsonError(c, "not_found", "User not found", 404, getRequestId(c));
  }
  if (!appUser.authUserId) {
    return jsonError(
      c,
      "auth_error",
      "User is not linked to Better Auth (run initial setup or sign in via /api/auth).",
      400,
      getRequestId(c),
    );
  }

  const password =
    parsed.data.password ??
    process.env.TRACKR_DEV_DEFAULT_PASSWORD ??
    "TrackrDev!local1";

  return auth.api.signInEmail({
    body: { email: appUser.email, password, rememberMe: true },
    asResponse: true,
  }) as Promise<Response>;
});

/** @deprecated use POST /api/auth/sign-out */
authRoutes.post("/logout", (c) => {
  return auth.api.signOut({ headers: c.req.raw.headers, asResponse: true }) as
    | Promise<Response>
    | Response;
});

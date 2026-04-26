import { Hono } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { z } from "zod";

import { isDevAuthAllowed } from "../../env";
import { getRequestId, jsonError, jsonOk } from "../../lib/api";
import { prisma } from "../../lib/db";
import {
  generateSessionToken,
  hashSessionToken,
} from "../../lib/session-crypto";
import { SESSION_COOKIE } from "../../middleware/session";

const devLoginSchema = z
  .object({
    email: z.string().email().optional(),
    userId: z.number().int().positive().optional(),
    tenantId: z.number().int().positive().optional(),
  })
  .refine((d) => d.email != null || d.userId != null, {
    message: "Provide email or userId",
  })
  .refine((d) => d.email == null || d.tenantId != null, {
    message: "Provide tenantId when using email",
  });

const SESSION_MAX_SEC = 30 * 24 * 60 * 60;

function bearerFromHeader(c: {
  req: { header: (n: string) => string | undefined };
}) {
  const h = c.req.header("Authorization");
  if (!h?.startsWith("Bearer ")) return undefined;
  return h.slice(7).trim();
}

export const authRoutes = new Hono();

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

  const user = parsed.data.email
    ? await prisma.user.findFirst({
        where: {
          email: parsed.data.email,
          tenantId: parsed.data.tenantId!,
        },
      })
    : await prisma.user.findUnique({
        where: { id: parsed.data.userId! },
      });

  if (!user) {
    return jsonError(c, "not_found", "User not found", 404, getRequestId(c));
  }

  const raw = generateSessionToken();
  const tokenHash = hashSessionToken(raw);
  const expiresAt = new Date(Date.now() + SESSION_MAX_SEC * 1000);

  await prisma.session.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
    },
  });

  setCookie(c, SESSION_COOKIE, raw, {
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
    maxAge: SESSION_MAX_SEC,
    secure: process.env.NODE_ENV === "production",
  });

  return jsonOk(c, {
    token: raw,
    user: {
      id: user.id,
      email: user.email,
      tenantId: user.tenantId,
    },
  });
});

authRoutes.post("/logout", async (c) => {
  const raw = bearerFromHeader(c) ?? getCookie(c, SESSION_COOKIE);
  if (raw) {
    const tokenHash = hashSessionToken(raw);
    await prisma.session.deleteMany({ where: { tokenHash } });
  }
  setCookie(c, SESSION_COOKIE, "", {
    path: "/",
    httpOnly: true,
    sameSite: "Lax",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
  });
  return jsonOk(c, { ok: true });
});

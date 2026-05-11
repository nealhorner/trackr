import { Hono } from "hono";
import { z } from "zod";

import { getRequestId, jsonError, jsonOk } from "../../lib/api";
import { runFirstTimeSetup } from "../../lib/initial-setup";
import { prisma } from "../../lib/db";
import {
  getSetupTokenFromEnv,
  loadInstanceConfigFile,
} from "../../lib/setup-config";

const setupBodySchema = z.object({
  tenantName: z.string().min(1).max(200),
  adminEmail: z.string().email(),
  adminPassword: z.string().min(8).max(200),
  adminDisplayName: z.string().min(1).max(200).optional(),
  setupToken: z.string().optional(),
  authSettings: z
    .object({
      password: z.boolean().optional(),
      google: z.boolean().optional(),
      apple: z.boolean().optional(),
      github: z.boolean().optional(),
      okta: z.boolean().optional(),
    })
    .optional(),
});

export const setupRoutes = new Hono();

setupRoutes.get("/status", async (c) => {
  const tenant = await prisma.tenant.findFirst({ orderBy: { id: "asc" } });
  const needsSetup = tenant == null || tenant.setupCompleteAt == null;
  const setupTokenRequired = Boolean(getSetupTokenFromEnv());
  return jsonOk(c, {
    needsSetup,
    setupTokenConfigured: setupTokenRequired,
    prefill: loadInstanceConfigFile(),
  });
});

setupRoutes.post("/complete", async (c) => {
  const configured = await prisma.tenant.findFirst({
    where: { NOT: { setupCompleteAt: null } },
  });
  if (configured) {
    return jsonError(
      c,
      "already_set_up",
      "Instance is already configured",
      400,
      getRequestId(c),
    );
  }

  const required = getSetupTokenFromEnv();
  if (required) {
    const got = c.req.header("X-Trackr-Setup-Token");
    if (got !== required) {
      return jsonError(
        c,
        "forbidden",
        "Invalid or missing setup token",
        403,
        getRequestId(c),
      );
    }
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
  const parsed = setupBodySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(
      c,
      "validation_error",
      parsed.error.message,
      400,
      getRequestId(c),
    );
  }

  const d = parsed.data;
  const a = d.authSettings;
  const authSettings = {
    password: a?.password ?? true,
    google: a?.google ?? false,
    apple: a?.apple ?? false,
    github: a?.github ?? false,
    okta: a?.okta ?? false,
  };

  try {
    await runFirstTimeSetup({
      tenantName: d.tenantName,
      adminEmail: d.adminEmail,
      adminPassword: d.adminPassword,
      adminDisplayName: d.adminDisplayName,
      authSettings,
    });
  } catch {
    return jsonError(
      c,
      "server_error",
      "Could not complete setup. Email may already be in use.",
      400,
      getRequestId(c),
    );
  }

  return jsonOk(c, { ok: true }, 201);
});

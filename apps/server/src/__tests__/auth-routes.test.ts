import { Hono } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { findFirstAppUser, signInEmail } = vi.hoisted(() => ({
  findFirstAppUser: vi.fn(),
  signInEmail: vi.fn(),
}));

vi.mock("../env", () => ({
  isDevAuthAllowed: () => true,
}));

vi.mock("../lib/betterAuth", () => ({
  auth: {
    api: {
      signInEmail: signInEmail,
    },
  },
}));

vi.mock("../lib/db", () => ({
  prisma: {
    appUser: {
      findFirst: findFirstAppUser,
    },
  },
}));

import { authRoutes } from "../routes/v1/auth";

function makeApp() {
  const app = new Hono();
  app.route("/api/v1/auth", authRoutes);
  return app;
}

describe("auth routes: dev-login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    findFirstAppUser.mockResolvedValue(null);
    signInEmail.mockResolvedValue(
      new Response(null, { status: 200, headers: { "set-cookie": "test=1" } }),
    );
  });

  it("rejects login when tenantId is missing", async () => {
    const app = makeApp();

    const res = await app.request("/api/v1/auth/dev-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@example.com" }),
    });

    expect(res.status).toBe(400);
    expect(findFirstAppUser).not.toHaveBeenCalled();
  });

  it("calls Better Auth sign-in for app user with auth link", async () => {
    const app = makeApp();
    findFirstAppUser.mockResolvedValue({
      id: 42,
      email: "admin@example.com",
      tenantId: 7,
      authUserId: "auth-1",
    });

    const res = await app.request("/api/v1/auth/dev-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@example.com",
        tenantId: 7,
        password: "devpass123",
      }),
    });

    expect(res.status).toBe(200);
    expect(signInEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.objectContaining({
          email: "admin@example.com",
        }),
        asResponse: true,
      }),
    );
  });
});

import { Hono } from "hono";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { findFirstUser, createSession } = vi.hoisted(() => ({
  findFirstUser: vi.fn(),
  createSession: vi.fn(),
}));

vi.mock("../env", () => ({
  isDevAuthAllowed: () => true,
}));

vi.mock("../lib/session-crypto", () => ({
  generateSessionToken: () => "raw-session-token",
  hashSessionToken: () => "hashed-session-token",
}));

vi.mock("../lib/db", () => ({
  prisma: {
    user: {
      findFirst: findFirstUser,
    },
    session: {
      create: createSession,
      deleteMany: vi.fn(),
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
    findFirstUser.mockResolvedValue(null);
    createSession.mockResolvedValue({ id: 1 });
  });

  it("rejects login when tenantId is missing", async () => {
    const app = makeApp();

    const res = await app.request("/api/v1/auth/dev-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@example.com" }),
    });

    expect(res.status).toBe(400);
    expect(findFirstUser).not.toHaveBeenCalled();
    const body = (await res.json()) as { message: string };
    expect(body.message).toContain("tenantId");
  });

  it("looks up email by tenant and creates a session", async () => {
    const app = makeApp();
    findFirstUser.mockResolvedValue({
      id: 42,
      email: "admin@example.com",
      tenantId: 7,
    });

    const res = await app.request("/api/v1/auth/dev-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@example.com", tenantId: 7 }),
    });

    expect(res.status).toBe(200);

    const body = (await res.json()) as {
      data: {
        token: string;
        user: { id: number; email: string; tenantId: number };
      };
    };
    expect(body.data.token).toBe("raw-session-token");
    expect(body.data.user).toEqual({
      id: 42,
      email: "admin@example.com",
      tenantId: 7,
    });
    
    expect(findFirstUser).toHaveBeenCalledWith({
      where: {
        email: "admin@example.com",
        tenantId: 7,
      },
    });
    expect(createSession).toHaveBeenCalledWith({
      data: {
        userId: 42,
        tokenHash: "hashed-session-token",
        expiresAt: expect.any(Date),
      },
    });
  });

  it("looks up userId by tenant and creates a session", async () => {
    const app = makeApp();
    findFirstUser.mockResolvedValue({
      id: 42,
      email: "admin@example.com",
      tenantId: 7,
    });

    const res = await app.request("/api/v1/auth/dev-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: 42, tenantId: 7 }),
    });

    expect(res.status).toBe(200);
    expect(findFirstUser).toHaveBeenCalledWith({
      where: {
        id: 42,
        tenantId: 7,
      },
    });
    expect(createSession).toHaveBeenCalledWith({
      data: {
        userId: 42,
        tokenHash: "hashed-session-token",
        expiresAt: expect.any(Date),
      },
    });
  });
});

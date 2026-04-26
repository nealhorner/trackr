import { describe, expect, it } from "vitest";
import app from "../index";

describe("API error shape", () => {
  it("returns 401 for protected routes without session", async () => {
    const res = await app.request("/api/v1/projects");
    expect(res.status).toBe(401);
    const body = (await res.json()) as {
      error: string;
      message: string;
      requestId?: string;
    };
    expect(body).toMatchObject({
      error: "unauthorized",
      message: expect.any(String),
    });
  });

  it("includes x-request-id in error body when provided", async () => {
    const res = await app.request("/api/v1/projects", {
      headers: { "x-request-id": "req-test-1" },
    });
    expect(res.status).toBe(401);
    const body = (await res.json()) as { requestId?: string };
    expect(body.requestId).toBe("req-test-1");
  });
});

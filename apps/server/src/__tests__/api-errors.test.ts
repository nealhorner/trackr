import { describe, expect, it } from "vitest";
import app from "../index";

describe("API error shape", () => {
  it("returns standard error JSON for unimplemented v1 routes", async () => {
    const res = await app.request("/api/v1/projects");
    expect(res.status).toBe(501);
    const body = (await res.json()) as {
      error: string;
      message: string;
      requestId?: string;
    };
    expect(body).toMatchObject({
      error: "not_implemented",
      message: expect.any(String),
    });
    expect(body.message).toBe("API endpoint not implemented yet");
  });

  it("includes x-request-id in error body when provided", async () => {
    const res = await app.request("/api/v1/foo", {
      headers: { "x-request-id": "req-test-1" },
    });
    expect(res.status).toBe(501);
    const body = (await res.json()) as { requestId?: string };
    expect(body.requestId).toBe("req-test-1");
  });
});

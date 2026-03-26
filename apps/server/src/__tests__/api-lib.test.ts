import { Hono } from "hono";
import { describe, expect, it } from "vitest";

import { ApiError, jsonFromUnknown } from "../lib/api";

describe("ApiError and jsonFromUnknown", () => {
  it("maps ApiError to correct status and body", async () => {
    const app = new Hono();
    app.onError((err, c) => jsonFromUnknown(c, err));
    app.get("/x", () => {
      throw new ApiError("forbidden", 403, "nope");
    });

    const res = await app.request("/x");
    expect(res.status).toBe(403);
    const body = (await res.json()) as { error: string; message: string };
    expect(body).toEqual({
      error: "forbidden",
      message: "nope",
    });
  });

  it("maps unknown errors to 500 internal_error", async () => {
    const app = new Hono();
    app.onError((err, c) => jsonFromUnknown(c, err));
    app.get("/y", () => {
      throw new Error("boom");
    });

    const res = await app.request("/y");
    expect(res.status).toBe(500);
    const body = (await res.json()) as { error: string; message: string };
    expect(body.error).toBe("internal_error");
    expect(body.message).toBe("boom");
  });
});

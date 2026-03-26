import { describe, expect, it } from "vitest";
import app from "../index";

describe("health", () => {
  it("returns ok", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ status: "ok" });
  });

  it("serves UI-shell placeholder at /", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("<title>Trackr</title>");
    expect(html).toContain("global-search");
  });
});

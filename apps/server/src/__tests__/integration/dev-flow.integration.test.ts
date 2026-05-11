import { describe, expect, it } from "vitest";

import app from "../../index";

function cookieHeaderFromSetCookie(h: {
  get: (k: string) => string | null;
  getSetCookie?: () => string[];
}): string {
  if (typeof h.getSetCookie === "function") {
    const all = h.getSetCookie();
    if (all.length === 0) return "";
    return all
      .map((x) => x.split(";")[0]!)
      .filter(Boolean)
      .join("; ");
  }
  const s = h.get("set-cookie");
  if (!s) return "";
  return s
    .split(/,(?=\s*[^,=;]+=)/g)
    .map((c) => c.split(";")[0]!.trim())
    .filter(Boolean)
    .join("; ");
}

describe.skipIf(process.env.RUN_INTEGRATION !== "true")(
  "integration: dev login + API",
  () => {
    it("dev-login returns set-cookie and projects list works", async () => {
      const password = process.env.SEED_ADMIN_PASSWORD ?? "TrackrDev!local1";
      const login = await app.request("/api/v1/auth/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: "admin@example.com",
          tenantId: 1,
          password,
        }),
      });
      expect([200, 302]).toContain(login.status);
      const cookie = cookieHeaderFromSetCookie({
        get: (k) => login.headers.get(k),
        getSetCookie: (login.headers as { getSetCookie?: () => string[] })
          .getSetCookie,
      });
      expect(cookie.length).toBeGreaterThan(0);

      const projects = await app.request("/api/v1/projects", {
        headers: { cookie: cookie },
      });
      expect(projects.status).toBe(200);
      const body = (await projects.json()) as {
        data: { projects: unknown[] };
      };
      expect(Array.isArray(body.data.projects)).toBe(true);
    });
  },
);

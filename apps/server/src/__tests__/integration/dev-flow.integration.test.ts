import { describe, expect, it } from "vitest";

import app from "../../index";

function sessionCookieFromSetCookie(setCookie: string | null): string {
  if (!setCookie) return "";
  const m = setCookie.match(/trackr_session=([^;]+)/);
  return m ? `trackr_session=${m[1]}` : "";
}

describe.skipIf(process.env.RUN_INTEGRATION !== "true")(
  "integration: dev login + API",
  () => {
    it("dev-login returns session cookie and projects list works", async () => {
      const login = await app.request("/api/v1/auth/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "admin@example.com" }),
      });
      expect(login.status).toBe(200);
      const cookie = sessionCookieFromSetCookie(login.headers.get("set-cookie"));
      expect(cookie).toContain("trackr_session=");

      const projects = await app.request("/api/v1/projects", {
        headers: { Cookie: cookie },
      });
      expect(projects.status).toBe(200);
      const body = (await projects.json()) as {
        data: { projects: unknown[] };
      };
      expect(Array.isArray(body.data.projects)).toBe(true);
    });
  },
);

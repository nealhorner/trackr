import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";

import { isLocalOnlyMode } from "./env";
import { getRequestId, jsonFromUnknown } from "./lib/api";
import { auth } from "./lib/betterAuth";
import { v1 } from "./routes/v1/index";

const app = new Hono();

const localOnlyMode = isLocalOnlyMode();

const allowOrigins = new Set([
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  "http://127.0.0.1:1420",
  "http://localhost:1420",
  "tauri://localhost",
  "https://tauri.localhost",
  ...(process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",")
    .map((o) => o.trim())
    .filter(Boolean) ?? []),
]);

app.use(
  "*",
  cors({
    origin: (origin) => {
      if (origin && allowOrigins.has(origin)) {
        return origin;
      }
      // In local-only mode keep same-machine UX, but fail closed otherwise.
      return localOnlyMode ? "http://localhost:5173" : undefined;
    },
    credentials: true,
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "X-Trackr-Setup-Token",
      "Cookie",
    ],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.onError((err, c) => {
  const requestId = getRequestId(c);
  return jsonFromUnknown(c, err, requestId);
});

// Health endpoint for liveness checks and smoke tests.
app.get("/health", (c) => c.json({ status: "ok" }));

// UI-shell smoke endpoint (Phase 0). Phase 1 web uses SvelteKit; keep for legacy E2E if needed.
app.get("/", (c) => {
  const html = `
  <!doctype html>
  <html>
    <head><title>Trackr</title></head>
    <body>
      <header>
        <div class="context-title">Home</div>
        <input class="global-search" placeholder="Search organizations, projects, tickets..." />
      </header>
      <aside class="left-nav">
        <div class="tenant-name">Tenant Name</div>
        <nav>
          <button>Home</button>
          <button>Your Work</button>
          <button>Organizations</button>
          <button>Projects</button>
          <button>Analytics</button>
          <button>Settings</button>
          <button>Favorites</button>
        </nav>
      </aside>
      <main>
        <div id="page-placeholder">Phase 0 scaffold</div>
      </main>
    </body>
  </html>
  `;
  return c.body(html, 200, { "Content-Type": "text/html" });
});

app.on(["GET", "POST"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.route("/api/v1", v1);

export default app;

// Local dev entrypoint.
// Use @hono/node-server: raw `http.createServer(app.fetch)` is wrong because Node passes
// (IncomingMessage, ServerResponse) while Hono expects Web Fetch API Request/Response.
if (require.main === module) {
  const port = Number(process.env.PORT ?? 3000);
  serve(
    {
      fetch: app.fetch,
      port,
    },
    (info) => {
      // eslint-disable-next-line no-console
      console.log(
        `Trackr server listening on http://localhost:${info.port ?? port}`,
      );
    },
  );
}

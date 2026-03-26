import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

// Health endpoint for liveness checks and smoke tests.
app.get("/health", (c) => c.json({ status: "ok" }));

// UI-shell smoke endpoint (Phase 0).
// This is a temporary scaffolding route so Playwright can validate the UI shell early,
// before the full SvelteKit UI is wired in Phase 1.
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

// Placeholder API v1 routes (Phase 0 scaffolding only).
app.get("/api/v1/:resource", (c) => {
  return c.json(
    { error: "not_implemented", message: "API endpoint not implemented yet" },
    501,
  );
});

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

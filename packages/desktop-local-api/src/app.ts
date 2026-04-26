import { Hono } from "hono";
import { jsonFromUnknown, jsonOk } from "./api";
import { v1 } from "./routes";

export function createApp() {
  const app = new Hono();
  app.onError((err, c) => jsonFromUnknown(c, err));
  app.get("/health", (c) => c.json({ status: "ok" }));
  app.route("/api/v1", v1);
  app.get("/", (c) => jsonOk(c, { status: "desktop-local-api" }));
  return app;
}

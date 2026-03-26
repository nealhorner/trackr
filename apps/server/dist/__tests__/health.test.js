"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const index_1 = __importDefault(require("../index"));
(0, vitest_1.describe)("health", () => {
  (0, vitest_1.it)("returns ok", async () => {
    const res = await index_1.default.request("/health");
    (0, vitest_1.expect)(res.status).toBe(200);
    const body = await res.json();
    (0, vitest_1.expect)(body).toEqual({ status: "ok" });
  });
  (0, vitest_1.it)("serves UI-shell placeholder at /", async () => {
    const res = await index_1.default.request("/");
    (0, vitest_1.expect)(res.status).toBe(200);
    const html = await res.text();
    (0, vitest_1.expect)(html).toContain("<title>Trackr</title>");
    (0, vitest_1.expect)(html).toContain("global-search");
  });
});

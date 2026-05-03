/**
 * Playwright webServer for desktop e2e: API (:3000) + SvelteKit desktop UI (:1420) with
 * VITE_DESKTOP_E2E=true. Mirrors dev-e2e.mjs but starts @trackr/desktop instead of @trackr/web.
 */
import { spawn } from "node:child_process";
import http from "node:http";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const viteEnv = { ...process.env, VITE_DESKTOP_E2E: "true" };

function checkHealth() {
  return new Promise((resolve) => {
    const req = http.get(
      "http://127.0.0.1:3000/health",
      { timeout: 2000 },
      (res) => {
        const ok = res.statusCode === 200;
        res.resume();
        resolve(ok);
      },
    );
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

/** True if something is already serving the desktop dev URL (avoids EADDRINUSE on 1420). */
function desktopDevResponding() {
  return new Promise((resolve) => {
    const req = http.get("http://127.0.0.1:1420/", { timeout: 2000 }, (res) => {
      res.resume();
      resolve(true);
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForHealthyApi(maxMs, interval) {
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    if (await checkHealth()) return true;
    await new Promise((r) => setTimeout(r, interval));
  }
  return false;
}

function port3000Open() {
  return new Promise((resolve) => {
    const socket = net.connect({ host: "127.0.0.1", port: 3000 }, () => {
      socket.destroy();
      resolve(true);
    });
    socket.on("error", () => resolve(false));
    socket.setTimeout(2000, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function main() {
  process.chdir(root);

  if (await waitForHealthyApi(15_000, 400)) {
    if (await desktopDevResponding()) {
      console.log(
        "[dev:e2e-desktop] API up and http://127.0.0.1:1420/ already responds; holding process (reuse existing Vite).",
      );
      await new Promise(() => {});
      return;
    }
    console.log(
      "[dev:e2e-desktop] API already up; starting desktop Vite (1420) only.",
    );
    const child = spawn("npm", ["run", "dev:web", "-w", "@trackr/desktop"], {
      stdio: "inherit",
      cwd: root,
      env: viteEnv,
    });
    child.on("exit", (code, signal) => {
      process.exit(code ?? (signal ? 1 : 0));
    });
    return;
  }

  if (await port3000Open()) {
    console.error(
      "[dev:e2e-desktop] Port 3000 is in use but /health did not return 200 within 15s.",
    );
    console.error(
      "[dev:e2e-desktop] Free port 3000 or set REUSE_E2E_SERVERS=1 with API + desktop Vite already running.",
    );
    process.exit(1);
  }

  const child = spawn(
    "npx",
    [
      "concurrently",
      "-k",
      "-n",
      "api,desktop",
      "npm run dev -w @trackr/server",
      "npx wait-on -t 120000 http://127.0.0.1:3000/health && npm run dev:web -w @trackr/desktop",
    ],
    {
      stdio: "inherit",
      cwd: root,
      env: viteEnv,
    },
  );
  child.on("exit", (code, signal) => {
    process.exit(code ?? (signal ? 1 : 0));
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

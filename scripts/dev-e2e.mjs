/**
 * Playwright `webServer` entry: start API + web, or web only if the API is already up.
 * Avoids EADDRINUSE when port 3000 is taken by another `npm run dev -w @trackr/server`.
 */
import { spawn } from "node:child_process";
import http from "node:http";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

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
    console.log(
      "[dev:e2e] API already responding on http://127.0.0.1:3000/health; starting web only.",
    );
    const child = spawn("npm", ["run", "dev", "-w", "@trackr/web"], {
      stdio: "inherit",
      cwd: root,
      env: process.env,
    });
    child.on("exit", (code, signal) => {
      process.exit(code ?? (signal ? 1 : 0));
    });
    return;
  }

  if (await port3000Open()) {
    console.error(
      "[dev:e2e] Port 3000 is in use but http://127.0.0.1:3000/health did not return 200 within 15s.",
    );
    console.error(
      "[dev:e2e] Stop the process using port 3000, or run with REUSE_E2E_SERVERS=1 if the full stack is already up.",
    );
    process.exit(1);
  }

  const child = spawn(
    "npx",
    [
      "concurrently",
      "-k",
      "-n",
      "api,web",
      "npm run dev -w @trackr/server",
      "npx wait-on -t 120000 http://127.0.0.1:3000/health && npm run dev -w @trackr/web",
    ],
    {
      stdio: "inherit",
      cwd: root,
      env: process.env,
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

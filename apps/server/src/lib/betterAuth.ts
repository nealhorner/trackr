import { createRequire } from "node:module";

import { isLocalOnlyMode } from "../env";
import { prisma } from "./db";

const nodeRequire = createRequire(__filename);
// better-auth is published as ESM; Node 22+ can still load it from CJS via `createRequire`
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
const { betterAuth } = nodeRequire("better-auth") as any;
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
const { prismaAdapter } = nodeRequire("better-auth/adapters/prisma") as any;
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
const { google, github, apple } = nodeRequire(
  "better-auth/social-providers",
) as any;
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-explicit-any
const { genericOAuth, okta } = nodeRequire("better-auth/plugins") as any;

const secret = process.env.BETTER_AUTH_SECRET;
const localOnlyMode = isLocalOnlyMode();

if (!secret || secret.length < 32) {
  if (!localOnlyMode) {
    throw new Error(
      "BETTER_AUTH_SECRET must be set to a string at least 32 characters long when not in local-only mode (missing, empty, or too short).",
    );
  }
  console.warn(
    "[better-auth] BETTER_AUTH_SECRET is missing or shorter than 32 characters; using the dev placeholder because local-only mode is enabled.",
  );
}

const defaultOrigins = [
  "http://127.0.0.1:3000",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://localhost:5173",
  "http://127.0.0.1:1420",
  "http://localhost:1420",
  "tauri://localhost",
  "https://tauri.localhost",
];

const extra = process.env.BETTER_AUTH_TRUSTED_ORIGINS;
const fromEnv = extra
  ? extra
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean)
  : [];

function issuerOrigin(raw?: string): string | null {
  if (!raw) return null;
  try {
    const u = new URL(raw.trim());
    return u.origin;
  } catch {
    return null;
  }
}

const oktaIssuer = process.env.OKTA_ISSUER?.trim();
const oktaOrigin = issuerOrigin(oktaIssuer);

const trustedOrigins = Array.from(
  new Set([...defaultOrigins, ...fromEnv, ...(oktaOrigin ? [oktaOrigin] : [])]),
);

const baseURL = process.env.BETTER_AUTH_URL ?? "http://127.0.0.1:3000";

const socialProviders: Record<string, unknown> = {};
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  socialProviders.google = google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  });
}
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  socialProviders.github = github({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  });
}
if (process.env.APPLE_CLIENT_ID && process.env.APPLE_CLIENT_SECRET) {
  socialProviders.apple = apple({
    clientId: process.env.APPLE_CLIENT_ID,
    clientSecret: process.env.APPLE_CLIENT_SECRET,
    ...(process.env.APPLE_APP_BUNDLE_IDENTIFIER
      ? { appBundleIdentifier: process.env.APPLE_APP_BUNDLE_IDENTIFIER }
      : {}),
  });
}

const plugins: unknown[] = [];
if (
  process.env.OKTA_CLIENT_ID &&
  process.env.OKTA_CLIENT_SECRET &&
  oktaIssuer
) {
  plugins.push(
    genericOAuth({
      config: [
        okta({
          clientId: process.env.OKTA_CLIENT_ID,
          clientSecret: process.env.OKTA_CLIENT_SECRET,
          issuer: oktaIssuer,
        }),
      ],
    }),
  );
}

export const auth = betterAuth({
  appName: "Trackr",
  baseURL,
  basePath: "/api/auth",
  secret:
    secret ?? (localOnlyMode ? "00000000000000000000000000000000" : undefined),
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true, requireEmailVerification: false },
  trustedOrigins,
  socialProviders:
    Object.keys(socialProviders).length > 0 ? socialProviders : undefined,
  plugins: plugins.length > 0 ? plugins : undefined,
});

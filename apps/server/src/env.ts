/** Dev-only login (`POST /api/v1/auth/dev-login`) — allowed when not production or `ALLOW_DEV_AUTH=true`. */
export function isDevAuthAllowed(): boolean {
  return (
    process.env.ALLOW_DEV_AUTH === "true" ||
    process.env.NODE_ENV === "development"
  );
}

function toOrigin(value?: string): string | null {
  if (!value) {
    return null;
  }
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function isLocalOrigin(origin: string): boolean {
  if (origin === "tauri://localhost" || origin === "https://tauri.localhost") {
    return true;
  }
  try {
    const parsed = new URL(origin);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return false;
    }
    return (
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      parsed.hostname === "::1"
    );
  } catch {
    return false;
  }
}

/** True when no remote auth/base origin is configured and runtime is not production. */
export function isLocalOnlyMode(): boolean {
  if (process.env.NODE_ENV === "production") {
    return false;
  }
  const fromTrusted = process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") ?? [];
  const configuredOrigins = [
    toOrigin(process.env.BETTER_AUTH_URL),
    ...fromTrusted.map((origin) => toOrigin(origin.trim())),
  ].filter((o): o is string => Boolean(o));
  return (
    configuredOrigins.length > 0 &&
    configuredOrigins.every((origin) => isLocalOrigin(origin))
  );
}

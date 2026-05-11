import { createHmac, timingSafeEqual } from "node:crypto";

import { isLocalOnlyMode } from "../env";

export enum ClientPlatform {
  DESKTOP = "desktop",
  WEB = "web",
  UNKNOWN = "unknown",
}

const DESKTOP_PLATFORM_HEADER = "x-trackr-client-platform";
const DESKTOP_TS_HEADER = "x-trackr-client-ts";
const DESKTOP_SIGNATURE_HEADER = "x-trackr-client-signature";
const DESKTOP_LABEL = "desktop";
const MAX_CLOCK_SKEW_SECONDS = 120;

/** Normalize origin to remove any path/query params. *
 * @param value - The origin to normalize.
 * @returns The normalized origin.
 */
function normalizeOrigin(value: string | null): string | null {
  if (!value) {
    return null;
  }
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

/** Check if the origin is a Tauri origin.
 * @param origin - The origin to check.
 * @returns True if the origin is a Tauri origin, false otherwise.
 */
function isTauriOrigin(origin: string | null): boolean {
  return origin === "tauri://localhost" || origin === "https://tauri.localhost";
}

/** Generate the expected desktop signature.
 * @param req - The request.
 * @param ts - The timestamp.
 * @param secret - The secret.
 * @returns The expected desktop signature.
 */
function expectedDesktopSignature(
  req: Request,
  ts: string,
  secret: string,
): string {
  const url = new URL(req.url);
  const payload = `${ts}.${req.method.toUpperCase()}.${url.pathname}`;
  return createHmac("sha256", secret).update(payload).digest("hex");
}

/** Compare two hexadecimal strings in constant time.
 * @param a - The first hexadecimal string.
 * @param b - The second hexadecimal string.
 * @returns True if the strings are equal, false otherwise.
 */
function safeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  const aBuf = Buffer.from(a, "hex");
  const bBuf = Buffer.from(b, "hex");
  if (aBuf.length !== bBuf.length || aBuf.length === 0) {
    return false;
  }
  return timingSafeEqual(aBuf, bBuf);
}

/** Cryptographically verify desktop identity using TRACKR_CLIENT_PLATFORM_SECRET.
 * @param req - The request.
 * @returns True if the request is a verified desktop request, false otherwise.
 */
export function isVerifiedDesktopRequest(req: Request): boolean {
  const secret = process.env.TRACKR_CLIENT_PLATFORM_SECRET;
  if (!secret || secret.length < 32) {
    return false;
  }

  const platform = req.headers.get(DESKTOP_PLATFORM_HEADER);
  const tsRaw = req.headers.get(DESKTOP_TS_HEADER);
  const signature = req.headers.get(DESKTOP_SIGNATURE_HEADER);
  if (platform !== DESKTOP_LABEL || !tsRaw || !signature) {
    return false;
  }

  const ts = Number(tsRaw);
  if (!Number.isFinite(ts)) {
    return false;
  }
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - ts) > MAX_CLOCK_SKEW_SECONDS) {
    return false;
  }

  const expected = expectedDesktopSignature(req, tsRaw, secret);
  return safeEqualHex(signature.toLowerCase(), expected);
}

/**
 * Classify request platform. For high-trust checks, use isVerifiedDesktopRequest().
 * In local-only mode we allow tauri-origin inference as a pragmatic fallback.
 * @param req - The request.
 * @returns The client platform.
 */
export function getClientPlatform(req: Request): ClientPlatform {
  if (isVerifiedDesktopRequest(req)) {
    return ClientPlatform.DESKTOP;
  }

  const origin = normalizeOrigin(req.headers.get("origin"));
  const referer = normalizeOrigin(req.headers.get("referer"));
  const candidate = origin ?? referer;
  if (candidate == null) {
    return ClientPlatform.UNKNOWN;
  }

  if (isTauriOrigin(candidate) && isLocalOnlyMode()) {
    return ClientPlatform.DESKTOP;
  }
  if (candidate.startsWith("http://") || candidate.startsWith("https://")) {
    return ClientPlatform.WEB;
  }
  return ClientPlatform.UNKNOWN;
}

/**
 * High-confidence desktop check. In local-only mode, tauri origin fallback is allowed.
 * @param req - The request.
 * @returns True if the request is a trusted desktop request, false otherwise.
 */
export function isTrustedDesktopRequest(req: Request): boolean {
  return (
    isVerifiedDesktopRequest(req) ||
    (isLocalOnlyMode() && getClientPlatform(req) === ClientPlatform.DESKTOP)
  );
}

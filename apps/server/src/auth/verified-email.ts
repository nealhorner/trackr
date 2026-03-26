import { ApiError } from "../lib/api";
import type { ServerConnectedIdentity } from "./types";

/**
 * Server-connected mode requires a verified email (product rule).
 */
export function requireVerifiedEmailForServerMode(
  identity: ServerConnectedIdentity,
): void {
  if (!identity.emailVerified) {
    throw new ApiError(
      "email_not_verified",
      403,
      "Email must be verified to use server-connected mode.",
    );
  }
}

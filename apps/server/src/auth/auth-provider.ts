import type { ServerConnectedIdentity } from "./types";

/**
 * Pluggable auth adapter (email/password, OAuth, SSO). Implementations belong in Phase 1+.
 */
export interface AuthProvider {
  readonly name: string;

  /** Verify credentials or exchange a provider token; returns normalized identity or null. */
  authenticate(
    _input: Record<string, unknown>,
  ): Promise<ServerConnectedIdentity | null>;
}

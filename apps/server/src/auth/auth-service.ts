import type { AuthProvider } from "./auth-provider";
import type { ServerConnectedIdentity } from "./types";
import { requireVerifiedEmailForServerMode } from "./verified-email";

/**
 * Core auth orchestration (provider-agnostic). Phase 1 wires real providers and persistence.
 */
export class AuthService {
  constructor(private readonly _providers: AuthProvider[]) {}

  get providers(): readonly AuthProvider[] {
    return this._providers;
  }

  /**
   * After a successful provider authentication, enforce server-connected policies.
   */
  assertServerConnectedAccess(identity: ServerConnectedIdentity): void {
    requireVerifiedEmailForServerMode(identity);
  }
}

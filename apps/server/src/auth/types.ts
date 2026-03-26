/**
 * Provider-agnostic identity signals (Phase 0 stubs).
 */

export type TenantScopedUserId = {
  tenantId: number;
  userId: number;
};

/** Normalized identity after any adapter (email/password, OAuth, SSO). */
export type ServerConnectedIdentity = TenantScopedUserId & {
  email: string;
  /** True when the user may use server-connected mode (OAuth email_verified or verified email/password). */
  emailVerified: boolean;
};

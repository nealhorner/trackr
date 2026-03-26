import type { ServerConnectedIdentity } from "./types";

/**
 * Merge/link accounts when verified email matches within the **same tenant** only.
 * Never merge across tenants. Phase 1 will persist and audit.
 */
export function shouldMergeIdentitiesWithinTenant(
  _existing: ServerConnectedIdentity,
  _incoming: ServerConnectedIdentity,
): boolean {
  throw new Error("not implemented: shouldMergeIdentitiesWithinTenant");
}

/**
 * Explicit guard: cross-tenant merge is forbidden even if emails match.
 */
export function assertSameTenantForLinking(
  a: { tenantId: number },
  b: { tenantId: number },
): void {
  if (a.tenantId !== b.tenantId) {
    throw new Error("cross_tenant_identity_link_forbidden");
  }
}

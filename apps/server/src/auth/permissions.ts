/**
 * Canonical permission keys (free strings in DB; validated on write per Phase 0 decision).
 * Unknown keys at evaluation time are treated as not granted.
 */
export const PERMISSION_KEYS = [
  "project.read",
  "project.write",
  "project.admin",
  "ticket.read",
  "ticket.write",
  "ticket.comment",
  "board.transition_ticket",
  "org.metadata",
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export function isKnownPermissionKey(key: string): key is PermissionKey {
  return (PERMISSION_KEYS as readonly string[]).includes(key);
}

/**
 * Additive-only: effective permissions = union of grant strings (deduped).
 */
export function evaluatePermissionsUnion(
  grants: readonly string[],
): Set<string> {
  const effective = new Set<string>();
  for (const g of grants) {
    if (isKnownPermissionKey(g)) {
      effective.add(g);
    }
  }
  return effective;
}

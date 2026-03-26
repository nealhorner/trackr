export type { AuthProvider } from "./auth-provider";
export { AuthService } from "./auth-service";
export {
  assertSameTenantForLinking,
  shouldMergeIdentitiesWithinTenant,
} from "./linking";
export {
  evaluatePermissionsUnion,
  isKnownPermissionKey,
  PERMISSION_KEYS,
} from "./permissions";
export type { PermissionKey } from "./permissions";
export type { ServerConnectedIdentity, TenantScopedUserId } from "./types";
export { requireVerifiedEmailForServerMode } from "./verified-email";
export { toLimitedTicketView } from "./limited-ticket-view";

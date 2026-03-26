import { describe, expect, it } from "vitest";

import {
  assertSameTenantForLinking,
  evaluatePermissionsUnion,
  isKnownPermissionKey,
  requireVerifiedEmailForServerMode,
} from "../auth";

describe("permissions", () => {
  it("accepts known keys only in union", () => {
    expect(isKnownPermissionKey("ticket.read")).toBe(true);
    expect(isKnownPermissionKey("unknown.key")).toBe(false);
    const set = evaluatePermissionsUnion([
      "ticket.read",
      "unknown.key",
      "ticket.read",
    ]);
    expect([...set].sort()).toEqual(["ticket.read"]);
  });
});

describe("verified email", () => {
  it("throws when email not verified", () => {
    expect(() =>
      requireVerifiedEmailForServerMode({
        tenantId: 1,
        userId: 1,
        email: "a@b.com",
        emailVerified: false,
      }),
    ).toThrow();
  });

  it("passes when verified", () => {
    expect(() =>
      requireVerifiedEmailForServerMode({
        tenantId: 1,
        userId: 1,
        email: "a@b.com",
        emailVerified: true,
      }),
    ).not.toThrow();
  });
});

describe("tenant linking guard", () => {
  it("throws on cross-tenant", () => {
    expect(() =>
      assertSameTenantForLinking({ tenantId: 1 }, { tenantId: 2 }),
    ).toThrow("cross_tenant");
  });
});

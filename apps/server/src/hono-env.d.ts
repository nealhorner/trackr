import "hono";

declare module "hono" {
  interface ContextVariableMap {
    authUser: {
      id: number;
      tenantId: number;
      email: string;
      isTenantAdmin: boolean;
    } | null;
  }
}

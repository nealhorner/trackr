/** Dev-only login (`POST /api/v1/auth/dev-login`) — allowed when not production or `ALLOW_DEV_AUTH=true`. */
export function isDevAuthAllowed(): boolean {
  return (
    process.env.ALLOW_DEV_AUTH === "true" || process.env.NODE_ENV !== "production"
  );
}

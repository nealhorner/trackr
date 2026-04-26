import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export class ApiError extends Error {
  readonly name = "ApiError";

  constructor(
    public readonly code: string,
    public readonly status: ContentfulStatusCode,
    message: string,
  ) {
    super(message);
  }
}

export function jsonOk<T>(
  c: Context,
  data: T,
  status: ContentfulStatusCode = 200,
) {
  return c.json({ data }, status);
}

export function jsonError(
  c: Context,
  code: string,
  message: string,
  status: ContentfulStatusCode,
) {
  return c.json({ error: code, message }, status);
}

export function jsonFromUnknown(c: Context, err: unknown) {
  if (err instanceof ApiError) {
    return jsonError(c, err.code, err.message, err.status);
  }
  const message =
    err instanceof Error ? err.message : "An unexpected error occurred";
  return jsonError(c, "internal_error", message, 500);
}

import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

/**
 * Standard JSON error body for `/api/v1/*` (and consistent errors elsewhere).
 */
export type ApiErrorBody = {
  error: string;
  message: string;
  requestId?: string;
};

/**
 * Standard JSON success envelope for `/api/v1/*`.
 */
export type ApiOkBody<T> = {
  data: T;
};

export class ApiError extends Error {
  readonly name = "ApiError";

  constructor(
    /** Machine-readable code, e.g. `not_found`, `validation_error` */
    public readonly code: string,
    /** HTTP status */
    public readonly status: ContentfulStatusCode,
    message: string,
    public readonly requestId?: string,
  ) {
    super(message);
  }
}

export function getRequestId(c: Context): string | undefined {
  return c.req.header("x-request-id") ?? undefined;
}

/** Success response for versioned API routes. */
export function jsonOk<T>(
  c: Context,
  data: T,
  status: ContentfulStatusCode = 200,
) {
  const body: ApiOkBody<T> = { data };
  return c.json(body, status);
}

/** Error response using {@link ApiErrorBody} shape. */
export function jsonError(
  c: Context,
  code: string,
  message: string,
  status: ContentfulStatusCode,
  requestId?: string,
) {
  const body: ApiErrorBody = { error: code, message, requestId };
  return c.json(body, status);
}

/** Map {@link ApiError} to JSON. */
export function jsonFromApiError(c: Context, err: ApiError) {
  return jsonError(c, err.code, err.message, err.status, err.requestId);
}

/** Map unknown errors to a safe JSON response (no stack in body). */
export function jsonFromUnknown(c: Context, err: unknown, requestId?: string) {
  if (err instanceof ApiError) {
    return jsonFromApiError(c, err);
  }
  const message =
    err instanceof Error ? err.message : "An unexpected error occurred";
  return jsonError(c, "internal_error", message, 500, requestId);
}

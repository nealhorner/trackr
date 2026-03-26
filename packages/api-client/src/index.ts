import type { ApiError } from "@trackr/types";

export type { ApiError };

// Placeholder typed API client. This will be expanded in Phase 1.
export async function getHealth(_baseUrl: string): Promise<{ status: string }> {
  throw new Error("not implemented");
}

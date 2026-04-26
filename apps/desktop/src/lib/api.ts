import { invoke } from "@tauri-apps/api/core";

let baseUrlCache: string | null = null;

export async function apiBaseUrl(): Promise<string> {
  if (baseUrlCache) return baseUrlCache;
  const url = await invoke<string>("start_local_api");
  baseUrlCache = url;
  return url;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const base = await apiBaseUrl();
  const response = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const body = (await response.json()) as {
    data?: T;
    error?: string;
    message?: string;
  };
  if (!response.ok || body.data === undefined) {
    throw new Error(body.message ?? "Request failed");
  }
  return body.data;
}

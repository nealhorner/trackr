import { invoke } from "@tauri-apps/api/core";

import type { DesktopConfig } from "./desktopConfig";

let baseUrlCache: string | null = null;
let configCache: DesktopConfig | null = null;

function useE2EInvokeHook(): boolean {
  return (
    import.meta.env.VITE_DESKTOP_E2E === "true" && typeof window !== "undefined"
  );
}

async function tauriInvoke<T>(
  cmd: string,
  args?: Record<string, unknown>,
): Promise<T> {
  if (useE2EInvokeHook()) {
    const hook = (
      window as unknown as {
        __trackrDesktopE2EInvoke__?: (
          command: string,
          payload?: Record<string, unknown>,
        ) => Promise<unknown>;
      }
    ).__trackrDesktopE2EInvoke__;
    if (hook) {
      return hook(cmd, args) as Promise<T>;
    }
  }
  return invoke<T>(cmd, args as never);
}

export function clearApiCaches() {
  baseUrlCache = null;
  configCache = null;
}

export async function getDesktopConfig(): Promise<DesktopConfig> {
  if (configCache) return configCache;
  const c = await tauriInvoke<DesktopConfig>("get_desktop_config");
  configCache = c;
  return c;
}

export async function setDesktopConfig(config: DesktopConfig): Promise<void> {
  await tauriInvoke("set_desktop_config", { config });
  clearApiCaches();
}

export async function apiBaseUrl(): Promise<string> {
  if (baseUrlCache) return baseUrlCache;
  const cfg = await getDesktopConfig();
  if (cfg.mode === "remote") {
    const u = cfg.remoteBaseUrl?.replace(/\/$/, "");
    if (!u) {
      throw new Error("Remote server URL is not configured");
    }
    baseUrlCache = u;
    return u;
  }
  if (cfg.mode === "unset") {
    throw new Error("Choose local or remote mode on the home screen first");
  }
  const url = await tauriInvoke<string>("start_local_api");
  baseUrlCache = url;
  return url;
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const cfg = await getDesktopConfig();
  const base = await apiBaseUrl();
  const credentials: RequestCredentials =
    cfg.mode === "remote" ? "include" : "same-origin";
  const response = await fetch(`${base}${path}`, {
    ...init,
    credentials,
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

export async function openRemoteLoginWindow(baseUrl: string): Promise<void> {
  await tauriInvoke("open_remote_login_window", { baseUrl });
}

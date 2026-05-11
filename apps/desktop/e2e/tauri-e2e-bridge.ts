import type { Page } from "@playwright/test";

export type TauriE2EBridgeOptions = {
  /**
   * Mocked `start_local_api` return value. In e2e we point at the dev Postgres API so the
   * local-mode UI can load without spawning the real Tauri sidecar.
   */
  mockLocalApiBaseUrl?: string;
};

/**
 * Installs `window.__trackrDesktopE2EInvoke__` before navigation. Requires
 * `VITE_DESKTOP_E2E=true` (see Playwright webServer).
 */
export async function installTauriE2EBridge(
  page: Page,
  options: TauriE2EBridgeOptions = {},
): Promise<void> {
  const localApiUrl = options.mockLocalApiBaseUrl ?? "http://127.0.0.1:3000";

  await page.addInitScript(
    ({ localApiUrl: base }: { localApiUrl: string }) => {
      type Cfg = {
        version: number;
        mode: "unset" | "local" | "remote";
        remoteBaseUrl: string | null;
        localDisplayName: string | null;
      };

      const initial: Cfg = {
        version: 1,
        mode: "unset",
        remoteBaseUrl: null,
        localDisplayName: null,
      };

      let cfg: Cfg = { ...initial };

      (
        window as unknown as {
          __trackrDesktopE2EInvoke__?: (
            command: string,
            payload?: Record<string, unknown>,
          ) => Promise<unknown>;
        }
      ).__trackrDesktopE2EInvoke__ = async (
        command: string,
        payload?: Record<string, unknown>,
      ) => {
        switch (command) {
          case "get_desktop_config":
            return { ...cfg };
          case "set_desktop_config": {
            const next = (payload?.config ?? {}) as Partial<Cfg>;
            cfg = {
              version: typeof next.version === "number" ? next.version : 1,
              mode: next.mode ?? "unset",
              remoteBaseUrl:
                next.remoteBaseUrl !== undefined ? next.remoteBaseUrl : null,
              localDisplayName:
                next.localDisplayName !== undefined
                  ? next.localDisplayName
                  : null,
            };
            if (cfg.mode === "local" && !cfg.localDisplayName) {
              cfg.localDisplayName = "e2e-local-workspace";
            }
            return;
          }
          case "start_local_api":
            return base;
          case "open_remote_login_window":
            return;
          case "generate_local_display_name":
            return "e2e-local-workspace";
          default:
            throw new Error(`Unhandled desktop e2e invoke: ${command}`);
        }
      };
    },
    { localApiUrl },
  );
}

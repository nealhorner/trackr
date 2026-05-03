export type AppMode = "unset" | "local" | "remote";

export type DesktopConfig = {
  version: number;
  mode: AppMode;
  remoteBaseUrl?: string | null;
  localDisplayName?: string | null;
};

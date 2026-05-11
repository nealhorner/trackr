import { readFileSync, existsSync } from "node:fs";

import { z } from "zod";

const instanceConfigSchema = z.object({
  tenantName: z.string().min(1).max(200).optional(),
  adminEmail: z.string().email().optional(),
  /// Optional hint for the setup wizard; password is not stored in config in production.
  hasAdminPassword: z.boolean().optional(),
  authSettings: z
    .object({
      password: z.boolean().optional(),
      google: z.boolean().optional(),
      apple: z.boolean().optional(),
      github: z.boolean().optional(),
      okta: z.boolean().optional(),
    })
    .optional(),
});

export type InstanceConfigFile = z.infer<typeof instanceConfigSchema>;

/**
 * When `TRACKR_CONFIG_PATH` points to a JSON file, operators can pre-fill the first-time setup
 * (tenant name, auth method toggles). Secrets must still come from env in production.
 */
export function loadInstanceConfigFile(): InstanceConfigFile | null {
  const p = process.env.TRACKR_CONFIG_PATH;
  if (!p) return null;
  if (!existsSync(p)) {
    return null;
  }
  const raw = readFileSync(p, "utf8");
  const j = JSON.parse(raw) as unknown;
  return instanceConfigSchema.parse(j);
}

/**
 * If set, the POST /api/v1/setup/complete endpoint requires this value in `X-Trackr-Setup-Token`.
 */
export function getSetupTokenFromEnv(): string | undefined {
  return process.env.TRACKR_SETUP_SECRET;
}

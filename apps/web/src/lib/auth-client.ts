import { genericOAuthClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/client";

/** Same origin in dev: Vite proxies /api to Trackr server (see vite.config). */
export const authClient = createAuthClient({
  baseURL: "",
  plugins: [genericOAuthClient()],
});

import { redirect } from "@sveltejs/kit";

import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ fetch, url }) => {
  if (url.pathname === "/login") {
    return {};
  }
  const r = await fetch("/api/v1/me");
  if (r.status === 401) {
    throw redirect(302, "/login");
  }
  return {};
};

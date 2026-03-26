import { error } from "@sveltejs/kit";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params }) => {
  const r = await fetch(`/api/v1/projects/${params.id}`);
  if (r.status === 404) throw error(404, "Project not found");
  if (!r.ok) throw error(r.status, "Failed to load project");
  const j = (await r.json()) as {
    data: {
      project: { id: number; name: string; organizationId: number; createdAt: string };
    };
  };
  return { project: j.data.project };
};

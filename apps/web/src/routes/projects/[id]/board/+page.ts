import { error } from "@sveltejs/kit";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params }) => {
  const r = await fetch(`/api/v1/projects/${params.id}/board`);
  if (r.status === 404) throw error(404, "Board not found");
  if (!r.ok) throw error(r.status, "Failed to load board");
  const j = (await r.json()) as {
    data: {
      board: {
        id: number;
        projectId: number;
        columns: Array<{ id: number; key: string; name: string; position: number }>;
      };
      tickets: Array<{
        id: number;
        title: string;
        status: string;
        boardColumnId: number | null;
      }>;
    };
  };
  return j.data;
};

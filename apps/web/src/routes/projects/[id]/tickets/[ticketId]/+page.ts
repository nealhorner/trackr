import { error } from "@sveltejs/kit";

import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ fetch, params }) => {
  const [ticketRes, commentsRes] = await Promise.all([
    fetch(`/api/v1/tickets/${params.ticketId}`),
    fetch(`/api/v1/tickets/${params.ticketId}/comments`),
  ]);

  if (ticketRes.status === 404) throw error(404, "Ticket not found");
  if (!ticketRes.ok) throw error(ticketRes.status, "Failed to load ticket");
  if (!commentsRes.ok) throw error(commentsRes.status, "Failed to load comments");

  const ticketJson = (await ticketRes.json()) as {
    data: {
      ticket: {
        id: number;
        projectId: number;
        title: string;
        descriptionMarkdown: string | null;
        status: string;
        createdAt: string;
        updatedAt: string;
      };
    };
  };

  const commentsJson = (await commentsRes.json()) as {
    data: {
      comments: Array<{
        id: number;
        body: string;
        createdAt: string;
        author: { id: number; email: string };
      }>;
    };
  };

  return {
    ticket: ticketJson.data.ticket,
    comments: commentsJson.data.comments,
  };
};

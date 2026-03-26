import type { TicketFull, TicketLimited } from "@trackr/types";

/** Phase 0 stub: shape a ticket for users without full project access. */
export function toLimitedTicketView(
  ticket: Pick<TicketFull, "id" | "title" | "descriptionMarkdown" | "status">,
  ownAttachmentIds: number[] = [],
): TicketLimited {
  return {
    kind: "limited",
    id: ticket.id,
    title: ticket.title,
    descriptionMarkdown: ticket.descriptionMarkdown,
    status: ticket.status,
    ownAttachmentIds,
  };
}

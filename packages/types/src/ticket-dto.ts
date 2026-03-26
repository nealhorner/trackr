/**
 * Ticket DTO shapes for permission-aware responses (Phase 0 contract).
 * Full content is only returned when the caller has project/ticket content access.
 */

export type TicketLimited = {
  kind: "limited";
  id: number;
  title: string;
  descriptionMarkdown: string | null;
  status: string;
  /** IDs of attachments uploaded by the current user only (Phase 1). */
  ownAttachmentIds: number[];
};

export type TicketFull = {
  kind: "full";
  id: number;
  title: string;
  descriptionMarkdown: string | null;
  status: string;
  projectId: number;
  // Phase 1: comments, all attachments, assignee, etc.
};

export type TicketView = TicketLimited | TicketFull;

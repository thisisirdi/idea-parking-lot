export const IDEA_STATUSES = [
  "INBOX",
  "PARKED",
  "EXPLORING",
  "IN_PROGRESS",
  "SHIPPED",
  "ARCHIVED"
] as const;

export type IdeaStatus = (typeof IDEA_STATUSES)[number];

export const IDEA_STATUS_LABELS: Record<IdeaStatus, string> = {
  INBOX: "Inbox",
  PARKED: "Parked",
  EXPLORING: "Exploring",
  IN_PROGRESS: "In progress",
  SHIPPED: "Shipped",
  ARCHIVED: "Archived"
};


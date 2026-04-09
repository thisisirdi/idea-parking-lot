import { ConflictError } from "@/src/lib/errors";

import type { IdeaStatus } from "./idea-status";

export const allowedIdeaStatusTransitions: Record<IdeaStatus, IdeaStatus[]> = {
  INBOX: ["PARKED", "EXPLORING", "ARCHIVED"],
  PARKED: ["INBOX", "EXPLORING", "ARCHIVED"],
  EXPLORING: ["INBOX", "PARKED", "IN_PROGRESS", "ARCHIVED"],
  IN_PROGRESS: ["EXPLORING", "SHIPPED", "ARCHIVED"],
  SHIPPED: ["EXPLORING", "ARCHIVED"],
  ARCHIVED: ["INBOX", "PARKED", "EXPLORING"]
};

export function canTransitionStatus(from: IdeaStatus, to: IdeaStatus): boolean {
  if (from === to) {
    return true;
  }

  return allowedIdeaStatusTransitions[from].includes(to);
}

export function assertValidStatusTransition(from: IdeaStatus, to: IdeaStatus): void {
  if (!canTransitionStatus(from, to)) {
    throw new ConflictError(`Cannot move an idea from ${from} to ${to}.`);
  }
}


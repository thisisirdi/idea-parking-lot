"use client";

import { IDEA_STATUSES, IDEA_STATUS_LABELS, type IdeaStatus } from "@/src/domain/idea/idea-status";
import { canTransitionStatus } from "@/src/domain/idea/idea-status.rules";

type StatusSelectorProps = {
  currentStatus: IdeaStatus;
  onChange: (status: IdeaStatus) => void;
  disabled?: boolean;
};

export function StatusSelector({
  currentStatus,
  onChange,
  disabled = false
}: StatusSelectorProps) {
  return (
    <label className="field">
      <span>Status</span>
      <select
        value={currentStatus}
        onChange={(event) => onChange(event.target.value as IdeaStatus)}
        disabled={disabled}
      >
        {IDEA_STATUSES.map((status) => {
          const isAllowed = canTransitionStatus(currentStatus, status);

          return (
            <option key={status} value={status} disabled={!isAllowed && status !== currentStatus}>
              {IDEA_STATUS_LABELS[status]}
            </option>
          );
        })}
      </select>
    </label>
  );
}

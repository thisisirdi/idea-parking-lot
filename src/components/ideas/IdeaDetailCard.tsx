"use client";

import { useState } from "react";

import { IDEA_STATUS_LABELS } from "@/src/domain/idea/idea-status";
import { calculateRiceScore } from "@/src/domain/idea/rice";
import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  IdeaDto
} from "@/src/interfaces/api/idea.dto";
import { formatIdeaDate } from "@/src/lib/format";

import { RiceEditor } from "./RiceEditor";
import { RiceScoreBadge } from "./RiceScoreBadge";
import { StatusSelector } from "./StatusSelector";

type IdeaDetailCardProps = {
  initialIdea: IdeaDto;
};

type DraftState = {
  title: string;
  description: string;
  riceReach: number | null;
  riceImpact: number | null;
  riceConfidence: number | null;
  riceEffort: number | null;
};

function toDraftState(idea: IdeaDto): DraftState {
  return {
    title: idea.title,
    description: idea.description ?? "",
    riceReach: idea.riceReach,
    riceImpact: idea.riceImpact,
    riceConfidence: idea.riceConfidence,
    riceEffort: idea.riceEffort
  };
}

export function IdeaDetailCard({ initialIdea }: IdeaDetailCardProps) {
  const [idea, setIdea] = useState(initialIdea);
  const [draft, setDraft] = useState<DraftState>(() => toDraftState(initialIdea));
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingStatus, setIsChangingStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const previewScore = calculateRiceScore({
    reach: draft.riceReach,
    impact: draft.riceImpact,
    confidence: draft.riceConfidence,
    effort: draft.riceEffort
  });

  async function handleSave() {
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/ideas/${idea.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: draft.title,
          description: draft.description,
          riceReach: draft.riceReach,
          riceImpact: draft.riceImpact,
          riceConfidence: draft.riceConfidence,
          riceEffort: draft.riceEffort
        })
      });

      if (!response.ok) {
        const payload = (await response.json()) as ApiErrorResponse;
        setErrorMessage(payload.error.message);
        return;
      }

      const payload = (await response.json()) as ApiSuccessResponse<IdeaDto>;
      setIdea(payload.data);
      setDraft(toDraftState(payload.data));
      setSuccessMessage("Saved. The idea has a slightly sharper shape now.");
    } catch {
      setErrorMessage("Save failed. The idea is still here, but the update did not land.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleStatusChange(nextStatus: IdeaDto["status"]) {
    if (nextStatus === idea.status) {
      return;
    }

    setIsChangingStatus(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`/api/ideas/${idea.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          status: nextStatus
        })
      });

      if (!response.ok) {
        const payload = (await response.json()) as ApiErrorResponse;
        setErrorMessage(payload.error.message);
        return;
      }

      const payload = (await response.json()) as ApiSuccessResponse<IdeaDto>;
      setIdea(payload.data);
      setSuccessMessage("Status updated.");
    } catch {
      setErrorMessage("Status update failed. The backend kept the current state.");
    } finally {
      setIsChangingStatus(false);
    }
  }

  return (
    <section className="card stack-lg">
      <div className="detail-header">
        <div className="stack-xs">
          <p className="eyebrow">Idea detail</p>
          <div className="idea-list-badges">
            <span className={`badge badge-status badge-status-${idea.status.toLowerCase()}`}>
              {IDEA_STATUS_LABELS[idea.status]}
            </span>
            <RiceScoreBadge score={idea.riceScore} />
          </div>
        </div>
        <StatusSelector
          currentStatus={idea.status}
          onChange={handleStatusChange}
          disabled={isChangingStatus}
        />
      </div>

      <div className="stack-md">
        <label className="field">
          <span>Title</span>
          <input
            type="text"
            value={draft.title}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                title: event.target.value
              }))
            }
            maxLength={160}
          />
        </label>

        <label className="field">
          <span>Description</span>
          <textarea
            rows={6}
            value={draft.description}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                description: event.target.value
              }))
            }
            placeholder="Why this might matter, what sparked it, what future you should remember."
          />
        </label>

        <RiceEditor
          value={{
            riceReach: draft.riceReach,
            riceImpact: draft.riceImpact,
            riceConfidence: draft.riceConfidence,
            riceEffort: draft.riceEffort
          }}
          onChange={(value) =>
            setDraft((current) => ({
              ...current,
              ...value
            }))
          }
          defaultOpen={[draft.riceReach, draft.riceImpact, draft.riceConfidence, draft.riceEffort].some(
            (value) => value !== null
          )}
          helperText="Client preview is for speed. The server still owns the real score."
        />

        <div className="detail-meta">
          <p>Preview score: {previewScore === null ? "Not enough data yet." : previewScore.toFixed(2)}</p>
          <p>Created {formatIdeaDate(idea.createdAt, true)}</p>
          <p>Updated {formatIdeaDate(idea.updatedAt, true)}</p>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="primary-button" onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save changes"}
        </button>
      </div>

      {errorMessage ? <p className="form-message form-message-error">{errorMessage}</p> : null}
      {successMessage ? <p className="form-message form-message-success">{successMessage}</p> : null}
    </section>
  );
}

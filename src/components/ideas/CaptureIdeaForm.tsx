"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type {
  ApiErrorResponse,
  ApiSuccessResponse,
  IdeaDto
} from "@/src/interfaces/api/idea.dto";

import { RiceEditor } from "./RiceEditor";

type CaptureIdeaState = {
  title: string;
  description: string;
  riceReach: number | null;
  riceImpact: number | null;
  riceConfidence: number | null;
  riceEffort: number | null;
};

const initialState: CaptureIdeaState = {
  title: "",
  description: "",
  riceReach: null,
  riceImpact: null,
  riceConfidence: null,
  riceEffort: null
};

export function CaptureIdeaForm() {
  const router = useRouter();
  const titleRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [formState, setFormState] = useState<CaptureIdeaState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: formState.title,
          description: formState.description,
          riceReach: formState.riceReach,
          riceImpact: formState.riceImpact,
          riceConfidence: formState.riceConfidence,
          riceEffort: formState.riceEffort
        })
      });

      if (!response.ok) {
        const payload = (await response.json()) as ApiErrorResponse;
        setErrorMessage(payload.error.message);
        return;
      }

      await (response.json() as Promise<ApiSuccessResponse<IdeaDto>>);

      setFormState(initialState);
      setSuccessMessage("Parked. Future you now has a breadcrumb.");
      router.refresh();
      titleRef.current?.focus();
    } catch {
      setErrorMessage("Could not park that idea right now. Try again in a sec.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="card stack-md">
      <div className="stack-xs">
        <h2>Quick capture</h2>
        <p className="muted-copy">One sacred field. Everything else is optional seasoning.</p>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="stack-md">
        <div className="capture-row">
          <label className="field capture-title-field">
            <span>Title</span>
            <input
              ref={titleRef}
              autoFocus
              type="text"
              value={formState.title}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  title: event.target.value
                }))
              }
              placeholder="A tiny future obsession"
              required
              maxLength={160}
            />
          </label>

          <button type="submit" className="primary-button capture-submit" disabled={isSubmitting}>
            {isSubmitting ? "Parking..." : "Park it"}
          </button>
        </div>

        <label className="field">
          <span>Description</span>
          <textarea
            rows={4}
            value={formState.description}
            onChange={(event) =>
              setFormState((current) => ({
                ...current,
                description: event.target.value
              }))
            }
            onKeyDown={(event) => {
              if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                formRef.current?.requestSubmit();
              }
            }}
            placeholder="Context, sketch, or leave it blank and keep moving."
          />
        </label>

        <RiceEditor
          value={{
            riceReach: formState.riceReach,
            riceImpact: formState.riceImpact,
            riceConfidence: formState.riceConfidence,
            riceEffort: formState.riceEffort
          }}
          onChange={(value) =>
            setFormState((current) => ({
              ...current,
              ...value
            }))
          }
          title="Optional RICE"
        />

        <div className="form-actions">
          <span className="muted-copy">
            Press Enter in the title to submit. Ctrl/Cmd + Enter works in notes.
          </span>
        </div>

        {errorMessage ? <p className="form-message form-message-error">{errorMessage}</p> : null}
        {successMessage ? <p className="form-message form-message-success">{successMessage}</p> : null}
      </form>
    </section>
  );
}

"use client";

import { useId, useState } from "react";

import { calculateRiceScore } from "@/src/domain/idea/rice";

type RiceFields = {
  riceReach: number | null;
  riceImpact: number | null;
  riceConfidence: number | null;
  riceEffort: number | null;
};

type RiceEditorProps = {
  value: RiceFields;
  onChange: (value: RiceFields) => void;
  defaultOpen?: boolean;
  title?: string;
  helperText?: string;
};

function toInputValue(value: number | null): string {
  return value === null ? "" : String(value);
}

export function RiceEditor({
  value,
  onChange,
  defaultOpen = false,
  title = "RICE inputs",
  helperText = "Optional. Helpful when the idea starts asking for a real seat at the table."
}: RiceEditorProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const scopeId = useId();
  const preview = calculateRiceScore({
    reach: value.riceReach,
    impact: value.riceImpact,
    confidence: value.riceConfidence,
    effort: value.riceEffort
  });

  function updateField(field: keyof RiceFields, nextValue: string) {
    onChange({
      ...value,
      [field]: nextValue === "" ? null : Number(nextValue)
    });
  }

  return (
    <div className="rice-editor">
      <button
        type="button"
        className="ghost-button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        aria-controls={scopeId}
      >
        {isOpen ? "Hide RICE" : "Add RICE"}
      </button>

      {isOpen ? (
        <div className="rice-panel" id={scopeId}>
          <div className="stack-xs">
            <h3>{title}</h3>
            <p className="muted-copy">{helperText}</p>
          </div>

          <div className="rice-grid">
            <label className="field">
              <span>Reach</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={toInputValue(value.riceReach)}
                onChange={(event) => updateField("riceReach", event.target.value)}
              />
            </label>

            <label className="field">
              <span>Impact</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={toInputValue(value.riceImpact)}
                onChange={(event) => updateField("riceImpact", event.target.value)}
              />
            </label>

            <label className="field">
              <span>Confidence</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={toInputValue(value.riceConfidence)}
                onChange={(event) => updateField("riceConfidence", event.target.value)}
              />
            </label>

            <label className="field">
              <span>Effort</span>
              <input
                type="number"
                inputMode="decimal"
                min="0.01"
                step="0.01"
                value={toInputValue(value.riceEffort)}
                onChange={(event) => updateField("riceEffort", event.target.value)}
              />
            </label>
          </div>

          <p className="muted-copy">
            Preview: {preview === null ? "Add all four values for a score." : preview.toFixed(2)}
          </p>
        </div>
      ) : null}
    </div>
  );
}


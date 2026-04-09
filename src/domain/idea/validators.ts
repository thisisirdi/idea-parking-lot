import { ValidationError } from "@/src/lib/errors";

export function validateIdeaTitle(title: string): string {
  const normalized = title.trim();

  if (!normalized) {
    throw new ValidationError("Title is required.");
  }

  if (normalized.length > 160) {
    throw new ValidationError("Title must be 160 characters or fewer.");
  }

  return normalized;
}

export function validateDescription(description?: string | null): string | null {
  if (description === null || description === undefined) {
    return null;
  }

  const normalized = description.trim();

  if (!normalized) {
    return null;
  }

  if (normalized.length > 5000) {
    throw new ValidationError("Description must be 5000 characters or fewer.");
  }

  return normalized;
}

export function validateOptionalRiceValue(
  label: string,
  value?: number | null,
  options?: { min?: number; greaterThan?: number }
): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (!Number.isFinite(value)) {
    throw new ValidationError(`${label} must be a valid number.`);
  }

  if (options?.min !== undefined && value < options.min) {
    throw new ValidationError(`${label} must be at least ${options.min}.`);
  }

  if (options?.greaterThan !== undefined && value <= options.greaterThan) {
    throw new ValidationError(`${label} must be greater than ${options.greaterThan}.`);
  }

  return value;
}

export interface RiceInput {
  reach?: number | null;
  impact?: number | null;
  confidence?: number | null;
  effort?: number | null;
}

export function calculateRiceScore(input: RiceInput): number | null {
  const values = [input.reach, input.impact, input.confidence, input.effort];

  if (values.some((value) => value === null || value === undefined)) {
    return null;
  }

  const [reach, impact, confidence, effort] = values as number[];

  if ([reach, impact, confidence, effort].some((value) => !Number.isFinite(value))) {
    return null;
  }

  if (reach < 0 || impact < 0 || confidence < 0 || effort <= 0) {
    return null;
  }

  const score = (reach * impact * confidence) / effort;

  return Number(score.toFixed(2));
}


import test from "node:test";
import assert from "node:assert/strict";

import { calculateRiceScore } from "@/src/domain/idea/rice";

test("calculateRiceScore returns a rounded score when all fields are valid", () => {
  const score = calculateRiceScore({
    reach: 24,
    impact: 2.5,
    confidence: 80,
    effort: 3
  });

  assert.equal(score, 1600);
});

test("calculateRiceScore returns null when any field is missing", () => {
  const score = calculateRiceScore({
    reach: 24,
    impact: 2.5,
    confidence: 80
  });

  assert.equal(score, null);
});

test("calculateRiceScore returns null when effort is zero or lower", () => {
  assert.equal(
    calculateRiceScore({
      reach: 10,
      impact: 2,
      confidence: 50,
      effort: 0
    }),
    null
  );

  assert.equal(
    calculateRiceScore({
      reach: 10,
      impact: 2,
      confidence: 50,
      effort: -2
    }),
    null
  );
});

test("calculateRiceScore rounds to two decimals", () => {
  const score = calculateRiceScore({
    reach: 11,
    impact: 2.3,
    confidence: 77,
    effort: 9
  });

  assert.equal(score, 216.46);
});

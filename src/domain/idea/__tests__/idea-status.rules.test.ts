import test from "node:test";
import assert from "node:assert/strict";

import {
  assertValidStatusTransition,
  canTransitionStatus
} from "@/src/domain/idea/idea-status.rules";
import { ConflictError } from "@/src/lib/errors";

test("canTransitionStatus allows valid status changes", () => {
  assert.equal(canTransitionStatus("INBOX", "EXPLORING"), true);
  assert.equal(canTransitionStatus("EXPLORING", "IN_PROGRESS"), true);
  assert.equal(canTransitionStatus("ARCHIVED", "INBOX"), true);
});

test("canTransitionStatus rejects invalid status changes", () => {
  assert.equal(canTransitionStatus("INBOX", "SHIPPED"), false);
  assert.equal(canTransitionStatus("PARKED", "SHIPPED"), false);
  assert.equal(canTransitionStatus("SHIPPED", "IN_PROGRESS"), false);
});

test("assertValidStatusTransition throws ConflictError on invalid change", () => {
  assert.throws(() => assertValidStatusTransition("INBOX", "SHIPPED"), ConflictError);
});


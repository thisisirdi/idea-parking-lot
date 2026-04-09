import { z } from "zod";

import { IDEA_STATUSES } from "@/src/domain/idea/idea-status";

const optionalStringSchema = z.preprocess((value) => {
  if (value === undefined || value === null) {
    return undefined;
  }

  if (typeof value !== "string") {
    return value;
  }

  return value.trim();
}, z.string().max(5000).optional());

const optionalNumberSchema = z.preprocess((value) => {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    return Number(value);
  }

  return value;
}, z.number().finite().optional());

export const ideaIdParamSchema = z.object({
  id: z.string().uuid()
});

export const createIdeaSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: optionalStringSchema,
  status: z.enum(IDEA_STATUSES).optional(),
  riceReach: optionalNumberSchema,
  riceImpact: optionalNumberSchema,
  riceConfidence: optionalNumberSchema,
  riceEffort: optionalNumberSchema
});

export const updateIdeaSchema = z
  .object({
    title: z.string().trim().min(1).max(160).optional(),
    description: optionalStringSchema.nullable().optional(),
    riceReach: optionalNumberSchema.nullable().optional(),
    riceImpact: optionalNumberSchema.nullable().optional(),
    riceConfidence: optionalNumberSchema.nullable().optional(),
    riceEffort: optionalNumberSchema.nullable().optional()
  })
  .refine((value) => Object.values(value).some((field) => field !== undefined), {
    message: "Provide at least one field to update."
  });

export const changeIdeaStatusSchema = z.object({
  status: z.enum(IDEA_STATUSES)
});

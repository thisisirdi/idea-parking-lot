import type { Idea as PrismaIdea, Prisma } from "@prisma/client";

import type { Idea } from "@/src/domain/idea/idea.types";

function decimalToNumber(value: Prisma.Decimal | null): number | null {
  if (value === null) {
    return null;
  }

  return value.toNumber();
}

export function mapPrismaIdeaToDomain(idea: PrismaIdea): Idea {
  return {
    id: idea.id,
    title: idea.title,
    description: idea.description,
    riceReach: decimalToNumber(idea.riceReach),
    riceImpact: decimalToNumber(idea.riceImpact),
    riceConfidence: decimalToNumber(idea.riceConfidence),
    riceEffort: decimalToNumber(idea.riceEffort),
    riceScore: decimalToNumber(idea.riceScore),
    status: idea.status,
    createdAt: idea.createdAt,
    updatedAt: idea.updatedAt
  };
}


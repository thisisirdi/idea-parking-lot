import type { IdeaStatus } from "@/src/domain/idea/idea-status";
import type { Idea } from "@/src/domain/idea/idea.types";

export interface IdeaDto {
  id: string;
  title: string;
  description: string | null;
  riceReach: number | null;
  riceImpact: number | null;
  riceConfidence: number | null;
  riceEffort: number | null;
  riceScore: number | null;
  status: IdeaStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ApiSuccessResponse<T> {
  data: T;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

export function toIdeaDto(idea: Idea): IdeaDto {
  return {
    ...idea,
    createdAt: idea.createdAt.toISOString(),
    updatedAt: idea.updatedAt.toISOString()
  };
}


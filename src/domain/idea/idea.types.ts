import type { IdeaStatus } from "./idea-status";

export interface Idea {
  id: string;
  title: string;
  description: string | null;
  riceReach: number | null;
  riceImpact: number | null;
  riceConfidence: number | null;
  riceEffort: number | null;
  riceScore: number | null;
  status: IdeaStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IdeaInput {
  title: string;
  description?: string | null;
  status?: IdeaStatus;
  riceReach?: number | null;
  riceImpact?: number | null;
  riceConfidence?: number | null;
  riceEffort?: number | null;
}

export interface IdeaUpdateInput {
  title?: string;
  description?: string | null;
  riceReach?: number | null;
  riceImpact?: number | null;
  riceConfidence?: number | null;
  riceEffort?: number | null;
}


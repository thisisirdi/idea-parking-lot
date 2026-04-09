import type { IdeaStatus } from "@/src/domain/idea/idea-status";
import type { Idea } from "@/src/domain/idea/idea.types";

export interface CreateIdeaRecord {
  title: string;
  description: string | null;
  riceReach: number | null;
  riceImpact: number | null;
  riceConfidence: number | null;
  riceEffort: number | null;
  riceScore: number | null;
  status: IdeaStatus;
}

export interface UpdateIdeaRecord {
  title?: string;
  description?: string | null;
  riceReach?: number | null;
  riceImpact?: number | null;
  riceConfidence?: number | null;
  riceEffort?: number | null;
  riceScore?: number | null;
}

export interface IdeaRepository {
  create(input: CreateIdeaRecord): Promise<Idea>;
  update(id: string, input: UpdateIdeaRecord): Promise<Idea>;
  findById(id: string): Promise<Idea | null>;
  listAll(): Promise<Idea[]>;
  changeStatus(id: string, status: IdeaStatus): Promise<Idea>;
}


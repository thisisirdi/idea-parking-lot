import test from "node:test";
import assert from "node:assert/strict";

import { ChangeIdeaStatusService } from "@/src/application/ideas/change-idea-status.service";
import type { IdeaStatus } from "@/src/domain/idea/idea-status";
import type { Idea } from "@/src/domain/idea/idea.types";
import type {
  CreateIdeaRecord,
  IdeaRepository,
  UpdateIdeaRecord
} from "@/src/infrastructure/repositories/idea-repository";
import { ConflictError, NotFoundError } from "@/src/lib/errors";

class InMemoryIdeaRepository implements IdeaRepository {
  constructor(private readonly ideas: Idea[]) {}

  async create(_input: CreateIdeaRecord): Promise<Idea> {
    throw new Error("Not implemented.");
  }

  async update(_id: string, _input: UpdateIdeaRecord): Promise<Idea> {
    throw new Error("Not implemented.");
  }

  async findById(id: string): Promise<Idea | null> {
    return this.ideas.find((idea) => idea.id === id) ?? null;
  }

  async listAll(): Promise<Idea[]> {
    return [...this.ideas];
  }

  async changeStatus(id: string, status: IdeaStatus): Promise<Idea> {
    const idea = this.ideas.find((entry) => entry.id === id);

    if (!idea) {
      throw new NotFoundError("Idea not found.");
    }

    idea.status = status;
    idea.updatedAt = new Date("2026-04-10T10:00:00.000Z");

    return idea;
  }
}

function buildIdea(status: IdeaStatus): Idea {
  return {
    id: "idea-1",
    title: "Explore onboarding hub",
    description: null,
    riceReach: null,
    riceImpact: null,
    riceConfidence: null,
    riceEffort: null,
    riceScore: null,
    status,
    createdAt: new Date("2026-04-01T08:00:00.000Z"),
    updatedAt: new Date("2026-04-01T08:00:00.000Z")
  };
}

test("ChangeIdeaStatusService allows valid transitions", async () => {
  const repository = new InMemoryIdeaRepository([buildIdea("INBOX")]);
  const service = new ChangeIdeaStatusService(repository);

  const idea = await service.execute("idea-1", "EXPLORING");

  assert.equal(idea.status, "EXPLORING");
});

test("ChangeIdeaStatusService rejects invalid transitions", async () => {
  const repository = new InMemoryIdeaRepository([buildIdea("INBOX")]);
  const service = new ChangeIdeaStatusService(repository);

  await assert.rejects(() => service.execute("idea-1", "SHIPPED"), ConflictError);
});

test("ChangeIdeaStatusService throws NotFoundError when the idea is missing", async () => {
  const repository = new InMemoryIdeaRepository([]);
  const service = new ChangeIdeaStatusService(repository);

  await assert.rejects(() => service.execute("missing", "EXPLORING"), NotFoundError);
});

import test from "node:test";
import assert from "node:assert/strict";

import { UpdateIdeaService } from "@/src/application/ideas/update-idea.service";
import type { IdeaStatus } from "@/src/domain/idea/idea-status";
import type { Idea } from "@/src/domain/idea/idea.types";
import type {
  CreateIdeaRecord,
  IdeaRepository,
  UpdateIdeaRecord
} from "@/src/infrastructure/repositories/idea-repository";
import { NotFoundError, ValidationError } from "@/src/lib/errors";

class InMemoryIdeaRepository implements IdeaRepository {
  constructor(private readonly ideas: Idea[]) {}

  async create(_input: CreateIdeaRecord): Promise<Idea> {
    throw new Error("Not implemented.");
  }

  async update(id: string, input: UpdateIdeaRecord): Promise<Idea> {
    const idea = this.ideas.find((entry) => entry.id === id);

    if (!idea) {
      throw new NotFoundError("Idea not found.");
    }

    Object.assign(idea, input, {
      updatedAt: new Date("2026-04-10T09:00:00.000Z")
    });

    return idea;
  }

  async findById(id: string): Promise<Idea | null> {
    return this.ideas.find((idea) => idea.id === id) ?? null;
  }

  async listAll(): Promise<Idea[]> {
    return [...this.ideas];
  }

  async changeStatus(_id: string, _status: IdeaStatus): Promise<Idea> {
    throw new Error("Not implemented.");
  }
}

function buildIdea(): Idea {
  return {
    id: "idea-1",
    title: "Partner tracker",
    description: "Keep intros tidy.",
    riceReach: 10,
    riceImpact: 2,
    riceConfidence: 70,
    riceEffort: 2,
    riceScore: 700,
    status: "PARKED",
    createdAt: new Date("2026-04-01T08:00:00.000Z"),
    updatedAt: new Date("2026-04-01T08:00:00.000Z")
  };
}

test("UpdateIdeaService merges updates and recomputes riceScore", async () => {
  const repository = new InMemoryIdeaRepository([buildIdea()]);
  const service = new UpdateIdeaService(repository);

  const idea = await service.execute("idea-1", {
    title: "Partner tracker v2",
    riceImpact: 3,
    riceEffort: 1.5
  });

  assert.equal(idea.title, "Partner tracker v2");
  assert.equal(idea.riceImpact, 3);
  assert.equal(idea.riceEffort, 1.5);
  assert.equal(idea.riceScore, 1400);
});

test("UpdateIdeaService clears riceScore when rice becomes incomplete", async () => {
  const repository = new InMemoryIdeaRepository([buildIdea()]);
  const service = new UpdateIdeaService(repository);

  const idea = await service.execute("idea-1", {
    riceConfidence: null
  });

  assert.equal(idea.riceConfidence, null);
  assert.equal(idea.riceScore, null);
});

test("UpdateIdeaService throws NotFoundError for unknown ideas", async () => {
  const repository = new InMemoryIdeaRepository([]);
  const service = new UpdateIdeaService(repository);

  await assert.rejects(() => service.execute("missing", { title: "Nope" }), NotFoundError);
});

test("UpdateIdeaService rejects invalid effort", async () => {
  const repository = new InMemoryIdeaRepository([buildIdea()]);
  const service = new UpdateIdeaService(repository);

  await assert.rejects(
    () =>
      service.execute("idea-1", {
        riceEffort: 0
      }),
    ValidationError
  );
});

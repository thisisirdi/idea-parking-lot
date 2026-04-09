import test from "node:test";
import assert from "node:assert/strict";

import { CreateIdeaService } from "@/src/application/ideas/create-idea.service";
import type { IdeaStatus } from "@/src/domain/idea/idea-status";
import type { Idea } from "@/src/domain/idea/idea.types";
import type {
  CreateIdeaRecord,
  IdeaRepository,
  UpdateIdeaRecord
} from "@/src/infrastructure/repositories/idea-repository";
import { ValidationError } from "@/src/lib/errors";

class InMemoryIdeaRepository implements IdeaRepository {
  private readonly ideas: Idea[] = [];

  async create(input: CreateIdeaRecord): Promise<Idea> {
    const idea: Idea = {
      id: `idea-${this.ideas.length + 1}`,
      ...input,
      createdAt: new Date("2026-04-10T08:00:00.000Z"),
      updatedAt: new Date("2026-04-10T08:00:00.000Z")
    };

    this.ideas.push(idea);
    return idea;
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

  async changeStatus(_id: string, _status: IdeaStatus): Promise<Idea> {
    throw new Error("Not implemented.");
  }
}

test("CreateIdeaService defaults new ideas to INBOX and computes riceScore", async () => {
  const repository = new InMemoryIdeaRepository();
  const service = new CreateIdeaService(repository);

  const idea = await service.execute({
    title: "  Tiny CRM for referrals  ",
    description: "  Keep warm follow-ups from disappearing.  ",
    riceReach: 12,
    riceImpact: 2.5,
    riceConfidence: 80,
    riceEffort: 2
  });

  assert.equal(idea.title, "Tiny CRM for referrals");
  assert.equal(idea.description, "Keep warm follow-ups from disappearing.");
  assert.equal(idea.status, "INBOX");
  assert.equal(idea.riceScore, 1200);
});

test("CreateIdeaService stores null riceScore when rice is incomplete", async () => {
  const repository = new InMemoryIdeaRepository();
  const service = new CreateIdeaService(repository);

  const idea = await service.execute({
    title: "Voice inbox",
    riceReach: 12,
    riceImpact: 3
  });

  assert.equal(idea.riceScore, null);
});

test("CreateIdeaService rejects an empty title", async () => {
  const repository = new InMemoryIdeaRepository();
  const service = new CreateIdeaService(repository);

  await assert.rejects(
    () =>
      service.execute({
        title: "   "
      }),
    ValidationError
  );
});

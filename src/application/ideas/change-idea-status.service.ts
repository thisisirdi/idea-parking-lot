import { assertValidStatusTransition } from "@/src/domain/idea/idea-status.rules";
import type { IdeaStatus } from "@/src/domain/idea/idea-status";
import type { IdeaRepository } from "@/src/infrastructure/repositories/idea-repository";
import { NotFoundError } from "@/src/lib/errors";

export class ChangeIdeaStatusService {
  constructor(private readonly ideaRepository: IdeaRepository) {}

  async execute(id: string, nextStatus: IdeaStatus) {
    const existingIdea = await this.ideaRepository.findById(id);

    if (!existingIdea) {
      throw new NotFoundError("Idea not found.");
    }

    assertValidStatusTransition(existingIdea.status, nextStatus);

    return this.ideaRepository.changeStatus(id, nextStatus);
  }
}


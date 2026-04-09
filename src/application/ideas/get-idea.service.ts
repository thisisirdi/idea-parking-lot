import type { IdeaRepository } from "@/src/infrastructure/repositories/idea-repository";
import { NotFoundError } from "@/src/lib/errors";

export class GetIdeaService {
  constructor(private readonly ideaRepository: IdeaRepository) {}

  async execute(id: string) {
    const idea = await this.ideaRepository.findById(id);

    if (!idea) {
      throw new NotFoundError("Idea not found.");
    }

    return idea;
  }
}


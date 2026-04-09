import type { IdeaRepository } from "@/src/infrastructure/repositories/idea-repository";

export class ListIdeasService {
  constructor(private readonly ideaRepository: IdeaRepository) {}

  async execute() {
    return this.ideaRepository.listAll();
  }
}


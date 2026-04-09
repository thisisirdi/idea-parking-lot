import { calculateRiceScore } from "@/src/domain/idea/rice";
import type { IdeaUpdateInput } from "@/src/domain/idea/idea.types";
import {
  validateDescription,
  validateIdeaTitle,
  validateOptionalRiceValue
} from "@/src/domain/idea/validators";
import type { IdeaRepository } from "@/src/infrastructure/repositories/idea-repository";
import { NotFoundError } from "@/src/lib/errors";

export class UpdateIdeaService {
  constructor(private readonly ideaRepository: IdeaRepository) {}

  async execute(id: string, input: IdeaUpdateInput) {
    const existingIdea = await this.ideaRepository.findById(id);

    if (!existingIdea) {
      throw new NotFoundError("Idea not found.");
    }

    const title = input.title !== undefined ? validateIdeaTitle(input.title) : existingIdea.title;
    const description =
      input.description !== undefined
        ? validateDescription(input.description)
        : existingIdea.description;
    const riceReach =
      input.riceReach !== undefined
        ? validateOptionalRiceValue("Reach", input.riceReach, { min: 0 })
        : existingIdea.riceReach;
    const riceImpact =
      input.riceImpact !== undefined
        ? validateOptionalRiceValue("Impact", input.riceImpact, { min: 0 })
        : existingIdea.riceImpact;
    const riceConfidence =
      input.riceConfidence !== undefined
        ? validateOptionalRiceValue("Confidence", input.riceConfidence, { min: 0 })
        : existingIdea.riceConfidence;
    const riceEffort =
      input.riceEffort !== undefined
        ? validateOptionalRiceValue("Effort", input.riceEffort, { greaterThan: 0 })
        : existingIdea.riceEffort;
    const riceScore = calculateRiceScore({
      reach: riceReach,
      impact: riceImpact,
      confidence: riceConfidence,
      effort: riceEffort
    });

    return this.ideaRepository.update(id, {
      title,
      description,
      riceReach,
      riceImpact,
      riceConfidence,
      riceEffort,
      riceScore
    });
  }
}


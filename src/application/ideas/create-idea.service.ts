import { calculateRiceScore } from "@/src/domain/idea/rice";
import type { IdeaInput } from "@/src/domain/idea/idea.types";
import {
  validateDescription,
  validateIdeaTitle,
  validateOptionalRiceValue
} from "@/src/domain/idea/validators";
import type { IdeaRepository } from "@/src/infrastructure/repositories/idea-repository";

export class CreateIdeaService {
  constructor(private readonly ideaRepository: IdeaRepository) {}

  async execute(input: IdeaInput) {
    const title = validateIdeaTitle(input.title);
    const description = validateDescription(input.description);
    const riceReach = validateOptionalRiceValue("Reach", input.riceReach, { min: 0 });
    const riceImpact = validateOptionalRiceValue("Impact", input.riceImpact, { min: 0 });
    const riceConfidence = validateOptionalRiceValue("Confidence", input.riceConfidence, {
      min: 0
    });
    const riceEffort = validateOptionalRiceValue("Effort", input.riceEffort, {
      greaterThan: 0
    });
    const riceScore = calculateRiceScore({
      reach: riceReach,
      impact: riceImpact,
      confidence: riceConfidence,
      effort: riceEffort
    });

    return this.ideaRepository.create({
      title,
      description,
      riceReach,
      riceImpact,
      riceConfidence,
      riceEffort,
      riceScore,
      status: input.status ?? "INBOX"
    });
  }
}

